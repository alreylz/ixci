let socket = undefined;


const WsMessageTypes = {
    RPC_COMMAND: 0,
    MONITORING: 1,
    SCREENCASTING: 2
}


//Set to true if you want attempt auto connection of a browser client to the local ip.
const AUTO_CONNECT_LOCAL = false;
const DEFAULT_PORT = 9030;
const DEFAULT_IP = "localhost";

let websocketURL = "";


const clientLogDiv = document.querySelector("#client-log");


// Hide main page div if no connection has been established.
setInterval(() => {
    if (socket == undefined) {
        document.querySelector("#pageContent").style.display = "none";
    } else {
        document.querySelector("#pageContent").style.display = "initial";
    }
}, 3000);


function DisplayWebsocketServerConnectionStatus() {

    let statusBox = document.querySelector("#ws-server-connection-status").querySelector(".status-box");
    let hostname = document.querySelector("#conn-hostname");

    if (socket === undefined) {
        statusBox.classList.add("disconnected-box");
        statusBox.classList.remove("connected-box");
        statusBox.innerHTML = "DISCONNECTED"
    } else {
        statusBox.classList.add("connected-box");
        statusBox.classList.remove("disconnected-box");
        statusBox.innerHTML = "CONNECTED"
    }
    hostname.innerHTML = `${websocketURL}`;

}


// [Main program]

//Extract where to connect.
if (AUTO_CONNECT_LOCAL) {
    socket = new WebSocket(websocketURL = `ws://${DEFAULT_IP}:${DEFAULT_PORT}`);
    document.querySelector("#connection-prompt").className = "hidden";
} else {
    // Obtain hostname or <IpAddress:Port> to use for websocket connection from within the page.
    let connectToTxtBox = document.getElementById("hostname").value;
    
    if (connectToTxtBox.startsWith("ws")) {
        socket = new WebSocket(websocketURL = `${connectToTxtBox}`)
    } else {
        socket = new WebSocket(websocketURL = `ws://${connectToTxtBox}/`);
    }
}

//Attempt Connection
tryConnectWS();


function tryConnectWS() {

    
    if(socket == undefined){
        let connectToTxtBox = document.getElementById("hostname").value;
        if (connectToTxtBox.startsWith("ws")) {
            socket = new WebSocket(websocketURL = `${connectToTxtBox}`)
        } else {
            socket = new WebSocket(websocketURL = `ws://${connectToTxtBox}/`);
        }
    }
    

    console.log(`[Websocket] Attempting Connection To : '${websocketURL}'  [AUTO_CONNECT_LOCAL=${AUTO_CONNECT_LOCAL}]`);

    //Periodicaly Update Visible status.
    setInterval(DisplayWebsocketServerConnectionStatus, 3000);

    //Hook HTML buttons with websocket message sending.
    RPCCallsHookup(socket);


    //[WS OPEN]
    socket.onopen = function (e) {
        alert("[open] Connection established");
        socket.send("woz");
    };

    // [WS MESSAGE RECEIVED]
    socket.onmessage = function (event) {

        let wsMessage = event.data;


        let wsMessageAsJavasriptObject = undefined;

        //Try to convert the input message (a json), to a Javascript object to ease manipulation.
        try {
            wsMessageAsJavasriptObject = JSON.parse(wsMessage);
            DisplayIncomingMessageInClientLog(wsMessage);
        } catch (e) {
            console.log("Received a message which was impossible to parse.")
        }


        //[When Parseable message]
        if (wsMessageAsJavasriptObject !== undefined) {


            // @todo here  process message in a way depending on the type of data.

            //console.log("RECEIVED MESSAGE " + Object.keys(msgObject))

            switch (wsMessageAsJavasriptObject["MessageType"]) {

                case WsMessageTypes.MONITORING :
                    switch (wsMessageAsJavasriptObject["OpCode"]) {
                        case "UserTransform":
                            console.log("[Monitoring] User coords and rotation received and updated.")
                            ShowPositionAndRotationInSvgMap(wsMessageAsJavasriptObject);
                            break;
                        // more cases here

                        case "GeneralStatus":
                            console.log("[Monitoring] General Remote game status received.")
                            DisplayRemoteGeneralStatus(wsMessageAsJavasriptObject);


                            break;
                        //Información sobre la solución ideal del Minijuego.
                        case "MinigameSolution":
                            DisplayMinigameSolution(wsMessageAsJavasriptObject);


                            break;


                        //Información sobre el progreso del usuario en el minijuego
                        case "MiniGameStatus":
                            DisplayCurrentMinigameStatus(wsMessageAsJavasriptObject);

                            break;
                    }


                case  WsMessageTypes.SCREENCASTING:

                    //Display the received image data in Base 64
                    let imgElemForRemote = document.querySelector("#remoteView");
                    
                    //Decode as JPEG:
                    // imgElemForRemote.src = 'data:image/jpeg;base64,' + wsMessageAsJavasriptObject.Data;

                    //Decode as PNG
                    imgElemForRemote.src = 'data:image/png;base64,' + wsMessageAsJavasriptObject.Data;
                    
                    //@future There must be a better way
                    // var imageDataBuffer = new Uint8Array(msgObject.Data.imgData) ;
                    // console.log("BUFFER DATA" + imageDataBuffer);
                    // var blob = new Blob( [ imageDataBuffer ], { type: "image/png" } );
                    // var urlCreator = window.URL || window.webkitURL;
                    // var imageUrl = urlCreator.createObjectURL( blob );
                    // imgElemForRemote.src = imageUrl;
                    break;


            }


        } else {
            //HERE FUNCTION
        }


    };

    socket.onclose = function (event) {
        if (event.wasClean) {
            alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            alert('[close] Connection died.');
        }
    };

    socket.onerror = function (error) {
        alert("[error]"); // ${error.message}`);
        socket = undefined;
    };


}


let commandButtons = document.querySelectorAll(".woz-clck")

function wsSendData(buttonDataElem) {

    let dataId = buttonDataElem.getAttribute("data-id");
    console.log("PRESSED BUTTON  WITH DATA ID = " + dataId);
    socket.send(dataId);


}

// Adding listeners.
commandButtons.forEach(
    button => {
        button.addEventListener("click", () => wsSendData(button));
        console.log("Added click listener");
        return false;
    }
);


function DisplayCurrentMinigameStatus(wsMessage) {

    let CurrentMGStatusPanel = document.querySelector("#MinigameStatusDisplay");


    let htmlToPutInPanel = "";

    //User Ordering
    console.log(wsMessage.Data["UserOrdering"]);
    let dictionaryOrderedElems = JSON.parse(wsMessage.Data["UserOrdering"]);
    // console.log("EXAMPLE OF DATA EXTRACTED" + wsMessage["UserOrdering"])


    htmlToPutInPanel = "<ul>"


    for (i = 0; i < 5; i++) {
        try {

            htmlToPutInPanel += "<li>" + `<b> Position ${i + 1} </b>:  ${dictionaryOrderedElems[i]["NodeId"]} - ${dictionaryOrderedElems[i]["Weight"]}   ` + "</li>";
        } catch (e) {
            console.log(`${i} slot is empty by now in game.`)
        }
    }

    htmlToPutInPanel += "</ul>"
    if ("CorrectionSummary" in wsMessage.Data)
        var corrSummary = JSON.parse(wsMessage.Data["CorrectionSummary"]);

    if (corrSummary)
        htmlToPutInPanel += `
            <ul>
                <li> Task: Top ${corrSummary["numSlotsUsed"].toString()} nodes. </li>
                <li> Number of Empty Slots: ${corrSummary["numEmptySlots"].toString()}. </li>
                <li> Number of errors: ${corrSummary["numErrors"].toString()}. </li>
                <li> Correctly ordered: ${corrSummary["correctlyOrdered"].toString()}. </li>
            </ul>
        `;


    //Correction Summary
    console.log("MESSAGE DATA KEYS:" + Object.keys(wsMessage.Data));
    console.log("EXAMPLE OF DATA EXTRACTED" + wsMessage.Data["CorrectionSummary"])

    // htmlToPutInPanel += wsMessage.Data["CorrectionSummary"].toString();

    //ADD EVERYTHINH
    CurrentMGStatusPanel.innerHTML = htmlToPutInPanel

}


function DisplayMinigameSolution(wsMessage) {


    let expectedOrderList = JSON.parse(wsMessage.Data["ExpectedOrder"]);


    let minigameSolutionPanel = document.querySelector("#MinigameSolutionDisplay");

     let htmlToPutInPanel = "<ul>";
         // "<h3> Expected solution to the task: </h3><pre>";
    console.log("Expected order list " + expectedOrderList)

    console.log(Object.keys(expectedOrderList));
    for (i = 1; i <= 5; i++) {
        console.log(expectedOrderList[i]);
        htmlToPutInPanel += `<li> <b> Position ${i} </b> : ${expectedOrderList[i]} </li>`;
    }
    minigameSolutionPanel.innerHTML = htmlToPutInPanel + "</ul>";

    // expectedOrderList.forEach((v, i) => htmlToPutInPanel += ` Position ${i} : Node: ${v}` + " <br>")
    // minigameSolutionPanel.innerHTML = htmlToPutInPanel;
    //
    // console.log("Expected order list "  + expectedOrderList)


}


function DisplayIncomingMessageInClientLog(msg) {

    let debugMessageDiv = document.createElement("div");
    //Formatting
    debugMessageDiv.setAttribute("class", "debugMsg");

    
    
    debugMessageDiv.textContent = msg; //event.data;
    
    try {
       let parsedMsg=  JSON.parse(msg);
        if( parsedMsg["MessageType"] === 2){
            debugMessageDiv.textContent = `New Frame Received: ts=${parsedMsg["Timestamp"].toString()}s`;
        }
    }
    catch (e){
        
    }
    clientLogDiv.appendChild(debugMessageDiv);
    
    
    
    
    
}

function ClearClientLog() {
    while (clientLogDiv.lastElementChild) {
        clientLogDiv.removeChild(clientLogDiv.lastElementChild);
    }
}


//Given a width and a height of the Antilatency Map in the real world, displays the position and rotation of the head in a svg window in the browser page.
function ShowPositionAndRotationInSvgMap(wsMessage, widthInAntilatencyMatSquares = 8.0, heightInAntilatencyMatSquares = 5.0) {

    let svgContainer = document.getElementById("world2D");

    // Obtain real dimensions in meters and aspect ratio from these (to keep svg map properly scaled).
    let rwWidth = 0.6 * widthInAntilatencyMatSquares;
    let rwHeight = 0.6 * heightInAntilatencyMatSquares;
    let aspectRatio = rwHeight / rwWidth;

    //console.log(`aspect ratio ${aspectRatio}`);

    //[MAKE SVG GROW AND SHRINK WITH WINDOW]
    let mapWidth = svgContainer.getBoundingClientRect().width;
    //Calculo la altura correspondiente.
    let mapHeight = mapWidth * aspectRatio;
    svgContainer.setAttribute("height", mapHeight);

    //console.log(`svg (W,H) = ${mapWidth} , ${mapHeight}`);

    //Get svg elements representing the user.
    let userHead = svgContainer.querySelector(".user-head-svg");
    let userGazeLine = document.querySelector("#user-head-dir")
    let userRepresentation = document.querySelector("#user-rep");


    //Coordinate correction

    //1) Sumar nuevo origen.
    let correctedX = wsMessage.Data.position[0] + rwWidth / 2.0;
    let correctedY = wsMessage.Data.position[2] + rwHeight / 2.0;

    //2) Convert meters to window units
    correctedX = mapWidth - (correctedX * mapWidth / rwWidth);
    correctedY = correctedY * mapHeight / rwHeight;

    let headDiameter = 0.15;//cm   //https://en.wikipedia.org/wiki/Human_head

    userHead.setAttribute("cx", correctedX.toString());
    userHead.setAttribute("cy", correctedY.toString());
    userHead.setAttribute("r", (headDiameter * mapWidth / rwWidth).toString())
    userHead.setAttribute("fill", "yellow")


    userGazeLine.setAttribute("d", `M ${correctedX} ${correctedY} L ${correctedX} ${correctedY + 60} Z`)
    userGazeLine.setAttribute("style", "stroke:teal;stroke-width:2");

    userGazeLine.setAttribute("transform", `rotate (${wsMessage.Data.rotation[1]} ${correctedX.toString()} ${correctedY.toString()} ) `);

}


console.log(commandButtons)

//Handles how the general status information about a remote game client is displayed in the webpage.
function DisplayRemoteGeneralStatus(wsMessage) {
    const whereToShowGameClientStatus = document.querySelector("#GameClientGeneralStatus");

    let statusText = ""

    if ("CurrentSceneName" in wsMessage.Data) {
        let sceneNameContainer = document.querySelector("span[data-id='m-SceneName']");
        sceneNameContainer.innerHTML = wsMessage.Data["CurrentSceneName"].toString();
    }
    if ("ActiveGraph" in wsMessage.Data) {
        let graphNameContainer = document.querySelector("span[data-id='m-ActiveGraphName']");
        graphNameContainer.innerHTML = wsMessage.Data["ActiveGraph"].toString();
    }

    if ("AntilatencyDevices" in wsMessage.Data) {
        let devicesContainer = document.querySelector("span[data-id='m-AntilatencyDeviceList']");
        devicesContainer.innerHTML = wsMessage.Data["AntilatencyDevices"];
    }

    if ("Measures" in wsMessage.Data) {
        let distanceContainer = document.querySelector("span[data-id='m-TravelledDistance']");
        let interactionsCountContainer = document.querySelector("span[data-id='m-InteractionCounter']");

        // console.log(wsMessage.Data.Measures)
        // console.log(typeof (JSON.parse(wsMessage.Data.Measures)))

        let measuresDict = JSON.parse(wsMessage.Data.Measures)
        // console.log(Object.keys(measuresDict))
        // console.log(measuresDict)
        if ("Distance" in measuresDict)
            distanceContainer.innerHTML = measuresDict.Distance.toString()
        if ("InteractionsCounter" in measuresDict)
            interactionsCountContainer.innerHTML = measuresDict.InteractionsCounter.toString()


    }

    let nuPar = document.createElement("p");
    nuPar.innerText = statusText
    whereToShowGameClientStatus.appendChild(nuPar);
}



