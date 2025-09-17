// Imagina que quieres obtener información de los usuarios y sus DNI

SELECT * FROM users u
INNER JOIN dni d 
ON u.user_id = d.user_id

SELECT user_id , c.company_id , u.name AS employee , c.name AS company  FROM users u 
JOIN companies c 
ON u.company_id  = c.company_id 

// Realiza una unión interna entre las tablas 'users' y 'dni' utilizando la columna 'user_id' como clave de unión

// DEFINICION: 
    // La unión interna (INNER JOIN) devuelve solo las filas que tienen coincidencias en ambas tablas.



    SELECT u.name , l.language_name 
FROM users_languages ul 
JOIN users u ON ul.user_id = u.user_id 
JOIN languages l ON ul.language_id = l.language_id 

// Muestra los nombres de los usuarios y los idiomas que hablan gracias a la tabla intermedia 'users_languages' , el join en este caso sirve para relacionar las tres tablas. La lógica seria: 
// 1. Obtener los usuarios de la tabla 'users'
// 2. Obtener los idiomas de la tabla 'languages'
// 3. Relacionar ambas tablas a través de la tabla intermedia 'users_languages'