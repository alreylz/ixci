

//Monitoring / Wizard of OZ server code.

const express = require('express'); /* We the express package to create a quick and dirty web-server */
var app = express();


//Object binding representing the web-server, which we generate via express.
const server = require('http').Server(app);

// Configuration
var port = process.env.PORT || 9030;


const WebSocket = require('ws');


//  List of all non-game connections.
const browser_sockets = [];

// List of all game connections
let game_clients = [];


/* SUPPORTED URL PATTERNS */


app.get('/home',function(req, res) {
    res.sendFile(__dirname + '/html/home.html');
});


app.get('/msii-monitor',function(req, res) {
    console.log(`[GET] Accessed monitor page from IP ${req.ip}`);
    res.sendFile(__dirname + '/html/cpage.html');
});

app.get('/nasa.tlx',function(req, res) {
    res.sendFile(__dirname + '/html/NASA_TLX.html');
});

app.get('/flow.sc',function(req, res) {
    res.sendFile(__dirname + '/html/FlowShortScale.html');
});


const bodyParser = require('body-parser');
app.use(bodyParser.json());


app.post('/', function (req, res) {
    console.log(req.body);

    var fs = require('fs');
    fs.writeFile(`/tmp/${req.body.userID}`, req.body.data, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
    
    
    res.send('Saved successfully the file for the user' + req.body.userID )
    
})








// Aquí está obteniendo el servidor de web sockets, diciéndole que ha creado un server de http a manita.
const wss = new WebSocket.Server({ server }, {port: port});

// We create a method which creates unique ids made of 3 randomly generated hex strings (using the s4());
wss.getUniqueID = function () {
    
    function s4() {
        //generates a number between 1 and 16 , then converts it to base HEX and then avoids the first letter.
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4();
};


//
// console.log(wss.getUniqueID())
// console.log(wss.getUniqueID())


//const IntervalListSocketsHandle = setInterval(() => listActiveWSs(), 15 * 1000);


// function listActiveWSs(){
// //Lists all the websockets connections handled by the ws-server    
//     console.log("\n\n\n[STATUS] >> ACTIVE WEBSOCKETS ?");
//     if(browser_sockets == 'undefined' || browser_sockets.length <= 0){
//         console.log('\t NO BROWSER SOCKETS ACTIVE ')
//     }
//     else {
//         console.log(`Browser sockets: #${browser_sockets.length}`);
//         browser_sockets.forEach(el => console.log(`\t ${el.id}`))
//     }   
//    
//     if( game_clients == 'undefined' || game_clients.length <= 0 ) {
//         console.log('\t NO GAME SOCKETS ACTIVE ')
//     }
//     else{
//         console.log(`Game clients: #${game_clients.length}`);
//         game_clients.forEach(el => console.log(`\t ${el.id}`))
//     }
//    
//     let t = Date.now();
//     console.log('----'); //Last update on '+ t.toDateString() );
//        
// }



//When a connection is established on a websocket.
wss.on('connection', function connection(_ws) {
    
    //obtenemos la instancia del web socket (ws)
    //podemos tener varios clientes conectándose a nuestro servidor web, por lo que necesitamos una manera de identificar las diferentes conexiones bidireccionales.

    //When a message is received in any web socket handled by this server. 
    _ws.on('message', function incoming(_message) {

        
        
        
        
        switch(_message){
            case 'woz': // if is a web client, used for game monitoring and command triggering
                _ws.id = wss.getUniqueID(); // give an id property to the web socket, 
                                            // so that we can distinguish between sockets later
                browser_sockets.push(_ws);
                console.log(`[NewWS][WOZ-CLIENT] ${_ws.id}`);
                _ws.send("Connection established with Server. You are a browser_client");
                break;
            case 'mr': // if it is a game client, then we want to handle it in a different way.
                _ws.id = wss.getUniqueID();
                game_clients.push(_ws);
                console.log(`[NewWS][GAME-CLIENT] ${_ws.id}`);
                _ws.send("Connection established with Server. You are a game_client");

                break;
                
            default: // If connection has already been confirmed.
                
                //a) message comes from game --> pass it to browser clients.
                if( game_clients.length > 0 && game_clients.find( elem => elem.id === _ws.id ))
                {
                    console.log(`[IN] -->> Message received from game_client ${_ws.id}`);
                    browser_sockets.forEach( _sock => _sock.send(_message));
                    console.log("[OUT] <<-- Message sent to all browser clients ");
                }
                //b) message comes from browser client --> send it to game_clients
                else 
                {
                    console.log(`[IN] -->> Message received from browser_client ${_ws.id}`);
                    game_clients.forEach( _sock => _sock.send(_message));
                    console.log("[OUT] <<-- Message sent to all game clients ");
                }
                // UNCOMMENT TO DISPLAY ALL MESSAGES.
                //console.log(`>> received message: ${_message}`);
                
        }

       
    });
    _ws.on('close', function(){
        const idx = browser_sockets.findIndex(el => el.id == _ws.id);
        const idg = game_clients.findIndex(el => el.id == _ws.id)

        if(idx > -1){
            const deleted = browser_sockets.splice(idx, 1);
            console.log(`deleted browser_socket.`);
        }
        else{
            const deleted = game_clients.splice(idx, 1);
            console.log(`deleted game_client.`);
        }
    })
    
    
});

//When the server has to be shut down, I created this method to perform cleanup.
wss.close = function cleanup() {

    console.log("Closing all web socket connections from server "+ Date.now())
    game_clients.forEach((s => { s.send("server instructs to shut down the connection"); s.close(); s.terminate();}));
    
};


//server.listen(process.env.PORT);
console.log("Server started");

server.listen(port, function(){
    console.log(`Web Server (HTTP) listening on *:${port}`);
});




/* [NOT REQUIRED YET] app.use junto con express.static define la estructura de la uri para acceder a elementos estáticos */
app.use('/',express.static(__dirname + '/js'));
app.use('/',express.static(__dirname + '/static'));




process.on('SIGINT', function(){
    wss.close();

    process.exit();
});










// const express = require('express')
//
// const app = express()
// const port = 8080
//
// app.get('/', function get(req,res){
//     //console.log(req);
//     res.send('Response from the server')
// })
//
//
//
// app.get('/sth', function get(req,res){
//     //console.log(req);
//     res.sendFile("cpage.html",{root: "C:\\Users\\Alejandro Rey\\Desktop\\GitHub\\ws-msii\\html"})
//     //res.send('Page wsControl')
// })
//
//
//
//
//
// app.listen(port, () => console.log("app listening "))
//
//
//
//
//
//
//
// // Serve static files in Express.
// app.use('/pathOfChoosing', express.static('static'))





// const ws = require('ws');
//
//
// const listenPort = 8080;
//
// const wsServer = new ws.Server(
//     { host: 'localhost', port: listenPort }
// );
//
// console.log(Object.keys(wsServer))
//
//
// wsServer.on('listening',(sth) => console.log(`Websocket server listening in port ${listenPort}`));
//
//
// wsServer.on('connection', (_ws) => {
//    
//     //Connection receives a websocket instance, which we can then use to add callbacks when messages are received.
//     // console.log(Object.keys(_ws))
//    
//     let numReceivedMsgs = 0;
//     //Stating what to do when a message is received on the server.
//     _ws.on('message', (msgIncoming) => {
//         console.log(`Received message: ${msgIncoming}`);
//         numReceivedMsgs += 1;
//     });
//    
//    
//     setInterval(() => { _ws.send(`message count ${numReceivedMsgs} so far.`)} , 1000);
//    
//    
// });
//
//
// wsServer.on('error',(_err) => console.log(`${_err}`) );
//
// wsServer.on('close', (sth) => console.log(`Closed server`));
//    




