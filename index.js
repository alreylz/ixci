/***
 * Main file of the application
 * run using 'npx nodemon ./index.js'
 */


/* Imports */
const dotenv = require('dotenv').config();
const expressApp = require("./express-app")
const logColors = require("./js/LogColouring")
const http = require('http');
const WebSocket = require("ws");

/* Constants */

const hostname = process.env.IP || "localhost";
const webPort = process.env.PORT || 9030;
const wsPort = process.env.WS || webPort;

// This variable is accessible from any backend code
global.__basedir = __dirname;
global.basedir = __dirname;

// HTTP SERVER WILL RUN EXPRESS CODE
const server = http.Server(expressApp);

// WEBSOCKET SERVER WILL RUN ON THE SAME HTTP SERVER AND A
const wss = new WebSocket.Server({server}, {port: wsPort});
let wsServerInfo = require("./wsServer")(wss);


console.clear();
console.log("╔╗╔╗╔╗╔══╗╔╗\n".blue() +
    "╠╣╚╬╬╝║╔═╝╠╣\n".blue() +
    "║║╔╬╬╗║╚═╗║║\n".blue() +
    "╚╝╚╝╚╝╚══╝╚╝  By @alreylz\n".blue());

// START THE WEB SERVER AND THE WEBSOCKET SERVER
server.listen(webPort,
    //On server startup success
    function () {
        console.log("------------------".green());
        console.log("✅ Server started".green());
        console.log("------------------".green());


        console.log(`\tWeb Server (HTTP) listening on `.green() + `${hostname}:${webPort}`.magenta());
        if (wsServerInfo)
            console.log(`\tWebsocket Server listening on `.green() + `${hostname}:${wsPort}`.magenta());


    });