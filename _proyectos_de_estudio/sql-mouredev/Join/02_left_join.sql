// El left join es una operación que devuelve todas las filas de la tabla de la izquierda y las filas coincidentes de la tabla de la derecha. Si no hay coincidencia, los resultados de la tabla de la derecha serán NULL.

SELECT * FROM users u
LEFT JOIN dni d ON u.id = d.user_id 

// En este ejemplo, se seleccionan todos los usuarios de la tabla 'users' y se unen con la tabla 'dni' utilizando un left join. Esto significa que todos los usuarios serán incluidos en el resultado, incluso si no tienen un DNI asociado. Si un usuario no tiene un DNI, las columnas correspondientes a la tabla 'dni' serán NULL.

#####################################################################


SELECT u.name , d.dni_number FROM dni d
LEFT JOIN users u ON u.user_id = d.user_id 

// En este ejemplo, se seleccionan todos los registros de la tabla 'dni' y se unen con la tabla 'users' utilizando un left join. Esto significa que todos los registros de DNI serán incluidos en el resultado, incluso si no tienen un usuario asociado. Si un DNI no tiene un usuario, las columnas correspondientes a la tabla 'users' serán NULL.