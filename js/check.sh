#!/bin/bash
set -e

# Before you run it for the first time:
# ------------------------
# npm i es-check
# sudo apt-get install duktape


function show_md5 {
    unamestr=$(uname)
    if [ "$unamestr" = 'Linux' ]; then
        md5sum "$1"
    else
        md5 -r "$1"
    fi
}

function check_it {
    npm_config_offline=true timeout 5s npx es-check "$1" "$2"
    npm_config_offline=true timeout 5s npx es-check "$1" "$2" --module
}


check_it es6 dist/RussianNouns.umd.js

echo
node --trace-uncaught testAPI.js dist/RussianNouns.umd.js

echo
echo
check_it es5 dist/RussianNouns.es5.js

echo
echo 'Using "dist/RussianNouns.es5.js"'
echo
cat dist/RussianNouns.es5.js testAPI.js | node --trace-uncaught

echo -e "\nDuktape with core-js:"
duk third-party/core-js-bundle/minified.js dist/RussianNouns.es5.js dukTest.js

echo
show_md5 dist/RussianNouns.umd.js
show_md5 dist/RussianNouns.es5.js

# `set -e` at the top of the script ensures that the script
# does not reach this line if the tests are failed.
echo -e "\n  All tests passed!\n"

