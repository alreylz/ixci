//Global results;
let flowLevelResult;
let anxietyLevelResult;
let challengeLevelResult;


let scale = [];
let left = [];
let right = [];


//Support for multiple languages  using the "?lang=<LANGUAGE>
let LANGUAGE = getUrlVars()["lang"] || "EN"

//lang
if (LANGUAGE === "EN") {

    scale[0] = "I feel just the right amount of challenge.";
    left[0] = "not at all";
    right[0] = "very much";

    scale[1] = "My thoughts/activities run fluidly and smoothly.";
    left[1] = "not at all";
    right[1] = "very much";

    scale[2] = "I don't notice time passing.";
    left[2] = "not at all";
    right[2] = "very much";

    scale[3] = "I have no difficulty concentrating.";
    left[3] = "not at all";
    right[3] = "very much";

    scale[4] = "My mind is completely clear.";
    left[4] = "not at all";
    right[4] = "very much";

    scale[5] = "I am totally absorbed in what I am doing.";
    left[5] = "not at all";
    right[5] = "very much";

    scale[6] = "The right thoughts/movements occur of their own accord.";
    left[6] = "not at all";
    right[6] = "very much";

    scale[7] = "I know what I have to do each step of the way.";
    left[7] = "not at all";
    right[7] = "very much";

    scale[8] = "I feel that I have everything under control.";
    left[8] = "not at all";
    right[8] = "very much";

    scale[9] = "I am completely lost in thought.";
    left[9] = "not at all";
    right[9] = "very much";

    scale[10] = "Something important to me is at stake here.";
    left[10] = "not at all";
    right[10] = "very much";

    scale[11] = "I won't make any mistake here.";
    left[11] = "not at all";
    right[11] = "very much";

    scale[12] = "I am worried about failing.";
    left[12] = "not at all";
    right[12] = "very much";

    scale[13] = "For me personally, the current demands are...";
    left[13] = "too low";
    right[13] = "too high";


} // [ES] SCALE VERSION
else if (LANGUAGE === "ES") {// Free translation (I couldn't find one).


    scale[0] = "Siento el nivel adecuado de dificultad.";
    left[0] = "completamente en desacuerdo";
    right[0] = "completamente de acuerdo";

    scale[1] = "Mis pensamientos o actividades fluyen con facilidad.";
    left[1] = "completamente en desacuerdo";
    right[1] = "completamente de acuerdo";

    scale[2] = "No soy consciente del tiempo que pasa.";
    left[2] = "completamente en desacuerdo";
    right[2] = "completamente de acuerdo";

    scale[3] = "No tengo problemas para concentrarme.";
    left[3] = "completamente en desacuerdo";
    right[3] = "completamente de acuerdo";

    scale[4] = "Comprendo todo a la perfección.";
    left[4] = "completamente en desacuerdo";
    right[4] = "completamente de acuerdo";

    scale[5] = "Me siento completamente absorbido por lo que hago.";
    left[5] = "completamente en desacuerdo";
    right[5] = "completamente de acuerdo";

    scale[6] = "Los pensamientos/movimientos adecuados ocurren de forma voluntaria.";
    left[6] = "completamente en desacuerdo";
    right[6] = "completamente de acuerdo";

    scale[7] = "Sé lo que tengo que hacer paso a paso.";
    left[7] = "completamente en desacuerdo";
    right[7] = "completamente de acuerdo";

    scale[8] = "Siento que tengo todo bajo control";
    left[8] = "completamente en desacuerdo";
    right[8] = "completamente de acuerdo";

    scale[9] = "Estoy completamente concentrado.";
    left[9] = "completamente en desacuerdo";
    right[9] = "completamente de acuerdo";

    scale[10] = "Siento que algo importante está en juego.";
    left[10] = "completamente en desacuerdo";
    right[10] = "completamente de acuerdo";

    scale[11] = "No cometeré errores.";
    left[11] = "completamente en desacuerdo";
    right[11] = "completamente de acuerdo";

    scale[12] = "Me preocupa fracasar.";
    left[12] = "completamente en desacuerdo";
    right[12] = "completamente de acuerdo";

    scale[13] = "Para mí, personalmente la exigencia actual es...";
    left[13] = "demasiado baja";
    right[13] = "demasiado alta";


}


function applyLanguage() {


    let scaleTDs = document.querySelectorAll("#questionnaire-container tr:not(.skip):not(tr:first-of-type) td:first-of-type");
    let ls = document.querySelectorAll("#questionnaire-container tr:not(tr:first-of-type) td:nth-of-type(2)");
    let rs = document.querySelectorAll("#questionnaire-container tr:not(tr:first-of-type) td:nth-of-type(4)");


    for (let s = 0; s < scale.length; s++) {
        ls[s].innerHTML = left[s];
        rs[s].innerHTML = right[s];
        scaleTDs[s].innerHTML = scale[s];
    }
    
    document.getElementsByClassName("saveRemoteButton")
    document.getElementsByClassName("clearFormButton")
    
    
    
    
}


function calculateResults() {
    var items = 0;
    var score1 = 0;
    var score2 = 0;
    var score3 = 0;
    var i = 0;
    //Iterate over form elements.

    // Add up score from "Flow items"
    for (i = 0; i < 70; i++) {
        console.log(document.FKS.elements[i]);
        if (document.FKS.elements[i].checked == true) {
            items++;
            score1 = score1 + (document.FKS.elements[i].value / 1);
        }
    }
    // Add up score from "Anxiety items"
    for (i = 70; i < 91; i++) {
        if (document.FKS.elements[i].checked == true) {
            items++;
            score2 = score2 + (document.FKS.elements[i].value / 1);
        }
    }
    // Compute challenge level.
    for (i = 0; i < 7; i++) {
        if (document.FKS.i14[i].checked == true) {
            items++;
            score3 = document.FKS.i14[i].value / 1;
        }
    }
    if (items != 14) {
        alert("Please answer all items...");
        return false;
    } else {
        document.FKS.FW.value = score1 / 10;
        flowLevelResult = score1 / 10;
        document.querySelector("#flow-level-res").value = flowLevelResult;
        document.FKS.Besorgnis.value = score2 / 3;
        anxietyLevelResult = score2 / 3;
        document.querySelector("#anxiety-level-res").value = anxietyLevelResult;

        document.FKS.Anforderung.value = score3;
        challengeLevelResult = score3;
        document.querySelector("#challenge-level-res").value = challengeLevelResult;
        return true;
    }
}


function clearForm() {
    resetQuestionnaire();
    document.querySelector("form").reset();
}

function resetQuestionnaire() {
    flowLevelResult = undefined;
    anxietyLevelResult = undefined;
    challengeLevelResult = undefined;
}

function postResults() {

    let userID = document.querySelector("#f-UserID").value;
    if (!userID) {
        alert("User ID not specified.");
        return;
    }
    //Recompute the questionnaire scores and check for empty items.
    if (!calculateResults()) {
        return;
    }
    if (!flowLevelResult || !anxietyLevelResult || !challengeLevelResult) {
        alert("You forgot to click evaluate. ")
        return;
    }


    let qAnswers = [];

    //14
    for (q = 1; q <= 14; q++) {
        //document.querySelector("input[type='radio'][name='i01']:checked").value
        let questionID = `${q}`
        questionID = questionID.padStart(2, "0");
        console.log(questionID)
        // document.querySelector(`input[type='radio'][name='i${questionID}']:checked`).value
        qAnswers[q - 1] = document.querySelector(`input[type='radio'][name='i${questionID}']:checked`).value

        console.log(qAnswers[q - 1]);
    }
    //window.location.host
    postJsonFileToRemote("http://localhost:9030/questionnaires", userID, {
        "UserID": userID,
        "Flow Level": flowLevelResult,
        "Anxiety Level": anxietyLevelResult,
        "Challenge Level": challengeLevelResult,
        "Q Answers": qAnswers
    }, "fss").then(() => alert("Sucessfully submitted the questionnaire."));


}


function onLoad() {
    document.querySelector(".saveRemoteButton").addEventListener("click", e => e.preventDefault());
    applyLanguage();
}