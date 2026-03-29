# Documentación de la API
 
## Estructura de carpetas
 
```
api/
├── src/
│   ├── config/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── queries/
│   ├── middlewares/
│   └── app.js
├── .env
├── .env.example
├── package.json
└── server.js
```
 
---
 
### `server.js`
El punto de entrada de la aplicación. Su único trabajo es iniciar el servidor y ponerlo a escuchar en un puerto. No contiene lógica de ningún tipo.
 
### `src/app.js`
Configura la aplicación Koa: registra los middlewares globales (manejo de errores, parseo del body, CORS) y monta las rutas. Es el "armado" de la app antes de que el servidor la use.
 
### `src/config/`
Centraliza la configuración de la aplicación. Aquí se leen las variables de entorno (`.env`) y se exportan para que el resto del código las consuma. También contiene la conexión a la base de datos.
 
### `src/routes/`
Define los endpoints HTTP de la API: qué URL responde a qué método (GET, POST, PUT, DELETE) y qué función del controller se encarga de procesarlo. No contiene lógica de negocio.
 
### `src/controllers/`
Recibe la petición HTTP, llama al servicio correspondiente y devuelve la respuesta. Es el puente entre la capa HTTP y la lógica de negocio. No accede directamente a la base de datos.
 
### `src/services/`
Contiene la lógica de negocio pura: validaciones, reglas, transformaciones de datos. No sabe nada de HTTP ni de la base de datos directamente. Llama a las queries para obtener o guardar datos.
 
### `src/queries/`
Es la única capa que habla con la base de datos. Contiene las consultas SQL o llamadas al ORM. No tiene lógica de negocio: solo obtiene o guarda datos y los devuelve.
 
### `src/middlewares/`
Funciones que se ejecutan en todas (o algunas) peticiones antes de llegar al controller. Se usan para tareas transversales como autenticación, manejo de errores o logging.
 
---
 
## Flujo de una petición
 
Cuando alguien hace una llamada a la API, el código se ejecuta en este orden:
 
```
Petición HTTP
     │
     ▼
  server.js         ← Recibe la conexión
     │
     ▼
   app.js           ← Pasa por los middlewares globales (auth, errorHandler, etc.)
     │
     ▼
  routes/           ← Identifica a qué controller enviar la petición según la URL
     │
     ▼
 controllers/       ← Extrae los datos de la petición y llama al servicio
     │
     ▼
  services/         ← Aplica las reglas de negocio
     │
     ▼
  queries/          ← Consulta o escribe en la base de datos
     │
     ▼
  config/database   ← Ejecuta la operación en la DB
     │
     ▼
  (respuesta sube de vuelta por el mismo camino)
```
 