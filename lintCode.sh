#!/bin/sh

# This script executes JSHint (https://jshint.com), which is a linter
# for JavaScript code.

scriptDir=$(cd $(dirname $0) && pwd)
cd $scriptDir

if [ ! -e ./node_modules/jshint/bin/jshint ]; then
    echo 'JSHint not installed. Please run "npm install" first.'
    exit 1
fi

./node_modules/jshint/bin/jshint ./client/