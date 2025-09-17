// Right Join: Devuelve todas las filas de la tabla de la derecha (dni) y las filas coincidentes de la tabla de la izquierda (users). Si no hay coincidencia, los resultados de la tabla de la izquierda serán NULL.

SELECT u.name , d.dni_number FROM dni d
RIGHT JOIN users u ON u.user_id = d.user_id 

// En este ejemplo, se seleccionan todos los usuarios de la tabla 'users' y se unen con la tabla 'dni' utilizando un right join. Esto significa que todos los usuarios serán incluidos en el resultado, incluso si no tienen un DNI asociado. Si un usuario no tiene un DNI, las columnas correspondientes a la tabla 'dni' serán NULL.

