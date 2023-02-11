const fs = require("fs");
const path = require("path");
const glob = require("glob");

const BUILD_DIR = path.resolve(__dirname, "../build");
const DATA_DIR = path.resolve(__dirname, "../data");
const MODS_DATA_DIR = path.join(DATA_DIR, "mods");
const MODS_BUILD_DIR = path.join(BUILD_DIR, "mods");

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
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dest;
}

/**
 * Parses the content of the give JSON file into an object.
 *
 * @param {string} filepath Path to JSON file
 * @returns {object}
 */
function parseJsonFile(filepath) {
  return JSON.parse(fs.readFileSync(filepath).toString());
}

/**
 * Reads the JSON at the given filepath, removes the schema, and writes it to
 * the build directory without any whitespace.
 *
 * @param {string} filepath Path to source file to minify
 */
function minifyJson(filepath) {
  const dest = getDestinationPath(filepath);
  const json = parseJsonFile(filepath);
  delete json.$schema;
  fs.writeFileSync(dest, JSON.stringify(json));
}

/**
 * Gets the names of all subdirs in the given dir.
 *
 * @param {string} dir Full path to dir to search
 * @returns List of subdir names
 */
function getSubdirs(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

//#endregion

//#region Build

// minify top-level data
glob.sync(path.join(DATA_DIR, "*.json")).forEach(minifyJson);

// process individual mod data
const modDataMap = new Map();
getSubdirs(MODS_DATA_DIR).forEach((modId) => {
  // load index JSON
  const indexPath = path.join(MODS_DATA_DIR, modId, "index.json");
  const indexJson = parseJsonFile(indexPath);
  modDataMap.set(modId, indexJson);

  // transform for prod
  delete indexJson.$schema;
  indexJson.pages.forEach((page) => {
    const htmlPath = path.join(MODS_DATA_DIR, modId, page.html);
    const htmlContent = fs.readFileSync(htmlPath).toString();
    page.html = htmlContent;
  });

  // write index
  const dest = path.join(MODS_BUILD_DIR, `${modId}.json`);
  if (!fs.existsSync(MODS_BUILD_DIR)) fs.mkdirSync(MODS_BUILD_DIR);
  fs.writeFileSync(dest, JSON.stringify(indexJson));
});

// process and transform overall mod index
(() => {
  // loading JSON
  const modIndexPath = path.join(MODS_DATA_DIR, "index.json");
  const modIndexJson = parseJsonFile(modIndexPath);
  delete modIndexJson.$schema;

  // adding display data
  modIndexJson.displayData = {};
  modDataMap.forEach((modData, modId) => {
    modIndexJson.displayData[modId] = {
      description: modData.description,
      lastUpdated: modData.lastUpdated,
      name: modData.name,
      status: modData.status,
      version: modData.version,
    };
  });

  // writing index
  const dest = getDestinationPath(modIndexPath);
  fs.writeFileSync(dest, JSON.stringify(modIndexJson));
})();

//#endregion
