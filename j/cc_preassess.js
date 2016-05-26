function updateNumOfProbes()
{

if (document.form1)
 {
	var f1 = document.form1
	
	f1.r1.value = f1.p1.value * f1.q1.value
	f1.r2.value = f1.p2.value * f1.q2.value
	f1.r3.value = f1.p3.value * f1.q3.value
	f1.r4.value = f1.p4.value * f1.q4.value
	f1.r5.value = f1.p5.value * f1.q5.value
	f1.r6.value = f1.p6.value * f1.q6.value
	f1.r7.value = f1.p7.value * f1.q7.value
	f1.r8.value = f1.p8.value * f1.q8.value
	f1.r9.value = f1.p9.value * f1.q9.value
	f1.r10.value = f1.p10.value * f1.q10.value
	f1.r11.value = f1.p11.value * f1.q11.value
	f1.r12.value = f1.p12.value * f1.q12.value
	
	f1.rTotal.value = 
	 Math.round(f1.r1.value) + 
	 Math.round(f1.r2.value) + 
	 Math.round(f1.r3.value) + 
	 Math.round(f1.r4.value) + 
	 Math.round(f1.r5.value) + 
	 Math.round(f1.r6.value) + 
	 Math.round(f1.r7.value) + 
	 Math.round(f1.r8.value) + 
	 Math.round(f1.r9.value) + 
	 Math.round(f1.r10.value) + 
	 Math.round(f1.r11.value) + 
	 Math.round(f1.r12.value)
 }
}

/* for Mozilla */
if (document.addEventListener) {
   document.addEventListener("DOMContentLoaded", updateNumOfProbes, false);
}

/* for Safari */
if (/WebKit/i.test(navigator.userAgent)) { // sniff
	var _timer = setInterval(function() {
		if (/loaded|complete/.test(document.readyState)) {
			clearInterval(_timer);
			updateNumOfProbes(); // call the onload handler
		}
	}, 10);
}

// for Internet Explorer (using conditional comments)
/*@cc_on @*/
/*@if (@_win32)
document.write("<script id=__ie_onload defer src=javascript:void(0)><\/script>");
var script = document.getElementById("__ie_onload");
script.onreadystatechange = function() {
	if (this.readyState == "complete") {
		updateNumOfProbes(); // call the onload handler
	}
};
/*@end @*/

/* for other browsers */
window.onload = updateNumOfProbes()