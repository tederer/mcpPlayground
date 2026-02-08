@echo off

set PROJECT_ROOT=%~dp0

call extendPathVariable.bat

if %ERRORLEVEL% GTR 0 (
   pause
   exit 1
)

if not exist %PROJECT_ROOT%\node_modules (
   echo No folder "node_modules" found: Executing "npm install" to install dependencies ...
   cmd /c npm install
   if %ERRORLEVEL% GTR 0 (
      echo "npm install" failed with exit code %ERRORLEVEL%.
      pause
      exit 1
   )
)

cmd /c npm start
pause