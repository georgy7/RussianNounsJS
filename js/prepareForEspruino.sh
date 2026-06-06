#!/bin/bash
set -e

# Windows-1251 хороша тем, что в ней буквы русского алфавита идут
# в том же порядке, как в Юникоде, за исключением буквы Ё.

TEMPFILE=dist/RussianNouns.es5.CP1251.js
EIGHTBIT=dist/RussianNouns.es5.8bit.js
RESULT=RN.js

iconv -f UTF-8 -t CP1251 dist/RussianNouns.es5.js > "$TEMPFILE"
./escape_nonsafe.py "$TEMPFILE" "$EIGHTBIT"
rm "$TEMPFILE"

cat polyfills.js \
    "$EIGHTBIT" > "$RESULT"
echo 'module.exports = RussianNouns;' >> "$RESULT"

echo "Saved to RN.js"

