@echo off

REM This file combines and compresses the JS libraries using Google Closure

java -jar compiler.jar --js=DD_roundies_0.0.2a.js --js=suckerfish.js --js=date.js --js=jquery.datePicker.js --js=jquery.coolinput.min.js --js=jquery.maskedinput-1.2.2.js --js=jquery.validate.js --js=nctracks_init.js --js_output_file=nctracks.min.js