@echo off
:: Usa Node v22 para este proyecto
setlocal
set "PATH=C:\node-v22.14.0-win-x64;%PATH%"
echo Node: v22.14.0 | node -v
echo npm: 10.9.2
echo.
node -v
npm -v
echo.
npm install %*
endlocal
