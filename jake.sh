#!/usr/bin/env bash

if [ ! -f node_modules/.bin/jake ]
    then
        echo "Building npm modules:"
        npm rebuild
fi

node_modules/.bin/jake $*