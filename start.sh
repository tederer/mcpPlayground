#!/bin/sh

scriptDir=$(cd $(dirname $0) && pwd)
cd $scriptDir

if [ ! -d ./node_modules ]; then
    echo "No folder \"node_modules\" found -> executing \"npm install\" to install dependencies ..."
    npm install
    exitCode=$?
    if [ $exitCode -ne 0 ]; then
       echo "\"npm install\" exited with code: $exitCode"
       exit $exitCode
    fi
fi

npm start
