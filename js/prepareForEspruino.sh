#!/bin/bash
set -e

# Windows-1251 хороша тем, что в ней буквы русского алфавита идут
# в том же порядке, как в Юникоде, за исключением буквы Ё.

iconv -f UTF-8 -t CP1251 dist/RussianNouns.es5.js > dist/RussianNouns.es5.CP1251.js

RESULT=RN.js

cat polyfills.js \
    dist/RussianNouns.es5.CP1251.js > "$RESULT"
echo 'module.exports = RussianNouns;' >> "$RESULT"

echo "Saved to RN.js"

