# mcpPlayground
This project is a playground for learning and discovering the Model Context Protocol (MCP). It uses the Node.js HTTP agent to implement the Streamable HTTP transport necessary for communicating with the Microsoft Learn MCP server. The Microsoft Learn MCP server was chosen for this project because it does not require an API key. Session initialization and querying of supported tools are implemented. Feel free to implement mission messages.

## Prerequisites

The following software is required to install and use the playground.

* [Node.js](https://nodejs.org/en/download/)
* [Git](https://git-scm.com/download/win)

## Installation

In order to install the playground, the GitHub project must be cloned.

### Linux
1. Open a command-line interface (CLI) and navigate to the folder in which you want to install the playground.
2. Execute `https://github.com/tederer/mcpPlayground.git`.

### Windows
1. Open a command-line interface (CLI) and navigate to the folder in which you want to install the playground.
2. Execute `git clone https://github.com/tederer/mcpPlayground.git`.


## Starting the app

Navigate to `mcpPlayground` and execute `start.sh` (Linux) or `start.bat` (Windows).

## References

* [Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro)
* [JSON-RPC](https://www.jsonrpc.org)
* [Node.js](https://nodejs.org/docs/latest/api/)
* [Microsoft Learn MCP Server](https://learn.microsoft.com/en-us/training/support/mcp)