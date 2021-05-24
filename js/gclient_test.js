// Bare bones websocket client which connects to a server 
// and configures itself as game_client by sending a specific message at connection startup

const WebSocket = require('ws');

let port = process.env.PORT | 9030 ; 
let hostname = process.env.HOSTNAME | 'localhost';

let wait_T_beforeMsg1 = /*num seconds*/ 2 * 1000;
let dataSendInterval = /*num seconds*/ 0.5 * 1000;



const ws = new WebSocket(`ws://${hostname}:${port}`);

ws.on('open', function open() {
    console.log(`Game_client running.`)
    ws.send("mr"); //send first message which is used for configuration in the server.
    // send a message every T seconds after waiting for U seconds
    setTimeout( () => sendDataPeriodically(ws,dataSendInterval), wait_T_beforeMsg1);
});


ws.on('message', function incoming(data) {
    console.log(`Received message: ${data}`);
});

function sendDataPeriodically(socket, repeatEvery){
    setInterval(()=> {socket.send("message sample")}, repeatEvery);
}