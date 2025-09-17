SELECT
    *,
    CASE
        WHEN age > 18 THEN 'True'
        WHEN age = 18 THEN 'Acaba de cumplir 18'
        ELSE 'False'
    END AS '¿Es mayor de edad?'
FROM
    users;

// Este case hace una evaluación de la edad de los usuarios y devuelve un texto indicando si son mayores de edad, si acaban de cumplir 18 años o si son menores de edad.


// DEFINICION DE CASE:

    => La cláusula CASE se utiliza en SQL para realizar evaluaciones condicionales en una consulta, permitiendo devolver valores diferentes según el resultado de dichas evaluaciones.