var fs = require('fs');

module.exports = function (context) {
    console.log('Adjustments before compile');

    // adjust version in project properties
    var projectProperties = 'platforms/android/project.properties';
    fs.access(projectProperties, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        fs.readFile(projectProperties, 'utf-8', function (err, data) {
            if (err) console.error(err);
            data = data.replace('com.google.firebase:firebase-core:+', 'com.google.firebase:firebase-core:16.0.8+');
            data = data.replace('com.google.firebase:firebase-messaging:+', 'com.google.firebase:firebase-messaging:17.5.0+');
            data = data.replace('com.google.firebase:firebase-config:+', 'com.google.firebase:firebase-config:16.4.1+');
            data = data.replace('com.google.firebase:firebase-perf:+', 'com.google.firebase:firebase-perf:16.2.4+');
            fs.writeFile(projectProperties, data, 'utf-8', function (err) {
                if (err) console.error(err);
            });
        });
    });

};


fs.copyFileSync("hooks/build-extras.gradle", "platforms/android/build-extras.gradle");