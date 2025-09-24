// TAREAS

1. - Añadir etiqueta @ValidateSchema :

    - La idea es que esta etquetas esté disponible a nivel global en la app, para usarse en servicios o cualquier otro proceso no en el basecontroller, y en los parenteiss de la etiqueta añadir los datos de la entidad para validar los datos del esquema que le pasamos.

    - Si lo valida se crea el job y se ejecuta el código

    - Si fallase la validación en un servicio, deberia cerrar el job con el error de zod integrado en el job , si fuera en un controller deberia evitar la crecio del job y devolver el json de error.

    - Añadir archivo validations.decorator.ts

2. - Modificar el sistema de jobs para integrar una librería que haga el trabajo de dichos jobs; Revisar ambas opciones:

    - Bull 

    - Agenda

    - Necesidades: 

    - Especificar un numero de intentos

    - Gestionar el peso de la tarea y su prioridad en cada job

    - Permitir customizar los datos de un job , que datos contiene, a que endpoint llama.


