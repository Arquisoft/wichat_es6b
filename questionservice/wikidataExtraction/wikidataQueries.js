const wikidata = require("./wikidataConnexion");

class WikiQueries {

    static regExp = /^Q\d+$/; // Expresión regular para filtrar las etiquetas del tipo "Q1234"

    static async query(){ 
        console.log("Países y Monumentos");
        const query = `
        SELECT ?monumentLabel ?countryLabel WHERE {
            ?monument wdt:P31 wd:Q570116; wdt:P17 ?country.
            SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
        } 
        LIMIT 2500
        `;

        const results = await wikidata.consulta(query);
        // console.log(results)
        return results.filter(function(element) {
            const monumentOk = !WikiQueries.regExp.test(element.monumentLabel);
            const countryOk = !WikiQueries.regExp.test(element.countryLabel);
            return countryOk && monumentOk;
        });

    }
}


module.exports = WikiQueries