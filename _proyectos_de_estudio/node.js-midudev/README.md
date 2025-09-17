### ¿ Qué es node.js ?

Node.js es un entorno de ejecución para JavaScript en el lado del servidor. Permite ejecutar código JavaScript fuera del navegador, utilizando el motor V8 de Google Chrome. Node.js es ampliamente utilizado para crear aplicaciones web, APIs, servidores y herramientas de línea de comandos, gracias a su modelo de E/S no bloqueante y orientado a eventos, lo que lo hace eficiente y escalable.

***¿Qué es globalThis?***

En Node.js:

global es un objeto que contiene variables y funciones globales accesibles desde cualquier parte del código. Es similar a window en el navegador.
this en el contexto global de un archivo Node.js no apunta a global, sino a module.exports. Dentro de funciones o clases, su valor depende de cómo se invoque.

ejecutar archivos con node: node nombre_del_archivo.js

