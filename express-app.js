//TODO LO RELATIVO A EXPRESS DEBERÍA IR AQUÍ

const express = require('express'); /* Express library to create Web-server */
const app = express();


//Configure global static file serving (dónde están los recursos estáticos que se usan en toda la app)


//Mount all routers
//0. MAIN ENDPOINTS
const MainEndpoints = require("./endpoints/Main");
app.use("/", MainEndpoints);
app.use('/', express.static(__dirname + '/js'));
app.use('/', express.static(__dirname + '/stylesheets'));
app.use('/', express.static(__dirname + '/static'));

// 1. QUESTIONNAIRES
const QuestionnaireEndpoints = require("./endpoints/Questionnaires");
app.use("/questionnaires/", QuestionnaireEndpoints);
app.use("/questionnaires/", express.static("views/questionnaires/js/"))
app.use("/questionnaires/", express.static("views/questionnaires/css/"))


// 2. DATA UPLOAD
const DataSaveEndpoints = require("./endpoints/DataSave")
app.use("/", DataSaveEndpoints);

// //Object binding representing the web-server, which we generate via express.
// const server = require('http').Server(app);
//
// const dotenv = require('dotenv').config();
//
// const path = require('path');
//
// // Dónde se guardarán los datos.
// let fs = require('fs');
//
//

module.exports = app;


