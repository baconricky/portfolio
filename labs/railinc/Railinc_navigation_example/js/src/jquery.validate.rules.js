/***********************************************************************
 ** TEMPORARY Error messages *******************************************
 ***********************************************************************
 ** NOTE: **************************************************************
 ** these are temporary and should be populated by the JSP similar to how 
 ** it is done for provider enrollment so as to use the language bundles. 
 ***********************************************************************
 ** I've put them in place here for testing only. 
 ***********************************************************************/
var idErrMsg='Please enter a valid Identification Number';
var ssnErrMsg='Please enter a valid SSN';
var dateErrMsg='Please enter a valid date';
var alphaErrMsg='Please do not enter numbers';
var phoneErrMsg='Please enter a valid contact number';
var zipErrMsg='Please enter a valid ZIP code';
var requiredErrMsg='This field is required.';

$(document).ready(function() {
/***********************************************************************
 ** Masking config *****************************************************
 ***********************************************************************/
	$(".idNum").mask("9999",{placeholder:" "});
	
/***********************************************************************
 ** Validation config **************************************************
 ***********************************************************************/
	$.validator.setDefaults(
	{ 
		onfocusout:     false,
		wrapper:        "p",
		ignoreTitle:	true,
		highlight: function(element, errorClass) {
			$(element).closest("div").addClass(errorClass);
		},
		errorPlacement: function(error, element) 
		{
			$(error).appendTo( $(element).closest("div") );
		}
	});

	$.validator.addMethod("oneOrMoreRequired", function(value, element) {
		var isValid = false;

		console.log(element.name + " : " + value);
		if (value !== "") {
			isValid = true;
		}

		$("input[class=oneOrMoreRequired]").each(function() {
			console.log(this.name + " : " + this.value);
			if (this.value !== "") {
				isValid = true;
			}
		});
		return isValid;
	}, requiredErrMsg);
	
	$.validator.addMethod("idNum", function(value, element) {
		return this.optional(element) || /(\D$)/.test(value);
	}, idErrMsg);
	
});

/***********************************************************************
 ** Validation config **************************************************
 ** fields are valid if rules return true. *****************************
 ***********************************************************************/
function daysInFebruary (year) {
	// February has 29 days in any year evenly divisible by four,
	// EXCEPT for centurial years which are not also divisible by 400.
	return (((year % 4 == 0) && ( (!(year % 100 == 0)) || (year % 400 == 0))) ? 29 : 28 );
}
	
function DaysArray(n) {
	for (var i = 1; i <= n; i++) {
		this[i] = 31;
		if (i==4 || i==6 || i==9 || i==11) this[i] = 30;
		if (i==2) this[i] = 29;
	} 
	return this;
}

function isDate(dtStr) {
	var dtCh='/';
	var minYear=new Date().getFullYear()-150;
	var maxYear=new Date().getFullYear()+150;
	var daysInMonth = DaysArray(12);
	var pos1=dtStr.indexOf(dtCh);
	var pos2=dtStr.indexOf(dtCh,pos1+1);
	var strMonth=dtStr.substring(0,pos1);
	var strDay=dtStr.substring(pos1+1,pos2);
	var strYear=dtStr.substring(pos2+1);
	strYr=strYear;
	
	if (strDay.charAt(0)=="0" && strDay.length>1) strDay=strDay.substring(1);
	if (strMonth.charAt(0)=="0" && strMonth.length>1) strMonth=strMonth.substring(1);
	
	for (var i = 1; i <= 3; i++) {
		if (strYr.charAt(0)=="0" && strYr.length>1) strYr=strYr.substring(1);
	}
	
	month=parseInt(strMonth);
	day=parseInt(strDay);
	year=parseInt(strYr);
	if (month<1 || month>12 || month == undefined || isNaN(month)) {
		dateErrMsg="Please enter a valid month.";
		return false;
	}
	
	if (day<1 || day>31 || (month==2 && day>daysInFebruary(year)) || day > daysInMonth[month] || day == undefined || isNaN(day)) {
		dateErrMsg="Please enter a valid day.";
		return false;
	}
	
	if (year==0 || year<minYear || year>maxYear || year == undefined || isNaN(year)) {
		dateErrMsg="Please enter a valid year between "+minYear+" and "+maxYear+".";
		return false;
	}
	
	return true;
}