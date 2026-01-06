#!/bin/bash
set -e

# Before you run it for the first time:
# ------------------------
# npm i es-check
# npm i uglify-js
# npm i @babel/cli
# npm i @babel/preset-env
# sudo apt-get install duktape


function show_md5 {
    unamestr=$(uname)
    if [ "$unamestr" = 'Linux' ]; then
        md5sum "$1"
    else
        md5 -r "$1"
    fi
}

function minify_it {
    npx uglifyjs \
            --mangle \
            --compress passes=2 \
            --beautify indent_level=4 \
            --comments "/@license|@preserve|^!/" \
            --output "$2" -- "$1"

    ls -l "$2"

    # Replacing spaces with tabs (for compactness)...
    unexpand -t 4 "$2" > mintemp.js

    # Removing spaces from the switch-case...
    sed -i 's/\t  case /\tcase /' mintemp.js
    sed -i 's/\t  default/\tdefault/' mintemp.js

    # Removing trailing spaces...
    sed -i 's/\s\+$//' mintemp.js

    # Fixing "No newline at end of file"
    # https://unix.stackexchange.com/a/31955
    sed -i -e '$a\' mintemp.js

    mv mintemp.js "$2"

    ls -l "$2"
}

function transpile_it {
    npx babel "$1" -o "$2" --no-babelrc --presets="@babel/preset-env"
    ls -l "$2"

    unexpand -t 2 "$2" | expand -t 4 > es5-4spaces-temp.js
    sed -i 's/^    RussianNounsJS/  RussianNounsJS/' es5-4spaces-temp.js
    sed -i 's/^    Copyright (c)/  Copyright (c)/'   es5-4spaces-temp.js
    sed -i 's/^    Released under/  Released under/' es5-4spaces-temp.js
    sed -i 's/^\/\*\!/\n\/\*\!/'                     es5-4spaces-temp.js

    mv es5-4spaces-temp.js "$2"
    ls -l "$2"
}

function check_it {
    npx es-check "$1" "$2"
    npx es-check "$1" "$2" --module
}


check_it es6 RussianNouns.js
ls -l RussianNouns.js

minify_it RussianNouns.js RussianNouns.min.js
show_md5 RussianNouns.js
show_md5 RussianNouns.min.js

echo
node --trace-uncaught testAPI.js RussianNouns.js

echo -e "\nTranspiling to ES5...\n"
transpile_it RussianNouns.js RussianNouns-es5.js
check_it es5 RussianNouns-es5.js
show_md5 RussianNouns-es5.js

echo
node --trace-uncaught testAPI.js RussianNouns-es5.js

echo -e "\nDuktape with core-js:"
duk third-party/core-js-bundle/minified.js RussianNouns-es5.js dukTest.js

echo
show_md5 RussianNouns.js
show_md5 RussianNouns.min.js
show_md5 RussianNouns-es5.js

# `set -e` at the top of the script ensures that the script
# does not reach this line if the tests are failed.
echo -e "\n  All tests passed!\n"

