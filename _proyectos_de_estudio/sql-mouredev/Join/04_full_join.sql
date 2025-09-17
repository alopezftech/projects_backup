// Full join: Devuelve todas las filas cuando hay una coincidencia en una de las tablas. Si no hay coincidencia, las filas de la tabla que no tiene coincidencia contendrán NULL.

SELECT * FROM users u
FULL JOIN dni d ON u.id = d.user_id

// En este ejemplo, se seleccionan todos los usuarios de la tabla 'users' y se unen con la tabla 'dni' utilizando un full join. Esto significa que todos los usuarios y todos los registros de DNI serán incluidos en el resultado. Si un usuario no tiene un DNI, las columnas correspondientes a la tabla 'dni' serán NULL, y viceversa.

// Esto no funciona en MySQL, pero si en otros sistemas de gestión de bases de datos como PostgreSQL o SQL Server. En MySQL, puedes lograr un efecto similar utilizando una combinación de LEFT JOIN y RIGHT JOIN con UNION.

// Simulacion de full joint en mysql:

SELECT * FROM users u
LEFT JOIN dni d ON u.user_id = d.user_id
UNION
SELECT * FROM users u
RIGHT JOIN dni d ON u.user_id = d.user_id;

