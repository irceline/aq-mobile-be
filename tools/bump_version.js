#!/usr/bin/env node

// Save hook under `project-root/hooks/before_prepare/`
//
// Don't forget to install xml2js using npm
// `$ npm install xml2js`
// tested with Cordova 7.0.1 & Ionic 3.7.0

var fs = require('fs');
var xml2js = require('xml2js');
var args = process.argv.slice(2);

if (!args || args.length == 0) {
    throw new Error("Arg build number needed")
}

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

// Read config.xml
fs.readFile('config.xml', 'utf8', function(err, data) {
    if(err) {
        return console.log(err);
    }

    // Get XML
    var xml = data;

    // Parse XML to JS Obj
    xml2js.parseString(xml, function (err, result) {
        if(err) {
            return console.log(err);
        }

        let versionCode;

        if(typeof result['widget']['$']['version'] === 'undefined') {
            versionCode = ['0', '0', '1']
            versionCode.splice(3, 1, args[0])
        } else {
            let v = result['widget']['$']['version'].split('.');
            versionCode = v
            versionCode.splice(3, 1, args[0])
        }

        result['widget']['$']['ios-CFBundleVersion'] = versionCode.join('.');
        result['widget']['$']['android-versionCode'] = versionCode.map((d, i) => {
            if (i == versionCode.length - 1) {
                return pad(d, 4);
            }

            return d
        }).join('');

        // Build XML from JS Obj
        var builder = new xml2js.Builder();
        var xml = builder.buildObject(result);

        // Write config.xml
        fs.writeFile('config.xml', xml, function(err) {
            if(err) {
                return console.log(err);
            }

            console.log(versionCode.join('.'))
        });

    });
});