//TODO LO RELATIVO A EXPRESS DEBERÍA IR AQUÍ

const express = require('express'); /* Express library to create Web-server */
const app = express();
const cors = require("cors");

const dotenv = require("dotenv").config();


//Configure global static file serving (dónde están los recursos estáticos que se usan en toda la app)

const allowedOrigins = [
    'http://localhost', 'https://localhost',
    `http://${process.env.IP}`, `https://${process.env.IP}`,
    `http://alreylz.me`,
    `http://${process.env.IP}:${process.env.PORT}`, `https://${process.env.IP}:${process.env.PORT}`];


//Enable CORS for my routes
app.use(cors({
    origin: function (origin, callback) {    // allow requests with no origin
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));


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


module.exports = app;


