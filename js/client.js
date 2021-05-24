//Client that does not currently support the browser


console.log(" running browser client")
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:9030');

ws.on('open', function open() {
    alert("Connected client");
    console.log("websocket client was opened ");
    setInterval(()=> {ws.send("message sample")}, 1000);
});

ws.on('message', function incoming(data) {
    console.log(data);
});



