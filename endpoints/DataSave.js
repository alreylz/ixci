const express = require('express');
const router = express.Router();


var GLOBAL_BASE_DIR = null;
var EXP_DATA_SAVEPATH = null;
var Q_SAVEPATH = null;


// CHAPUZA QUE PERMITE INICIALIZAR VARIABLES GLOBALES DE ESTE ARCHIVO USANDO
// E.g., global.__basedir
const initGlobalVariables = setTimeout(() => {
    console.log("-------------------------\nGLOBAL SAVE VARIABLES\n-------------------------".yellow())

    GLOBAL_BASE_DIR = global.__basedir;
    require(`${GLOBAL_BASE_DIR}` + "/js/LogColouring")

    console.log(`\tGLOBAL_BASE_DIR : ${GLOBAL_BASE_DIR}`.blue());

    //SET GLOBAL VARIABLES
    EXP_DATA_SAVEPATH = path.join(`${GLOBAL_BASE_DIR}`, "uploads", `${process.env.EXP_DATA_SAVEPATH}`) //Specifies where to save Experiment Logs within the server.
    Q_SAVEPATH = path.join(`${global.basedir}`, "uploads", `${process.env.Q_SAVEPATH}`);


    console.log(`\tEXP_DATA_SAVEPATH : ${EXP_DATA_SAVEPATH}`.blue());

    console.log(`\tQ_SAVEPATH : ${Q_SAVEPATH}`.blue());


}, 1000);


// Read from .env file
require("dotenv").config()
// Import log colors


const path = require("path")
const fs = require("fs")


const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({limit: "50mb", parameterLimit: 50000, extended: true}));


// ------------------------------------------
// SUBIDA ARCHIVOS (Uso biblioteca multer)
// -----------------------------------------
const multer = require('multer'); // Library to process multipart requests

// A) Storage object
// -> Sets where received files will be stored.
const multerStorageConfiguration =
    multer.diskStorage({
        destination: // Specifies via a function where uploaded files are stored
            async function (req, file, cb) {
                // By default, files are stored in the /uploads folder
                let saveFolder = `${global.__basedir}/uploads`;

                //If 'saveTo' attribute is specified in the request, it means the upload folder must change
                // - the directory/directories are created if not present
                if ("saveTo" in req) {
                    saveFolder = path.join(saveFolder, req.saveTo);
                    req.saveFolder = saveFolder;
                    await fs.promises.mkdir(saveFolder, {recursive: true})
                }

                console.log("\t\tmulter config ".red() + ` - Incoming file will be saved to: ${saveFolder}`.green())

                cb(null, saveFolder);

            },
        filename: //Specifies via a function the naming strategy for the incoming file in the receiving FS
            async function (req, file, cb) {

                let uploadFileName = file.originalname;


                const saveTarget = path.join(req.saveFolder, file.originalname);
                //Check if file exists already and warns that it won't be overwritten (adds suffix)
                if (await checkFileExists(saveTarget)) {
                    console.log(`\t\tCareful! a file with the same name exists: ${saveTarget}.\n\t\tAnother with a suffix will be created`.yellow())

                    let {ext, name} = path.parse(file.originalname);

                    uploadFileName = name + Date.now() + ext;
                }

                cb(null, uploadFileName);
            }
    })


// B) File Filter
/***
 * uploadFileFilterByExtension:
 * Multer configuration function that filters the uploaded files so that only supported extensions
 * can be uploaded (there is an array where the valid extensions are placed)
 * @param req
 * @param file
 * @param callback
 * @returns {*}
 */
function uploadFileFilterByExtension(req, file, callback) {

    const supportedFileExtensions = ["experiment", "png", "jpg", "gif", "json", "txt", "csv"]

    //Extract file extension
    let re = /(?:\.([^.]+))?$/;
    let extension = re.exec(file.originalname);
    console.log(`\t\tReceived file '${file.originalname}' with extension: ${extension[1]}`.yellow());

    //Check if extension is supported
    let success = false;
    for (let idx in supportedFileExtensions) {

        // console.log(`is ${supportedFileExtensions[idx]} === ${extension[1]}`)
        if (extension[1] === supportedFileExtensions[idx]) {

            success = true;
            break;
        }
    }
    if (success === false) callback(new Error(`Attempt to upload file with unsupported extension '${extension[1]}'`), false)

    callback(null, true)
}


// C) Middleware for folder separation
// Middleware que permite guardar los archivos que vienen en una subcarpeta
// (añade un atributo que luego lee multer antes de guardar)
const preuploadMiddlewareExperimentFolderOrganization = (req, res, next) => {

    let experimentName = req.params.experiment;
    req.saveTo = path.join("experiments", experimentName);
    console.log(`preuploadMiddlewareExperimentFolderOrganization -> req.saveTo  set to ${experimentName} `)

    next();
};


// --------------------------------------------------------------
// MAIN MULTER MIDDLEWARE (FOR USE DIRECTLY IN EXPRESS ROUTES)
// --------------------------------------------------------------
const upload = multer({
    storage: multerStorageConfiguration, //Filtro para que solo se acepten ciertas extensiones de archivo.
    fileFilter: uploadFileFilterByExtension
});


/*
********************************************
 ENDPOINTS
********************************************
 */


// NEW
// Saving using UXF tools (see Unity)
router.post('/uxf.save', async function (req, resp) {

    console.log("[UXF IXCI Companion] Received request to" + "/uxf.save".magenta())

    const pathElems = await req.body.fileInfo.split("/")

    let experimentId = pathElems[0]
    let ppId = pathElems[1]
    let seshId = pathElems[2]


    // const uxfLogWritePath = `${__dirname}/${EXP_DATA_SAVEPATH}/${experimentId}/${ppId}/`;
    const uxfLogWritePath = `${EXP_DATA_SAVEPATH}/${experimentId}/${ppId}/`;

    // Crear directorio asociado al experimento (por si no existe)
    await fs.promises.mkdir(uxfLogWritePath, {recursive: true})


    let filename = path.basename(req.body.fileInfo);
    let extname = path.extname(req.body.fileInfo);
    let filenameNoExt = path.basename(filename, extname)


    // Escribir archivo de un participante.
    await fs.promises.writeFile(`${uxfLogWritePath}${filenameNoExt}_${experimentId}_${ppId}${extname}`, req.body.data, function (err) {
        if (err) {
            return console.log("ERROR GUARDANDO ARCHIVO");
        }
    });
    resp.status(200).send({message: ' File correctly received!!'})


});


//TODO: REVISIT
//Receives .experiments files from client and saves it in the server's filesystem.
router.post('/ExpData.save', upload.single('fileFieldName'), function (req, resp) {

    console.log(req.file);
    console.log("Received request to /file.save2")
    if (req.method !== 'POST') {
        resp.status(400).send({message: 'Only POST requests allowed'})
        return;
    }

    //let whereToSave = `${__dirname}/${ED_SAVEPATH}${req.body.filename}.${req.body.type}`;

    console.log("'/file.save2' POST REQUEST received:");
    console.log(req.body);
});


/**
 * Recibe Json y los guarda como un archivo
 */
router.post('/data.save', async function (req, resp) {

    console.log("Received request to /data.save")

    if (req.method !== 'POST') {
        resp.status(400).send({message: 'Only POST requests allowed'})
        return;
    }

    console.log("Obtaining a POST request dude");


    //Procesamiento por chunks hasta completar lo enviado
    let data = '';
    req.on('data', chunk => {
        data += chunk;
    })
    req.on('end', () => {
        console.log(JSON.parse(data));
        resp.end();


    })
    const actualData = JSON.stringify(req.body);
    // = JSON.parse(req.body);
    console.log(actualData);

    await fs.promises.writeFile(`${global.__basedir}/holo.my.json`, actualData, function (err) {
        if (err) {
            return console.log("ERROR GUARDANDO ARCHIVO WTF");
        }
        console.log("GUARDANDO ARCHIVO WTF");
    });


    resp.status(200).send({message: ' JSON Correctly received!!'})


});


//NEW
router.post('/data.save', upload.single('fileFieldName'), async function (req, resp) {

    console.log(" RECEIVED MULTIPART SAVE REQUEST")
    //
    // console.log(req)

    console.log(await req.body.file)

    resp.status(200).send({message: ' File Correctly received!!'})
});


//Endpoint que solo sirve para guardar un único archivo que viene en el cuerpo de la petición
router.post('/experiments/:experiment', [verifyTokenMiddleware, preuploadMiddlewareExperimentFolderOrganization, upload.any()], async function (req, resp) {

    console.log("REQUEST  TO /experiments/:experiment")

    resp.status(200).send({message: ' File Correctly received and saved!!'})
});

// MISMA COSA PERO SIN PROTECCIÓN JWT
router.post('/experiments_nojwt/:experiment', [preuploadMiddlewareExperimentFolderOrganization, upload.any()], async function (req, resp) {

    console.log("REQUEST  TO /experiments/:experiment")

    resp.status(200).send({message: ' File Correctly received and saved!!'})
});


/***
 * JWT Protected endpoints
 */

const jwt = require("jsonwebtoken")


// JWT GENERATION / LOGIN
router.post("/login", (req, res) => {
    const {username, password} = req.body;

    console.log("login request".magenta())


    if (username === "alreylz" && password === "01241851") {

        const jwt_payload = {username};

        const token = jwt.sign(jwt_payload, process.env.JWT_SECRET_KEY, {
            expiresIn: '1h'
        });

        return res.json({username, token, msg: "Login Success"});
    }
    return res.json({msg: "Invalid Credentials"});
});


// Modify the home endpoint as below
// to use the verifyTokenMiddleware
router.post("/protected", verifyTokenMiddleware, (req, res) => {

    const {user} = req;
    res.json({msg: `Welcome ${user.username}`});
});


/**
 * Recibe Json y los guarda como un archivo
 */
router.post('/experiments/:experiment/:ppid/data.save', verifyTokenMiddleware, async function (req, resp) {


    let participantId = req.params.ppid;
    let experiment = req.params.experiment;

    console.log(`[POST] >>Received request to save data for experiment '${experiment}' participant '${participantId}' -> /data.save)`.magenta());

    const actualData = JSON.stringify(req.body);

    console.log(actualData);

    console.log(global.__basedir)

    const dirPath = `${global.__basedir}/uploads/experiments/`;
    const filename = `${experiment}_${participantId}.json`;


    //Create directory if not exists
    await fs.promises.mkdir(dirPath, {recursive: true})
        .then(() => console.log("[DIR INIT] Success on initialising the uploads directory for experiment : \n\t" + `${dirPath}`))
        .catch(() => console.error("[ERROR] Something went wrong initialising directory : " + `${dirPath}`));


    //Save file content
    await fs.promises.writeFile(dirPath + filename, actualData, function (err) {
        if (err) {
            return console.log(`Error guardando archivo ${dirPath}`);
        }
        console.log(`Archivo ${dirPath} guardado correctamente`);
    });

    resp.status(200).send({message: 'JSON POST Success'})


});


router.post("/debugMultipartMessage2", async function (req, res) {


    console.log("DEBUG MULTIPART MESSAGE");


    //Procesamiento por chunks hasta completar lo enviado
    let data = '';
    req.on('data', chunk => {
        data += chunk;
    })
    req.on('end', () => {
        // console.log(JSON.parse(data));
        console.log(data)
        res.end();


    })


});


//Used for testing (saves all received files in a folder in the server side)
router.post("/debugMultipartMessageMultipleFiles", upload.any(), async function (req, res) {


    console.dir("MULTIPART MESSAGE MULTIPLE FILES")

    // console.dir(req)
    console.dir(req.body) // -> Esto contiene los campos que no son archivos

    console.dir(req.files)

    //Procesamiento por chunks hasta completar lo enviado
    let data = '';
    req.on('data', chunk => {
        data += chunk;
    })
    req.on('end', () => {
        // console.log(JSON.parse(data));
        console.log(data)
        res.end();


    })


});


/***
 * HELPER FUNCTIONS
 */

/***
 * Express middleware function that intercepts a request and verifies a jwt
 * @param req the incoming request
 * @param res the response to generate (here of in a subsequent step of the request processing)
 * @param next allows the processing of the request to continue
 * @returns {*}
 */
function verifyTokenMiddleware(req, res, next) {

    const headerNameForAuth = "authorization";

    //Check token is present in request
    if (!headerNameForAuth in req.headers) {
        console.log("verifyTokenMiddleware --> Error No auth header provided".red())
        return res.status(400).json({msg: "No authorization header provided"})
    }

    let token = undefined;

    //Parse Token
    try {
        console.log(req.headers)
        const authorizationHeader = req.headers[headerNameForAuth]
        console.log("authorizationHeader" + authorizationHeader)
        token = parseBearer(authorizationHeader);
    } catch (e) {
        console.log("VerifyToken  Error Parsing auth token".red())
        return res.status(403).json({
            msg: "Error parsing authorization token. Forbidden access"
        });
    }


    //Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.user = decoded;
    } catch (err) {
        return res.status(401).json({
            msg: "Invalid Token"
        });
    }
    next();
};


/***
 * Takes an Authorization header value as "Bearer <actualToken>" and extracts the token itself from it
 * @param bearer the whole
 * @returns {string}
 */
function parseBearer(bearer) {
    console.log("Trying to parse jwt: " + bearer)
    const [_, token] = bearer.trim().split(" ");
    return token;
};


function checkFileExists(file) {
    return fs.promises.access(file, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false)
}

module.exports = router;