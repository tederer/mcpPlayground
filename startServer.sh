#!/bin/sh

scriptDir=$(cd $(dirname $0) && pwd)
cd $scriptDir

if [ ! -d ./virtualPythonEnv ]; then
    echo "Folder of virtual python environment (./virtualPythonEnv) missing. Please follow the installation steps in README.md."
    exit 1
fi

./virtualPythonEnv/bin/python3 ./server/mcpServer.py
