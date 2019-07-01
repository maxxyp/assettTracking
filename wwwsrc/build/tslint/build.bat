del /s *.js
del /s *.js.map
node ..\..\node_modules\typescript\lib\tsc.js -p tsconfig.json
pause
