const fs = require('fs');
const { $ } = require('protractor');
const xml2js = require('xml2js');
const _ = require('lodash')

// platforms/android/app/src/main/AndroidManifest.xml
try {
  const obj = fs.readFileSync('platforms/android/app/src/main/AndroidManifest.xml', 'utf8')

  xml2js.parseString(obj, (err, result) => {
    if (err) {
      throw new Error('Failed to parse AndroidManifest.xml')
      return;
    }

    result.manifest.application[0] = _.reduce(result.manifest.application[0], (final, d, k) => {
      if (['activity', 'service', 'receiver'].includes(k)) {
        d.forEach((e, i) => {
          if (typeof e['intent-filter'] !== 'undefined') {
            if (typeof e.$['android:exported'] === 'undefined') {
              final[k][i].$['android:exported'] = 'true'
              console.log(`manifest.application.${k}.${i} does have intent-filter, but android:exported is not present, adding android:exported!`)
            } else {
              console.log(`manifest.application.${k}.${i} does have intent-filter, but android:exported already present, skipping...`)
            }
          } else {
            console.log(`manifest.application.${k}.${i} does not have intent-filter, skipping...`)
          }
        });
      }


      return final;
    }, result.manifest.application[0])

    const builder = new xml2js.Builder();
    const xml = builder.buildObject(result);

    // Write config.xml
    fs.writeFileSync('platforms/android/app/src/main/AndroidManifest.xml', xml);
  })
} catch (e) {
  console.log(e)
  throw e;
}