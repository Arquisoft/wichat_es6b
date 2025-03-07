const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { queries: imagesQueries } = require('./all_questions.js');

const generatorEndpoint = process.env.REACT_APP_API_ORIGIN_ENDPOINT || 'http://localhost:3000';

const app = express();
app.disable('x-powered-by');
const port = 8003;

const frontendUrl = 'http://localhost:3000';  // Asegúrate de que sea el puerto correcto donde está corriendo el frontend

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', frontendUrl);  // Asegúrate de permitir el acceso desde el frontend
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

var language = 'es'; // Valor por defecto es 'es' (español)

// Middleware to parse JSON in request body
app.use(bodyParser.json());

// Permitir peticiones desde Game
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', generatorEndpoint);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Consultas generales
var generalQueries = getQueriesAndQuestions(imagesQueries);

var correctOption = "";
var options = [];
var question = "";
var image = "";
var url = 'https://query.wikidata.org/sparql';
var randomNumber;

const maxQuestions = 5;
var numberOfQuestions = 0;

// La funcion getQueriesAndQuestion vuelca el all_questions en generalQueries
function getQueriesAndQuestions(imagesQueries) {
    var generalQueries = [];
    for (const lang in imagesQueries) {
        for (const categoria in imagesQueries[lang]) {
            for (const [query, pregunta] of imagesQueries[lang][categoria]) {
                generalQueries.push([categoria, query.trim(), pregunta]);
            }
        }
    }
    return generalQueries;
}

// Consultas por tema
async function getQueriesByThematic(thematic) {
    if (thematic == "Geografia") {
        changeQueriesAndQuestions("Geografia");
    } else if (thematic == "Cultura") {
        changeQueriesAndQuestions("Cultura");
    } else if (thematic == "Informatica") {
        changeQueriesAndQuestions("Informatica");
    } else if (thematic == "Personajes") {
        changeQueriesAndQuestions("Personajes");
    } else {
        queries = getAllValues();
    }
}

function changeQueriesAndQuestions(thematic) {
    // Aquí seleccionamos el idioma y el tema correctamente
    queries = imagesQueries[language][thematic];
}

function getAllValues() {
    let results = [];
    for (let thematic in imagesQueries) {
        let thematicQueries = imagesQueries[thematic];
        if (thematicQueries[language]) {
            results = results.concat(thematicQueries[language]);
        }
    }
    return results;
}

/// Obtener y procesar la pregunta
async function generarPregunta() {
    // Verificar si queries está vacío
    if (queries.length === 0) {
        throw new Error("No hay preguntas disponibles. Verifica que las queries se estén cargando correctamente.");
    }

    // Generar un número aleatorio solo si queries tiene preguntas
    randomNumber = crypto.randomInt(0, queries.length);  // Generamos un índice aleatorio de la lista de queries

    try {
        // Petición a la API de WikiData
        var response = await axios.get(url, {
            params: {
                query: queries[randomNumber][0],
                format: 'json'
            },
            headers: {
                'Accept': 'application/sparql-results+json'
            }
        });

        procesarDatos(response.data);  // Procesamos los datos recibidos

    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        throw new Error('Error al obtener datos: ' + error);
    }
}

function procesarDatos(data) {
    // Limpiar opciones previas
    options = [];
    var data = data.results.bindings;
    var randomIndexes = [];
    var optionsSelected = [];

    // Obtener 4 índices aleatorios
    while (randomIndexes.length < 4) {
        var randomIndex = crypto.randomInt(0, data.length);
        var option = data[randomIndex].optionLabel.value;
        var quest = "";

        if ('questionLabel' in data[randomIndex]) {
            quest = data[randomIndex].questionLabel.value;
        }

        if (!randomIndexes.includes(randomIndex) && (quest == "" || (!(option.startsWith("Q") || option.startsWith("http"))
            && !(quest.startsWith("Q") || quest.startsWith("http")))) && !optionsSelected.includes(option)) {
            randomIndexes.push(randomIndex);
            optionsSelected.push(option);
        }
    }

    // Escoger la opción correcta
    var correctIndex = crypto.randomInt(0, 4);
    correctOption = data[randomIndexes[correctIndex]].optionLabel.value;

    if (quest == "") {
        question = queries[randomNumber][1];
        image = data[randomIndexes[correctIndex]].imageLabel.value;
    } else {
        image = "";
        questionValue = data[randomIndexes[correctIndex]].questionLabel.value;
        question = queries[randomNumber][1] + questionValue + "?";
    }

    // Organizar las opciones
    for (let i = 0; i < 4; i++) {
        let optionIndex = randomIndexes[i];
        let option = data[optionIndex].optionLabel.value;
        options.push(option);
    }
}


function procesarDatos(data) {
    // Limpiar opciones previas
    options = [];
    var data = data.results.bindings;
    var randomIndexes = [];
    var optionsSelected = [];

    // Obtener 4 índices aleatorios
    while (randomIndexes.length < 4) {
        var randomIndex = crypto.randomInt(0, data.length);
        var option = data[randomIndex].optionLabel.value;
        var quest = "";

        if ('questionLabel' in data[randomIndex]) {
            quest = data[randomIndex].questionLabel.value;
        }

        if (!randomIndexes.includes(randomIndex) && (quest == "" || (!(option.startsWith("Q") || option.startsWith("http"))
            && !(quest.startsWith("Q") || quest.startsWith("http")))) && !optionsSelected.includes(option)) {
            randomIndexes.push(randomIndex);
            optionsSelected.push(option);
        }
    }

    // Escoger la opción correcta
    var correctIndex = crypto.randomInt(0, 4);
    correctOption = data[randomIndexes[correctIndex]].optionLabel.value;

    if (quest == "") {
        question = queries[randomNumber][1];
        image = data[randomIndexes[correctIndex]].imageLabel.value;
    } else {
        image = "";
        questionValue = data[randomIndexes[correctIndex]].questionLabel.value;
        question = queries[randomNumber][1] + questionValue + "?";
    }

    // Organizar las opciones
    for (let i = 0; i < 4; i++) {
        let optionIndex = randomIndexes[i];
        let option = data[optionIndex].optionLabel.value;
        options.push(option);
    }
}


function procesarDatos(data) {
    // Limpiar opciones previas
    options = [];
    var data = data.results.bindings;
    var randomIndexes = [];
    var optionsSelected = [];

    // Obtener 4 índices aleatorios
    while (randomIndexes.length < 4) {
        var randomIndex = crypto.randomInt(0, data.length);
        var option = data[randomIndex].optionLabel.value;
        var quest = "";

        if ('questionLabel' in data[randomIndex]) {
            quest = data[randomIndex].questionLabel.value;
        }

        if (!randomIndexes.includes(randomIndex) && (quest == "" || (!(option.startsWith("Q") || option.startsWith("http"))
            && !(quest.startsWith("Q") || quest.startsWith("http")))) && !optionsSelected.includes(option)) {
            randomIndexes.push(randomIndex);
            optionsSelected.push(option);
        }
    }

    // Escoger la opción correcta
    var correctIndex = crypto.randomInt(0, 4);
    correctOption = data[randomIndexes[correctIndex]].optionLabel.value;

    if (quest == "") {
        question = queries[randomNumber][1];
        image = data[randomIndexes[correctIndex]].imageLabel.value;
    } else {
        image = "";
        questionValue = data[randomIndexes[correctIndex]].questionLabel.value;
        question = queries[randomNumber][1] + questionValue + "?";
    }

    // Organizar las opciones
    for (let i = 0; i < 4; i++) {
        let optionIndex = randomIndexes[i];
        let option = data[optionIndex].optionLabel.value;
        options.push(option);
    }
}

// Ruta para generar una nueva pregunta aleatoria
app.get('/generateQuestion', async (req, res) => {
    try {
        // Verificar si se recibió un lenguaje, y asignar 'es' por defecto
        language = req.query.language || 'es';  // Aquí asignamos un valor por defecto

        // Verificar que el idioma sea válido
        if (!imagesQueries[language]) {
            throw new Error(`El idioma ${language} no está soportado.`);
        }

        queries = []; // Limpiar las queries para cargar solo las actuales
        await getQueriesByThematic(req.query.thematic);  // Cargar las queries por temática
        await generarPregunta();  // Generar una nueva pregunta aleatoria

        // Crear la respuesta con la pregunta, opciones y la respuesta correcta
        const response = {
            responseQuestion: question,
            responseOptions: options,
            responseCorrectOption: correctOption,
            responseImage: image,
        };

        res.status(200).json(response);  // Enviar la respuesta como JSON
    } catch (error) {
        res.status(400).json({ error: error.message });  // Enviar error si ocurre uno
    }
});

// Ruta para generar automáticamente una nueva pregunta cada vez que se responde la anterior
app.get('/nextQuestion', async (req, res) => {
    try {
        language = req.query.language || 'es'; // Asegurar que haya un lenguaje por defecto
        queries = [];
        
        if (numberOfQuestions === 0) {
            gameId = null;
        }

        await getQueriesByThematic(req.query.thematic);
        await generarPregunta();
        numberOfQuestions++;

        if (numberOfQuestions >= maxQuestions) {
            numberOfQuestions = 0;
        }

        // Enviar la pregunta generada automáticamente
        var response = {
            responseQuestion: question,
            responseOptions: options,
            responseCorrectOption: correctOption,
            responseImage: image,
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Ruta para la raíz
app.get("/", (req, res) => {
    res.send("Bienvenido al servicio de generación de preguntas");

});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Questions Generation Service listening at http://localhost:${port}`);
});


app.get('/startGame', async (req, res) => {
    try {
        res.send("Preguntas juego")
        language = req.query.language || 'es'; // Idioma por defecto
        queries = [];

        if (numberOfQuestions === 0) {
            gameId = null;
        }

        await getQueriesByThematic(req.query.thematic);
        await generarPregunta();
        numberOfQuestions++;

        if (numberOfQuestions >= maxQuestions) {
            numberOfQuestions = 0;
        }

        // Crear el objeto de la pregunta
        const response = {
            responseQuestion: question,
            responseOptions: options,
            responseCorrectOption: correctOption,
            responseImage: image,
        };

        // Emitir la pregunta a todos los clientes conectados
        io.emit('newQuestion', response);

        res.status(200).json({ message: "Pregunta enviada a los clientes" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});




