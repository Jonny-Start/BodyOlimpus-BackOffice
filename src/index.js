const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressFileupload = require('express-fileupload');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;


// CORS configurado ANTES de los parsers
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// Configurar Express para manejar datos de formularios (DESPUÉS de CORS)
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Para formularios
app.use(express.json({ limit: '10mb' })); // Para JSON
app.use(cookieParser());

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/public', express.static('public'));

// Middleware para manejo de archivos
app.use(expressFileupload({
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB
  useTempFiles: true, // Guarda en /tmp/ en lugar de memoria
  abortOnLimit: true, // Detiene la subida si se excede el límite
  createParentPath: true // Crea la ruta padre si no existe
}));

// Rutas
const indexRouter = require('./routes/index.js');
app.use('/', indexRouter);

// Middleware para manejar rutas no encontradas
app.use('/{*splat}', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    method: req.method,
    url: req.originalUrl
  });
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error('Error stack:', err.stack);
  console.error('Error message:', err.message);

  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json({ error: 'Something broke!' });
  } else {
    return res.status(500).json({
      error: err.message,
      stack: err.stack
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${port}`);
  console.log(`📝 Modo: ${process.env.NODE_ENV || 'development'}`);
});
