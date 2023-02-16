const express = require('express'); /* Express library to create Web-server */
const router = express.Router();

require("dotenv");
const path = require("path")


/* SUPPORTED URL PATTERNS */
router.get('/', function (req, res) {
    //console.log(`[GET] Accessed monitor page from IP ${req.ip}`);
    // res.sendFile(path.join(__dirname, '../html/cPageRemake.html'));


    const ENV = {ip : process.env.IP, port: process.env.port}
     res.render("main/ixci-panel.ejs", {ENV});



});


router.get('/home', function (req, res) {
    res.sendFile(path.join(__dirname, '../html/home.html'));
});


module.exports = router;