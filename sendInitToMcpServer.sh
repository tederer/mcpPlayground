#!/bin/bash

# This script sends an "initialize" request to the MCP server and 
# prints the received response to STDOUT. By default a local MCP
# server at http://localhost:9000/mcp gets used. To send the request
# to another MCP server, put the URL into the environment variable 
# MCP_SERVER_URL before calling this script.

mcpServerUrl=http://localhost:9000/mcp

if [ "${MCP_SERVER_URL}x" != "x" ]; then
   mcpServerUrl=$MCP_SERVER_URL
fi

echo "Sending \"initialize\" request to $mcpServerUrl ..."

curl -X POST \
    --dump-header - \
    -H 'Content-Type: application/json' \
    -H 'Accept: text/event-stream, application/json' \
    -d '{"id":1,"jsonrpc":"2.0","method":"initialize","params":{"protocolVersion":"2025-06-12","capabilities":{},"clientInfo":{"name":"mcpTest","version":"0.0.1"}}}' \
    $mcpServerUrl

