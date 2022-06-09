

// =======================================================================
// Dummy function per ovviare all'assenza eventuale di console di debug
// =======================================================================
if (!window.console) window.console = {};
if (!window.console.log) window.console.log = function () { };
// =======================================================================
// =======================================================================

var bEnableLog;

bEnableLog = false;

var aStandardRules = new Array();
var aStandardRulesEl = new Array();
var iRuleIndex = 0;
var iRuleIndexEl = 0;

var sCUD_S = "";
var sEmailPec_S = "";

//Definizione delle variabili temporanee
var sTipoUtente = "P";
var bEnableRegAcc = 0;
var bAsRegAcc = 0;
var bEsenzioneIVA = 1;

var sNome = "Alejandro";
var sCognome = "Rey López";
var cSesso = "";
var sRagSoc = "";
var sCOFI = "";
var sPAIV_P = "";
var sPAIV = "";
var sIndirizzo = "";
var sCap = "";
var iNazione = 6;
var sNazione = "SPAIN";
var sProvincia = "";
var iComune = "";
var sComune = "";

var sProvEstera = "";
var sCittaEstera = "";
var sTel = "";
var sFax = "";
var sCell = "";
var sEmail = "alejandro.rey@uc3m.es";

var sNome_S = "Alejandro";
var sCognome_S = "Rey López";
var sRagSoc_S = "";
var sIndirizzo_S = "";
var sCap_S = "";
var iNazione_S = 6;
var sNazione_S = "SPAIN";
var sProvincia_S = "";
var iComune_S = "";
var sComune_S = "";
var sProvEstera_S = "";
var sCittaEstera_S = "";

var sDataN = "26/05/1996";
var sLuogoN = "";
var sProvN = "";
var iNazioneN = 6;
var iComuneN = "";

var iSponsorC = 0;

var bPivaNonObb = "False"
var bVerificaCFVAT = 0;

var bTerritorialitaIVA = 0;
var bSedeITA = 1;

var sBaseURL = "https://prenotazioni.consultaumbria.com/cmsweb/"

var iUpdateDett = 0;

var sFocusThis = "";

var bFatturaElettronica = 0;
var bFatturaElettronica_S = 0;

var IdCouponClifo = 0;
var iCheckSeveritaDatiFt = 0;
var bDati_Spedizione = 0;

var bEventoVirtuale = 0;

function UndoModDettagli(){

    if (sTipoUtente == "P")
        document.getElementsByName("rdbTipoProprietario").item(0).checked = true;
    else
        document.getElementsByName("rdbTipoProprietario").item(1).checked = true;

    ReloadSettings();

    DisplayFields();

    $("#form_report").show();
    $("#form_controls").show();
    $("#form_payment").show();

    $("#form_edit").hide();

    if ((bEnableRegAcc == 1)&&(bAsRegAcc == 1)){
        $("#form_selector").show();
    }

    if (document.getElementsByName("rdbTipoProprietario").item(0).checked){
        //$("#form_fatt_el_S").css("display","none");
        UndoModDettagliEl('P');
    }
    if (document.getElementsByName("rdbTipoProprietario").item(1).checked){
        //$("#form_fatt_el").css("display","none");
        UndoModDettagliEl('S');
    }



}

function UndoModDettagliEl(sTipo){
    if (sTipo == "P"){
        if ($(".dett_fatt_el").css("display") != "inline" ){
            $("#form_report_fatt_el").show();
            $("#form_edit_fatt_el").hide();
            $("#form_report_fatt_el_S").hide();
            $("#form_edit_fatt_el_S").hide();
        }else{
            $("#form_report_fatt_el").hide();
            if ($("#selNazione").val()==9){
                $("#form_controls").hide();
                $("#form_payment").hide();
            }

        }
    }else{
        if ($(".dett_fatt_el_S").css("display") != "inline" ){
            $("#form_report_fatt_el_S").show();
            $("#form_edit_fatt_el_S").hide();
            $("#form_report_fatt_el").hide();
            $("#form_edit_fatt_el").hide();
        }else{
            $("#form_report_fatt_el_S").hide();
            if ($("#selNazione_S").val()==9){
                $("#form_controls").hide();
                $("#form_payment").hide();
            }
        }
    }
}

function DisplayFields(){
    $("#txtRagSoc").val(sRagSoc);
    $("#txtNome").val(sNome);
    $("#txtCognome").val(sCognome);
    $("#txtCOFI").val(sCOFI);
    $("#txtPAIV").val(sPAIV);
    $("#txtPAIV_P").val(sPAIV_P);
    $("#txtTel").val(sTel);
    $("#txtFax").val(sFax);
    $("#txtCell").val(sCell);
    $("#txtEmail").val(sEmail);
    $("#txtIndirizzo").val(sIndirizzo);
    $("#txtCap").val(sCap);
    $("#txtProvEstera").val(sProvEstera);
    $("#txtCittaEstera").val(sCittaEstera);

    $("#selNazione").val(iNazione);
    if (iNazione == 9){
        LoadProvince('selProvincia', 'selNazione', 'TEXT', 'F');
        $("#selProvincia").val(sProvincia);

        LoadComuni('selComune', 'selProvincia', 'selNazione', 'TEXT');
        $("#selComune").val(iComune);
    }

    $("#txtRagSoc_S").val(sRagSoc_S);
    $("#txtNome_S").val(sNome_S);
    $("#txtCognome_S").val(sCognome_S);
    $("#txtIndirizzo_S").val(sIndirizzo_S);
    $("#txtCap_S").val(sCap_S);
    $("#txtProvEstera_S").val(sProvEstera_S);
    $("#txtCittaEstera_S").val(sCittaEstera_S);

    $("#selNazione_S").val(iNazione_S);
    if (iNazione_S == 9){
        LoadProvince('selProvincia_S', 'selNazione_S', 'TEXT', 'S');
        $("#selProvincia_S").val(sProvincia_S);

        LoadComuni('selComune_S', 'selProvincia_S', 'selNazione_S', 'TEXT');
        $("#selComune_S").val(iComune_S);
    }

    $("#txtDataN").val(sDataN);
    $("#txtLuogoN").val(sLuogoN);
    $("#selNazioneN").val(iNazioneN);

    $("#selSesso").val(cSesso);

    if (iNazioneN == 9){
        LoadProvince('selProvinciaN', 'selNazioneN', 'TEXT', 'F');
        $("#selProvincia").val(sProvincia);

        LoadComuni('selComuneN', 'selProvinciaN', 'selNazioneN', 'TEXT');
        $("#selComuneN").val(iComuneN);
    }


    if (document.getElementsByName("rdbTipoProprietario").item(0).checked){
        $("#form_fatt_el_S").css("display","none");
        ModificaDettagliFattEl('P');
    }
    if (document.getElementsByName("rdbTipoProprietario").item(1).checked){
        $("#form_fatt_el").css("display","none");
        ModificaDettagliFattEl('C');
    }

    KeyUpData();
}

function CopyDetails(){

    $("#txtRagSoc_S").val($("#txtRagSoc").val());
    $("#txtNome_S").val($("#txtNome").val());
    $("#txtCognome_S").val($("#txtCognome").val());
    $("#txtIndirizzo_S").val($("#txtIndirizzo").val());
    $("#txtCap_S").val($("#txtCap").val());
    $("#txtProvEstera_S").val($("#txtProvEstera").val());
    $("#txtCittaEstera_S").val($("#txtCittaEstera").val());

    $("#selNazione_S").val($("#selNazione").val());

    if ($("#selNazione_S").val() == 9){
        LoadProvince('selProvincia_S', 'selNazione_S', 'TEXT', 'S');

        $("#selProvincia_S").val($("#selProvincia").val());

        LoadComuni('selComune_S', 'selProvincia_S', 'selNazione_S', 'TEXT');
        $("#selComune_S").val($("#selComune").val());
    }

}

function UpdateTmpVars(){
    if (document.getElementsByName("rdbTipoProprietario").item(0).checked)
        sTipoUtente == "P";
    else if(document.getElementsByName("rdbTipoProprietario").item(1).checked)
        sTipoUtente == "A";

    ReloadSettings();

    sRagSoc = $("#txtRagSoc").val();
    sNome = $("#txtNome").val();
    sCognome = $("#txtCognome").val();
    sCOFI = $("#txtCOFI").val();
    sPAIV = $("#txtPAIV").val();
    sPAIV_P = $("#txtPAIV_P").val();
    sTel = $("#txtTel").val();
    sFax = $("#txtFax").val();
    sCell = $("#txtCell").val();
    sEmail = $("#txtEmail").val();
    sIndirizzo = $("#txtIndirizzo").val();
    sCap = $("#txtCap").val();
    sProvEstera = $("#txtProvEstera").val();
    sCittaEstera = $("#txtCittaEstera").val();

    iNazione = $("#selNazione").val();
    sProvincia = $("#selProvincia").val();
    iComune = $("#selComune").val();

    sRagSoc_S = $("#txtRagSoc_S").val();
    sNome_S = $("#txtNome_S").val();
    sCognome_S = $("#txtCognome_S").val();
    sIndirizzo_S = $("#txtIndirizzo_S").val();
    sCap_S = $("#txtCap_S").val();
    sProvEstera_S = $("#txtProvEstera_S").val();
    sCittaEstera_S = $("#txtCittaEstera_S").val();

    iNazione_S = $("#selNazione_S").val();
    sProvincia_S = $("#selProvincia_S").val();
    iComune_S =	$("#selComune_S").val();

}


function SetupPageLayout(){

    if (bAsRegAcc == 1){
        ReloadSettings();

        if (iSponsorC == 0)
            $("#objSponsorC").hide();
        else
            $("#objSponsorC").show();

        $("#form_report").hide();
        $("#form_edit").hide();
        $("#form_payment").hide();
        $("#form_controls").hide();

        $("#form_selector").show();

    }
    else {
        ReloadSettings();

        $("#form_report").show();
        $("#form_edit").hide();
        $("#form_payment").show();
        $("#form_controls").show();

        $("#form_selector").hide();

    }

}

function ChangePayerAcc(){

    var objRdb = document.getElementsByName("rdbPayer");

    if (objRdb.item(1).checked){
        $("#form_report").hide();
        $("#form_edit").hide();
        $("#form_payment").hide();
        $("#form_controls").hide();

        $("#form_payment").show();
        $("#form_controls").show();

    }
    else if (objRdb.item(2).checked){
        $("#form_report").hide();
        $("#form_edit").hide();
        $("#form_payment").hide();
        $("#form_controls").hide();

        $("#form_controls").show();
    }
    else if (objRdb.item(0).checked){

        $("#form_edit").hide();

        $("#form_report").show();
        $("#form_payment").show();
        $("#form_controls").show();
    }

}


function ReloadSettings(){

    var sDisplayStyle_p = "";
    var sDisplayStyle_a = "";

    if (document.getElementsByName("rdbTipoProprietario").item(0).checked){
        sDisplayStyle_p = "inline";
        sDisplayStyle_a = "none";
    }
    else if (document.getElementsByName("rdbTipoProprietario").item(1).checked){
        sDisplayStyle_p = "none";
        sDisplayStyle_a = "inline";
    }

    if (document.getElementById("selNazione").value == "9"){
        sShowClass_ITA_F = "inline";
        sShowClass_EXT_F = "none";
    }
    else{
        sShowClass_ITA_F = "none";
        sShowClass_EXT_F = "inline";
    }

    if (document.getElementById("selNazione_S").value == "9"){
        sShowClass_ITA_S = "inline";
        sShowClass_EXT_S = "none";
    }
    else{
        sShowClass_ITA_S = "none";
        sShowClass_EXT_S = "inline";
    }

    $(".is_privato").each(function (i) { this.style.display = sDisplayStyle_p; });
    $(".is_azienda").each(function (i) { this.style.display = sDisplayStyle_a; });

    $(".is_italiano").each(function (i) { this.style.display = sShowClass_ITA_F; });
    $(".is_estero").each(function (i) { this.style.display = sShowClass_EXT_F; });

    $(".is_italiano_n").each(function (i) { this.style.display = sShowClass_ITA_F; });
    $(".is_estero_n").each(function (i) { this.style.display = sShowClass_EXT_F; });

    $(".is_italiano_s").each(function (i) { this.style.display = sShowClass_ITA_S; });
    $(".is_estero_s").each(function (i) { this.style.display = sShowClass_EXT_S; });

    if (document.getElementsByName("rdbTipoProprietario").item(0).checked){
        $("#form_fatt_el_S").css("display","none");
        ModificaDettagliFattEl('P');
    }
    if (document.getElementsByName("rdbTipoProprietario").item(1).checked){
        $("#form_fatt_el").css("display","none");
        ModificaDettagliFattEl('C');
    }
}

function ResetFields(){

    $("#txtRagSoc").val("");
    $("#txtCOFI").val("");
    $("#txtCOFI_A").val("");
    $("#txtPAIV").val("");
    $("#txtPAIV_P").val("");
    $("#txtTel").val("");
    $("#txtFax").val("");
    $("#txtCell").val("");
    $("#txtEmail").val("");
    $("#txtIndirizzo").val("");
    $("#txtCap").val("");
    $("#txtProvEstera").val("");
    $("#txtCittaEstera").val("");

    $("#selNazione").val("");
    $("#selProvincia").val("");
    $("#selComune").val("");

    $("#txtRagSoc_S").val("");
    $("#txtNome_S").val("");
    $("#txtCognome_S").val("");
    $("#txtIndirizzo_S").val("");
    $("#txtCap_S").val("");
    $("#txtProvEstera_S").val("");
    $("#txtCittaEstera_S").val("");

    $("#selNazione_S").val("");
    $("#selProvincia_S").val("");
    $("#selComune_S").val("");

    KeyUpData();
}


function KeyUpData(){
    $("#txtRagSoc").keyup();
    $("#txtCOFI").keyup();
    $("#txtCOFI_A").keyup();
    $("#txtPAIV").keyup();
    $("#txtPAIV_P").keyup();
    $("#txtTel").keyup();
    $("#txtFax").keyup();
    $("#txtCell").keyup();
    $("#txtEmail").keyup();
    $("#txtIndirizzo").keyup();
    $("#txtCap").keyup();
    $("#txtProvEstera").keyup();
    $("#txtCittaEstera").keyup();

    $("#selNazione").keyup();
    $("#selProvincia").keyup();
    $("#selComune").keyup();

    $("#txtRagSoc_S").keyup();
    $("#txtNome_S").keyup();
    $("#txtCognome_S").keyup();
    $("#txtIndirizzo_S").keyup();
    $("#txtCap_S").keyup();
    $("#txtProvEstera_S").keyup();
    $("#txtCittaEstera_S").keyup();

    $("#selNazione_S").keyup();
    $("#selProvincia_S").keyup();
    $("#selComune_S").keyup();
}


function BackToList(){
    window.open("Billing.asp", "_self");
}

function selectContents(fieldObject){
    fieldObject.focus();
}

function Right(STRING,CHARACTER_COUNT){
    return STRING.substring((STRING.length - CHARACTER_COUNT),STRING.length);
}

function AddRule(sName, sRule, sMessage){
    if (sMessage.length > 0)
        aStandardRules[iRuleIndex] = sName + "|" + sRule + "|" + sMessage;
    else
        aStandardRules[iRuleIndex] = sName + "|" + sRule;

    iRuleIndex ++;
}

function AddRuleEl(sName, sRule, sMessage){

    if (sMessage.length > 0)
        aStandardRulesEl[iRuleIndexEl] = sName + "|" + sRule + "|" + sMessage;
    else
        aStandardRulesEl[iRuleIndexEl] = sName + "|" + sRule;

    iRuleIndexEl ++;
}

function myCheckDate(dtDateValue){
    var msg;
    if (dtDateValue.length > 0 ){
        if (isDate(dtDateValue, 'dd/MM/yyyy') == false){
            msg = "Please check the format of date field!";
        }
        else{
            if (parseInt(Right(dtDateValue,4)) < 1900 || parseInt(Right(dtDateValue,4)) > 2079)
                msg = "Please check the format of date field!";
            else
                msg = null;
        }
    }
    return msg;
}


function PrepareRules(){
    //iRuleIndex = 0;

    if (document.getElementsByName("rdbTipoProprietario").item(0).checked){
        //AddRule("txtNome", "required", "");
        //AddRule("txtCognome", "required", "");
        AddRule("txtDataN", 'custom|myCheckDate($("#txtDataN").val());', "");

        AddRule("txtNome_S", "required", "Name");
        AddRule("txtCognome_S", "required", "Last name");


        if (document.getElementById("selNazione").value == "9"){
            if (bPivaNonObb != "True"){
                AddRule("txtCOFI", 'custom|CheckCF("txtCOFI", "txtPAIV", "selNazione");', "Fiscal Code / SSN (Social Security Number)");
            }
            AddRule("txtDataN", "required", "Date of birth");
            AddRule("selNazioneN", "notequal|28", "Province");

            if (document.getElementById("selNazioneN").value == "9"){
                AddRule("selProvinciaN", "required", "Province");
                AddRule("selComuneN", "required", "City");
            }
            else {
                AddRule("txtProvinciEsteraN", "required", "Zip code");
                AddRule("txtCittaEsteraN", "required", "City");
            }

            AddRule("selSesso", "required", "Gender");
        }
        AddRule("txtPAIV_P", 'custom|CheckPIVA("txtPAIV_P", "selNazione");', "V.A.T. (Value Added Tax)");
    }
    else {
        AddRule("txtRagSoc", "required", "Corporate name");
        AddRule("txtRagSoc_S", "required", "Corporate name");

        if (bPivaNonObb != "True"){
            if (CheckUE()!= false) {
                AddRule("txtPAIV", "required", "V.A.T. (Value Added Tax)");
                AddRule("txtPAIV", 'custom|CheckPIVA("txtPAIV", "selNazione");', "V.A.T. (Value Added Tax)");
            }
        }
    }

    //Nazione residenza deve essere diversa da "-"

    AddRule("selNazione", "notequal|28", "Country");
    AddRule("selNazione", "custom|CheckBlackList();", "Country");
    AddRule("txtIndirizzo", "required", "Address");

    AddRule("selNazione_S", "notequal|28", "Country");
    AddRule("txtIndirizzo_S", "required", "Address");

    if (document.getElementById("selNazione").value == "9"){
        AddRule("txtCap", "required", "Zip code");
        AddRule("selProvincia", "required", "Province");
        AddRule("selComune", "required", "City");
    }
    else {
        AddRule("txtCap", "required", "Zip code");
        AddRule("txtCittaEstera", "required", "City");
    }

    if (document.getElementById("selNazione_S").value == "9"){
        AddRule("txtCap_S", "required", "Zip code");
        AddRule("selProvincia_S", "required", "Province");
        AddRule("selComune_S", "required", "City");
    }
    else {
        AddRule("txtCap_S", "required", "Zip code");
        AddRule("txtCittaEstera_S", "required", "City");
    }

    //Valida l'email
    AddRule("txtEmail", "required", "E-mail");
    AddRule("txtEmail", "email", "E-mail");




}

function PrepareRulesPers(){
    var i;
    if (typeof arrValidateFT === 'undefined') {
        PrepareRules();
    }else{

        for (i=0; i < arrValidateFT.length; i++){


            if (document.getElementsByName("rdbTipoProprietario").item(0).checked){
                //AddRule("txtNome", "required", "");
                //AddRule("txtCognome", "required", "");
                AddRule("txtDataN", 'custom|myCheckDate($("#txtDataN").val());', "");

                AddRule("txtNome_S", "required", "Name");
                AddRule("txtCognome_S", "required", "Last name");


                if (document.getElementById("selNazione").value == "9"){
                    if (bPivaNonObb != "True"){
                        AddRule("txtCOFI", 'custom|CheckCF("txtCOFI", "txtPAIV", "selNazione");', "Fiscal Code / SSN (Social Security Number)");
                    }
                    if (arrValidateFT[i][1] == "txtDataN_P"){
                        if (Boolean(parseInt(arrValidateFT[i][0]))){
                            AddRule("txtDataN", "required", "Date of birth");
                        }
                    }


                    if (arrValidateFT[i][1] == "selNazioneN"){
                        if (Boolean(parseInt(arrValidateFT[i][0]))){
                            AddRule("selNazioneN", "notequal|28", "Province");
                        }
                    }


                    if (document.getElementById("selNazioneN").value == "9"){
                        if (arrValidateFT[i][1] == "selProvinciaN"){
                            if (Boolean(parseInt(arrValidateFT[i][0]))){
                                AddRule("selProvinciaN", "required", "Province");
                            }
                        }


                        if (arrValidateFT[i][1] == "selComuneN"){
                            if (Boolean(parseInt(arrValidateFT[i][0]))){
                                AddRule("selComuneN", "required", "City");
                            }
                        }

                    }
                    else {
                        if (arrValidateFT[i][1] == "txtProvinciEsteraN"){
                            if (Boolean(parseInt(arrValidateFT[i][0]))){
                                AddRule("txtProvinciEsteraN", "required", "Zip code");
                            }
                        }


                        if (arrValidateFT[i][1] == "txtCittaEsteraN"){
                            if (Boolean(parseInt(arrValidateFT[i][0]))){
                                AddRule("txtCittaEsteraN", "required", "City");
                            }
                        }

                    }
                    if (arrValidateFT[i][1] == "selSesso"){
                        if (Boolean(parseInt(arrValidateFT[i][0]))){
                            AddRule("selSesso", "required", "Gender");
                        }
                    }

                }
            }
            else {
                if (arrValidateFT[i][1] == "txtRagSoc"){
                    if (Boolean(parseInt(arrValidateFT[i][0]))){
                        AddRule("txtRagSoc", "required", "Corporate name");
                    }
                }

                if (arrValidateFT[i][1] == "txtRagSoc_S"){
                    if (Boolean(parseInt(arrValidateFT[i][0]))){
                        AddRule("txtRagSoc_S", "required", "Corporate name");
                    }
                }

                if (bPivaNonObb != "True"){
                    if (CheckUE()!= false) {
                        AddRule("txtPAIV", "required", "V.A.T. (Value Added Tax)");
                        AddRule("txtPAIV", 'custom|CheckPIVA("txtPAIV", "selNazione");', "V.A.T. (Value Added Tax)");
                    }
                }
            }

            //Nazione residenza deve essere diversa da "-"
            if (arrValidateFT[i][1] == ""){
                if (Boolean(parseInt(arrValidateFT[i][0]))){

                }
            }
            AddRule("selNazione", "notequal|28", "Country");
            AddRule("selNazione", "custom|CheckBlackList();", "Country");
            if (arrValidateFT[i][1] == "txtIndirizzo"){
                if (Boolean(parseInt(arrValidateFT[i][0]))){
                    AddRule("txtIndirizzo", "required", "Address");
                }
            }


            if (arrValidateFT[i][1] == "selNazione_S"){
                if (Boolean(parseInt(arrValidateFT[i][0]))){
                    AddRule("selNazione_S", "notequal|28", "Country");
                }
            }


            if (arrValidateFT[i][1] == "txtIndirizzo_S"){
                if (Boolean(parseInt(arrValidateFT[i][0]))){
                    AddRule("txtIndirizzo_S", "required", "Address");
                }
            }


            if (document.getElementById("selNazione").value == "9"){
                if (arrValidateFT[i][1] == "txtCap"){
                    if (Boolean(parseInt(arrValidateFT[i][0]))){
                        AddRule("txtCap", "required", "Zip code");
                    }
                }

                if (arrValidateFT[i][1] == "selProvincia"){
                    if (Boolean(parseInt(arrValidateFT[i][0]))){
                        AddRule("selProvincia", "required", "Province");
                    }
                }

                if (arrValidateFT[i][1] == "selComune"){
                    if (Boolean(parseInt(arrValidateFT[i][0]))){
                        AddRule("selComune", "required", "City");
                    }
                }

            }
            else {
                if (arrValidateFT[i][1] == "txtCap"){
                    if (Boolean(parseInt(arrValidateFT[i][0]))){
                        AddRule("txtCap", "required", "Zip code");
                    }
                }

                if (arrValidateFT[i][1] == "txtCittaEstera"){
                    if (Boolean(parseInt(arrValidateFT[i][0]))){
                        AddRule("txtCittaEstera", "required", "City");
                    }
                }

            }

            if (document.getElementById("selNazione_S").value == "9"){
                if (arrValidateFT[i][1] == "txtCap_S"){
                    if (Boolean(parseInt(arrValidateFT[i][0]))){
                        AddRule("txtCap_S", "required", "Zip code");
                    }
                }

                if (arrValidateFT[i][1] == "selProvincia_S"){
                    if (Boolean(parseInt(arrValidateFT[i][0]))){
                        AddRule("selProvincia_S", "required", "Province");
                    }
                }

                if (arrValidateFT[i][1] == "selComune_S"){
                    if (Boolean(parseInt(arrValidateFT[i][0]))){
                        AddRule("selComune_S", "required", "City");
                    }
                }

            }
            else {
                if (arrValidateFT[i][1] == "txtCap_S"){
                    if (Boolean(parseInt(arrValidateFT[i][0]))){
                        AddRule("txtCap_S", "required", "Zip code");
                    }
                }

                if (arrValidateFT[i][1] == "txtCittaEstera_S"){
                    if (Boolean(parseInt(arrValidateFT[i][0]))){
                        AddRule("txtCittaEstera_S", "required", "City");
                    }
                }

            }

            //Valida l'email
            if (arrValidateFT[i][1] == "txtEmail"){
                if (Boolean(parseInt(arrValidateFT[i][0]))){
                    AddRule("txtEmail", "required", "E-mail");
                }
            }


            AddRule("txtEmail", "email", "E-mail");


        }

    }
}


function PrepareRulesFattEl(sTipo){
    iRuleIndexEl = 0;
    if (sTipo == "P"){
        if (document.getElementsByName("rdbFattEL").item(0).checked){

            AddRuleEl("txtCUD", "custom|CheckFattEl()", "Required a field between Email PEC and C.U.D.");
            AddRuleEl("txtEmailPec", "custom|CheckFattEl()", "Required a field between Email PEC and C.U.D.");
            AddRuleEl("txtEmailPec", "email", "");
        }
    }else{
        if (document.getElementsByName("rdbFattEL_S").item(0).checked){
            if ($("#selTipo_S").val() == 2) {
                AddRuleEl("txtCUD_S", "custom|CheckFattEl_S()", "Required a field between Email PEC and C.U.D.");
                AddRuleEl("txtEmailPec_S", "custom|CheckFattEl_S()", "Required a field between Email PEC and C.U.D.");
                AddRuleEl("txtEmailPec_S", "email", "");
            }else{
                AddRuleEl("txtCUD_S", "required", "");
                AddRuleEl("txtEmailPec_S", "email", "");
            }
        }
    }
}


function CheckFattEl(){
    var msg;

    if (($("#txtCUD").val() == "")&&($("#txtEmailPec").val() == "")){
        msg = "Required a field between Email PEC and C.U.D.";
    }

    return msg;
}

function CheckFattEl_S(){
    var msg;

    if (($("#txtCUD_S").val() == "")&&($("#txtEmailPec_S").val() == "")){
        msg = "Required a field between Email PEC and C.U.D.";
    }

    return msg;
}



function CheckCF(sObjCF, sObjPIVA, sObjNation){

    var msg;
    var CFPattern = new RegExp("[A-Za-z]{6}[0-9LMNPQRSTUV]{2}[A-Za-z]{1}[0-9LMNPQRSTUV]{2}[A-Za-z]{1}[0-9LMNPQRSTUV]{3}[A-Za-z]{1}");

    if (document.getElementById(sObjNation).value == "9"){
        if ((Trim(document.getElementById(sObjCF).value) == "")&&(Trim(document.getElementById(sObjPIVA).value) == "")){
            msg = "Wrong Tax identification number format. Please verify";
        }
        else{
            if (Trim(document.getElementById(sObjCF).value) != ""){
                var sCOFI = Trim(document.getElementById(sObjCF).value);
                if (sCOFI.length != 16)
                    msg = "Wrong Tax identification number format. Please verify";
                else
                if (CFPattern.test(sCOFI) == false )
                    msg = "Wrong Tax identification number format. Please verify";
                else
                if (bVerificaCFVAT == 1 )
                {

                    var sCognome, sNome, sDataNascita, sSesso, sCitta, sProvincia;
                    sCognome = document.getElementById("txtCognome").value ;
                    sNome = document.getElementById("txtNome").value ;
                    sDataNascita = document.getElementById("txtDataN").value ;
                    sSesso = document.getElementById("selSesso").value ;
                    sCitta = document.getElementById("selComuneN").value ;
                    sProvincia = document.getElementById("selProvinciaN").value ;
                    if ((sCognome != "") && (sNome != "") && (sDataNascita != "") && (sSesso != "") && (sCitta != "") && (sProvincia != ""))
                    {
                        VerifyCF("pst_Verify_CF", sCOFI, sCognome, sNome, sDataNascita, sSesso, sCitta, sProvincia);
                        if (document.getElementById("pst_Verify_CF").value == "False" )
                            msg = "Wrong Tax identification number format. Please verify";
                        else{

                            var sCF, sEmail
                            sCF = "";

                            //alert(sCF + " : " +sCOFI) ;	

                            if (sCF!=sCOFI){
                                //sEmail = document.getElementById("txtEmail").value ;
                                VerifyCFUtente("pst_Verify_CF_Utente", sCOFI, "");
                                if (document.getElementById("pst_Verify_CF_Utente").value != "" ){
                                    if (document.getElementById("pst_Verify_CF_Utente").value != "MULTI" ){
                                        msg = "Tax Code associated with another participant";
                                        document.getElementById("txtEmailVerify_Edit").value = document.getElementById("pst_Verify_CF_Utente").value
                                        Open_Form_VerifyMailCF();
                                    }
                                    else{
                                        msg = "Tax Code associated with another participant - Contact the secretary";
                                        Open_Form_VerifyMailCF_segreteria();
                                    }
                                }else{
                                    msg = null;
                                }
                            }else{
                                msg = null;
                            }

                        }
                    }else
                        msg = null;
                }else
                    msg = null;
            }
        }

    }

    return msg;
}


function VerifyEmailCF_Utente(){
    var sEmailCheck
    var sCOFICheck = Trim(document.getElementById("txtCOFI").value);
    sEmailCheck = document.getElementById("txtEmailVerify_Edit_Check").value;

    VerifyCFUtente("pst_Verify_CF_Utente", sCOFICheck, sEmailCheck);
    if (document.getElementById("pst_Verify_CF_Utente").value != "" ){
        Open_Form_VerifyMailCF_segreteria();
    }else{
        //location.reload(true);
        window.location.replace("MainCheckOut.asp");
    }

}



function CheckPIVA(sObjPIVA, sObjNation){
    var msg;
    var CodiceNazione;
    var idNazione;
    var sVATCode;
    var bVerificaVIES = "False";
    var bCheckVerificaVIES;

    CodiceNazione = '';
    sVATCode = "";
    idNazione = 0;
    msg = null;

    if (document.getElementById(sObjNation).value != ""){
        idNazione = document.getElementById(sObjNation).value;
    }


    if (Trim(document.getElementById(sObjPIVA).value) != ""){
        //Memorizza il contenuto testuale dell'elemento selezionato
        CodiceNazione = document.getElementById(sObjNation).options[document.getElementById(sObjNation).selectedIndex].text
    }

    if (Trim(CodiceNazione) != ""){
        //estrare la parte di testo relativa al codice della nazione
        var iPosParentesi = InStr(CodiceNazione, '(', true, 0);
        if (iPosParentesi >= 0)
            CodiceNazione = Mid(CodiceNazione, iPosParentesi +1, (Len(CodiceNazione) -1) - (iPosParentesi +1));

        CodiceNazione = Replace(CodiceNazione, '-', '');
        sVATCode = $("#" + sObjPIVA ).val();
        if ((bVerificaVIES== true)||(bVerificaVIES== "true")||(bVerificaVIES== "True")) {
            if(($("#chkVerifyVIES_PAIV").prop('checked') == false)||($("#chkVerifyVIES_PAIV").prop('checked') == "false")||($("#chkVerifyVIES_PAIV").prop('checked') == "False")){
                if ((bVerificaCFVAT == 1 ) && (sVATCode!="") && (CodiceNazione!=""))
                {
                    VerifyVAT("pst_Verify_VAT", sVATCode, idNazione);
                    //alert(document.getElementById("pst_Verify_VAT").value)
                    if (document.getElementById("pst_Verify_VAT").value == "false"){
                        msg = "Wrong V.A.T. (Value Added Tax) format. Please correct!";
                    }
                }
            }

        }

        /*                
        if (!Validate_PIVA(CodiceNazione, document.getElementById(sObjPIVA).value))

            msg = "Wrong V.A.T. (Value Added Tax) format. Please correct!";
        */

        if (!checkVATNumber(CodiceNazione + sVATCode)){
            msg = "Wrong V.A.T. (Value Added Tax) format. Please correct!";
        }


    }

    return msg;
}

function CheckBlackList(){
    var bResult;
    var iIDSelectedNation;
    var iFiscalNation;

    var bIsBlacklisted = false;
    var msg = null;
    var CFPattern = new RegExp("[A-Za-z]{6}[0-9LMNPQRSTUV]{2}[A-Za-z]{1}[0-9LMNPQRSTUV]{2}[A-Za-z]{1}[0-9LMNPQRSTUV]{3}[A-Za-z]{1}");
    var sCodeID;
    var sVAT_Code;

    iIDSelectedNation = parseInt($("#selNazione").val());
    iFiscalNation = parseInt($("#selNazione").val());

    sFocusThis = "";

    for (i=0; i < aBlackListNazioni.length; i++){
        if (parseInt(aBlackListNazioni[i][1]) == iIDSelectedNation){
            if (Boolean(parseInt(aBlackListNazioni[i][0]))){
                bIsBlacklisted = true;
                break;
            }
        }
    }


    if (bIsBlacklisted){
        // Se Paese � in blacklist allora necessaria verifica codice identificativo

        if (document.getElementsByName("rdbTipoProprietario").item(0).checked){
            sFocusThis = "txtCOFI";
            sCodeID = $("#txtCOFI").val();

            if (Trim(sCodeID) == "") {
                msg = "Please specify one of the fields at least Tax identification number and V.A.T. (Value Added Tax)";
            }
            else{
                if (iFiscalNation == 9){
                    if (sCodeID.length != 16){
                        msg = "Wrong Tax identification number format. Please verify";
                    }
                    else {
                        if (CFPattern.test(sCodeID) == false ){
                            msg = "Wrong Tax identification number format. Please verify";
                        }
                    }
                }
                else {
                    if (sCodeID.length < 4){
                        msg = "Wrong Tax identification number format. Please verify";
                    }
                }
            }
        }
        else {
            sFocusThis = "txtPAIV";
            sCodeID = $("#txtPAIV").val();

            if (Trim(sCodeID) == "") {
                msg = "Please specify one of the fields at least Tax identification number and V.A.T. (Value Added Tax)";
            }
            else{
                if (iFiscalNation == 9){
                    if (sCodeID.length != 11){
                        msg = "Wrong V.A.T. (Value Added Tax) format. Please correct";
                    }
                }
                else {
                    if (sCodeID.length < 4){
                        msg = "Wrong V.A.T. (Value Added Tax) format. Please correct";
                    }
                }
            }
        }
    }

    return msg;
}

function CheckUE(){
    var bResult;
    var iIDSelectedNation;

    var bIsUE = false;
    $("#star_piva_a").css("visibility","collapse");

    iIDSelectedNation = parseInt($("#selNazione").val());
    iFiscalNation = parseInt($("#selNazione").val());

    sFocusThis = "";

    for (i=0; i < aListNazioniUE.length; i++){
        if (parseInt(aListNazioniUE[i][1]) == iIDSelectedNation){
            if (Boolean(parseInt(aListNazioniUE[i][0]))){
                bIsUE = true;
                $("#star_piva_a").css("visibility","visible");
                break;
            }
        }
    }

    return bIsUE;
}






function LoadProvince(objTarget, objSource, sResultType, sSection){
    var sPage = "";
    var objAsterisc;
    var objItalian;
    var iAction;

    if (document.getElementById(objSource).value == "9"){

        sPage = "include/getHTMLString.asp?ACT=3&PARAM1=" + $("#" + objTarget).val();
        iAction = 1;

        SendRequest(sPage, iAction, objTarget);

        sShowClass_ITA = "inline";
        sShowClass_EXT = "none";


    }
    else {
        sShowClass_ITA = "none";
        sShowClass_EXT = "inline";

    }

    switch(sSection){
        case "F":
            $(".is_italiano").each(function (i) { this.style.display = sShowClass_ITA; });
            $(".is_estero").each(function (i) { this.style.display = sShowClass_EXT; });


            break;

        case "N":
            $(".is_italiano_n").each(function (i) { this.style.display = sShowClass_ITA; });
            $(".is_estero_n").each(function (i) { this.style.display = sShowClass_EXT; });


            break;

        case "S":
            $(".is_italiano_s").each(function (i) { this.style.display = sShowClass_ITA; });
            $(".is_estero_s").each(function (i) { this.style.display = sShowClass_EXT; });
            break;
    }


    if (document.getElementById(objSource).value == "9"){

        if (document.getElementsByName("rdbTipoProprietario").item(0).checked){
            $("#form_fatt_el_S").css("display","none");
            ModificaDettagliFattEl('P');
            if ($("#selNazione").val()==9){
                $("#form_payment").hide();
                $("#form_controls").hide();
            }
        }
        if (document.getElementsByName("rdbTipoProprietario").item(1).checked){
            $("#form_fatt_el").css("display","none");
            ModificaDettagliFattEl('C');
            if ($("#selNazione_S").val()==9){
                $("#form_payment").hide();
                $("#form_controls").hide();
            }
        }

    }
    else {
        $("#form_payment").show();
        $("#form_controls").show();
        $("#form_report_fatt_el_S").hide();
        $("#form_edit_fatt_el_S").hide();
        $("#form_report_fatt_el").hide();
        $("#form_edit_fatt_el").hide();
    }



}

function LoadComuni(objTarget, objSource, objFlag, sResultType){
    var sPage = "";
    var iAction;

    if (document.getElementById(objFlag).value == "9"){

        if (objTarget == "selComuneN"){
            sPage = "include/getHTMLString.asp?ACT=4&PARAM1=" + $("#" + objSource).val() + "&PARAM2=" + $("#" + objTarget).val() + "&PARAM3=N";
        }else{
            sPage = "include/getHTMLString.asp?ACT=4&PARAM1=" + $("#" + objSource).val() + "&PARAM2=" + $("#" + objTarget).val();
        }


        iAction = 1;


        if (document.getElementById(objSource).value != ""){
            SendRequest(sPage, iAction, objTarget);
        }
    }
}

function VerifyCF(obj, psCF, psCognome, psNome, psDataNascita, psSesso, psCitta, psProvincia){

    sPage = "include/getHTMLString.asp?ACT=30&PARAM=" + psCF + "&PARAM1=" + psCognome + "&PARAM2=" + psNome + "&PARAM3=" + psDataNascita + "&PARAM4=" + psSesso + "&PARAM5=" + psCitta + "&PARAM6=" + psProvincia;
    iAction = 5;

    SendRequest(sPage, iAction, obj);

}

function VerifyCFUtente(obj, psCF, psEmail){

    sPage = "include/getHTMLString.asp?ACT=57&PARAM=" + psCF + "&PARAM1=" + psEmail;
    iAction = 5;
    //alert (sPage)
    SendRequest(sPage, iAction, obj);

}

function VerifyVAT(obj, psVAT, psNazione){

    sPage = "include/getHTMLString.asp?ACT=31&PARAM=" + psVAT + "&PARAM1=" + psNazione;
    iAction = 5;
    //alert (sPage)
    SendRequest(sPage, iAction, obj);

}

function VerifyCEE(obj, psNazione){

    sPage = "include/getHTMLString.asp?ACT=43&PARAM=" + psNazione;
    iAction = 5;
    //alert (sPage)
    SendRequest(sPage, iAction, obj);

}

function VerifyFeeTerrIva(obj, psCodeVAT){

    sPage = "include/getHTMLString.asp?ACT=46&PARAM=" + psCodeVAT;
    iAction = 5;
    //alert (sPage)
    SendRequest(sPage, iAction, obj);

}

function GetDatiFattElettronicaS(obj){
    var sPAIV = ""
    sPAIV = $("#txtPAIV").val();

    sPage = "include/getHTMLString.asp?ACT=52&PARAM=" + sPAIV;
    iAction = 5;
    //alert (sPage)
    SendRequest(sPage, iAction, obj);
    UpdateLabelsEl_Load();

}

function GetTotaleFeeTerrIva(psParam){
    var linkLocation = "";
    linkLocation = sBaseURL + "S2SBilling.asp?" + psParam + "=1";
    //alert(linkLocation);
    $('iframe').attr('src',linkLocation);
    $('iframe').fadeIn()

}


//        function SetVarAcc(){
//            if (document.getElementById("chkRegAcc").checked)
//                bAsRegAcc = true;
//            else
//                bAsRegAcc = false;
//        }

function ModificaDettagli(){
    if ((bEnableRegAcc == 1)&&(bAsRegAcc == 1)){
        $("#form_selector").hide();
    }


    $("#form_report").hide();

    $("#form_edit").show();


    if (document.getElementsByName("rdbTipoProprietario").item(0).checked){
        if ($("#selNazione").val()==9){
            $("#form_payment").hide();
            $("#form_controls").hide();
        }
        //$("#form_fatt_el_S").css("display","none");
        UndoModDettagliEl('P');
    }
    if (document.getElementsByName("rdbTipoProprietario").item(1).checked){
        if ($("#selNazione_S").val()==9){
            $("#form_payment").hide();
            $("#form_controls").hide();
        }
        //$("#form_fatt_el").css("display","none");
        UndoModDettagliEl('S');
    }


}

function ModificaDettagliFattEl(sTipo){
    if (sTipo == "P") {
        $("#form_report_fatt_el").hide();
        $("#form_edit_fatt_el").show();

    }else{
        $("#form_report_fatt_el_S").hide();
        $("#form_edit_fatt_el_S").show();
    }
}

function VerifyChar(){
    var result = 0;
    var str = $("#txtRagSoc").val();
    var n = str.indexOf("&");
    var sAllert = "Invalid character [@char]";
    sAllert = sAllert.replace("[@char]","'&'");

    if (n != -1) {
        result = 1;
        $("#txtRagSoc").focus();
        alert(sAllert);
    }
    str = $("#txtRagSoc_S").val();
    n = str.indexOf("&");
    if (n != -1) {
        result = 1;
        $("#txtRagSoc_S").focus();
        alert(sAllert);
    }
    return result;
}

function UpdateDettagli(){
    var VerifyCharChek = VerifyChar();
    if (VerifyCharChek == 0){
        if (bDati_Spedizione == 1) {
            CopyDetails();
        }

        PrepareRules();


        var alertType = 'inline';
        var verifica_idNazione = 0;
        var sVATCode = ""


        document.getElementById(yav_config.errorsdiv).className = '';
        document.getElementById(yav_config.errorsdiv).style.display = 'none';

        if (yav.performCheck("frmData", aStandardRules,  alertType)){


            //alert(bTerritorialitaIVA);
            //alert(bSedeITA);
            if ((bTerritorialitaIVA == 1) && (bSedeITA == 0)) {


                if (bEventoVirtuale == 1){

                    if (document.getElementsByName("rdbTipoProprietario").item(1).checked){

                        verifica_idNazione = document.getElementById("selNazione").value;
                        if (verifica_idNazione!=9){
                            VerifyCEE("pst_Verify_CEE", verifica_idNazione);
                            if (document.getElementById("pst_Verify_CEE").value == "True"){
                                VerifyFeeTerrIva("pst_Verify_FeeTerrIva", "7TEEU");
                                GetTotaleFeeTerrIva("ReloadTOT");
                            }else{
                                VerifyFeeTerrIva("pst_Verify_FeeTerrIva", "7TEEX");
                                GetTotaleFeeTerrIva("ReloadTOT");
                            }
                        }else{
                            GetTotaleFeeTerrIva("ResetFee");
                        }

                    }else{
                        verifica_idNazione = document.getElementById("selNazione").value;
                        if (verifica_idNazione!=9){
                            VerifyCEE("pst_Verify_CEE", verifica_idNazione);
                            if (document.getElementById("pst_Verify_CEE").value == "True"){
                                VerifyFeeTerrIva("pst_Verify_FeeTerrIva", "7SXEU");
                                GetTotaleFeeTerrIva("ReloadTOT");
                            }else{
                                VerifyFeeTerrIva("pst_Verify_FeeTerrIva", "7STEX");
                                GetTotaleFeeTerrIva("ReloadTOT");
                            }
                        }else{
                            GetTotaleFeeTerrIva("ResetFee");
                        }

                    }


                }else{

                    if (document.getElementsByName("rdbTipoProprietario").item(1).checked){
                        //alert("1");
                        verifica_idNazione = document.getElementById("selNazione").value;
                        if (verifica_idNazione!=9){
                            //alert("2");
                            VerifyCEE("pst_Verify_CEE", verifica_idNazione);
                            if (document.getElementById("pst_Verify_CEE").value == "True"){
                                //alert("3");
                                sVATCode = document.getElementById("txtPAIV").value;
                                VerifyVAT("pst_Verify_VAT", sVATCode, verifica_idNazione);
                                if (document.getElementById("pst_Verify_VAT").value == "true"){
                                    //alert("4");
                                    // Art.7 ter
                                    VerifyFeeTerrIva("pst_Verify_FeeTerrIva", "7TEEU");
                                    GetTotaleFeeTerrIva("ReloadTOT");
                                }else{
                                    //alert("5");
                                    //Reset Fee - IVA Italiana
                                    GetTotaleFeeTerrIva("ResetFee");
                                }
                            }else{
                                //alert("6");
                                if ($("#txtPAIV").val()== ""){
                                    //alert("7");
                                    // Art.7 quinques
                                    VerifyFeeTerrIva("pst_Verify_FeeTerrIva", "7QQEX");
                                }else{
                                    //alert("8");
                                    // Art.7 ter
                                    VerifyFeeTerrIva("pst_Verify_FeeTerrIva", "7TEEX");
                                }
                                GetTotaleFeeTerrIva("ReloadTOT");
                            }
                        }else{
                            //alert("9");
                            //Reset Fee - IVA Italiana
                            GetTotaleFeeTerrIva("ResetFee");
                        }
                        //alert ($("#pst_Totale_FeeTerrIva").val());
                        //GetTotaleFeeTerrIva("ReloadTOT");
                    }else{
                        ///alert("10");

                        verifica_idNazione = document.getElementById("selNazione").value;

                        VerifyCEE("pst_Verify_CEE", verifica_idNazione);
                        if (document.getElementById("pst_Verify_CEE").value == "True"){
                            VerifyFeeTerrIva("pst_Verify_FeeTerrIva", "7QQEU");
                            GetTotaleFeeTerrIva("ReloadTOT");
                        }else{
                            VerifyFeeTerrIva("pst_Verify_FeeTerrIva", "7QQEX");
                            GetTotaleFeeTerrIva("ReloadTOT");
                        }

                    }

                }

            }



            UpdateLabels();
            UpdateTmpVars();

            $("#form_report").show();
            $("#form_edit").hide();

            if (($(".dett_fatt_el").css("display") != "inline" )&&($(".dett_fatt_el_S").css("display") != "inline" )){
                $("#form_payment").show();
                $("#form_controls").show();
            }

            if (document.getElementsByName("rdbTipoProprietario").item(0).checked){
                $("#form_fatt_el_S").css("display","none");
                ModificaDettagliFattEl('P');
            }
            if (document.getElementsByName("rdbTipoProprietario").item(1).checked){
                $("#form_fatt_el").css("display","none");
                ModificaDettagliFattEl('C');
            }


            if ((bEnableRegAcc == 1)&&(bAsRegAcc == 1)){
                $("#form_selector").show();
            }


        }
        else if (alertType == 'jsVar'){

            if (sFocusThis != ""){
                if (document.getElementById(sFocusThis)){
                    $("#" + sFocusThis).focus();
                }
            }

            var aErrors = jsErrors.toString().split(",");
            alert(aErrors[0]);
            return false;
        }
    }
}

function UpdateDettagliEl(sTipo){
    aStandardRulesEl = [];
    PrepareRulesFattEl(sTipo);
    var alertType = 'inline';
    var verifica_idNazione = 0;

    document.getElementById(yav_config.errorsdiv).className = '';
    document.getElementById(yav_config.errorsdiv).style.display = 'none';
    if (((document.getElementsByName("rdbFattEL").item(0).checked)&&(document.getElementsByName("rdbTipoProprietario").item(0).checked))||((document.getElementsByName("rdbFattEL_S").item(0).checked)&&(document.getElementsByName("rdbTipoProprietario").item(1).checked))){
        if (yav.performCheck("frmData", aStandardRulesEl,  alertType)){
            if (sTipo=="P"){
                UpdateLabelsEl();
                //UpdateTmpVars();
                if ($(".dett_fatt_el").css("display") != "inline" ){
                    $("#form_report_fatt_el").hide();
                    $("#form_edit_fatt_el").show();
                }else{

                    $("#form_report_fatt_el").show();
                    $("#form_edit_fatt_el").hide();
                }

                $("#form_report_fatt_el_S").hide();
                $("#form_edit_fatt_el_S").hide();

            }else{
                UpdateLabelsEl_S();
                //UpdateTmpVars();

                if ($(".dett_fatt_el_S").css("display") != "inline" ){
                    $("#form_report_fatt_el_S").hide();
                    $("#form_edit_fatt_el_S").show();
                }else{

                    $("#form_report_fatt_el_S").show();
                    $("#form_edit_fatt_el_S").hide();
                }

                $("#form_report_fatt_el").hide();
                $("#form_edit_fatt_el").hide();
            }

            $("#form_payment").show();
            $("#form_controls").show();

        }
        else if (alertType == 'jsVar'){

            if (sFocusThis != ""){
                if (document.getElementById(sFocusThis)){
                    $("#" + sFocusThis).focus();
                }
            }

            var aErrors = jsErrors.toString().split(",");
            alert(aErrors[0]);
            return false;
        }

    }else{
        if (sTipo=="P"){
            UpdateLabelsEl();
            $("#form_report_fatt_el").show();
            $("#form_edit_fatt_el").hide();
            $("#form_report_fatt_el_S").hide();
            $("#form_edit_fatt_el_S").hide();

        }else{
            UpdateLabelsEl_S();
            $("#form_report_fatt_el_S").show();
            $("#form_edit_fatt_el_S").hide();
            $("#form_report_fatt_el").hide();
            $("#form_edit_fatt_el").hide();
        }

        $("#form_payment").show();
        $("#form_controls").show();

    }
}



function UpdateLabels(){
    // FATTURAZIONE
    var sRagSoc = $("#txtRagSoc").val() + "<br />";
    var sNominativo = $("#txtNome").val() + ' ' + $("#txtCognome").val() + "<br />";
    var sIndirizzo = "";
    if ($("#selNazione").val() == 9)
        sIndirizzo = $("#txtIndirizzo").val() + '<br />' + $("#txtCap").val() + ' - ' + $('#selComune :selected').text() + ' (' + $('#selProvincia :selected').text() + ')'  + '<br />' + $("#selNazione :selected").text() + '<br />';
    else
        sIndirizzo = $("#txtIndirizzo").val() + '<br />' + $("#txtCap").val() + ' - ' + $('#txtCittaEstera').val() + ' (' + $('#txtProvEstera').val() + ')' + '<br />' + $("#selNazione :selected").text() + '<br />';

    var sCOFI = $("#txtCOFI").val() + '<br />';
    var sPAIV = $("#txtPAIV").val() + '<br />';
    var sPAIV_P = $("#txtPAIV_P").val() + '<br />';

    $("#F_RagSoc").html(sRagSoc);
    $("#F_Nominativo").html(sNominativo);
    $("#F_Indirizzo").html(sIndirizzo);
    $("#F_COFI").html(sCOFI);
    $("#F_PAIV").html(sPAIV);
    $("#F_PAIV_P").html(sPAIV_P);

    // SPEDIZIONE
    var sRagSoc_S = $("#txtRagSoc_S").val() + "<br />";
    var sNominativo_S = $("#txtNome_S").val() + ' ' + $("#txtCognome_S").val() + "<br />";
    var sIndirizzo_S = "";
    if ($("#selNazione_S").val() == 9)
        sIndirizzo_S = $("#txtIndirizzo_S").val() + '<br />' + $("#txtCap_S").val() + ' - ' + $('#selComune_S :selected').text() + ' (' + $('#selProvincia_S :selected').text() + ')'  + '<br />' + $("#selNazione_S :selected").text();
    else
        sIndirizzo_S = $("#txtIndirizzo_S").val() + '<br />' + $("#txtCap_S").val() + ' - ' + $('#txtCittaEstera_S').val() + ' (' + $('#txtProvEstera_S').val() + ')' + '<br />' + $("#selNazione_S :selected").text();

    $("#S_RagSoc").html(sRagSoc_S);
    $("#S_Nominativo").html(sNominativo_S);
    $("#S_Indirizzo").html(sIndirizzo_S);

}

function UpdateLabelsEl(){
    // FATTURAZIONE
    var sEmailPec = $("#txtEmailPec").val() + "<br />";
    var sCud = $("#txtCUD").val() + "<br />";
    var sDettaglioFattEl = "";
    if (document.getElementsByName("rdbFattEL").item(0).checked){
        sDettaglioFattEl = "<b>I have the delivery details for the electronic invoice</b><br>";
        $("#FattEl_Dett").html(sDettaglioFattEl);
        $("#FattEl_Pec").html("<b>Pec:</b> " + sEmailPec);
        $("#FattEl_CUD").html("<b>Cod. Univoco Dest.:</b> " + sCud);
    }else{
        sDettaglioFattEl = "<b>It's not mandatory for me to receive an electronic invoice</b>";
        $("#FattEl_Dett").html(sDettaglioFattEl);
        $("#FattEl_Pec").html("");
        $("#FattEl_CUD").html("");
        $("#txtCUD").val("");
        $("#txtEmailPec").val("");
    }

}

function UpdateLabelsEl_S(){
    // FATTURAZIONE
    var sEmailPec = $("#txtEmailPec_S").val() + "<br />";
    var sCud = $("#txtCUD_S").val() + "<br />";
    var sDettaglioFattEl = "";
    if (document.getElementsByName("rdbFattEL_S").item(0).checked){
        sDettaglioFattEl = "<b>I have the delivery details for the electronic invoice</b><br>";
        $("#FattEl_Dett_S").html(sDettaglioFattEl);
        $("#FattEl_Pec_S").html("<b>Pec:</b> " + sEmailPec);
        $("#FattEl_CUD_S").html("<b>Cod. Univoco Dest.:</b> " + sCud );
    }else{
        sDettaglioFattEl = "<b>It's not mandatory for me to receive an electronic invoice</b>";
        $("#FattEl_Dett_S").html(sDettaglioFattEl);
        $("#FattEl_Pec_S").html("");
        $("#FattEl_CUD_S").html("");
    }


}

function UpdateLabelsEl_Load(){
    // FATTURAZIONE
    var sDettFattEl = $("#txtDettFattEl").val();
    if (sDettFattEl != ""){
        var aDettFattEl = sDettFattEl.split("###");

        var sEmailPec = aDettFattEl[2];
        var sCud = aDettFattEl[1];

        var sDettaglioFattEl = "";
        if ((aDettFattEl[0] == true)||(aDettFattEl[0]== "True")||(aDettFattEl[0]== "Vero")){
            document.getElementsByName("rdbFattEL").item(0).checked

            if (sEmailPec != "-"){$("#txtEmailPec_S").val(sEmailPec);}
            $("#txtCUD_S").val(sCud);
            sDettaglioFattEl = "<b>I have the delivery details for the electronic invoice</b><br>";
            $("#FattEl_Dett_S").html(sDettaglioFattEl);
            $("#FattEl_Pec_S").html("<b>Pec:</b> " + sEmailPec  + "<br />");
            $("#FattEl_CUD_S").html("<b>Cod. Univoco Dest.:</b> " + sCud + "<br />");
        }else{
            document.getElementsByName("rdbFattEL").item(1).checked
            sDettaglioFattEl = "<b>It's not mandatory for me to receive an electronic invoice</b>";
            $("#FattEl_Dett_S").html(sDettaglioFattEl);
            $("#FattEl_Pec_S").html("");
            $("#FattEl_CUD_S").html("");
        }
    }

}

function CheckDataLoadPage(){
    var oRdbPayment;
    var i, bChecked;
    var bInvoiceDetailsMissing;



    // Introduzione controllo dati di fatturazione obbligatori compilati
    bInvoiceDetailsMissing = 0;
    // rdbPayer = 0 --> Il Partecipante o Accompagnatore in persona
    // rdbPayer = 1 --> Il Partecipante Sponsor o lo sponsor del PArtecipante collegato
    // rdbPayer = 2 --> Uno sponsor differente da quello del partecipante

    if ( (bEnableRegAcc == 0) || (bAsRegAcc == 0) || (parseInt($("input[name=rdbPayer]:checked").val()) == 0)  ){

        if ($("input[name='rdbTipoProprietario']:checked").length > 0){
            if ($("input[name='rdbTipoProprietario']:checked").val() == "P"){
                if ($("#txtNome").val() == ""){
                    if (bEnableLog) console.log("Nome mancante impossibile proseguire con il checkout");
                    bInvoiceDetailsMissing = 1;
                }

                if ($("#txtCognome").val() == ""){
                    if (bEnableLog) console.log("Cognome mancante impossibile proseguire con il checkout");
                    bInvoiceDetailsMissing = 1;
                }
            }
            else if ($("input[name='rdbTipoProprietario']:checked").val() == "C"){

                if ($("#txtRagSoc").val() == ""){
                    if (bEnableLog) console.log("Ragione Sociale mancante impossibile proseguire con il checkout");
                    bInvoiceDetailsMissing = 1;
                }
                if (bPivaNonObb != "True"){
                    if ($("#txtPAIV").val() == ""){
                        if (bEnableLog) console.log("Partita IVA mancante impossibile proseguire con il checkout");
                        bInvoiceDetailsMissing = 1;
                    }
                }
            }

            // Controlli Comuni sia a privato che azienda

            if ($("#selNazione").val() == 28){
                if (bEnableLog) console.log("Nazione mancante impossibile proseguire con il checkout");
                bInvoiceDetailsMissing = 1;
            }
            else{
                if ($("#selNazione").val() == 9){
                    if ($("#txtCOFI").val() == ""){
                        if (bEnableLog) console.log("Codice Fiscale mancante impossibile proseguire con il checkout");
                        bInvoiceDetailsMissing = 1;
                    }

                    // Se � italia allora vengono effettuati gli altri controlli
                    if ($("#selProvincia").val() == ""){
                        if (bEnableLog) console.log("Provincia mancante impossibile proseguire con il checkout");
                        bInvoiceDetailsMissing = 1;
                    }
                    else {
                        if ($("#selComune").val() == ""){
                            if (bEnableLog) console.log("Comune mancante impossibile proseguire con il checkout");
                            bInvoiceDetailsMissing = 1;
                        }
                    }
                    if ($("input[name='rdbTipoProprietario']:checked").val() == "P"){
                        if ($("#txtDataN").val() == ""){
                            if (bEnableLog) console.log("Data di Nascita mancante impossibile proseguire con il checkout");
                            bInvoiceDetailsMissing = 1;
                        }

                        if ($("#selComuneN").val() == ""){
                            if (bEnableLog) console.log("Luogo di Nascita mancante impossibile proseguire con il checkout");
                            bInvoiceDetailsMissing = 1;
                        }

                        if ($("#selNazioneN").val() == ""){
                            if (bEnableLog) console.log("Nazione di Nascita mancante impossibile proseguire con il checkout");
                            bInvoiceDetailsMissing = 1;
                        }

                        if ($("#selProvN").val() == ""){
                            if (bEnableLog) console.log("Provincia di Nascita mancante impossibile proseguire con il checkout");
                            bInvoiceDetailsMissing = 1;
                        }

                        if ($("#selSesso").val() == ""){
                            if (bEnableLog) console.log("Sesso mancante impossibile proseguire con il checkout");
                            bInvoiceDetailsMissing = 1;
                        }
                    }
                }
                else {
                    // Controllo dei campi obbligatori per la fatturazione su estero
                    /*if ($("#txtProvEstera").val() == ""){
                        if (bEnableLog) console.log("Provincia Estera mancante impossibile proseguire con il checkout");
                        bInvoiceDetailsMissing = 1;
                    }
                    */
                    if ($("#txtCittaEstera").val() == ""){
                        if (bEnableLog) console.log("Citt� Estera mancante impossibile proseguire con il checkout");
                        bInvoiceDetailsMissing = 1;
                    }

                }
            }

            if ($("#txtIndirizzo").val() == ""){
                if (bEnableLog) console.log("Indirizzo mancante impossibile proseguire con il checkout");
                bInvoiceDetailsMissing = 1;
            }

            if ($("#txtCap").val() == ""){
                if (bEnableLog) console.log("CAP mancante impossibile proseguire con il checkout");
                bInvoiceDetailsMissing = 1;
            }

        }
        else {
            if (bEnableLog) console.log("Errore di selezione proprietario documento");
            bInvoiceDetailsMissing = 1;
        }
    }

    if ((bInvoiceDetailsMissing == 1)||(iCheckSeveritaDatiFt > 0)){
        ModificaDettagli();
        return -1;
    }else{
        ModificaDettagli();
        UpdateDettagli();
    }

}


function CheckData(){
    var oRdbPayment;
    var i, bChecked;
    var bInvoiceDetailsMissing;



    // Introduzione controllo dati di fatturazione obbligatori compilati
    bInvoiceDetailsMissing = 0;
    // rdbPayer = 0 --> Il Partecipante o Accompagnatore in persona
    // rdbPayer = 1 --> Il Partecipante Sponsor o lo sponsor del PArtecipante collegato
    // rdbPayer = 2 --> Uno sponsor differente da quello del partecipante

    if ( (bEnableRegAcc == 0) || (bAsRegAcc == 0) || (parseInt($("input[name=rdbPayer]:checked").val()) == 0)  ){

        if ($("input[name='rdbTipoProprietario']:checked").length > 0){
            if ($("input[name='rdbTipoProprietario']:checked").val() == "P"){
                if ($("#txtNome").val() == ""){
                    if (bEnableLog) console.log("Nome mancante impossibile proseguire con il checkout");
                    bInvoiceDetailsMissing = 1;
                }

                if ($("#txtCognome").val() == ""){
                    if (bEnableLog) console.log("Cognome mancante impossibile proseguire con il checkout");
                    bInvoiceDetailsMissing = 1;
                }
            }
            else if ($("input[name='rdbTipoProprietario']:checked").val() == "C"){

                if ($("#txtRagSoc").val() == ""){
                    if (bEnableLog) console.log("Ragione Sociale mancante impossibile proseguire con il checkout");
                    bInvoiceDetailsMissing = 1;
                }
                if (bPivaNonObb != "True"){
                    if (CheckUE()!=false){
                        if ($("#txtPAIV").val() == ""){
                            if (bEnableLog) console.log("Partita IVA mancante impossibile proseguire con il checkout");
                            bInvoiceDetailsMissing = 1;
                        }
                    }
                }
            }

            // Controlli Comuni sia a privato che azienda

            if ($("#selNazione").val() == 28){
                if (bEnableLog) console.log("Nazione mancante impossibile proseguire con il checkout");
                bInvoiceDetailsMissing = 1;
            }
            else{

                if ($("#selNazione").val() == 9){
                    if (bPivaNonObb != "True"){
                        if (($("#txtCOFI").val() == "")&&($("#txtCOFI_A").val() == "")){
                            if (bEnableLog) console.log("Codice Fiscale mancante impossibile proseguire con il checkout");
                            bInvoiceDetailsMissing = 1;
                        }
                    }
                    // Se � italia allora vengono effettuati gli altri controlli
                    if ($("#selProvincia").val() == ""){
                        if (bEnableLog) console.log("Provincia mancante impossibile proseguire con il checkout");
                        bInvoiceDetailsMissing = 1;
                    }
                    else {
                        if ($("#selComune").val() == ""){
                            if (bEnableLog) console.log("Comune mancante impossibile proseguire con il checkout");
                            bInvoiceDetailsMissing = 1;
                        }
                    }
                }
                else {
                    // Controllo dei campi obbligatori per la fatturazione su estero
                    /*
                    if ($("#txtProvEstera").val() == ""){
                        if (bEnableLog) console.log("Provincia Estera mancante impossibile proseguire con il checkout");
                        bInvoiceDetailsMissing = 1;
                    }
                    */
                    if ($("#txtCittaEstera").val() == ""){
                        if (bEnableLog) console.log("Citt� Estera mancante impossibile proseguire con il checkout");
                        bInvoiceDetailsMissing = 1;
                    }

                }

            }

            if ($("#txtIndirizzo").val() == ""){
                if (bEnableLog) console.log("Indirizzo mancante impossibile proseguire con il checkout");
                bInvoiceDetailsMissing = 1;
            }

            if ($("#txtCap").val() == ""){
                if (bEnableLog) console.log("CAP mancante impossibile proseguire con il checkout");
                bInvoiceDetailsMissing = 1;
            }

        }
        else {
            if (bEnableLog) console.log("Errore di selezione proprietario documento");
            bInvoiceDetailsMissing = 1;
        }
    }

    if (bInvoiceDetailsMissing == 1){
        alert("Required information missing. Please, click on the 'Edit Details' button  to enter your details for the invoice and for the invoice shipment. Once you have filled all the mandatory fields, please confirm your entry by click the 'Save Changes' button.");
        return -1;
    }


    oRdbPayment = document.getElementsByName('rdbPayment');

    bChecked = false;
    for (i=0; i<oRdbPayment.length; i++){
        if (oRdbPayment[i].checked){
            bChecked = true;
            break;
        }
    }

    if (bChecked){
        if (confirm("Are you sure to continue?")){
            return i;
        }
    }
    else{
        alert("Please select one payment method before continuing.");
        return -1;
    }
}


function SubmitData(){
    var valReturn;
    var bSubmitForm;

    bSubmitForm = false;


    if ((bEnableRegAcc == 1) && (bAsRegAcc == 1)){
        // if ((document.getElementsByName("rdbPayer").item(0).checked == false)&&(document.getElementsByName("rdbPayer").item(1).checked == false)&&(document.getElementsByName("rdbPayer").item(2).checked == false))
        if (bEnableLog) console.log("Payer=" + $("input[name=rdbPayer]:checked").val());

        if ($("input[name=rdbPayer]:checked").length == 0){
            alert ("Selezionare un valore per l'entit� pagante");
            return 0;
        }
        else{

            // Casistica in cui Paga l'accompagnatore o un suo sponsor oppure paga l'iscritto di riferimento
            //if ((document.getElementsByName("rdbPayer").item(0).checked) || (document.getElementsByName("rdbPayer").item(1).checked)){
            if ( (parseInt($("input[name=rdbPayer]:checked").val()) == 0) || ( parseInt($("input[name=rdbPayer]:checked").val()) == 1) ){
                // Viene verificato che sia stata selezionata almeno una modalit� di pagamento
                valReturn = CheckData();
                if (valReturn >= 0){
                    //document.getElementById("frmData").submit();			
                    bSubmitForm = true;
                }

            }
            // Casistica in cui a Pagare sar� in seguito lo sponsor dell'iscritto di riferimento
            else {
                // Bypassati i controlli viene direttamente inviato il form dei dati alla pagina successiva
                //document.getElementById("frmData").submit();
                bSubmitForm = true;
            }
        }
    }
    else {

        //Se in esezione IVA diventa obbligatorio specificare i dettagli di fatturazione come azienda
        if (bEsenzioneIVA == 1){

            if ($("input[name=rdbTipoProprietario]:checked").val() == "P"){
                alert("Warning! You have chosen to take advantage of tax exemption. Therefore it is mandatory to specify all the company details for the invoice. Click the EDIT DETAILS button and fill the form with the required company details.")
                return false;
            }
        }

        valReturn = CheckData();


        if (valReturn >= 0){
            bSubmitForm = true;
        }
    }

    if (bSubmitForm == true){

        FinalizePostData();

        document.getElementById("frmData").action = "StepRegCheckout.asp";
        document.getElementById("frmData").method = "post";
        document.getElementById("frmData").target = "_self";

        document.getElementById("frmData").submit();
    }

}

// Compilazione dei campi nascosti
function FinalizePostData(){

    var objInput;
    var objSelect;
    var objRadio;
    var objCheckbox;

    var sPostName;
    var sFaceName;
    var sAppValue;

    // Reset di tutti i campi PostData
    $(".postData").each(function(){
        $(this).val('');
    });

    // Trasferimento Valori Input Text
    objInput = $("input[type='text']");
    if (objInput.length > 0 ){
        objInput.each(function(){
            sFaceName = $(this).attr("name");
            sPostName = "pst_" + sFaceName.substr(3, (sFaceName.length - 3));
            if (sPostName == "txtCOFI_A") {
                sPostName = "txtCOFI";
            }
            $("#" + sPostName).val($(this).val());
        });
    }

    // Trasferimento Valori Select
    objSelect = $('select');
    if (objSelect.length > 0 ){
        objSelect.each(function(){
            sFaceName = $(this).attr("name");
            sPostName = "pst_" + sFaceName.substr(3, (sFaceName.length - 3));
            $("#" + sPostName).val($(this).val());
        });
    }

    // Trasferimento Valori CheckBox
    objCheckbox = $("input[type='checkbox']:checked");
    if (objCheckbox.length > 0 ){
        objCheckbox.each(function(){
            sAppValue = "";

            sFaceName = $(this).attr("name");
            sPostName = "pst_" + sFaceName.substr(3, (sFaceName.length - 3));

            if ($("input[name='" + sFaceName + "']").length > 1) {
                sAppValue = $("#" + sPostName).val();
                if (sAppValue.length > 0) sAppValue = sAppValue + ",";
                $("#" + sPostName).val(sAppValue + $(this).val());
            }
            else {
                $("#" + sPostName).val($(this).val());
            }
        });
    }

    // Trasferimento Valori RadioButton
    objRadio = $("input[type='radio']").filter(':checked');
    if (objRadio.length > 0 ){
        objRadio.each(function(){
            sFaceName = $(this).attr("name");
            sPostName = "pst_" + sFaceName.substr(3, (sFaceName.length - 3));
            $("#" + sPostName).val($(this).val());
        });
    }
}

function SettingsFattEl(sSel){
    if (sSel == "S") {
        $(".dett_fatt_el").css("display","inline");
    }else{
        $(".dett_fatt_el").css("display","none");

    }
}

function SettingsFattEl_S(sSel){
    if (sSel == "S") {
        $(".dett_fatt_el_S").css("display","inline");
    }else{
        $(".dett_fatt_el_S").css("display","none");
    }
}

function Open_Form_VerifyMailCF(param) {
    var iPosition_Left = 0;
    var iPosition_Top = 0;

    iPosition_Left = ($(window).width() / 2);
    iPosition_Left = iPosition_Left - ($("#elEdit_VerifyCF").width() / 2);

    $("#elEdit_VerifyCF").css('left', iPosition_Left);

    if ($(window).height() < 400)
        $("#elEdit_VerifyCF").height($(window).height() - 100);
    else
        $("#elEdit_VerifyCF").height(400);

    $("#elEdit_VerifyCF").data("overlay").load();

}
function Close_Form_VerifyMailCF() {
    $("#elEdit_VerifyCF").data("overlay").close();
}

function Open_Form_VerifyMailCF_segreteria() {
    var iPosition_Left = 0;
    var iPosition_Top = 0;

    iPosition_Left = ($(window).width() / 2);
    iPosition_Left = iPosition_Left - ($("#elEdit_VerifyCF_seg").width() / 2);

    $("#elEdit_VerifyCF_seg").css('left', iPosition_Left);

    if ($(window).height() < 400)
        $("#elEdit_VerifyCF_seg").height($(window).height() - 100);
    else
        $("#elEdit_VerifyCF_seg").height(400);

    $("#elEdit_VerifyCF_seg").data("overlay").load();

}
function Close_Form_VerifyMailCF_segreteria() {
    $("#elEdit_VerifyCF_seg").data("overlay").close();
}

function countChar(val, sInput, iMax) {

    if (typeof val === 'undefined' || val === null) {

    }else{

        var len = val.value.length;
        if ((len > iMax) && (iCheckSeveritaDatiFt == 2)) {
            //val.value = val.value.substring(0, iMax);
            //$('#stat_'+sInput+' span').text(0);
            $('#stat_'+sInput+' span').text(iMax - len);
            $('#stat_'+sInput).css("color","red");
        } else {
            $('#stat_'+sInput+' span').text(iMax - len);
            $('#stat_'+sInput).css("color","orange");
        }
    }


}
	
    