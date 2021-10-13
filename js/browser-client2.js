const WsMessageTypes = {
    RPC_COMMAND: 0,
    MONITORING: 1,
    SCREENCASTING: 2
}

// FOR TESTING
// Set to true if you want attempt auto connection of a browser client to the local ip.
const AUTO_CONNECT_LOCAL = false;
const DEFAULT_PORT = 9030;
const DEFAULT_IP = "localhost";


let websocketURL = "";

let socket = undefined;


const clientLogDiv = document.querySelector("#client-log");


// [Main program]

//Extract where to connect and attempt connection if AUTO-CONNECT is enabled.
if (AUTO_CONNECT_LOCAL) {
    // Show if auto-connect is enabled
    let infoShow_ConnectConfig = document.querySelector("[data-id='connect-configuration']")
    infoShow_ConnectConfig.innerHTML = ` TRUE: ${DEFAULT_IP}:${DEFAULT_PORT}`;
    document.querySelector("#s-connection-prompt").className = "hidden";
    socket = new WebSocket(websocketURL = `ws://${DEFAULT_IP}:${DEFAULT_PORT}`);
    AttemptWSServerConnect(); //Attempt Connection
} else {
    // Show if auto-connect is enabled
    let infoShow_ConnectConfig = document.querySelector("[data-id='connect-configuration']")
    infoShow_ConnectConfig.innerHTML = ` FALSE`;
}



/* 
    Extracts a url from a page input field and attempts a connection to a websocket server at such url.
 */
function AttemptWSServerConnect() {

    //Obtain a valid ws url.
    if (socket === undefined) {
        let connectToTxtBox = document.querySelector("#f-hostname").value;
        connectToTxtBox.startsWith("ws://") ?
            socket = new WebSocket(websocketURL = `${connectToTxtBox}`) :
            socket = new WebSocket(websocketURL = `ws://${connectToTxtBox}/`);
    }


    console.log(`[Websocket] Attempting Connection To : '${websocketURL}' [AUTO_CONNECT_LOCAL=${AUTO_CONNECT_LOCAL}]`);

    //Periodicaly Update Visible status.
    setInterval(DisplayWebsocketServerConnectionStatus, 3000);

    //Hook HTML buttons with websocket message sending.
    RPCCallsHookup(socket);

    //[WS CLOSED]
    socket.onclose = function (event) {
        if (event.wasClean) {
            alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            alert('[close] Connection died.');
        }
    };

    //[WS ERROR]
    socket.onerror = function (error) {
        alert("[error]"); // ${error.message}`);
        socket = undefined;
    };

    //[WS OPEN]
    socket.onopen = function (e) {
        alert("[open] Connection established");
        socket.send("woz");
    };

    // [WS MESSAGE RECEIVED]
    socket.onmessage = function (event) {

        let wsMessage = event.data;
        let wsMessageAsJSObject = undefined;

        //Try to convert the input message (a json),
        // to a Javascript Object to ease manipulation.
        try {
            wsMessageAsJSObject = JSON.parse(wsMessage);
            DisplayIncomingMessageInClientLog(wsMessage);
        } catch (e) {
            console.log("[WS MSG RECEIVED] Message arrived but couldn't be parsed \n" + event.data)
        }


        //[When Parseable message]
        if (wsMessageAsJSObject !== undefined) {

            // @todo here  process message in a way depending on the type of data.

            //console.log("RECEIVED MESSAGE " + Object.keys(msgObject))


            switch (wsMessageAsJSObject["MessageType"]) {

                case WsMessageTypes.MONITORING :
                    switch (wsMessageAsJSObject["OpCode"]) {

                        case "GeneralStatus":
                            console.log("[(IN)MSG][GeneralStatus] General Remote game status received.")
                            GeneralStatus_InputMsgProcesser(wsMessageAsJSObject);
                            break;

                        case "UserPerformanceInfo":
                            console.log("[(IN)MSG][UserPerformanceInfo] User Interaction and metrics received.")
                            UserPerformance_InputMsgProcesser(wsMessageAsJSObject);
                            break;
                            
                        case "VisualizationInfo":
                            console.log("[(IN)MSG][VisualizationInfo] In-game gata visualization information received.")
                            VisualizationInfo_InputMsgProcesser(wsMessageAsJSObject);
                            break;


                        //Información sobre la solución ideal del Minijuego.
                        case "MinigameSolution":
                            DisplayMinigameSolution(wsMessageAsJSObject);
                            break;
                        //Información sobre el progreso del usuario en el minijuego
                        case "MiniGameStatus":
                            DisplayCurrentMinigameStatus(wsMessageAsJSObject);
                            break;

                        case "UserTransform":
                            console.log("[(IN)MSG][UserTransform] User coords and rotation received.")
                            //ShowPositionAndRotationInSvgMap(wsMessageAsJSObject);
                            break;
                    }


                case  WsMessageTypes.SCREENCASTING:

                    //Display the received image data in Base 64
                    let imgElemForRemote = document.querySelector("#remoteView");

                    //Decode as JPEG:
                    // imgElemForRemote.src = 'data:image/jpeg;base64,' + wsMessageAsJavasriptObject.Data;

                    //Decode as PNG
                    imgElemForRemote.src = 'data:image/png;base64,' + wsMessageAsJSObject.Data;

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





function DisplayIncomingMessageInClientLog(msg) {

    let debugMessageDiv = document.createElement("div");
    //Formatting
    debugMessageDiv.setAttribute("class", "debugMsg");


    debugMessageDiv.textContent = msg; //event.data;

    try {
        let parsedMsg = JSON.parse(msg);
        if (parsedMsg["MessageType"] === 2) {
            debugMessageDiv.textContent = `New Frame Received: ts=${parsedMsg["Timestamp"].toString()}s`;
        }
    } catch (e) {

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

/* 
    Parses an input message how the general information about a remote game client is displayed in the webpage.
 */
function GeneralStatus_InputMsgProcesser(wsMessage) {

    const whereToShowGameClientStatus = document.querySelector("#GeneralStatusSection");
    let statusText = ""
    if ("CurrentSceneName" in wsMessage.Data) {
        let sceneNameContainer = document.querySelector("[data-id='m-SceneName']");
        sceneNameContainer.innerHTML = wsMessage.Data["CurrentSceneName"].toString();
    }
    if ("AntilatencyDevices" in wsMessage.Data) {
        let devicesContainer = document.querySelector("[data-id='m-AntilatencyDeviceList']");
        devicesContainer.innerHTML = wsMessage.Data["AntilatencyDevices"];
    }
    let nuPar = document.createElement("p");
    nuPar.innerText = statusText
    whereToShowGameClientStatus.appendChild(nuPar);
}


// Hide main page div if no connection has been established.
// setInterval(() => {
//     if (socket == undefined) {
//         document.querySelectorAll("section").forEach(e => e.style.display = "none");
//     } else {
//         document.querySelectorAll("section").forEach(e => e.style.display = "initial");
//     }
// }, 3000);


function VisualizationInfo_InputMsgProcesser(wsMessage) {

    let graphStats = JSON.parse(wsMessage.Data["GraphInfo"]);
    // console.log("processsing current visualization data.")
    //console.log(graphStats)

}

function UserPerformance_InputMsgProcesser(wsMessage) {
    
    let interactionData =  wsMessage.Data;
    
    document.querySelector("[data-id='m-TravelledDistance']").innerHTML = interactionData.Distance;

    let pSummary = JSON.parse(interactionData.InteractionSummary)
    document.querySelector("[data-id='m-InteractionSummary']").innerHTML = JSON.stringify(pSummary);
    
    let dInteraction = JSON.parse(interactionData.DetailInteraction)
    document.querySelector("[data-id='m-DetailInteraction']").innerHTML = JSON.stringify(dInteraction);
    
    let timersSummary = JSON.parse(interactionData.TimersSummary)
    document.querySelector("[data-id='m-TimersSummary']").innerHTML = JSON.stringify(timersSummary);
    
    console.log(interactionData)
    
}



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

    //ADD EVERYTHING
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





/* 
 Muestra en la web si se ha conectado este cliente al servidor de websockets correctamente.
 - Las clases de css disconnected-box y connected-box permiten definir estilos para el texto que aparece mostrando Conexión o Desconexión.
*/
function DisplayWebsocketServerConnectionStatus() {
    //Encontramos elementos del DOM a alterar.
    let statusBox = document.querySelector("#ws-server-connection-status").querySelector(".status-box");
    let hostname = document.querySelector("#conn-hostname");
    if (socket === undefined) {
        statusBox.classList.add("disconnected-box");
        statusBox.classList.remove("connected-box");
        statusBox.innerHTML = "DISCONNECTED"
    } else {
        statusBox.classList.add("connected-box");
        statusBox.classList.remove("disconnected-box");
        statusBox.innerHTML = "CONNECTED TO WS SERVER"
    }
    hostname.innerHTML = `${websocketURL}`;

}

