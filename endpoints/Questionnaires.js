const express = require('express'); /* Express library to create Web-server */
const router = express.Router();


const path = require("path")


const ejs = require("ejs");


// Show all available questionnaires as simple buttons
router.get("/", (req, res) => {
    let respBody = "<script defer> function goTo(path){ window.location.href = window.location.pathname + path; console.log(window.location.href) }  </script>";

    router.stack.forEach(
        (r) => {
            if (r.route && r.route.path && r.route.path != "/")
                respBody += `<button onclick="goTo('${r.route.path}')">${r.route.path} </button> <br/>`;
        })

    res.send(`Available questionnaires: <br/> ${respBody}`);
});





/*
Flow Short Scale
 */
router.get("/fss", (req, res) => {
    res.render("questionnaires/FSS.ejs", );
})


/*
NASA TLX completo
 */
router.get("/nasa.tlx", (req, res) => {
    res.render("questionnaires/Nasa_TLX.ejs", );
});


module.exports = router;