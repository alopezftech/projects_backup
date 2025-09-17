	SELECT name , init_date AS "Fecha_de_inicio_en_programacion" FROM users WHERE name = 'Brais' ;// Consulta el nombre y la fecha de inicio en programación del usuario llamado 'Brais', utilizando un alias para la columna de fecha de inicio
    
    // DEFINICION DE ALIAS:
    
   => Un alias en SQL es un nombre temporal asignado a una tabla o columna para facilitar su referencia en una consulta.

   	SELECT CONCAT('nombre: ', name, '. apellidos: ', surname) AS 'Nombre completo' FROM users; // Consulta el nombre completo de los usuarios concatenando el nombre y los apellidos, utilizando un alias para la columna resultante

    // DEFINICION DE CONCAT:
    
   => La función CONCAT se utiliza en una consulta SQL para concatenar dos o más cadenas de texto en una sola.
