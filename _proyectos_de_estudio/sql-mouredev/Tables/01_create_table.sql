CREATE TABLE persons ( 
id int NOT NULL AUTO_INCREMENT , // Identificador único para cada persona
name varchar(100) NOT NULL, // Nombre de la persona
age int, // Edad de la persona
email varchar(50), // Correo electrónico de la persona
created datetime DEFAULT CURRENT_TIMESTAMP(), // Fecha de creación del registro
CONSTRAINT uk UNIQUE(id), // Restricción de unicidad para el identificador
CONSTRAINT pk_persons PRIMARY KEY (id), // Restricción de clave primaria para la tabla persons
CONSTRAINT chk_age CHECK(age>=18) // Restricción de verificación para la edad
);

// DEFINICION DE LA TABLA:

    => La cláusula CREATE TABLE se utiliza en SQL para crear una nueva tabla en la base de datos.
    
   
