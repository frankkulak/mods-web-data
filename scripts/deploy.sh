#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run clean:build
npm run clean:deploy
npm run build
node ./scripts/predeploy.cjs

# navigate into the deploy output directory
cd deploy

# create empty repo and commit all changes
git init
git add -A
git commit -m 'Deploy.'

# overwrite the prod branch
git push -f git@github.com:frankkulak/mods-web-data.git HEAD:deploy

# navigate back
cd -
