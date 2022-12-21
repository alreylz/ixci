const express = require('express'); /* Express library to create Web-server */
const router = express.Router();


const path = require("path")
const fs = require("fs")


// NEW
// Saving using UXF tools (see Unity)
router.post('/uxf.save', async function (req, resp) {

    console.log("Received request to /uxf.save")

    if (req.method !== 'POST') {
        resp.status(400).send({message: 'Only POST requests allowed'})
        return;
    }

    //let whereToSave = `${__dirname}/${ED_SAVEPATH}${req.body.filename}.${req.body.type}`;

    console.log(req.body);

    // try {
    const pathElems = req.body.fileInfo.split("/")

    let experimentId = pathElems[0]
    let ppId = pathElems[1]
    let seshId = pathElems[2]


    const uxfLogWritePath = `${__dirname}/${EXP_DATA_SAVEPATH}/${experimentId}/${ppId}/`;


    console.log(` Escribiendo archivo `)

    // Crear directorio asociado al experimento (que normalmente existe)
    await fs.promises.mkdir(uxfLogWritePath, {recursive: true})


    let filename = path.basename(req.body.fileInfo);
    let extname = path.extname(req.body.fileInfo);
    let filenameNoExt = path.basename(filename, extname)


    // Escribir archivo de un participante.
    await fs.promises.writeFile(`${uxfLogWritePath}${filenameNoExt}_${experimentId}_${ppId}${extname}`, req.body.data,
        function (err) {
            if (err) {
                return console.log("ERROR GUARDANDO ARCHIVO");
            }
        });
    resp.status(200).send({message: ' File correctly received!!'})


});