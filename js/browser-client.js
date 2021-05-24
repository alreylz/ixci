
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
        if(msgObject !== undefined && "MessageType" in msgObject && "OperationName" in msgObject && "Data" in msgObject && "Options" in msgObject){

            
            
            // @todo here  process message in a way depending on the type of data.

            console.log(Object.keys(msgObject))
            console.log(msgObject.MessageType);
           console.log(msgObject.OperationName);
          //console.log(msgObject.Data.position)//forEach(d => console.log(d));
            console.log(msgObject.Data);
            
          console.log(msgObject.Options)//forEach(d => console.log(d));
           
            
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
                
                
                let imgB64 = msgObject.Data.imgData;
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





