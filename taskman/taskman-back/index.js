const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const dbConfig = require('./config/db.config');
const path = require('path');
const nodemailer = require('nodemailer');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:4200' }));
const upload = multer({ dest: path.join(__dirname, 'scripts') });

// Obtener todas las tareas programadas con su última ejecución
app.get('/api/tasks', async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const result = await sql.query(`
      SELECT t.*, e.Id AS ExecutionId, e.ExecutionTime, e.Status, e.Log
      FROM ScheduledTasks t
      LEFT JOIN (
        SELECT *, ROW_NUMBER() OVER (PARTITION BY TaskId ORDER BY ExecutionTime DESC) AS rn
        FROM TaskExecutions
      ) e ON t.Id = e.TaskId AND e.rn = 1
      ORDER BY t.ScheduledTime
    `);
    // Formatear ScheduledTime a 'HH:mm'
    const tasks = result.recordset.map(row => ({
      ...row,
      ScheduledTime: row.ScheduledTime
        ? row.ScheduledTime instanceof Date
          ? row.ScheduledTime.toTimeString().slice(0, 5)
          : String(row.ScheduledTime).slice(0, 5)
        : '',
      Entorno: row.Entorno || 'Test'
    }));
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Editar hora programada
app.put('/api/tasks/:id', async (req, res) => {
  const { ScheduledTime } = req.body;
  try {
    await sql.connect(dbConfig);
    await sql.query`UPDATE ScheduledTasks SET ScheduledTime = ${ScheduledTime} WHERE Id = ${req.params.id}`;
    res.status(200).json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cambiar estado activo/inactivo de una tarea
app.put('/api/tasks/:id/active', async (req, res) => {
  const { Active } = req.body;
  try {
    await sql.connect(dbConfig);
    await sql.query`UPDATE ScheduledTasks SET Active = ${Active} WHERE Id = ${req.params.id}`;
    res.status(200).json({ message: 'Active state updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cambiar entorno de una tarea
app.put('/api/tasks/:id/entorno', async (req, res) => {
  const { Entorno } = req.body;
  if (!['Test', 'Prod'].includes(Entorno)) {
    return res.status(400).json({ error: 'Valor de entorno inválido' });
  }
  try {
    await sql.connect(dbConfig);
    await sql.query`UPDATE ScheduledTasks SET Entorno = ${Entorno} WHERE Id = ${req.params.id}`;
    res.status(200).json({ message: 'Entorno actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lanzar ejecución manualmente
app.post('/api/tasks/:id/execute', async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const task = await sql.query`SELECT * FROM ScheduledTasks WHERE Id = ${req.params.id}`;
    if (!task.recordset[0]) return res.status(404).json({ error: 'Task not found' });
    if (!task.recordset[0].Active) {
      return res.status(403).json({ error: 'Task is not active and cannot be executed' });
    }
    const scriptName = task.recordset[0].ScriptName;
    const scriptPath = path.join(__dirname, 'scripts', scriptName);
    const entorno = task.recordset[0].Entorno || 'Test';
    const envFile = entorno === 'Prod' ? '.env-scripts' : '.env-scripts-test';
    const env = { ...process.env, ENV_SCRIPTS_FILE: envFile };

    exec(`python "${scriptPath}"`, { env }, async (error, stdout, stderr) => {
      const status = error ? 'error' : 'success';
      const log = error ? stderr : stdout;
      await sql.query`
        INSERT INTO TaskExecutions (TaskId, Status, Log, Entorno)
        VALUES (${req.params.id}, ${status}, ${log}, ${entorno})
      `;
      if (status === 'error') {
        //await sendErrorEmail(scriptName, log);
      }
      res.status(200).json({ status, log });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear nueva tarea solo con selección de script existente
app.post('/api/tasks', async (req, res) => {
  const { Name, ScheduledTime, ScriptName, Entorno } = req.body;
  try {
    await sql.connect(dbConfig);
    // Validar nombre único
    const existing = await sql.query`SELECT * FROM ScheduledTasks WHERE Name = ${Name}`;
    if (existing.recordset.length > 0) {
      return res.status(409).json({ error: 'Ya existe una tarea con ese nombre' });
    }
    // Validar que el script exista
    const scriptPath = path.join(__dirname, 'scripts', ScriptName);
    if (!fs.existsSync(scriptPath)) {
      return res.status(404).json({ error: 'El script seleccionado no existe' });
    }
    await sql.query`INSERT INTO ScheduledTasks (Name, ScriptName, ScheduledTime, Active, Entorno) VALUES (${Name}, ${ScriptName}, ${ScheduledTime}, 1, ${Entorno || 'Test'})`;
    return res.status(201).json({ message: 'Created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Nuevo endpoint para subir o sobreescribir un archivo .py
app.post('/api/scripts/upload', upload.single('scriptFile'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se subió ningún archivo' });
    const ext = path.extname(req.file.originalname);
    if (ext !== '.py') {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Solo se permiten archivos .py' });
    }
    const destPath = path.join(__dirname, 'scripts', req.file.originalname);
    if (fs.existsSync(destPath)) {
      fs.unlinkSync(destPath);
    }
    fs.renameSync(req.file.path, destPath);
    // Generar requirements.txt y pip install
    try {
      const { execSync } = require('child_process');
      execSync(`pipreqs "${path.join(__dirname, 'scripts')}" --force`, { stdio: 'inherit' });
      const reqPath = path.join(__dirname, 'scripts', 'requirements.txt');
      if (fs.existsSync(reqPath)) {
        execSync(`pip install -r "${reqPath}"`, { stdio: 'inherit' });
      }
    } catch (err) {
      return res.status(500).json({ error: 'Error generando o instalando requirements', details: err.message });
    }
    return res.status(200).json({ message: 'Archivo subido correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint para editar el nombre de la tarea
app.put('/api/tasks/:id/name', async (req, res) => {
  const { Name } = req.body;
  try {
    await sql.connect(dbConfig);
    // Validar nombre único
    const existing = await sql.query`SELECT * FROM ScheduledTasks WHERE Name = ${Name} AND Id != ${req.params.id}`;
    if (existing.recordset.length > 0) {
      return res.status(409).json({ error: 'Ya existe una tarea con ese nombre' });
    }
    await sql.query`UPDATE ScheduledTasks SET Name = ${Name} WHERE Id = ${req.params.id}`;
    res.status(200).json({ message: 'Nombre actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint para obtener scripts existentes
app.get('/api/scripts', (req, res) => {
  const scriptsDir = path.join(__dirname, 'scripts');
  fs.readdir(scriptsDir, (err, files) => {
    if (err) return res.status(500).json({ error: 'No se pudieron listar los scripts' });
    const pyFiles = files.filter(f => f.endsWith('.py'));
    res.json(pyFiles);
  });
});

// Obtener ejecuciones y logs
app.get('/api/executions', async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const result = await sql.query(`
      SELECT e.*, t.ScriptName, t.ScheduledTime
      FROM TaskExecutions e
      JOIN ScheduledTasks t ON e.TaskId = t.Id
      ORDER BY e.ExecutionTime DESC
    `);
    // Formatear ScheduledTime a 'HH:mm'
    const executions = result.recordset.map(row => ({
      ...row,
      ScheduledTime: row.ScheduledTime
        ? row.ScheduledTime instanceof Date
          ? row.ScheduledTime.toTimeString().slice(0, 5)
          : String(row.ScheduledTime).slice(0, 5)
        : ''
    }));
    res.json(executions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verificar si existe un archivo .py con el mismo nombre
app.get('/api/scripts/exists/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'scripts', filename);
  res.json({ exists: fs.existsSync(filePath) });
});

// API para leer el .env-scripts
app.get('/api/env-scripts', (req, res) => {
  console.log('[DEBUG] Hola');
  const envPath = path.join(__dirname, '.env-scripts');
  console.log('[DEBUG] Leyendo archivo .env-scripts desde: %s', envPath);
  fs.readFile(envPath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('No se pudo leer el archivo .env-scripts');
    res.type('text/plain').send(data);
  });
});

// API para guardar el .env-scripts
app.post('/api/env-scripts', (req, res) => {
  const envPath = path.join(__dirname, '.env-scripts');
  const backupPath = path.join(__dirname, '.env-scripts-backup');
  const { content } = req.body;
  // Hacer backup antes de guardar
  fs.copyFile(envPath, backupPath, copyErr => {
    if (copyErr && copyErr.code !== 'ENOENT') {
      return res.status(500).send('No se pudo crear el backup de .env-scripts');
    }
    fs.writeFile(envPath, content, 'utf8', err => {
      if (err) return res.status(500).send('No se pudo guardar el archivo .env-scripts');
      res.send('OK');
    });
  });
});

// API para leer el .env-scripts-test
app.get('/api/env-scripts-test', (req, res) => {
  const envPath = path.join(__dirname, '.env-scripts-test');
  fs.readFile(envPath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('No se pudo leer el archivo .env-scripts-test');
    res.type('text/plain').send(data);
  });
});

// API para guardar el .env-scripts-test
app.post('/api/env-scripts-test', (req, res) => {
  const envPath = path.join(__dirname, '.env-scripts-test');
  const { content } = req.body;
  fs.writeFile(envPath, content, 'utf8', err => {
    if (err) return res.status(500).send('No se pudo guardar el archivo .env-scripts-test');
    res.send('OK');
  });
});

// API para restaurar el backup de .env-scripts
app.post('/api/env-scripts/restore-backup', (req, res) => {
  const envPath = path.join(__dirname, '.env-scripts');
  const backupPath = path.join(__dirname, '.env-scripts-backup');
  fs.copyFile(backupPath, envPath, copyErr => {
    if (copyErr) {
      return res.status(500).send('No se pudo restaurar el backup de .env-scripts');
    }
    res.send('OK');
  });
});

// Lanzador automático de tareas programadas
setInterval(async () => {
  try {
    await sql.connect(dbConfig);
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    console.log(`[DEBUG] Lanzador automático: Hora actual: ${currentTime}`);
    // Buscar tareas activas cuya hora programada ya pasó y que no tengan ejecución hoy
    const tasks = await sql.query`SELECT * FROM ScheduledTasks WHERE Active = 1 AND ScheduledTime <= ${currentTime}`;
    console.log(`[DEBUG] Tareas candidatas encontradas:`, tasks.recordset.map(t => ({Id: t.Id, Name: t.Name, ScheduledTime: t.ScheduledTime})));
    for (const task of tasks.recordset) {
      // Verificar si ya se ejecutó hoy
      const today = now.toISOString().slice(0, 10); // YYYY-MM-DD
      const startOfDay = today + 'T00:00:00.000Z';
      const startOfNextDay = new Date(now.getTime() + 24*60*60*1000).toISOString().slice(0, 10) + 'T00:00:00.000Z';
      const execs = await sql.query`SELECT TOP 1 * FROM TaskExecutions WHERE TaskId = ${task.Id} AND ExecutionTime >= ${startOfDay} AND ExecutionTime < ${startOfNextDay} AND Status != 'error'`;
      console.log(`[DEBUG] Tarea ${task.Id} (${task.Name}) - ¿Ya ejecutada hoy?:`, execs.recordset.length > 0);
      if (execs.recordset.length === 0) {
        const scriptPath = path.join(__dirname, 'scripts', task.ScriptName);
        const entorno = task.Entorno || 'Test';
        const envFile = entorno === 'Prod' ? '../.env-scripts' : '../.env-scripts-test';
        const env = { ...process.env, ENV_SCRIPTS_FILE: envFile };
        console.log(`[DEBUG] Ejecutando script para tarea ${task.Id} (${task.Name}): ${scriptPath}`);
        exec(`python "${scriptPath}"`, { env }, async (error, stdout, stderr) => {
          const status = error ? 'error' : 'success';
          const log = error ? stderr : stdout;
          console.log(`[DEBUG] Resultado ejecución tarea ${task.Id} (${task.Name}): status=${status}`);
          await sql.query`
            INSERT INTO TaskExecutions (TaskId, ExecutionTime, Status, Log, Entorno)
            VALUES (${task.Id}, ${now}, ${status}, ${log}, ${entorno})
          `;
          if (status === 'error') {
            console.log(`[DEBUG] Error al ejecutar tarea ${task.Id} (${task.Name}):`, log);
            //await sendErrorEmail(task.ScriptName, log);
          }
        });
      }
    }
  } catch (err) {
    console.log('[DEBUG] Error general en lanzador automático:', err);
    // Opcional: log de error general
  }
}, 60000); // Cada minuto

// Enviar email en caso de error
async function sendErrorEmail(scriptName, log) {
  // Configura tu transporte SMTP real aquí
  let transporter = nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 587,
    secure: false,
    auth: {
      user: 'usuario@example.com',
      pass: 'password'
    }
  });
  await transporter.sendMail({
    from: 'notificaciones@example.com',
    to: 'destinatario@example.com',
    subject: `Error en ejecución de script: ${scriptName}`,
    text: `Se produjo un error en la ejecución del script ${scriptName}.

Log:
${log}`
  });
}

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Taskman backend escuchando en http://localhost:${PORT}`);
});
