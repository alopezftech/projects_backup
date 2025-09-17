SELECT * FROM users LIMIT 10; // Consulta los primeros 10 usuarios

SELECT * FROM users WHERE NOT mail = "brais@gmail.com" OR age >= 38 LIMIT 2; // Consulta los primeros 2 usuarios cuyo correo electrónico no es 'brais@gmail.com' o tienen 38 años o más

// DEFINICION DE LIMIT:

    => La cláusula LIMIT se utiliza en una consulta SQL para restringir el número de filas devueltas en el conjunto de resultados.