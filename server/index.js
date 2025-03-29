const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const projectRoutes = require('./routes/projects.js');

dotenv.config();

console.log("🚀 Iniciando servidor...");

const app = express();

// Middleware para loggear todas las peticiones
app.use((req, res, next) => {
    console.log(`🌐 [INDEX.JS] Nueva petición: ${req.method} ${req.originalUrl}`);
    console.log(`🌐 [INDEX.JS] Headers: ${JSON.stringify(req.headers['content-type'])}`);
    next();
});

// Middlewares
app.use(cors());

// Modificar estos middlewares para que NO procesen formularios multipart
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ 
  extended: true,
  limit: '1mb',
  // Esta línea es clave: evita que este middleware procese formularios multipart
  verify: (req, res, buf, encoding) => {
    if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
      // Marcar que este formulario multipart debe ser ignorado por este middleware
      req._multipartFormData = true;
    }
  }
}));

// Añadir middleware para verificar si debemos procesar el body
app.use((req, res, next) => {
  // Si es un formulario multipart, saltamos express.json y express.urlencoded
  if (req._multipartFormData) {
    req._body = false; // Indicar que el body aún no ha sido procesado
  }
  next();
});

// Rutas - Añadir un middleware para loggear antes de llegar a las rutas
app.use('/projects', (req, res, next) => {
    console.log(`🛣️ [INDEX.JS] Ruta /projects: ${req.method}`);
    console.log(`🛣️ [INDEX.JS] ¿Body ya procesado? ${req._body ? 'SÍ' : 'NO'}`);
    next();
}, projectRoutes);

app.post('/vivo', (req, res) => {
    console.log("Recibido en /vivo");
    console.log("req.body:", req.body);
    res.send('Hello from vivo');
});

// Manejador de errores
app.use((err, req, res, next) => {
    console.error('❌ [INDEX.JS] Error no capturado:', err);
    res.status(500).json({
        error: err.message || 'Error interno del servidor'
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`✅ Servidor ejecutándose en puerto ${PORT}`);
});


