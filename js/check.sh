#!/bin/sh

# npm i es-check

#   To run in on ES6 engine,
#   you will need at least polyfills for:
#
#       • Array.prototype.includes
#       • Object.values

npx es-check --module es6 RussianNouns.es8.js
