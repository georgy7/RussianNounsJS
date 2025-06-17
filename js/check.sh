#!/bin/bash
set -e

# Before you run it first time !!!!!!!!!
# npm i es-check
# npm i uglify-es
# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

#   To run in on ES6 engine,
#   you will need at least polyfills for:
#
#       • Array.prototype.includes
#       • Object.values

npx es-check es6 RussianNouns.js --module

ls -l RussianNouns.js

uglifyjs \
        --mangle --module \
        --compress passes=2 \
        --beautify indent_level=4 \
        --comments "/@license|@preserve|^!/" \
        --output RussianNouns.min.js -- RussianNouns.js

ls -l RussianNouns.min.js

# Replacing spaces with tabs (for compactness)...
unexpand -t 4 RussianNouns.min.js > RussianNouns.min.temp.js

# Removing spaces from the switch-case...
sed -i 's/\t  case /\tcase /' RussianNouns.min.temp.js
sed -i 's/\t  default/\tdefault/' RussianNouns.min.temp.js

# Removing trailing spaces...
sed -i 's/\s\+$//' RussianNouns.min.temp.js

# Fixing "No newline at end of file"
# https://unix.stackexchange.com/a/31955
sed -i -e '$a\' RussianNouns.min.temp.js

mv RussianNouns.min.temp.js RussianNouns.min.js

ls -l RussianNouns.min.js

node --trace-uncaught testAPI.js
