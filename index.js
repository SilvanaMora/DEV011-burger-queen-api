/* eslint-disable max-len */
const express = require('express'); // Importamos bilbioteca
const config = require('./config'); //  Importamos la configuración de un archivo llamado config.js del mismo directorio. 
const authMiddleware = require('./middleware/auth'); // Importamos un middleware para manejar la autenticación,para que usuarios accedan a la app
const errorHandler = require('./middleware/error'); // importamos un middleware para manejar errores que ocurran durante la ejecución de la aplicació
const routes = require('./routes'); // Importamos las rutas que definen las diferentes URL que la aplicación puede manejar y la lógica asociada a ellas.
const pkg = require('./package.json'); // Importamos información del archivo package.json del proyecto, que contiene metadatos como su nombre, versión y dependencias.
const {connect} = require ('./connect');

const { port, secret } = config; // Extrae el port (número de puerto) y el secret (probablemente usado para autenticación) del objeto de configuración importado.
const app = express(); //  Crea una instancia de la aplicación Express, que actúa como el centro principal para manejar solicitudes y respuestas.
const db = connect(); //llamo a funcion connect 
app.set('config', config); // Hace que el objeto de configuración esté disponible en toda la aplicación
app.set('pkg', pkg); // Hace que la información del paquete esté disponible en toda la aplicación usando

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false })); // Analiza los cuerpos de las solicitudes entrantes en formato application/x-www-form-urlencoded (comúnmente usado para enviar formularios).
app.use(express.json()); // Analiza los cuerpos de las solicitudes entrantes en formato JSON (común para interacciones API).
app.use(authMiddleware(secret)); //  Aplica el middleware de autenticación para proteger ciertas rutas, usando el secret para verificación.


// Registrar rutas
routes(app, (err) => {
  if (err) {
    throw err;
  }

  app.use(errorHandler); // Aplica el middleware de manejo de errores para capturar y procesar los errores que ocurren durante el procesamiento de las solicitudes.

  app.listen(port, () => { // Inicia el servidor Express y escucha en el port especificado, imprimiendo un mensaje en la consola cuando esté listo.
    console.info(`App listening on port ${port}`);
  });
});
