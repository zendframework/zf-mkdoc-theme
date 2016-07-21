#!/usr/bin/env bash
# Build assets

SCRIPT_PATH="$(cd "$(dirname "$0")" && pwd -P)"

cd $SCRIPT_PATH/asset
npm install
gulp
perl -pi -e 's/\.[a-z]+"(:)|"|,|^\{\n$|\}/$1/g' ../assets.yml
