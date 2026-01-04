#!/bin/bash
set -e

# Before you run it for the first time, install this (as a non-root user):
# ------------------------
# npm i es-check
# npm i uglify-js
# npm i @babel/cli
# npm i @babel/preset-env


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
npx babel RussianNouns.js -o RussianNouns-es5.js --no-babelrc --presets="@babel/preset-env"
ls -l RussianNouns-es5.js

unexpand -t 2 RussianNouns-es5.js | expand -t 4 > RussianNouns-es5-4spaces.js
mv RussianNouns-es5-4spaces.js RussianNouns-es5.js
ls -l RussianNouns-es5.js

check_it es5 RussianNouns-es5.js
show_md5 RussianNouns-es5.js

echo
node --trace-uncaught testAPI.js RussianNouns-es5.js

echo
show_md5 RussianNouns.js
show_md5 RussianNouns.min.js
show_md5 RussianNouns-es5.js

# `set -e` at the top of the script ensures that the script
# does not reach this line if the tests are failed.
echo -e "\n  All tests passed!\n"

