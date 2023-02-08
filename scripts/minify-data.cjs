const fs = require("fs");
const path = require("path");
const glob = require("glob");

const dataDir = path.resolve(__dirname, "../data");
const minifiedDir = path.resolve(__dirname, "../minified");

glob.sync(path.join(dataDir, "**/*.json")).forEach((filepath) => {
  const dest = path.join(minifiedDir, filepath.replace(dataDir, ""));
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir);
  const data = JSON.parse(fs.readFileSync(filepath).toString());
  delete data.$schema;
  fs.writeFileSync(dest, JSON.stringify(data));
});
