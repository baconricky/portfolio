/*
Author: Robert Hashemian
http://www.hashemian.com/
You can use this code in any manner so long as the author's
name, Web address and this disclaimer is kept intact.
********************************************************
*/

function calcage(secs, num1, num2) {
  var LeadingZero = true;
  s = ((Math.floor(secs/num1))%num2).toString();
  if (LeadingZero && s.length < 2)
  s = "0" + s;
  return "<b>" + s + "</b>";
}

function CountBack(secs) {
  var CountStepper = -1;
  var CountActive = true;
  var DisplayFormat = " <div id=\"dfWidgetCountText\"><h2>%%D%% Days<\/h2><\/div> <div id=\"dfWidgetCountTextSmall\">%%H%% Hours %%M%% Minutes %%S%% Seconds <\/div>";
  var FinishMessage = " <div id=\"dfWidgetCountText\"><\/div> <br><br>";
  if (secs < 0) {
    document.getElementById("cntdwn").innerHTML = FinishMessage;
    return;
  }
  DisplayStr = DisplayFormat.replace(/%%D%%/g, calcage(secs,86400,100000));
  DisplayStr = DisplayStr.replace(/%%H%%/g, calcage(secs,3600,24));
  DisplayStr = DisplayStr.replace(/%%M%%/g, calcage(secs,60,60));
  DisplayStr = DisplayStr.replace(/%%S%%/g, calcage(secs,1,60));
  document.getElementById("cntdwn").innerHTML = DisplayStr;
  if (CountActive)
    setTimeout("CountBack(" + (secs+CountStepper) + ")", SetTimeOutPeriod);
}

function putspan() {
 document.write("<div id=\"dfWidget\"><div id=\"dfWidgetText\">Liberate Your Documents</div><div id=\"dfWidgetTextSmall\">ISO Vote on March 29, 2008<\/div><br><span id='cntdwn'><\/span><br><div id=\"dfWidgetLinkText\"><a href=\"http:\/\/www.documentfreedom.org\">DocumentFreedom.org<\/a><\/div><\/div>");
 document.getElementById("dfWidget").style.width = "220px";
 document.getElementById("dfWidget").style.margin = "5 5 5 5";
 document.getElementById("dfWidget").style.border = "1px solid #990000";
 document.getElementById("dfWidget").style.padding = "10px";
 document.getElementById("dfWidget").style.background = "#efefef"; 
 document.getElementById("dfWidget").style.textAlign = "center";
 document.getElementById("dfWidget").style.fontFamily = "\"Lucida Grande\", \"Luxi sans\", \"Bitstream Vera Sans\", \"Trebuchet MS\", helvetica, verdana, sans-serif";
 document.getElementById("dfWidget").style.fontSize = "12px";
 document.getElementById("dfWidgetText").style.fontSize = "16px";
 document.getElementById("dfWidgetText").style.fontWeight = "bold";
 document.getElementById("dfWidgetText").style.color = "#990000";
 document.getElementById("dfWidgetTextSmall").style.fontSize = "12px";
}

CountStepper = Math.ceil(-1);
if (CountStepper == 0)
  CountActive = false;
var SetTimeOutPeriod = (Math.abs(CountStepper)-1)*1000 + 990;
putspan();
var dthen = new Date("3/29/2008 12:00 AM");
var dnow = new Date();
if(CountStepper>0)
  ddiff = new Date(dnow-dthen);
else
  ddiff = new Date(dthen-dnow);
gsecs = Math.floor(ddiff.valueOf()/1000);
CountBack(gsecs);

