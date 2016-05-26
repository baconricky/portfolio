@echo off

cd ..\js

del *.min.js

REM "1. Compiling and minifing our 3rd party javascript libraries"
java -jar ..\bin\yuicompressor-2.4.6.jar -o standard.min.js standard.js

REM "2. Compiling and minifing the app-specific javascript libraries"
java -jar ..\bin\yuicompressor-2.4.6.jar -o app.min.js app.js

cd ..\css

del *.min.css

REM "3. Compiling and minifing our 3rd party css libraries"
java -jar ..\bin\yuicompressor-2.4.6.jar -o standard.min.css standard.css

REM "4. Compiling and minifing the app-specific css libraries"
java -jar ..\bin\yuicompressor-2.4.6.jar -o app.min.css app.css

cd ../bin

REM "DONE"
