#!/bin/sh

rm -r rx ||:
rm -r kefir ||:
rm -r common ||:
rm -r rxjs ||:
rm index.js ||:
mv build/* .
rm -r build
