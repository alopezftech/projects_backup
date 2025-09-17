# 🛠️ Verificar si SQL Server local está activo (Windows CMD)

Este documento resume los principales comandos para comprobar si el servidor **SQL Server** local está funcionando en Windows.  

---

## 📋 Tabla de Comandos y Usos en cmd


| Comando | ¿Para qué sirve? |
|---------|------------------|
| `sc query type= service state= all \| find "SQL"` | Lista **todos los servicios** relacionados con SQL Server instalados en el sistema. |

| `sc query MSSQLSERVER` | Verifica el **estado del servicio principal** de SQL Server (instancia por defecto). |

| `sc query MSSQL$MiInstancia` | Comprueba el estado de una **instancia con nombre**. |

| `net start \| find "SQL"` | Muestra qué **servicios SQL están iniciados** actualmente. |

| `telnet localhost 1433` | Testea si SQL Server está **escuchando en el puerto 1433** (por defecto). |

| `ping localhost` | Verifica que el equipo responda, útil como primer chequeo de conectividad. |

| `netstat -ano \| find "1433"` | Comprueba si hay un proceso **escuchando en el puerto 1433**. |

| `sqlcmd -S localhost -U sa -P TuPassword` | Intenta una **conexión directa al motor SQL** usando el cliente de línea de comandos. |

# Relaciones entre tablas:

- 1. 🔹 1:1 (Uno a Uno)

    Cada registro en la tabla A está relacionado con exactamente un registro en la tabla B, y viceversa.

    Se usa cuando quieres dividir información de un mismo objeto en dos tablas distintas (por organización, seguridad o eficiencia).

    📌 Ejemplo:

    Tabla Usuarios (id, nombre, email)

    Tabla Pasaportes (id, número_pasaporte, usuario_id)

    👉 Cada usuario tiene un único pasaporte y cada pasaporte pertenece a un único usuario.

- 2. 🔹 1:N (Uno a Muchos)

    Un registro en la tabla A puede estar relacionado con muchos registros en la tabla B, pero cada registro en la tabla B está relacionado con solo un registro en la tabla A.

    📌 Ejemplo:

    Tabla Usuarios (id, nombre)

    Tabla Pedidos (id, fecha, usuario_id)

    👉 Un usuario puede tener muchos pedidos, pero cada pedido pertenece a un único usuario.

- 3. 🔹 N:M (Muchos a Muchos)

    Un registro en la tabla A puede estar relacionado con muchos registros en la tabla B, y viceversa.

    Se implementa con una tabla intermedia (de unión o puente).

    📌 Ejemplo:

    Tabla Estudiantes (id, nombre)

    Tabla Cursos (id, nombre)

    Tabla intermedia EstudianteCurso (estudiante_id, curso_id)

    👉 Un estudiante puede estar en muchos cursos, y cada curso tiene muchos estudiantes.    

# 