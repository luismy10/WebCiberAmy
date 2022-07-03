const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(cors());

app.set('port', process.env.PORT || 5000);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "..", "app/build")));

//api rest
app.use('/api/usuario', require('./src/router/Usuario'));
app.use('/api/transaccion', require('./src/router/Transaccion'));

//pdf
app.use('/documents/pdf', require('./src/router/Documentos'));

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "app/build", "index.html"));
});

app.listen(app.get("port"), () => {
    console.log(`El servidor está corriendo en el puerto ${app.get("port")}`);
});