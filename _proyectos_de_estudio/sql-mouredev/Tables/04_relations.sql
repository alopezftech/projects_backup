CREATE TABLE dni(
dni_id int AUTO_INCREMENT PRIMARY KEY,
dni_number int NOT NULL,
user_id int,
UNIQUE(dni_id),
FOREIGN KEY(user_id) REFERENCES users(user_id) // Establece una relación con la tabla 'users'
)

// Relacion 1:1 // Cada usuario tiene un único DNI