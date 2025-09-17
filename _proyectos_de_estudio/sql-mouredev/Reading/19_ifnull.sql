SELECT name , surname , IFNULL(age, 0) AS age FROM users; // Si la edad es NULL, se reemplaza por 0.

// DEFINICION DE IFNULL:

    => La función IFNULL se utiliza en SQL para reemplazar valores NULL con un valor predeterminado especificado, permitiendo manejar datos faltantes de manera más efectiva.