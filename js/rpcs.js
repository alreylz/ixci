// Here we define the functions used to send information to execute a command in the remote game client/s


class RPCMessage{
    
    constructor(msgType = 0,opCode,DataDic,OptionsDic) {
    this.MessageType = msgType;
    this.OpCode = opCode;
    this.Data = DataDic;
    this.Options = OptionsDic;
    }
    
}





//All buttons have a data id starting from "b-"
let allButtons = document.querySelectorAll('[data-id^=b-]')
allButtons.forEach((a) => console.log(a));


function RPCCallsHookup( _ws /*a websocket instance*/) {
    
    //para cada botón, añadir hacer que on-click se envíe el mensaje correspondiente.
    
    
    
    document.querySelector('[data-id$=LoadScene]').addEventListener("click", () => LoadScene(_ws))
    
    
    
    //
    
    
    //preparar el mensaje:
    
    //
    
    
}



function LoadScene(_ws){
    //get input
    let sceneName = document.querySelector("#f-SceneName");
    console.log(sceneName);
    
    console.log(sceneName.value)
    let message = new RPCMessage(0,"LoadScene",{"SceneName" : sceneName.value}, {})
    
    _ws.send(JSON.stringify(message));
    
}