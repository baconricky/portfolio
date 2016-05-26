// Copyright Eloqua Corporation.
var elqDt = new Date();
var elqMs = elqDt.getMilliseconds();

if ((typeof elqCurE != 'undefined') && (typeof elqPPS != 'undefined')) {
    document.write('<SCR' + 'IPT TYPE="text/javascript" LANGUAGE="JavaScript" SRC="' + elqCurE + '?pps=' + elqPPS + '&siteid=' + elqSiteID + '&DLKey=' + elqDLKey + '&DLLookup=' + elqDLLookup + '&ms=' + elqMs + '"><\/SCR' + 'IPT>');
}
else {
    alert("code problem in CPers. are you using the async script?");
}
