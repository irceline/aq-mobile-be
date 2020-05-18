var fs = require('fs');

// Fixes following issue while build optimized TODO: check if can be removed after upgrade to ng 8
// ERROR in ./node_modules/ionic4-auto-complete/fesm5/ionic4-auto-complete.js
// Module build failed (from ./node_modules/@angular-devkit/build-optimizer/src/build-optimizer/webpack-loader.js):
// TypeError: Cannot read property 'kind' of undefined
const scrubFilePath = "node_modules/@angular-devkit/build-optimizer/src/transforms/scrub-file.js";
if (fs.existsSync(scrubFilePath)) {
    fs.readFile(scrubFilePath, 'utf8', function (err, obj) {
        // find and replace fragment
        const replaced = obj.replace(
            'decorateArray.elements[1].kind !== ts.SyntaxKind.CallExpression', 
            'decorateArray.elements.length <= 1 || decorateArray.elements[1].kind !== ts.SyntaxKind.CallExpression'
            );
        fs.writeFile(scrubFilePath, replaced, (error) => {
            if (error) { console.error(error); }
        });
    });
}