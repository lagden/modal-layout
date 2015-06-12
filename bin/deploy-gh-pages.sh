#!/bin/bash

set -e
rm -rf build || exit 0;
grunt build
cd build
git init
git config user.name "Travis-CI"
git config user.email "travis@lagden.in"
git add .
git commit -m "Deploy to GitHub Pages"
git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1
