const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.use( express.json({ extended: true }) );

const port = process.env.PORT || 4000;

// Rutas de la API
app.use( '/api/register', require('./routes/register.js') );
app.use( '/api/login',require('./routes/login.js') );
app.use( '/api/lists',require('./routes/lists') );
app.use( '/api/tasks', require('./routes/taks') );

app.listen( port, () => console.log('Servidor iniciado en el puerto ' + port) );
