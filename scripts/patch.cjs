const fs = require("fs");
const path = require("path");
const glob = require("glob");

glob
  .sync(path.resolve(__dirname, "../data/mods/*/index.json"))
  .forEach((filepath) => {
    const buffer = fs.readFileSync(filepath);
    const index = JSON.parse(buffer.toString());
    if (index.status === "working") {
      index.status = "untested";
      fs.writeFileSync(filepath, JSON.stringify(index, null, 2));
    }
  });
