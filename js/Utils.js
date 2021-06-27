//Given a url, posts a json comprised of filename and the data that will go inside the saved file.
async function postJsonFileToRemote(url, name, jsonObj, filetype="json") {

    
    await fetch(url.toString(), {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },

        
        body: JSON.stringify({
            filename: name, 
            type: filetype,
            data: jsonObj
        })
    })
        .then((response) => {
            //do something awesome that makes the world a better place
        })
}




//Creates an object with as many keys as variables passed in the url.
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}