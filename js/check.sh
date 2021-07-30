#!/bin/bash
set -e

# npm i es-check
# npm i uglify-es

#   To run in on ES6 engine,
#   you will need at least polyfills for:
#
#       • Array.prototype.includes
#       • Object.values

npx es-check --module es6 RussianNouns.js

ls -l RussianNouns.js

npx uglifyjs \
        --mangle \
        --compress passes=2 \
        --beautify indent_level=4,bracketize=true,ecma=6 \
        --comments "/@license|@preserve|^!/" \
        --output RussianNouns.min.js -- RussianNouns.js

ls -l RussianNouns.min.js

unexpand -t 4 RussianNouns.min.js > RussianNouns.min.temp.js
mv RussianNouns.min.temp.js RussianNouns.min.js

ls -l RussianNouns.min.js

node --trace-uncaught testAPI.js
