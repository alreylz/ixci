﻿// JS Client TO Unity Game Communication
// Here we define the functions used to SEND information to execute a command in the remote game client/s


class RPCMessage {
    // Represents a message going from JS to Unity C#
    constructor(msgType = 0, opCode, DataDic, OptionsDic) {
        this.MessageType = msgType;
        this.OpCode = opCode;
        this.Data = DataDic;
        this.Options = OptionsDic;
    }
}


//All buttons have a data id starting from "b-"
let allButtons = document.querySelectorAll('[data-id^=b-]')
allButtons.forEach((a) => console.log(a));


function RPCCallsHookup(_ws /*a websocket instance*/) {

    //para cada botón que envía mensajes, añadir un listener a "on-click" que envíe el mensaje correspondiente con los datos asociados.


    document.querySelector('[data-id$=LoadScene]').addEventListener("click", () => LoadScene_SndMsg(_ws));
    document.querySelector('[data-id$=LoadGraph]').addEventListener("click", () => LoadGraph(_ws));
    document.querySelector('[data-id$=HideEdges]').addEventListener("click", () => ChangeEdgesVisibility(false, _ws));
    document.querySelector('[data-id$=ShowEdges]').addEventListener("click", () => ChangeEdgesVisibility(true, _ws));

    document.querySelector('[data-id$=GameMonitoringConfiguration]').addEventListener("click", () => GameMonitoringConfiguration(_ws));
    document.querySelector('[data-id$=SetupExpTakeInfo]').addEventListener("click", () => SetupExperimentTakeInfo_SngMsg(_ws));

    document.querySelector('[data-id$=EndExperiment]').addEventListener("click", () => EndExperimentAndSave_SndMsg(_ws));


    document.querySelector('[data-id$=ParamTweak]').addEventListener("click", () => ParamTweakingOneByOne(_ws));

    //handle changes on param tweak form
    let tweakDropdown = document.querySelector("select[name='s-list-paramNames']") // campo select en el DOM
    let tweakInputField = document.querySelector("#f-ParamValue") //campo de input en el DOM


    tweakDropdown.addEventListener("change", (ev) => {
        console.log(` ON CHANGE DETECTED for dropdown. selected index ${ev.target.value}`)


        console.log(tweakInputField)
        //ITERACIÓN PARA VER EL DATATYPE
        let index = 0;
        let selOptionHTMLNode;
        let selOptions = tweakDropdown.options;
        console.log("ITERATION OVER ELEMENTS")
        for (let i = 0; i < selOptions.length; i++) {
            //console.log( selOptions[i]);
            //console.log( );
            if (selOptions[i].getAttribute("value") === ev.target.value) {
                console.log(`Found option with value ${ev.target.value} `)
                selOptionHTMLNode = selOptions[i];
                break;
            }
            index++;
        }


        console.log(` Currently selected option [${index}] `)
        console.log("---------------------------------------\n OPTION HTML NODE:")
        console.log(selOptionHTMLNode)

        // if( selOptionHTMLNode === undefined)
        //     return;
        //
        
        switch (selOptionHTMLNode.getAttribute("data-type")) {


            case "int":
                tweakInputField.value = '';
                console.log("changed input field to INT: ")
                tweakInputField.setAttribute("placeholder", "INT NUMBER")
                tweakInputField.setAttribute("type", "number")
                tweakInputField.setAttribute("step", "1")
                tweakInputField.value = 0;
                break;
            case "float":
                tweakInputField.value = '';
                tweakInputField.setAttribute("placeholder", "FLOAT NUMBER")
                tweakInputField.setAttribute("type", "number")
                tweakInputField.setAttribute("step", "0.01")
                tweakInputField.value = 0;
                break;
            case "bool":

                tweakInputField.setAttribute("type", "text")
                tweakInputField.value = 'on';
                break;

            default:
                console.log("Shall change type of input field depending on data.");
        }

    })


}


function EndExperimentAndSave_SndMsg(_ws) {
    let message = new RPCMessage(0, "EndExperimentTake", {}, {});
    _ws.send(JSON.stringify(message));
    console.log(`Enviando EndExperimentTake `);
}


function SetupExperimentTakeInfo_SngMsg(_ws) {

    let participantID = document.querySelector("#f-ParticipantID").value;
    let experimentalCondition = document.querySelector('[name$=NumExpCondition]').value;


    console.log(`Enviando ${participantID} ${experimentalCondition}`);

    let message = new RPCMessage(0, "SetupTakeInfo", {
        "PartID": participantID,
        "ExperimentalCond": experimentalCondition.toString()
    }, {});


    _ws.send(JSON.stringify(message));

}


function LoadScene_SndMsg(_ws) {
    //get input

    let presetSceneName = document.querySelector('[name$=list-SceneName]').value;
    let customSceneName = document.querySelector("#f-SceneName");


    let nameToSend = presetSceneName;
    if (presetSceneName === "Other") {
        nameToSend = customSceneName;
    }

    let message = new RPCMessage(0, "LoadScene", {"SceneName": nameToSend}, {})

    _ws.send(JSON.stringify(message));

}

function LoadGraph(_ws) {
    //get input
    let graphName = document.querySelector("#f-GraphName");
    let loadGraph = document.querySelector("#checkbox-LoadRenderInfo");

    console.log(loadGraph)
    let message = new RPCMessage(0, "LoadGraph",
        {"GraphName": graphName.value}, {"LoadRenderInfo": loadGraph.checked, "ProgressiveRendering": true})

    console.log(message);


    _ws.send(JSON.stringify(message));
}


function ChangeEdgesVisibility(visibility, _ws) {

    let opCode = "HideEdges";
    if (visibility == true) {
        opCode = "ShowEdges";
    }
    let message = new RPCMessage(0, opCode,
        {}, {})

    _ws.send(JSON.stringify(message));
}


function GameMonitoringConfiguration(_ws) {

    let monitorPositionAndRotation = document.querySelector("#checkbox-MonitorPosRot").checked;
    let posRotPeriod = document.querySelector("#f-TMonitorPosRot").value;

    let monitorUserView = document.querySelector("#checkbox-MonitorGameView").checked;
    let userViewPeriod = document.querySelector("#f-TMonitorGameview").value;


    let message = new RPCMessage(0,
        "GameMonitoringConfiguration",
        {"GameView": monitorUserView, "PosRot": monitorPositionAndRotation}, {
            "GameViewT": userViewPeriod,
            "PosRotT": posRotPeriod
        })

    console.log(message);

    _ws.send(JSON.stringify(message));

}


//on param tweaking section active, make input field change to allow only a specific datatype.

function ParamTweakingOneByOne(_ws) {


    let toTweakParam = document.querySelector("select[name='s-list-paramNames']").value
    let toTweakParamValue = document.querySelector("#f-ParamValue").value;
    console.log(`${toTweakParam} : ${toTweakParamValue}`)

    let message = new RPCMessage(0,
        "ParamTweak", {
            [toTweakParam]: toTweakParamValue
        }, {})

    console.log("TO BE SENT:")
    console.log(message);

    _ws.send(JSON.stringify(message));


}




