// Copyright Eloqua Corporation.
// patched 1-30-2013 gshereme@redhat.com to fix XSS vuln
var elqDt = new Date();
var elqMs = elqDt.getMilliseconds();
if ((typeof elqCurE != 'undefined') && (typeof elqPPS != 'undefined')){
document.write('<SCR' + 'IPT TYPE="text/javascript" LANGUAGE="JavaScript" SRC="' + elqCurE + '?pps=' + elqPPS + '&siteid=' + elqSiteID + '&ref=' +
elqReplace(elqReplace(elqReplace(elqReplace(elqReplace(elqReplace(location.href,'&','%26'),'#','%23'),'"','%22'),"'",'%27'),'<','%3C'),'>','%3E') 
+ '&ms=' + elqMs + '"><\/SCR' + 'IPT>');
}
