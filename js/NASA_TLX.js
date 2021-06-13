// Based on the code by Keith Vertanen
// Adapted by Alejandro Rey
// https://www.keithv.com/
//https://www.keithv.com/software/nasatlx/nasatlx.html
// 


// Create a set of parallel arrays for each of the scales
var scale = new Array(); // Array of scale names.
var left = new Array(); // info to the left of each scale
var right = new Array(); // info to the right of each scale
var def = new Array(); // definition of each scale
var guides = new Array();
var NUM_SCALES = 6;


//Support for multiple languages  using the "?lang=<LANGUAGE>
let LANGUAGE = getUrlVars()["lang"] || "EN"

//[EN] SCALE VERSION
if (LANGUAGE === "EN") {
    scale[0] = "Mental Demand";
    left[0] = "Low";
    right[0] = "High";
    def[0] = "How much mental and perceptual activity was required (e.g. thinking, deciding, calculating, remembering, looking, searching, etc)? Was the task easy or demanding, simple or complex, exacting or forgiving?";

    scale[1] = "Physical Demand";
    left[1] = "Low";
    right[1] = "High";
    def[1] = "How much physical activity was required (e.g. pushing, pulling, turning, controlling, activating, etc)? Was the task easy or demanding, slow or brisk, slack or strenuous, restful or laborious?";

    scale[2] = "Temporal Demand";
    left[2] = "Low";
    right[2] = "High";
    def[2] = "How much time pressure did you feel due to the rate of pace at which the tasks or task elements occurred? Was the pace slow and leisurely or rapid and frantic?";

    scale[3] = "Performance";
    left[3] = "Good";
    right[3] = "Poor";
    def[3] = "How successful do you think you were in accomplishing the goals of the task set by the experimenter (or yourself)? How satisfied were you with your performance in accomplishing these goals?";

    scale[4] = "Effort";
    left[4] = "Low";
    right[4] = "High";
    def[4] = "How hard did you have to work (mentally and physically) to accomplish your level of performance?";

    scale[5] = "Frustration";
    left[5] = "Low";
    right[5] = "High";
    def[5] = "How insecure, discouraged, irritated, stressed and annoyed versus secure, gratified, content, relaxed and complacent did you feel during the task?";

    guides[0] = "Click on each scale at the point that best indicates your experience of the task."
    guides[1] = "One each of the following 15 screens, click on the scale title that represents the more important contributor to workload for the task."

} // [ES] SCALE VERSION
else if (LANGUAGE === "ES") {
    scale[0] = "Demanda Mental";
    left[0] = "Baja";
    right[0] = "Alta";
    def[0] = "¿Cuánta actividad mental y perceptual te ha hecho falta para realizar la tarea? ¿Fue la tarea fácil de completar? ¿Exigente o sencilla? Cuando hablamos de Demanda Mental, nos referimos a la realización de actividades como pensar, decidir, calcular, mirar, buscar, recordar, etc.";

    scale[1] = "Demanda Física";
    left[1] = "Baja";
    right[1] = "Alta";
    def[1] = "¿Cuánta actividad física fue necesaria para realizar la tarea? ¿Fue la tarea fácil de realizar? ¿Extenuante o Relajada? ¿Cuando hablamos de Demanda Física, nos referimos a actividades como empujar, controlar, tirar, activar mecanismos, etc.";

    scale[2] = "Demanda Temporal";
    left[2] = "Baja";
    right[2] = "High";
    def[2] = "¿Cuánta presión temporal sentiste debido al ritmo de la tarea realizada?¿Fue el ritmo de la actividad tranquilo/pausado o por el contrario, fue el ritmo frenético?";

    scale[3] = "Rendimiento";
    left[3] = "Alto";
    right[3] = "Bajo";
    def[3] = "¿Cuál es tu nivel de satisfacción respecto a tu desempeño en la tarea propuesta? ¿Qué tal crees haberlo hecho? ";

    scale[4] = "Esfuerzo";
    left[4] = "Bajo";
    right[4] = "Alto";
    def[4] = "¿Cuánto esfuerzo consideras que has tenido que realizar (tanto mental como físico) para lograr un buen desempeño en la tarea que se te ha planteado?";

    scale[5] = "Nivel de frustración";
    left[5] = "Bajo";
    right[5] = "Alto";
    def[5] = "¿Cómo de inseguro, descorazonado, irritado o estresado te has sentido? O por el contrario, ¿Cómo de relajado, cómodo, tranquilo y satisfecho contigo mismo/a te has sentido durante la realización de la tarea impuesta?";

    guides[0] = "Haz click en el punto de cada escala que mejor refleja tu experiencia realizando la tarea propuesta por los investigadores."
    guides[1] = "A continución, aparecerán un total de 15 pantallas diferentes en las que deberá seleccionar para cada caso qué escala considera más relavante para el concepto de 'carga' para la tarea realizada."
}

// Pairs of factors in order in the original instructions, numbers
// refer to the index in the scale, left, right, def arrays.
var pair = new Array();
pair[0] = "4 3"; //E.g. Effort vs Performance (scales 3 and 4)
pair[1] = "2 5";
pair[2] = "2 4";
pair[3] = "1 5";
pair[4] = "3 5";
pair[5] = "1 2";
pair[6] = "1 3";
pair[7] = "2 0";
pair[8] = "5 4";
pair[9] = "3 0";
pair[10] = "3 2";
pair[11] = "0 4";
pair[12] = "0 1";
pair[13] = "4 1";
pair[14] = "5 0";

// Variable where the results end up
let user_id = undefined;
var results_rating = new Array();
var results_tally = new Array();
var results_weight = new Array();
var results_overall;

var pair_num = 0; // Pairwise selection round is kept here.
for (var i = 0; i < NUM_SCALES; i++)
    results_tally[i] = 0;


// Used to randomize the pairings presented to the user
function randOrd() {
    return (Math.round(Math.random()) - 0.5);
}

// Make sure things are good and mixed
for (i = 0; i < 100; i++) {
    pair.sort(randOrd);
}

// When users click on a scale entry, we turn  all squares of the table white and the one selected to a different color
function scaleClick(index, val) {
    results_rating[index] = val;

    // Turn background color to white for all cells
    for (i = 5; i <= 100; i += 5) {
        var top = "t_" + index + "_" + i;
        var bottom = "b_" + index + "_" + i;
        document.getElementById(top).bgColor = '#FFFFFF';
        document.getElementById(bottom).bgColor = '#FFFFFF';
    }

    var top = "t_" + index + "_" + val;
    var bottom = "b_" + index + "_" + val;
    document.getElementById(top).bgColor = '#128783';
    document.getElementById(bottom).bgColor = '#128783';
}

// Return the HTML that produces the table for a given scale (generates the html for the whole questionnaire dynamically).
function getScaleHTML(index) {
    var result = "";

    // Outer table with a column for scale, column for definition
    result += '<table><tr><td>';

    // Table that generates the scale
    result += '<table class="scale">';

    // Row 1, just the name of the scale
    result += '<tr><td colspan="20" class="heading">' + scale[index] + '</td></tr>';

    // Row 2, the top half of the scale increments, 20 total columns (it makes each scale subdivision interactable).
    result += '<tr>';
    var num = 1;
    for (var i = 5; i <= 100; i += 5) {
        result += '<td id="t_' + index + '_' + i + '"   class="top' + num + '" onMouseUp="scaleClick(' + index + ', ' + i + ');"></td>';
        num++;
        if (num > 2)
            num = 1;
    }
    result += '</tr>';

    // Row 3, bottom half of the scale increments
    result += '<tr>';
    for (var i = 5; i <= 100; i += 5) {
        result += '<td id="b_' + index + '_' + i + '"   class="bottom" onMouseUp="scaleClick(' + index + ', ' + i + ');"></td>';
    }
    result += '</tr>';

    // Row 4, left and right of range labels
    result += '<tr>';
    result += '<td colspan="10" class="left">' + left[index] + '</td><td colspan="10" class="right">' + right[index] + '</td>';
    result += '</tr></table></td>';


    // Now for the definition of the scale (explanation of the scale, such as what is effort, frustration, etc.)
    result += '<td class="def">';
    result += def[index];
    result += '</td></tr></table>';

    return result;
}


// Executed when the page loads, draws the set of Nasa Scales dynamically into the page.
function onLoad() {
    // Get all the scales ready
    for (var i = 0; i < NUM_SCALES; i++) {
        document.getElementById("scale" + i).innerHTML = getScaleHTML(i);
    }
    
    //Change help info about each part of the questionnaire according to language.
    document.querySelectorAll(".q-guide-1").forEach(n => n.innerHTML = guides[1]);
     document.querySelector(".q-guide-0").innerHTML = guides[0];
    if (LANGUAGE == "ES") {
        document.querySelectorAll(".next").forEach(b => b.value = "Siguiente >>");
    }
    
}

// Users want to proceed after doing the scales
function buttonPart1() {
    user_id = document.querySelector("#f-UserID").value;
    if (!user_id) {
        if (LANGUAGE == "EN") {
            alert("It is required that you enter a user ID so that the results are saved properly.")
        } else {
            alert("Has olvidado especificar el identificador de usuario. Pregunta al investigador a cargo para que te proporcione el valor a introducir en ese campo.")
        }
        return false;
    }
    // Check to be sure they click on every scale
    for (var i = 0; i < NUM_SCALES; i++) {
        if (!results_rating[i]) {
            if (LANGUAGE == "EN") {
                alert('A value must be selected for every scale!');
            } else {
                alert('Un valor debe ser seleccionado por cada escala del cuestionario. Comprueba que has resaltado al menos un intervalo en cada escala.');
            }

            return false;
        }
    }

    // Bye bye part 1, hello part 2
    document.getElementById('div_part1').style.display = 'none';
    document.getElementById('div_part2').style.display = '';

    return true;
}

// User done reading the part 2 instructions
function buttonPart2() {
    // Bye bye part 2, hello part 3
    document.getElementById('div_part2').style.display = 'none';
    document.getElementById('div_part3').style.display = '';

    // Set the labels for the buttons
    setPairLabels();
    return true;
}


// Set the button labels for the pairwise comparison stage
function setPairLabels() {
    var indexes = new Array();
    indexes = pair[pair_num].split(" ");

    var pair1 = scale[indexes[0]];
    var pair2 = scale[indexes[1]];

    document.getElementById('pair1').value = pair1;
    document.getElementById('pair2').value = pair2;

    document.getElementById('pair1_def').innerHTML = def[indexes[0]];
    document.getElementById('pair2_def').innerHTML = def[indexes[1]];
}

// They clicked the top pair button
function buttonPair1() {
    var indexes = new Array();
    indexes = pair[pair_num].split(" ");
    results_tally[indexes[0]]++;

    nextPair();
    return true;
}

// They clicked the bottom pair button
function buttonPair2() {
    var indexes = new Array();
    indexes = pair[pair_num].split(" ");
    results_tally[indexes[1]]++;
    nextPair();
    return true;
}

// Compute the weights and the final score
function calcResults() {
    results_overall = 0.0;

    for (var i = 0; i < NUM_SCALES; i++) {
        results_weight[i] = results_tally[i] / 15.0;
        results_overall += results_weight[i] * results_rating[i];
    }
}

// Output the table of results
function getResultsHTML() {
    var result = "";

    result += "<table><tr><td></td><td>Rating</td><td>Tally</td><td>Weight</td></tr>";
    for (var i = 0; i < NUM_SCALES; i++) {
        result += "<tr>";

        result += "<td>";
        result += scale[i];
        result += "</td>";

        result += "<td>";
        result += results_rating[i];
        result += "</td>";

        result += "<td>";
        result += results_tally[i];
        result += "</td>";

        result += "<td>";
        result += results_weight[i];
        result += "</td>";

        result += "</tr>";
    }

    result += "</table>";
    result += "<br/>";
    result += "Overall = ";
    result += results_overall;
    result += "<br/>";

    return result;
}

// Move to the next pair
function nextPair() {
    pair_num++;
    if (pair_num >= 15) {
        document.getElementById('div_part3').style.display = 'none';
        document.getElementById('div_part4').style.display = '';
        calcResults();
        document.getElementById('div_part4').innerHTML = getResultsHTML();
        // Save results to a file.
        saveResultsToFile();
    } else {
        setPairLabels();
    }
}


//Saves the results of the questionnaire to the computer.
function saveResultsToFile() {

    let resultsObject = {};

    for (let scaleIterator = 0; scaleIterator < scale.length; scaleIterator++) {
        //Create a js object per scale.
        resultsObject[scale[scaleIterator]] = {
            "Rating": results_rating[scaleIterator],
            "Tally": results_tally[scaleIterator],
            "Weight": results_weight[scaleIterator]
        };
    }
    resultsObject["Overall"] = results_overall;

    download(JSON.stringify(resultsObject, results_overall, null, 2), `${user_id}_nasaTLX.json`, 'text/plain');

}


//Creates an object with as many keys as variables passed in the url.
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}


// Function to download data to a file
function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}