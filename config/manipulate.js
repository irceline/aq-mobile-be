var fs = require('fs'),
  path = require('path'),
  filePath = path.join(__dirname, '../node_modules/helgoland-toolbox/dist/index.js');

console.log('manipulate toolbox index file...');

fs.readFile(filePath, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace('export { HelgolandPlotlyGraphModule', '//');

  fs.writeFile(filePath, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});
