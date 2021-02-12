const request = require('request');
const async = require('async');
const fs = require('fs');

// Scrape Website of Belgium Post for Zipcodes
const nl_url = "http://www.bpost2.be/zipcodes/files/zipcodes_num_nl_new.html";

// Nominatim rever lookup server.
// NEVER POINT THIS AT THE OFFICIAL openstreetmap.nominatim.org SERVER! THIS WOULD VIOLATE THE TOS.
const nominatim_search_url = "http://localhost:7070/search?format=json&limit=5&q=";
const nominatim_details_url = "http://localhost:7070/details?format=json&place_id=";

// Pattern for extracting zipcode<->name pairs from belgium post website
// Selects only pairs that have Teilgemeinde as other postcodes are only administrative (and hard to lookup in nominatim)
const pattern = "(?:<td class=\"column0 style8 n\">)([0-9]{4})(?:<\/td>)(?:<td class=\"column1 style6 s\">)([^<]*)(?:<\/td>)(?:<td class=\"column2 style6 s\">)(?:[^<]+)(?:<\/td>)";

// Run Program in waterfall mode
async.waterfall([
    init,
    getLocations,
    nominatimLookup
], function (err, result) {
    console.log(err);
    console.log(result);
});

// Initialize Variables
function init(callback) {
    let list = [];
    callback(null, list);
};

function getLocations(list, callback) {
    request(nl_url, {}, (err, res, body) => {
        if (err) {
            callback(err);
        }
        // Selectively remove whitespace
        data = body.replace(/>\s+</g, '><');
        let split = data.split("</tr>");
        split.forEach((elem) => {
            let result = elem.match(pattern);
            if (result != undefined) {
                let name = unescape(result[2]);
                if (name.includes("&")) {
                    callback("Error: Failed to unescape(): " + name);
                } else {
                    list.push(
                        result[1] + "__" + name
                    );
                }
            };
        });
        console.log("Get locations");
        callback(null, list);
    });
}

function nominatimLookup(list) {
    let lookupList = [];
    let idCounter = 0;
    async.eachLimit(list, 1, (elem, callback) => {
        const city = elem.split('__')[1];
        const postalcode = elem.split('__')[0];
        const url = `http://localhost:7070/search?city=${city}&postalcode=${postalcode}&addressdetails=1&namedetails=1`;
        request(url, {}, (err, res, body) => {
            if (err) {
                console.log(err);
                callback(err);
            }
            const resJson = JSON.parse(body);
            if (resJson instanceof Array && resJson.length > 0) {
                let citymatch;
                citymatch = resJson.find(e => e.place_rank === 16);
                if (!citymatch) {
                    citymatch = resJson[0]
                }
                const result = parseSearchResult(citymatch, city, postalcode, url);
                if (result) {
                    result.id = idCounter++;
                    lookupList.push(result);
                }
                if ((idCounter % 100) === 0) {
                    console.log(`Created ${idCounter} of ${list.length}`);
                }
                callback();
            } else {
                callback();
            }
        });
    }, function (err) {
        if (err != null) {
            console.log(err)
        } else {
            fs.writeFileSync("./src/assets/locations.json", JSON.stringify(lookupList, null, 4));
        }
    })
}

/**
 * Converts textual html entities into decimal form.
 * Conversion taken from http://www.javascripter.net/faq/accentedcharacters.htm
 * @param {C} string 
 */
function unescape(string) {
    return string
        .replace(/&eacute;/g, "%C3%A9")
        .replace(/&Eacute;/g, "%C3%89")

        .replace(/&ccedil;/g, "%C3%A7")
        .replace(/&Ccedil;/g, "%C3%87")

        .replace(/&egrave;/g, "%C3%A8")
        .replace(/&Egrave;/g, "%C3%88")
        .replace(/&agrave;/g, "%C3%A0")
        .replace(/&Agrave;/g, "%C3%80")

        .replace(/&ocirc;/g, "%C3%B4")
        .replace(/&ecirc;/g, "%C3%AA")
        .replace(/&Ecirc;/g, "%C3%8A")
        .replace(/&ucirc;/g, "%C3%BB")
        .replace(/&Ucirc;/g, "%C3%9B")
        .replace(/&acirc;/g, "%C3%A2")
        .replace(/&Acirc;/g, "%C3%82");
}

function parseSearchResult(e, city, postalcode, url) {
    try {
        const labelNl = decodeURI(e.namedetails['name:nl'] || city);
        const labelFr = decodeURI(e.namedetails['name:fr'] || city);
        const labelEn = decodeURI(e.namedetails['name:en'] || city);
        const labelDe = decodeURI(e.namedetails['name:de'] || city);
        return {
            label: {
                fr: labelFr,
                nl: labelNl,
                en: labelEn,
                de: labelDe
            },
            postalcode: postalcode,
            latitude: parseFloat(e.lat),
            longitude: parseFloat(e.lon),
            // url: `https://nominatim.openstreetmap.org/ui/details.html?osmtype=R&osmid=${e.osm_id}`,
            // place_rank: e.place_rank
        };
    } catch (error) {
        console.error(`Error while parsing: ${city} with ${url}`);
        return;
    }
}