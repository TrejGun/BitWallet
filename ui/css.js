// DO NOT replace with IMPORTS, require by brfs static analyzer
const fs = require("fs");
const path = require("path");


// DO NOT optimize, https://github.com/browserify/brfs/issues/36
const cssFiles = {
  // imported fonts should go first
  "typography": fs.readFileSync(path.join(__dirname, "/app/css/output/typography.css"), "utf8"),
  "bootstrap": fs.readFileSync(path.join(__dirname, "../node_modules/bootstrap/dist/css/bootstrap.css"), "utf8"),
  "main": fs.readFileSync(path.join(__dirname, "/app/css/output/index.css"), "utf8"),
};

export default function bundleCss () {
  return Object.keys(cssFiles).reduce(function (bundle, fileName) {
    const fileContent = cssFiles[fileName];
    let output = "";

    output += "/*========== " + fileName + " ==========*/\n\n";
    output += fileContent;
    output += "\n\n";

    return bundle + output;
  }, "");
}
