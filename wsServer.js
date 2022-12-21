//HERE WEBSOCKET CODE
class WebsocketMessage {
    constructor(msgType = 0, opCode, DataDic, OptionsDic) {
        this.MessageType = msgType;
        this.OpCode = opCode;
        this.Data = DataDic;
    }
}

const wsServer = function (wss) {

    let ret = {} //-> El objeto a retornar cuando se usa esta bibliotecA

    //  List of all non-game connections.
    let browser_sockets = [];
    // List of all game connections
    let game_clients = [];


    //Helper function Lists all the websockets connections handled by the ws-server
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
        return wsStatusList;
    }


    //-----------------------
    // WEBSOCKET EVENT SERVER CODE
    //-----------------------

    // CONNECTION -> When a connection is established on a websocket.
    wss.on('connection', async function connection(wsock, req, client) {


        /* Obtenemos la instancia del web socket (ws)
           podemos tener varios clientes conectándose a nuestro servidor web,
           por lo que necesitamos una manera de identificar las diferentes conexiones bidireccionales
         */


        wsock.on('message', function incoming(_message) {
            //-> When a message is received in any web socket handled by this server.

            switch (_message) {
                case 'woz': // if is a web client, used for game monitoring and command triggering
                    wsock.id = wss.getUniqueID(); // give an id property to the web socket,
                    // so that we can distinguish between sockets later
                    browser_sockets.push(wsock);
                    console.log(` [+1]`.yellow() + ` browser_client`.red() + ` Websocket Connection` + ` with id '${wsock.id}' from ${req.socket.remoteAddress}`);

                    wsock.send(`Connection established with Server. You are a browser_client with id ${wsock.id}`);
                    //PASS DATA TO CLIENT


                    //TODO: HEREEEE
                    const initData = new WebsocketMessage(-1, 0, {
                        wsId: wsock.id
                    })
                    wsock.send(JSON.stringify(initData));


                    break;
                case 'mr': // if it is a game client, then we want to handle it in a different way.
                    wsock.id = webServer.getUniqueID();
                    game_clients.push(wsock);
                    console.log(` [+1]`.yellow() + ` game_client`.red() + ` Websocket Connection` + ` with id '${wsock.id}' from ${req.socket.remoteAddress}`);
                    // console.log(`[NewWS][GAME-CLIENT] ${_ws.id}`);
                    wsock.send("Connection established with Server. You are a game_client");

                    break;

                default: // If connection has already been confirmed.

                    //a) message comes from game --> pass it to browser clients.
                    if (game_clients.length > 0 && game_clients.find(elem => elem.id === wsock.id)) {
                        console.log(`Message received FROM game_client: ${wsock.id}`.magenta());
                        browser_sockets.forEach(_sock => _sock.send(_message));
                        console.log("\t[Action >>]".red() + " Message sent TO all browser clients ");
                    }
                    //b) message comes from browser client --> send it to game_clients
                    else {
                        console.log(`Message received FROM browser_client: ${wsock.id}`.yellow());
                        game_clients.forEach(_sock => _sock.send(_message));
                        console.log("\t[Action >>]".red() + "Message sent TO all game clients ");
                    }
                // UNCOMMENT TO DISPLAY ALL MESSAGES.
                //console.log(`>> received message: ${_message}`);

            }


        });
        wsock.on('close', function () {
            const idx = browser_sockets.findIndex(el => el.id == wsock.id);
            const idg = game_clients.findIndex(el => el.id == wsock.id)

            if (idx > -1) {
                const deleted = browser_sockets.splice(idx, 1);
                console.log(`deleted browser_socket.`);
            } else {
                const deleted = game_clients.splice(idx, 1);
                console.log(`deleted game_client.`);
            }
        })


    });

    // CLOSE -> When the server has to be shut down, I created this method to perform cleanup.
    wss.close = function cleanup() {

        console.log("Closing all web socket connections from server " + Date.now())
        game_clients.forEach((s => {
            s.send("server instructs to shut down the connection");
            s.close();
            s.terminate();
        }));

    };

    // AUX (PROVIDING ID TO EACH WEBSOCKET CONNECTION) -> We create a method which creates unique ids made of 3 randomly generated hex strings (using the s4());
    wss.getUniqueID = function () {

        function s4() {
            //generates a number between 1 and 16 , then converts it to base HEX and then avoids the first letter.
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }

        return s4() + s4() + '-' + s4();
    };

    // listActiveWSs();


    ret.browser_sockets = browser_sockets;
    ret.game_clients = game_clients;
    ret.listActive = listActiveWSs;

    return ret;


}


// // Devuelve un json con los ids de los clientes de browser y/o game clients para ver estado.
// app.get('/ActiveConnections', async (req, res) => {
//     console.log("Requested Active Connection Listing");
//     let objToSend = await listActiveWSs();
//     res.json(objToSend);
// });


module.exports = wsServer;