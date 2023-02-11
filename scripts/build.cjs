const fs = require("fs");
const path = require("path");
const glob = require("glob");

const DATA_DIR = path.resolve(__dirname, "../data");
const BUILD_DIR = path.resolve(__dirname, "../build");

//#region Helpers

/**
 * Figures out where the built file should be written to and ensures that all
 * necessary folders exist.
 *
 * @param {string} sourcePath File to source file
 * @returns {string}
 */
function getDestinationPath(sourcePath) {
  const rel = sourcePath.replace(DATA_DIR, "");
  const dest = path.join(BUILD_DIR, rel);
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  return dest;
}

/**
 * Reads the JSON at the given filepath, removes the schema, and writes it to
 * the build directory without any whitespace.
 *
 * @param {string} filepath Path to source file to minify
 */
function minifyJson(filepath) {
  const dest = getDestinationPath(filepath);
  const json = JSON.parse(fs.readFileSync(filepath).toString());
  delete json.$schema;
  fs.writeFileSync(dest, JSON.stringify(json));
}

//#endregion

//#region Build

// minify top-level data
glob.sync(path.join(DATA_DIR, "*.json")).forEach(minifyJson);

// TODO: process mods

//#endregion
