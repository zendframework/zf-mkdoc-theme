#!/usr/bin/env bash
# Build assets

SCRIPT_PATH="$(cd "$(dirname "$0")" && pwd -P)"

cd $SCRIPT_PATH/asset
rm package-lock.json
npm install --no-save

# Running each task separately due to concurrency issues when run
# at once via `gulp`
gulp images
gulp icons
gulp scripts
gulp styles

perl -pi -e 's/\.[a-z]+"(:)|"|,|^\{\n$|\}/$1/g' ../assets.yml
