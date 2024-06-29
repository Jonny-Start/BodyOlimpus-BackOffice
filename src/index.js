const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

// Configurar Express para manejar datos de formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Middleware para permitir CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rutas
const indexRouter = require('./routes/index.js');
app.use('/', indexRouter);

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  if(process.env.NODE_ENV === 'production') {
    return res.status(500).send('Something broke!');
  }
  // next();
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
