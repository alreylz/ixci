//Monitoring / Wizard of OZ server code.

console.clear();
const colors = require("./js/LogColouring.js")


const express = require('express'); /* Express library to create Web-server */
var app = express();
//Object binding representing the web-server, which we generate via express.
const server = require('http').Server(app);

// Configuration (ALLOW READ FROM ENVIRONMENT VARIABLES FILE)
const dotenv = require('dotenv').config();

var port = process.env.PORT || 9030;
let hostname = process.env.IP || "localhost";
const WebSocket = require('ws');

console.log("╔╗╔╗╔╗╔══╗╔╗\n".blue() +
    "╠╣╚╬╬╝║╔═╝╠╣\n".blue() +
    "║║╔╬╬╗║╚═╗║║\n".blue() +
    "╚╝╚╝╚╝╚══╝╚╝  By @alreylz\n".blue());

const path = require('path');


// Root directory of the project
const BASE_PROJ_DIR = process.env.BASE_PROJ_DIR || __dirname;
// Base directory to save dynamic data
const SAVE_BASE_PATH = process.env.SAVE_BASE_PATH || `${__dirname}/logging/`;
// 'POST' PATH TO SAVE QUESTIONNAIRE RESULTS.
const Q_SAVEPATH = process.env.Q_SAVEPATH || "logging/questionnaires/"; // Specifies where to save Questionnaires
// Experiment logs
const EXP_DATA_SAVEPATH = process.env.EXP_DATA_SAVEPATH || "logging/experiments/"; //Specifies where to save Experiment Logs within the server.


//  List of all non-game connections.
const browser_sockets = [];
// List of all game connections
let game_clients = [];


const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit: "50mb", parameterLimit: 50000, extended: true}));


const multer = require('multer'); // Library to process multipart requests


//Setup where received files will be stored.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/${EXP_DATA_SAVEPATH}`);
    },
    filename: function (req, file, cb) {
        // const uniqueSuffix = 
        //     Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.originalname);
    }
})


const upload = multer({
        storage: storage,
        //Filtro para que solo se acepten ciertas extensiones de archivo.
        fileFilter: function (req, file, callback) {
            let re = /(?:\.([^.]+))?$/;
            let extension = re.exec(file.originalname);
            console.log(extension[1]);
            if (extension[1] !== 'experiment') {
                return callback(new Error('Only .experiment files are allowed'))
            }
            callback(null, true)
        }
    })
;


// Dónde se guardarán los datos.
let fs = require('fs');
const {response} = require("express");


// INIT
// Creación de directorios para guardado de datos si estos no existen ya.


// console.log(" INITIALIZING SAVING PATHS ...".yellow());
//Folder para cuestionarios
   fs.promises.mkdir(`${__dirname}/${Q_SAVEPATH}`, {recursive: true})
        .then(() => console.log("[DIR INIT] Success on initialising the persistency directories for questionnaires :\n\t" + `${__dirname}/${Q_SAVEPATH}`))
        .catch(() => console.error("[ERROR] Something went wrong initialising directory : " + `${__dirname}/${Q_SAVEPATH}`));


//Logs del propio experimento
    fs.promises.mkdir(`${__dirname}/${EXP_DATA_SAVEPATH}`, {recursive: true})
        .then(() => console.log("[DIR INIT]Success on initialising the persistency directories for Experiment Logs : \n\t" + `${__dirname}/${EXP_DATA_SAVEPATH}`))
        .catch(() => console.error("[ERROR] Something went wrong initialising directory : " + `${__dirname}/${EXP_DATA_SAVEPATH}`));






/* SUPPORTED URL PATTERNS */
app.get('/', function (req, res) {
    //console.log(`[GET] Accessed monitor page from IP ${req.ip}`);
    res.sendFile(__dirname + '/html/cPageRemake.html');
});




app.get('/home', function (req, res) {
    res.sendFile(__dirname + '/html/home.html');
});

app.get('/msii-monitor', function (req, res) {
    console.log(`[GET] Accessed monitor page from IP ${req.ip}`);
    res.sendFile(__dirname + '/html/cpage.html');
});


app.get('/nasa.tlx', function (req, res) {
    res.sendFile(__dirname + '/html/NASA_TLX.html');
});

app.get('/flow.sc', function (req, res) {
    res.sendFile(__dirname + '/html/FlowShortScale.html');
});


//Receives .experiments files from client and saves it in the server's filesystem.
app.post('/ExpData.save', upload.single('fileFieldName'), function (req, resp) {

    console.log(req.file);
    console.log("Received request to /file.save2")
    if (req.method !== 'POST') {
        resp.status(400).send({message: 'Only POST requests allowed'})
        return;
    }

    //let whereToSave = `${__dirname}/${ED_SAVEPATH}${req.body.filename}.${req.body.type}`;

    console.log("'/file.save2' POST REQUEST received:");
    console.log(req.body);
});


app.put('/data.save', function (req, resp) {

    console.log("Received request to /data.save")

    if (req.method !== 'PUT') {
        resp.status(400).send({message: 'Only POST requests allowed'})
        return;
    }

    console.log("Obtaining a PUT request dude");


    //Procesamiento por chunks hasta completar el cacharro enviado
    let data = '';
    req.on('data', chunk => {
        data += chunk;
    })
    req.on('end', () => {
        console.log(JSON.parse(data));
        resp.end();
    })


    // const actualData  = JSON.stringify(req.body);
    // // = JSON.parse(req.body);
    // console.log(actualData);
    resp.status(200).send({message: ' JSON Correctly received!!'})


});


//This saves in a differente way.
app.post('/file.save', function (req, resp) {

    console.log("Received request to /file.save")

    if (req.method !== 'POST') {
        resp.status(400).send({message: 'Only POST requests allowed'})
        return;
    }

    //let whereToSave = `${__dirname}/${ED_SAVEPATH}${req.body.filename}.${req.body.type}`;

    console.log("'/file.save' POST REQUEST received:");
    console.log(req);

    //console.log(JSON.parse(req.body))
    //Procesamiento por chunks hasta completar el cacharro enviado
    let data = '';
    req.on('data', chunk => {
        data += chunk;
    })
    req.on('end', () => {
        //save
        console.log(data)

        //We write the file to disk in the configured directory.
        console.log("GUARDANDO ARCHIVO WTF");
        fs.writeFile(`${__dirname}/${Q_SAVEPATH}/cosaQueVieneDeClient.jpeg`, data,
            function (err) {
                if (err) {
                    return console.log("ERROR GUARDANDO ARCHIVO WTF");
                }
                console.log("GUARDANDO ARCHIVO WTF");
            });


        resp.end();
    })


    // const actualData  = JSON.stringify(req.body);
    // // = JSON.parse(req.body);
    // console.log(actualData);
    resp.status(200).send({message: ' JSON Correctly received!!'})


});


// NEW
// Saving using UXF tools (see Unity)
app.post('/uxf.save', async function (req, resp) {

    console.log("Received request to /uxf.save")

    if (req.method !== 'POST') {
        resp.status(400).send({message: 'Only POST requests allowed'})
        return;
    }

    //let whereToSave = `${__dirname}/${ED_SAVEPATH}${req.body.filename}.${req.body.type}`;

    console.log(req.body);

    // try {
    const pathElems = req.body.fileInfo.split("/")

    let experimentId = pathElems[0]
    let ppId = pathElems[1]
    let seshId = pathElems[2]


    const uxfLogWritePath = `${__dirname}/${EXP_DATA_SAVEPATH}/${experimentId}/${ppId}/`;


    console.log(` Escribiendo archivo `)

    // Crear directorio asociado al experimento (que normalmente existe)
    await fs.promises.mkdir(uxfLogWritePath, {recursive: true})


    let filename = path.basename(req.body.fileInfo);
    let extname = path.extname(req.body.fileInfo);
    let filenameNoExt = path.basename(filename, extname)


    // Escribir archivo de un participante.
    await fs.promises.writeFile(`${uxfLogWritePath}${filenameNoExt}_${experimentId}_${ppId}${extname}`, req.body.data,
        function (err) {
            if (err) {
                return console.log("ERROR GUARDANDO ARCHIVO");
            }
        });
    resp.status(200).send({message: ' File correctly received!!'})


});


//Para guardar datos de log del experimento.
app.post('/saveme.experiment', function (req, res) {

    let whereToSave = `${__dirname}/${EXP_DATA_SAVEPATH}${req.body.userID}.experiment`;

    console.log("'/saveme.experiment' POST REQUEST received. Will save incoming json as .experiment file");
    console.log(req.body);

    //We write the file to disk in the configured directory.
    fs.writeFile(whereToSave, JSON.stringify(req.body, undefined, 3),
        function (err) {
            if (err) {
                return console.log(`Error saving the .experiment file at ${whereToSave}:  ${err}.`);
            }
            console.log(`Successfully saved the .experiment data at ${whereToSave}.`);
        });

    res.send(`Saved successfully the file for the user {req.body.userID}`);

});


//saves the json data it receives as a file in the server side.
app.post('/questionnaires', function (req, res) {

    let whereToSave = `${__dirname}/${Q_SAVEPATH}${req.body.filename}.${req.body.type}`;

    console.log("'/questionnaires' POST REQUEST received:");
    console.log(req.body);

    //We write the file to disk in the configured directory.
    fs.writeFile(whereToSave, JSON.stringify(req.body.data, undefined, 3),
        function (err) {
            if (err) {
                return console.log(`Error saving the questionnaire file at ${whereToSave}:  ${err}.`);
            }
            console.log(`Successfully saved the questionnaire data at ${whereToSave}.`);
        });


    res.send('Saved successfully the file for the user' + req.body.userID)

})


printAnsweringUrls();


function printAnsweringUrls() {

    console.log(`Answering urls\n`.blue() +
        "------------------".blue())
    app._router.stack.forEach(function (layer) {
        let ruta = layer.route;
        if (ruta !== undefined) {
            console.log(`\t${ruta.path}`.blue());
        }
    });
    console.log("-------------------".blue())

}

// Aquí está obteniendo el servidor de web sockets, diciéndole que ha creado un server de http a manita.
const wss = new WebSocket.Server({server}, {port: port});


// We create a method which creates unique ids made of 3 randomly generated hex strings (using the s4());
wss.getUniqueID = function () {

    function s4() {
        //generates a number between 1 and 16 , then converts it to base HEX and then avoids the first letter.
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    return s4() + s4() + '-' + s4();
};


// Devuelve un json con los ids de los clientes de browser y/o game clients para ver estado.
app.get('/ActiveConnections', async (req, res) => {
    console.log("Requested Active Connection Listing");
    let objToSend = await listActiveWSs();
    res.json(objToSend);
});


//Lists all the websockets connections handled by the ws-server  
async function listActiveWSs() {


    let wsStatusList = {};

    wsStatusList["BrowserClients"] = [];
    wsStatusList["GameClients"] = [];

    console.log("[STATUS] >> ACTIVE WEBSOCKETS ?".green());
    if (browser_sockets == 'undefined' || browser_sockets.length <= 0) {
        console.log('\t NO BROWSER SOCKETS ACTIVE '.red())
    } else {
        console.log(`Browser sockets: #${browser_sockets.length}`.yellow());
        await browser_sockets.forEach(el => {
                console.log(`\t ${el.id}`.yellow());
                wsStatusList.BrowserClients.push(el.id);
            }
        )

    }
    if (game_clients == 'undefined' || game_clients.length <= 0) {
        console.log('\t NO GAME SOCKETS ACTIVE '.red())
    } else {
        console.log(`Game clients: #${game_clients.length}`.magenta());
        await game_clients.forEach(el => {
            console.log(`\t ${el.id}`.magenta());
            wsStatusList.GameClients.push(el.id);

        });

    }
    // let date_ob = new Date();
    // // current hours
    // let hours = date_ob.getHours();
    // // current minutes
    // let minutes = date_ob.getMinutes();
    // // current seconds
    // let seconds = date_ob.getSeconds();
    //
    // console.log(`timestamp: ${hours}:${minutes}:${seconds}`);
    //
    // console.log('----\n'); //Last update on '+ t.toDateString() );

    return wsStatusList;
}


//-----------------------
// WEBSOCKET SERVER CODE
//-----------------------

// -> When a connection is established on a websocket.
wss.on('connection', async function connection(_ws, req, client) {


    /* Obtenemos la instancia del web socket (ws)
       podemos tener varios clientes conectándose a nuestro servidor web,
       por lo que necesitamos una manera de identificar las diferentes conexiones bidireccionales
     */




    _ws.on('message', function incoming(_message) {
        //-> When a message is received in any web socket handled by this server.

        switch (_message) {
            case 'woz': // if is a web client, used for game monitoring and command triggering
                _ws.id = wss.getUniqueID(); // give an id property to the web socket,
                                            // so that we can distinguish between sockets later
                browser_sockets.push(_ws);
                console.log(` [+1]`.yellow() + ` browser_client`.red()+ ` Websocket Connection`+ ` with id '${_ws.id}' from ${req.socket.remoteAddress}`);

                _ws.send(`Connection established with Server. You are a browser_client with id ${_ws.id}`);
                //PASS DATA TO CLIENT


                //TODO: HEREEEE
                const initData = new WebsocketMessage(-1, 0, {
                    wsId: _ws.id
                })
                _ws.send(JSON.stringify(initData));


                break;
            case 'mr': // if it is a game client, then we want to handle it in a different way.
                _ws.id = wss.getUniqueID();
                game_clients.push(_ws);
                console.log(` [+1]`.yellow() + ` game_client`.red()+ ` Websocket Connection`+ ` with id '${_ws.id}' from ${req.socket.remoteAddress}`);
                // console.log(`[NewWS][GAME-CLIENT] ${_ws.id}`);
                _ws.send("Connection established with Server. You are a game_client");

                break;

            default: // If connection has already been confirmed.

                //a) message comes from game --> pass it to browser clients.
                if (game_clients.length > 0 && game_clients.find(elem => elem.id === _ws.id)) {
                    console.log(`Message received FROM game_client: ${_ws.id}`.magenta());
                    browser_sockets.forEach(_sock => _sock.send(_message));
                    console.log("\t[Action >>]".red() + " Message sent TO all browser clients ");
                }
                //b) message comes from browser client --> send it to game_clients
                else {
                    console.log(`Message received FROM browser_client: ${_ws.id}`.yellow());
                    game_clients.forEach(_sock => _sock.send(_message));
                    console.log("\t[Action >>]".red() + "Message sent TO all game clients ");
                }
            // UNCOMMENT TO DISPLAY ALL MESSAGES.
            //console.log(`>> received message: ${_message}`);

        }


    });
    _ws.on('close', function () {
        const idx = browser_sockets.findIndex(el => el.id == _ws.id);
        const idg = game_clients.findIndex(el => el.id == _ws.id)

        if (idx > -1) {
            const deleted = browser_sockets.splice(idx, 1);
            console.log(`deleted browser_socket.`);
        } else {
            const deleted = game_clients.splice(idx, 1);
            console.log(`deleted game_client.`);
        }
    })


});

//When the server has to be shut down, I created this method to perform cleanup.
wss.close = function cleanup() {

    console.log("Closing all web socket connections from server " + Date.now())
    game_clients.forEach((s => {
        s.send("server instructs to shut down the connection");
        s.close();
        s.terminate();
    }));

};


console.log("✅ Server started".green());
server.listen(port,
    //On server startup success
    function () {
        console.log(`\tWeb Server (HTTP) listening on `.green() + `${hostname}:${port}`.magenta());
    });


/* [NOT REQUIRED YET] app.use junto con express.static define la estructura de la uri para acceder a elementos estáticos */
app.use('/', express.static(__dirname + '/js'));
app.use('/', express.static(__dirname + '/stylesheets'));
app.use('/', express.static(__dirname + '/static'));


process.on('SIGINT', function () {
    wss.close();

    process.exit();
});



class WebsocketMessage {
    constructor(msgType = 0, opCode, DataDic, OptionsDic) {
        this.MessageType = msgType;
        this.OpCode = opCode;
        this.Data = DataDic;
    }
}


//
// //TODO: Basic authentication
// server.on('upgrade', function (req, socket, head) {
//     console.log(`\t  for upgrade`.magenta());
//
//     // ALLOW UPGRADING THE CONNECTION
//     console.log(`New WEBSOCKET CONNECTION UPGRADE request from ${req.socket.remoteAddress}`);
//
//     wss.emit('connection',socket,req);
//
//     // wss.handleUpgrade(request, socket, head, function (ws) {
//
//
//     //     wss.emit('connection', ws, request);
//     // });
//     // socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
//
//
// });
