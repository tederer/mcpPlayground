# mcpPlayground

This playground was created for learning and discovering the Model Context Protocol (MCP). It contains:
* A [FastMCP](https://gofastmcp.com)-based (Python) implementation of a MCP server.
* A [Node.js](https://nodejs.org)-based (JavaScript) implementation of the client part of MCP. 

## Prerequisites

The following software is required to use the playground.

* [Node.js](https://nodejs.org/en/download/)
* [Python](https://www.python.org/)
* [Git](https://git-scm.com/download/win)

## Installation

To install the playground, execute the following steps. 

1. Open a terminal and navigate to the folder where you want to install the playground. 
2. Execute `git clone https://github.com/tederer/mcpPlayground.git` to clone the project into a subfolder called `mcpPlayground`.
3. Execute `cd mcpPlayground`.
4. Execute `python3 -m venv ./virtualPythonEnv` to create a virtual python environment.
5. Execute `. ./virtualPythonEnv/bin/activate` to activate the virtual python environment.
6. Execute `pip install fastmcp` to install FastMCP.
7. Execute `deactivate` to deactivate the virtual python environment.
8. Execute `npm install` to install all JavaScript dependencies.

## Starting the MCP server

Executing `startServer.sh` starts a local MCP server listening on http://127.0.0.1:9000. Its source code is available in the "server" directory.

## Starting the MCP client

Executing `startClient.sh` starts the MCP client. It connects to the local MCP server and demonstrates how to use tools, get resources and download prompts. Executing `startClient.sh debug` activates the debug log level for more detailed log message.

### Connecting to another MCP server

The MCP Client supports the following optional environment variable to change the URL of the MCP server and to add a personal access token.

| Environment Variable      | Description                   | Default                   |
| ------------------------- | ------------------------------| ------------------------- |
| MCP_SERVER_URL            | URL of the MCP server.        | http://127.0.0.1:9000/mcp |
| MCP_PERSONAL_ACCESS_TOKEN | Personal Access Token to use. | empty                     |

**ATTENTION**: Do not use something like `MCP_PERSONAL_ACCESS_TOKEN=123456abcd startClient.sh` because every command gets stored in the command history and others can get access to your personal access token.

The Microsoft Learn MCP server (https://learn.microsoft.com/api/mcp) is a good candidate for learning because it does not require an API key. 

## References

* [JSON-RPC](https://www.jsonrpc.org)
* [FastMCP](https://gofastmcp.com)
* [Microsoft Learn MCP Server](https://learn.microsoft.com/en-us/training/support/mcp)
* [Model Context Protocol](https://modelcontextprotocol.io)
* [Node.js](https://nodejs.org/docs/latest/api/)
