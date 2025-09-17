ALTER TABLE persons 
ADD COLUMN phone varchar(20); // Agrega una nueva columna 'phone' a la tabla 'persons'

ALTER TABLE persons
MODIFY COLUMN created VARCHAR(50) AFTER phone; // Modifica el tipo de dato de la columna 'created' a VARCHAR(50) y la mueve para que esté después de la columna 'phone'

SHOW COLUMNS FROM persons; // Muestra la estructura de la tabla 'persons'