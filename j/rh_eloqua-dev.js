// cross-browser event handling implementation (so we don't clobber window.onload)
var addEvent = function( obj, type, fn ) {
        if (obj.addEventListener)
                obj.addEventListener(type, fn, false);
        else if (obj.attachEvent)
                obj.attachEvent('on' + type, function() { return fn.apply(obj, new Array(window.event));});
}

// ensure eloquaConfig is defined
if (typeof eloquaConfig != 'object') {
    var eloquaConfig = {};
}

/* extract login from rh_user cookie */
function getRedHatLoginFromCookie() {
    var rh_user_cookie = getCookie('rh_user');

    if (rh_user_cookie) {
	// some cookies are quote-wrapped, fix this
	rh_user_cookie = rh_user_cookie.replace(/^"(.*)"$/, '$1');

	return rh_user_cookie.split('|')[0];	
    }

    return false;
}

/* prepopulation */
var VISITOR_LOOKUP_KEY = 'ffafdb84-1612-4193-a91a-bde948cfca34';
var CONTACT_LOOKUP_KEY = '17b7e8bd-031a-4cbd-9a22-b4b5bba18a86';
var USER_LOOKUP_KEY = '76865c5a-53e8-435a-ab9f-def93603a570';

var ELOQUA_PREPOPULATE_FIELDS = [
	['Email', 'C_EmailAddress'],
	['FirstName', 'C_FirstName'],
	['LastName', 'C_LastName'],
	['Company', 'C_Company'],
	['Address', 'C_Address1'],
	['JobTitle', 'C_Title'],
	['Department', 'C_Department1'],
	['C_Job_Role1', 'C_Department1'],
	['City', 'C_City'],
	['Country', 'C_Country'],
	['StateProvince', 'C_State_Prov'],
	['ZipCode', 'C_Zip_Postal'],
	['Phone', 'C_BusPhone'],
	['ProductOfInterest', 'C_Product_Solution_of_Interest1'],
	['AreasofInterest', 'C_Areas_of_Interest1'],
	['MiddlewareBrands', 'C_Supported_Middleware_Brands1'],
	['PartnerOptIn', 'C_Opt_In_Share1'],
	['Share_Contact', 'C_Opt_In_Share1'],
	['AnnualRevenue', 'C_Annual_Revenue1']
];

var oElqUserInfo = new Object();    // create the user info object
var elqPPS = '';
var elqDLKey = '';
var elqDLLookup = '';
eval(document.write('<s' + 'cript type="text/javascript" language="javascript" src="https://web-ux-test.devlab.phx1.redhat.com/j/elqNowDev/elqRequest.js"></scrip' + 't>'));
eval(document.write('<s' + 'cript type="text/javascript" language="javascript" src="https://web-ux-test.devlab.phx1.redhat.com/j/elqNowDev/elqCfg.js"></scrip' + 't>'));
//eval(document.write('<s' + 'cript type="text/javascript" language="javascript" src="https://web-ux-test.devlab.phx1.redhat.com/j/elqNowDev/elqCfgXml.js"></scrip' + 't>'));
//eval(document.write('<s' + 'cript type="text/javascript" language="javascript" src="https://web-ux-test.devlab.phx1.redhat.com/j/elqNowDev/elqIntXml.js"></scrip' + 't>'));

function setEloquaDataContext(type, email) {
    var type = type;    //type can be 'visitor' or 'contact'
    var oElqUserInfo = new Object();
    oElqUserInfo.Email = email;
    elqPPS = '50';
    if(type == 'contact' && isDefined(oElqUserInfo.Email)) {
        elqDLKey = escape(CONTACT_LOOKUP_KEY);
        oElqUserInfo.Email    = email;
        elqDLLookup = '<C_EmailAddress>' + oElqUserInfo.Email + '</C_EmailAddress>';
    } else if (type == 'user' && getCookie('rh_user')) {
	elqDLKey = escape(USER_LOOKUP_KEY);

	var rh_login = getRedHatLoginFromCookie();

	if (rh_login) {
		elqDLLookup = '<C_Red_Hat_Login1>' + rh_login + '</C_Red_Hat_Login1>';
	} else {
		// if we don't have a login here, short circuit!
		return;
	}
    } else {
        //assuming everyone else as visitor
        elqDLKey = escape(VISITOR_LOOKUP_KEY);
        elqDLLookup = '';
    }
   
    eval(document.write('<s' + 'cript type="text/javascript" language="javascript" src="https://web-ux-test.devlab.phx1.redhat.com/j/elqNowDev/elqCPers.js"></scrip' + 't>'));
}

function SetElqContent() {
    if(!(isDefined(oElqUserInfo.Email))) {
        var email = GetElqContentPersonalizationValue('V_Email_Address') || GetElqContentPersonalizationValue('C_EmailAddress');

	if (email) {
		oElqUserInfo.Email = email;
		oElqUserInfo.loaded = false;
		setEloquaDataContext('contact', oElqUserInfo.Email);
	}
    } else if (this.GetElqContentPersonalizationValue) {
	for (var i=0; i<ELOQUA_PREPOPULATE_FIELDS.length; i++) {
		var field_def = ELOQUA_PREPOPULATE_FIELDS[i];
		oElqUserInfo[field_def[0]] = GetElqContentPersonalizationValue(field_def[1]);
	}
    }
}

function isDefined(variable) {
    return (typeof(variable) != "undefined")? true: false;
}

function popForm(fieldId, fieldVal) {
    try {
        if(isDefined(fieldVal)) {
            var oField = document.getElementById(fieldId);

	    if (oField && oField.tagName == 'SELECT' && oField.getAttribute('multiple') && oField.options) {
		var vals = fieldVal.split('::');
		for (var i=0; i<vals.length; i++){
			for (var j=0; j<oField.options.length; j++) {
				if (oField.options[j].value == vals[i]) {
					oField.options[j].selected = true;
					break;
				}
			}
		}
	    } else if (oField) {
            	oField.value = fieldVal;
	    }
        }
    } catch(e) {
        // alert("Could not find the field: " + fieldId + "\nTo set the value: " + fieldVal + "\n\nJS Error: " + e);
    }
}
function eloquaPrepopulate() {
    for (var i=0; i<ELOQUA_PREPOPULATE_FIELDS.length; i++) {
	var field = ELOQUA_PREPOPULATE_FIELDS[i][0];
	var cField = ELOQUA_PREPOPULATE_FIELDS[i][1];
	popForm(field, oElqUserInfo[field]);
	popForm(cField, oElqUserInfo[field]);
    }
}

// helper methods
var findAncestor = function(el, nodeName) {
    while (el.tagName != nodeName && el.parentNode) {
	el = el.parentNode;
    }
    if (el.tagName == nodeName){
	return el;
    }
}

// retain API
if (eloquaConfig.hidePrepopulatedEmailField) {
	if (!eloquaConfig.hidePrepopulatedFields) {
		eloquaConfig.hidePrepopulatedFields = [];
	}

	eloquaConfig.hidePrepopulatedFields.push('Email');
}

// Usage - supply an array of field names, eg:
// 	eloquaConfig.hidePrepopulatedFields = ['Email','RedHatLogin']
if (eloquaConfig.hidePrepopulatedFields) {
	// hide fields once they are set
	var fields = eloquaConfig.hidePrepopulatedFields;

	var _popForm = (function(){ return popForm; }());
	popForm = function(fieldId, value) {
	    _popForm(fieldId, value);

	    for (var i=0; i<fields.length; i++) {
		if (fieldId == fields[i] && value) {
		    var field = document.getElementById(fieldId);
		    if (field && field.type == 'text') {
		    	var tr = findAncestor(field, 'TR');
		    	tr.style.display = 'none';
		    }
	    	}
	    }
	}
}


if (typeof useRedHatLoginLookup != 'undefined') {
   setEloquaDataContext("user");
} else {

   setEloquaDataContext("visitor");
}

/* end prepopulation */

// convenience method for getting a cookie's value
//  (may have already been defined by Omniture scripts)
if (typeof getCookie != 'function') {
	function getCookie(name)
	{
	  var dc = document.cookie;
	  var prefix = name + "=";
	  var begin = dc.indexOf("; " + prefix);

	  if (begin == -1) {
	    begin = dc.indexOf(prefix);
	    if (begin != 0) return null;
	  } else {
	    begin += 2;
	    
	  }
	  var end = document.cookie.indexOf(";", begin);
	  if (end == -1) {
	    end = dc.length;
	  }
	  return unescape(dc.substring(begin + prefix.length, end));
	}
}

// onload handler
addEvent(window, 'load', function(){

   // set internal and external campaign ID hidden fields
   if (typeof getCookie == 'function') {
      var maps = [
         ['rh_omni_tc','OmnitureExternalCampaignId'],
         ['rh_omni_itc','OmnitureInternalCampaignId']
      ];

      for (var i=0; i<maps.length; i++) {
         var el = document.getElementById(maps[i][1]);
         if (el) {
            var val = getCookie(maps[i][0]);
            el.value = val ? val : ''; 
         }
      }
   }

   // pre-populate form with data
   eloquaPrepopulate();

   // Require PartnerOptIn (Evaluations)
   if (typeof requirePartnerOptIn != 'undefined' && requirePartnerOptIn) {
	if (!eloquaConfig.requiredCheckboxes) {
	    eloquaConfig.requiredCheckboxes = [];
	}
	eloquaConfig.requiredCheckboxes.push('PartnerOptIn');
   }

   // supplemental required fields (checkboxes)
   if (eloquaConfig.requiredCheckboxes && eloquaConfig.requiredCheckboxes.length) {
	var _CheckElqForm = (function(){ return CheckElqForm; }());

	var fields = [];
	for (var i=0; i<eloquaConfig.requiredCheckboxes.length; i++) {
	    var f = document.getElementById(eloquaConfig.requiredCheckboxes[i]);
	    if (f && f.nodeName == 'INPUT' && f.type == 'checkbox') {
		fields.push(f);
	    }
	}

	CheckElqForm = function(elqForm) {
	    var valid = _CheckElqForm(elqForm);

	    var errors = [];
	    for (var i=0; i<fields.length; i++) {
		if (!fields[i].checked) {
		    var field = new FieldObj();
		    field.Field = fields[i];
		    field.ErrorMessage = 'Form field ' + fields[i] + ' is required';
		    errors.push(field);
		}
	    }

	    if (errors.length) {
		errorSet = errorSet.concat(errors);
		DisplayErrorSet(errorSet);
		return false;
	    }

	    return valid;
	}
   }

   /* INTERNATIONAL STATE OPTIONS */
   var STATE_OPTIONS_FORM = '/forms/System-State';  // a utility form which defines the list of states

   var stateField = document.getElementById('StateProvince');
   var countryField = document.getElementById('Country');

   // provision for other country/state field names!
   if (!stateField) {
	stateField = document.getElementById('C_State_Prov');
   }
   if (!countryField) {
	countryField = document.getElementById('C_Country');
   }

   if (stateField && countryField && stateField.nodeName == 'SELECT' && countryField.nodeName == 'SELECT') {
	var initStateOptions = function(){
		// load the international state options in a hidden iframe
		var ifr = document.createElement('iframe');
		ifr.setAttribute('src', STATE_OPTIONS_FORM);
		ifr.setAttribute('id', 'iframe_state_options');
		ifr.style.display = 'none';
		document.body.appendChild(ifr);
	}
	initStateOptions(); // call this function on page load so we are prepared when user selects

	// override the form validation
	//  if country has no state options, then don't require state!
	var ___CheckElqForm = (function(){ return CheckElqForm; }());
	CheckElqForm = function(elqForm) {
		var valid = ___CheckElqForm(elqForm);
		if (valid) {
			return true;
		} else if (errorSet) {
			for (var i=0; i<errorSet.length; i++) {
				var f = errorSet[i].Field;
				if (f == stateField && elqGetInternationalStateOptions(countryField.value) === undefined) {
					errorSet.splice(i,1);
					break;
				}
			}
		}

		if (errorSet.length == 0) {
			ResetHighlight();
			return true;
		}
		
		return valid;
	}

	var elqGetInternationalStateOptions = function(code) {
		var ifr = document.getElementById('iframe_state_options');

		var oDoc = ifr.contentWindow || ifr.contentDocument;
		if (typeof oDoc != 'undefined' && typeof oDoc.document != 'undefined') {
			oDoc = oDoc.document;
		}

		if (ifr && oDoc && oDoc.getElementById('loaded')) {
			var el = oDoc.getElementById(code + '_State');
			if (el && el.options) {
				return el.options;
			}
		} else {
			return false;
		}
	}

	var updateState = function(e){
		var curState = stateField.value;
		var opts = elqGetInternationalStateOptions(countryField.value);
		
		if (opts == false) return; // we don't have enough information to continue, short-circuit

		if (opts) {
			while (stateField.childNodes.length) {
				stateField.removeChild( stateField.childNodes[0] );
			}
			for (var i=0; i<opts.length; i++) {
				var o = document.createElement('option');
				o.setAttribute('value', opts[i].value);
				o.appendChild( document.createTextNode(opts[i].innerHTML) );
				stateField.appendChild(o);
			}
			stateField.value = curState;
		} else {
			stateField.value = '';
		}
			
		// toggle state field
		var tr = findAncestor(stateField, 'TR');
		if (tr) { tr.style.display = opts ? 'block' : 'none'; }
	}
	countryField.onchange = updateState;
   }
   /* END INTERNATIONAL STATE OPTIONS */

   /* FORM VALIDATION OVERRIDES */

   // form validation configuration
   var errorMessageText = 'Please fill out all fields marked in red.';
   var stylesheetURL = 'https://www.redhat.com/s/rh_eloqua_validation.css';
   var errorMessageId = 'rhErrorMessage';

   // append a stylesheet for validation purposes
   var stylesheet = document.createElement('link');
   stylesheet.setAttribute('href', stylesheetURL);
   stylesheet.setAttribute('rel', 'stylesheet');
   stylesheet.setAttribute('type', 'text/css');
   document.body.appendChild(stylesheet);

    // overrides a built-in Eloqua validation function
    DisplayErrorSet = function(ErrorSet) {
       for (var i = 0; i < ErrorSet.length; i++) {
          toggleFieldValidation( errorSet[i].Field, true );
       }

       // display a general "please fill out all fields marked in red" type message
       if (ErrorSet.length && !document.getElementById( errorMessageId )) {
	    var errMsg = document.createElement('div');
	    errMsg.setAttribute('id', errorMessageId );
	    errMsg.appendChild( document.createTextNode(errorMessageText) );

	    // insert before the first (non-hidden) input field row
	    var firstInputRow = getFirstInputRow();
	    if (firstInputRow) {
		firstInputRow.parentNode.insertBefore(errMsg, firstInputRow);
	    }
       }
    }

    // overrides a built-in Eloqua validation function
    ResetHighlight = function() {
       var field;

       if (errorSet != null) {
          for (var i = 0; i < errorSet.length; i++) {
             toggleFieldValidation( errorSet[i].Field, false );
          }
        }
       errorSet = new Array();

	var errMsg = document.getElementById(errorMessageId);
	if (errMsg) {
		errMsg.parentNode.removeChild(errMsg);
	}
    }

    var __CheckElqForm = (function(){ return CheckElqForm; }());
    CheckElqForm = function(elqForm) {
	var valid = __CheckElqForm(elqForm);
	
	// add a field indicating validation status
	var el = getValidationStatusField();
	el.value = valid ? 1 : 0;
	return valid;
    }

    var getValidationStatusField = function(){
	var el = document.getElementById('elqFormValidationStatus');
	if (!el) {
		el = document.createElement('input');
		el.setAttribute('id', 'elqFormValidationStatus');
		el.setAttribute('type', 'hidden');
		document.body.appendChild(el);
	}
	return el;
    }

    var getFirstInputRow = function(){
	var rows = document.getElementById('MainDiv').getElementsByTagName('table');
	for (var i=0; i<rows.length; i++) {
		if (rows[i].getElementsByTagName('select').length || rows[i].getElementsByTagName('textarea') ){
			return rows[i];
		} else if (rows[i].getElementsByTagName('input').length) {
			var inputs = rows[i].getElementsByTagName('input');
	    		for (var j=0; j<inputs.length; j++) {
		    		if (!inputs[j].getAttribute('type') || inputs[j].getAttribute('type') != 'hidden') {
					return rows[i];
		    		}
	    		}
		}
	}
    }

    // IE-supported className selector
    var getChildrenWithClassName = function(el, className) {
	if (typeof el.getElementsByClassName == 'function') {
	   return el.getElementsByClassName(className);
	} else {
	   var els = [];
	   if (typeof el.childNodes != 'undefined') {
	   	for (var i=0; i<el.childNodes.length; i++) {
		   var matches = getChildrenWithClassName(el.childNodes[i], className);
		   for (var j=0; j<matches.length; j++) {
			els.push( matches[j] );
		   }
		}
	   }
	   if (el.className) {
		var classes = el.className.split(/\s+/);
		for (var i=0; i<classes.length; i++) {
		   if (className == classes[i]) {
			els.push(el);
			break;
		   }
		}
	   }
	   return els;
	}
    }

    var toggleFieldValidation = function(field, invalid) {
       var tr = findAncestor(field, 'TR');

       if (tr) {
	    var labels = getChildrenWithClassName( tr, "elqLabel" );
	    for (var i=0; i<labels.length; i++) {
	   	    labels[i].className = invalid ? 'elqLabel invalidFieldLabel' : 'elqLabel';
    	    }
       }
    }

    /* END FORM VALIDATION OVERRIDES */

    /* SITE SEARCH FIX */
    var doSiteSearch = function(){
	var site = 'redhat';
	var endpoint = 'http://www.redhat.com/search';

	var queryField = document.forms[0]['q'];
	if (queryField) {
		var qs = 'site=' + site + '&q=' + escape(queryField.value);
		window.location = endpoint + '?' + qs;
	}

	return false;
    }

    // apply handlers
    var siteSearchWrap = document.getElementById("site-search");
    if (siteSearchWrap) {
	var inputs = siteSearchWrap.getElementsByTagName('input');
	for (var i=0; i<inputs.length; i++) {
	    if (inputs[i].type == 'text' || inputs[i].type == 'submit') {
		// handle "Enter"
		inputs[i].onkeyup = function(e) {
		    if (e.keyCode == 13) {
			return doSiteSearch();
		    }
		}
	    }
	    if (inputs[i].type == 'submit') {
		// handle click
		inputs[i].onclick = function(e) {
		    return doSiteSearch();
		}
	    }
	}
    }

    /* END SITE SEARCH FIX */

    /* COPY RED HAT LOGIN */
    if (typeof copyRedHatLogin != 'undefined') {
	var loginField = document.getElementById('RedHatLogin');
	var rh_login = getRedHatLoginFromCookie();

	if (loginField && rh_login) {
		popForm('RedHatLogin', rh_login);
	}
    }

    if (document.getElementById('rh_user')) {
	document.getElementById('rh_user').value = getCookie('rh_user');	// TODO: rm
    }

    // copy query string parameters
    // Usage:
    //  <input type="hidden" id="query_foo" name="query_foo" />
    //  /forms/myform?foo=bar will set "bar" as the value for #query_foo
    var FIELD_PREFIX = "query_";
    var qs = window.location.search;
    if (qs && qs.length > 1) {
	var parts = qs.substr(1).split('&');
	for (var i=0; i<parts.length; i++) {
	    var kv = parts[i].split('=');
	    if (kv.length == 2) {
		var fieldId = FIELD_PREFIX + kv[0];
		var f = document.getElementById(fieldId);
		if (f && f.nodeName == 'INPUT' && f.type == 'hidden') {
		    popForm(fieldId, kv[1]);
		}
	    }
	}
    }

}); // end onload
