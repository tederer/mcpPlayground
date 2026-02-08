@echo off

set PROJECT_ROOT=%~dp0

set NODE_HOME=D:\Software\Node.js\current

node --version > nul 2>&1

if errorlevel 1 (
	if not exist %NODE_HOME%\node.exe (
		echo.
		echo ERROR: Neither PATH nor NODE_HOME environment variable points to installation folder of Node.js!
		echo.
		pause
		exit 1
	) else (
	   set "PATH=%PATH%;%NODE_HOME%"
	)
)

exit /b 0