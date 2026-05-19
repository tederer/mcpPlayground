from fastmcp import FastMCP

mcp = FastMCP("MCP-Playground-Server")

@mcp.tool
def add(a: int, b: int) -> int:
    return a + b

@mcp.resource("data://config")
def getConfig() -> dict:
    return {'host': 'localhost', 'port': 9000, 'protocol': 'http'}

@mcp.prompt
def analyzeData(dataPoints: list[float]) -> str:
    formatted_data = ", ".join(str(point) for point in dataPoints)
    return f"Please analyze these data points: {formatted_data}"

if __name__ == "__main__":
    mcp.run(transport="http", host="127.0.0.1", port=9000)


    