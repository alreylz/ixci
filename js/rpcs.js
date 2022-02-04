// JS Client TO Unity Game Communication
// Here we define the functions used to SEND information to execute a command in the remote game client/s



class RPCMessage{
    // Represents a message going from JS to Unity C#
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
    
    //para cada botón que envía mensajes, añadir un listener a "on-click" que envíe el mensaje correspondiente con los datos asociados.
    
    
    document.querySelector('[data-id$=LoadScene]').addEventListener("click", () => LoadScene(_ws));
    
    document.querySelector('[data-id$=LoadGraph]').addEventListener("click", () => LoadGraph(_ws) );
    
    document.querySelector('[data-id$=HideEdges]').addEventListener("click", () => ChangeEdgesVisibility(false,_ws));
    document.querySelector('[data-id$=ShowEdges]').addEventListener("click", () => ChangeEdgesVisibility(true,_ws));

    document.querySelector('[data-id$=GameMonitoringConfiguration]').addEventListener("click", () => GameMonitoringConfiguration(_ws));
    
    
    
    
    
}



function LoadScene(_ws){
    //get input
    let sceneName = document.querySelector("#f-SceneName");
    console.log(sceneName);
    
    console.log(sceneName.value)
    let message = new RPCMessage(0,"LoadScene",{"SceneName" : sceneName.value}, {})
    
    _ws.send(JSON.stringify(message));
    
}

function LoadGraph(_ws){
    //get input
    let graphName = document.querySelector("#f-GraphName");
    let loadGraph = document.querySelector("#checkbox-LoadRenderInfo");
    
    console.log(loadGraph)
    let message = new RPCMessage(0,"LoadGraph",
        {"GraphName" : graphName.value}, { "LoadRenderInfo": loadGraph.checked , "ProgressiveRendering" : true})

    console.log(message);
    
    
    _ws.send(JSON.stringify(message));
}


function ChangeEdgesVisibility( visibility, _ws){

    let opCode ="HideEdges";
    if(visibility == true){
        opCode = "ShowEdges";
    }
    let message = new RPCMessage(0,opCode,
        {}, { })
    
    _ws.send(JSON.stringify(message));
}


function GameMonitoringConfiguration(_ws){

    let monitorPositionAndRotation = document.querySelector("#checkbox-MonitorPosRot").checked;
    let posRotPeriod = document.querySelector("#f-TMonitorPosRot").value;
    
    let monitorUserView = document.querySelector("#checkbox-MonitorGameView").checked;
    let userViewPeriod = document.querySelector("#f-TMonitorGameview").value;
    
    

    let message = new RPCMessage(0,
        "GameMonitoringConfiguration",
        {"GameView" : monitorUserView  , "PosRot":  monitorPositionAndRotation }, { "GameViewT": userViewPeriod, "PosRotT" : posRotPeriod})

    console.log(message);

    _ws.send(JSON.stringify(message));
    
}



