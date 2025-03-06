const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { queries: imagesQueries } = require('./all_questions');

const generatorEndpoint = process.env.REACT_APP_API_ORIGIN_ENDPOINT || 'http://localhost:3000';

const app = express();
app.disable('x-powered-by');
const port = 8003;

var language = 'undefined';

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

//La funcion getQueriesAndQuestion vuelca el all_questions en generalQueries
function getQueriesAndQuestions(imagesQueries){
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
    queries = generalQueries[thematic];
    queries = queries[language];
}

function getAllValues() {
    let results = [];
    for (let thematic in generalQueries) {
        let thematicQueries = generalQueries[thematic];
        if (thematicQueries[language]) {
            results = results.concat(thematicQueries[language]);
        }
    }
    return results;
}

// Obtener y procesar la pregunta
async function generarPregunta() {
    randomNumber = crypto.randomInt(0, queries.length);
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

        procesarDatos(response.data);

    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        throw new Error('Error al obtener datos ' + error);
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

// Ruta para generar una nueva pregunta
app.get('/generateQuestion', async (req, res) => {
    try {
        language = req.query.language;
        queries = [];
        if (numberOfQuestions == 0) {
            gameId = null;
        }
        const user = req.query.user;
        await getQueriesByThematic(req.query.thematic);
        await generarPregunta();
        numberOfQuestions++;
        if (numberOfQuestions >= maxQuestions) {
            numberOfQuestions = 0;
        }

        // Respuesta con la pregunta y las opciones
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

// Iniciar servidor
app.listen(port, () => {
    console.log(`Questions Generation Service listening at http://localhost:${port}`);
});
