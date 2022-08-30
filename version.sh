#!/usr/bin/bash

npx auto-changelog -p

version=$(node -p -e "require('./package.json').version")

json -I -f demo/package.json -e "this.dependencies['openseadragon-select-plugin']=\"$version\""

git add .