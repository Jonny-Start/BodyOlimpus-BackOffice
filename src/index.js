const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 4000;

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
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
