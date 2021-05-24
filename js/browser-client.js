
let socket = undefined; 



let clientLogDiv = document.querySelector("#client-log"); 


// Hide main page div if no connection has been established.
setInterval( () => {
    if(socket == undefined){
    document.querySelector("#pageContent").style.display = "none";
}
else{
    document.querySelector("#pageContent").style.display= "block";
}
}, 1000);




function tryConnectWS() {

    // Obtain hostname to use for websocket connection
    let connectToTxtBox = document.getElementById("hostname").value;

    console.log("Will attempt ws connection to :" +connectToTxtBox);

    socket = new WebSocket(`ws://${connectToTxtBox}/`);

    RPCCallsHookup(socket);
    
    socket.onopen = function(e) {
        alert("[open] Connection established");
        //alert("Sending to server");
        socket.send("woz");
    };

    socket.onmessage = function(event) {
        //alert(`[message] Data received from server: ${event.data}`);

        //Adds received message to clientLogDiv.
        
        let wsMessage = event.data;


        let msgObject = undefined;
        //Process input data:
        try {
            msgObject = JSON.parse(wsMessage);
        }
        catch (e){
            console.log("a non communication message was encountered")
        }
        if(msgObject !== undefined /*&& "MessageType" in msgObject && "OpCode" in msgObject*/){

            
            
            // @todo here  process message in a way depending on the type of data.

            
          //   console.log(msgObject.MessageType);
          //  console.log(msgObject.OperationName);
          // //console.log(msgObject.Data.position)//forEach(d => console.log(d));
             //console.log(msgObject.Data);
            
          //console.log(msgObject.Options)//forEach(d => console.log(d));

            //console.log("RECEIVED MESSAGE " + Object.keys(msgObject))
            
            
            //Si mensaje de monitoring de posición.    
            if(msgObject["MessageType"] == 1 && msgObject["OpCode"] == "UserTransform"){
                
                //console.log("RECEIVED MESSAGE WITH USER TRANSFORM.")
                
                let svgContainer =  document.getElementById("world2D");
                
                //real dimensions in meters.
                let rwWidth = 0.6 * 8.0; 
                let rwHeight = 0.6 * 5.0;
                
                let aspectRatio =  rwHeight / rwWidth;

                
                
                
                console.log(`aspect ratio ${aspectRatio}`);
                
                
                //MAKE SVG GROW AND SHRINK WITH WINDOW.
                //Obtengo la anchura.
                let mapWidth = svgContainer.getBoundingClientRect().width;
                //Calculo la altura correspondiente.
                let mapHeight = mapWidth * aspectRatio;
                svgContainer.setAttribute("height",mapHeight);

                console.log(`svg (W,H) = ${mapWidth} , ${mapHeight}`);



                let userhead = svgContainer.querySelector(".user-head-svg");
                let userheadIcon = svgContainer.querySelector(".user-head-icon");
                let userGazeLine = document.querySelector("#user-head-dir")
                let userRepresentation =  document.querySelector("#user-rep");
                // userhead.setAttribute("cx",(mapWidth/2.0).toString() );
                // userhead.setAttribute("cy",(mapHeight/ 2.0).toString() ); 
                
                
                
                //@todo poner color cuando se están poniendo datos.
                
                //1) Sumar nuevo origen.
                let correctedX = msgObject.Data.position[0] + rwWidth/2.0 ;    
                let correctedY = msgObject.Data.position[2] + rwHeight/2.0 ;

                //2) Convert meters to window units
                correctedX = mapWidth -(correctedX *  mapWidth /rwWidth);
                correctedY = correctedY * mapHeight /rwHeight;
                
                let headDiameter =0.15;//cm   //https://en.wikipedia.org/wiki/Human_head
                
                userhead.setAttribute("cx", correctedX.toString());
                userhead.setAttribute("cy", correctedY.toString());
                userhead.setAttribute("r", (headDiameter *  mapWidth /rwWidth).toString())
                userhead.setAttribute("fill", "yellow")


                userGazeLine.setAttribute("d", `M ${correctedX} ${correctedY} L ${correctedX} ${correctedY+60} Z`)
                userGazeLine.setAttribute("style","stroke:teal;stroke-width:2");

                userGazeLine.setAttribute( "transform" , `rotate (${msgObject.Data.rotation[1]} ${correctedX.toString()} ${correctedY.toString()} ) `);
                //
                // userheadIcon.setAttribute("x", correctedX.toString());
                // userheadIcon.setAttribute("y", correctedY.toString());
                // userheadIcon.setAttribute("width",headDiameter *  mapWidth /rwWidth);
                // userheadIcon.setAttribute("height",headDiameter *  mapWidth /rwWidth);
                //
                //
                
                
                
                
            }
        
            if(msgObject["MessageType"] == 2){

                let imgElemForRemote = document.getElementById("remoteView");

                
                
                // var imageDataBuffer = new Uint8Array(msgObject.Data.imgData) ;
                //
                // console.log("BUFFER DATA" + imageDataBuffer);
                //
                // var blob = new Blob( [ imageDataBuffer ], { type: "image/png" } );
                //
                // var urlCreator = window.URL || window.webkitURL;
                //
                // var imageUrl = urlCreator.createObjectURL( blob );
                //
                // imgElemForRemote.src = imageUrl;
                
                
                let imgB64 = msgObject.Data;
                imgElemForRemote.src = 'data:image/png;base64,'+ imgB64;
                

            }
            
            
            
            
            
        }  
        else{
            let debugMessageDiv = document.createElement("div");
            debugMessageDiv.setAttribute("class","debugMsg");
            debugMessageDiv.textContent = wsMessage; //event.data;
            clientLogDiv.appendChild(debugMessageDiv);
        }
        
        
        
        
        
     
        
        
        
    };

    socket.onclose = function(event) {
        if (event.wasClean) {
            alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            alert('[close] Connection died');
        }
    };

    socket.onerror = function(error) {
        alert("[error]"); // ${error.message}`);
        socket = undefined;
    };



}









let commandButtons  = document.querySelectorAll(".woz-clck")

function wsSendData( buttonDataElem) {

   let dataId =  buttonDataElem.getAttribute("data-id");
    console.log("PRESSED BUTTON  WITH DATA ID = " + dataId);
    socket.send(dataId);


}

// Adding listeners.
commandButtons.forEach( 
    button => {  
        button.addEventListener("click",() => wsSendData(button) );
        console.log("Added click listener");
        return false;
    }
);


console.log(commandButtons)





