const fs = require("fs");
const path = require("path");
const { sync: globSync } = require("glob");

const ROOT_DIR = path.resolve(__dirname, "..");
const DEPLOY_DIR = path.join(ROOT_DIR, "deploy");

// generate .gitignore
fs.writeFileSync(path.join(DEPLOY_DIR, ".gitignore"), ".DS_Store");

const filesToCopy = [
  ...globSync(path.join(ROOT_DIR, "build/**/*")),
  ...globSync(path.join(ROOT_DIR, "images/**/*")),
  ...globSync(path.join(ROOT_DIR, "thumbnails/**/*")),
];

filesToCopy.forEach((srcPath) => {
  if (fs.lstatSync(srcPath).isDirectory()) return;
  const dstPath = srcPath.replace(ROOT_DIR, DEPLOY_DIR);
  const dstDir = path.dirname(dstPath);
  if (!fs.existsSync(dstDir)) fs.mkdirSync(dstDir, { recursive: true });
  fs.copyFileSync(srcPath, dstPath);
});
