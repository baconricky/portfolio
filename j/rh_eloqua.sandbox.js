/**
 * RH-Eloqua Supplemental JS - Add extra functionality to Eloqua forms
 *
 * https://docspace.corp.redhat.com/docs/DOC-50439
 **/

// ensure eloquaConfig is defined
if (typeof eloquaConfig != 'object') {
    var eloquaConfig = {};
}

var SANDBOX = true;

// GLOBAL CONFIG
var SITE_ID, VISITOR_LOOKUP_KEY, CONTACT_LOOKUP_KEY, USER_LOOKUP_KEY;
if (SANDBOX) {
	SITE_ID = 1798;
	VISITOR_LOOKUP_KEY = 'ffafdb84-1612-4193-a91a-bde948cfca34';
	CONTACT_LOOKUP_KEY = '17b7e8bd-031a-4cbd-9a22-b4b5bba18a86';
	USER_LOOKUP_KEY = '';
	CAMPAIGN_LOOKUP_KEY = 'da39f645-802e-48c3-a690-bf1c4d694727';
} else {
	SITE_ID = 1795;
	VISITOR_LOOKUP_KEY = 'e297a8c7-546a-4f73-8c10-0f9d8b313346';
	CONTACT_LOOKUP_KEY = '085c060c-71b0-4644-bef5-b041f88b5720';
	USER_LOOKUP_KEY = '76865c5a-53e8-435a-ab9f-def93603a570';
	CAMPAIGN_LOOKUP_KEY = 'c952709f-3614-47d6-983e-a167de3bff3b';
}

var COOKIE_INTERNAL_CAMPAIGN_ID = "rh_omni_itc";
var COOKIE_EXTERNAL_CAMPAIGN_ID = "rh_omni_tc";
var COOKIE_OFFER_CAMPAIGN_ID = "rh_offer_id";

// the default direct referrer campaign id
var DEFAULT_DIRECT_CAMPAIGN_ID = "70160000000H4AjAAK";
var DEFAULT_NATURAL_CAMPAIGN_ID = "70160000000H4AoAAK";

var QUERY_STRING_FORM_PREFIX = 'query_';

var STATE_OPTIONS_FORM = '/forms/System-State';  // a utility form which defines the list of states
var STATE_OPTIONS_IFRAME = 'iframe_state_options';

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

// form validation configuration
var FIELD_ERROR_MESSAGE = "Form field %% is required.";
var stylesheetURL = 'https://www.redhat.com/s/rh_eloqua_validation.css';

// TODO: document configuration options and usage
// 	eloquaConfig.hidePrepopulatedFields = ['Email','RedHatLogin']

// copyRedHatLogin
// errorMessageText
// hidePrepopulatedFields
// requiredCheckboxes
// useRedHatLoginLookup
// prepopulate
// getFieldLabels
// onError
// stateOptionsFormUrl

// deprecated configuration options (continue to support)
if (typeof useRedHatLoginLookup !== 'undefined') {
	eloquaConfig.useRedHatLoginLookup = useRedHatLoginLookup;
}

if (typeof copyRedHatLogin != 'undefined') {
	eloquaConfig.copyRedHatLogin = copyRedHatLogin;
}

if (typeof requirePartnerOptIn != 'undefined' && requirePartnerOptIn) {
	if (!eloquaConfig.requiredCheckboxes) {
	    eloquaConfig.requiredCheckboxes = [];
	}
	eloquaConfig.requiredCheckboxes.push('PartnerOptIn');
}

if (eloquaConfig.hidePrepopulatedEmailField) {
	if (!eloquaConfig.hidePrepopulatedFields) {
		eloquaConfig.hidePrepopulatedFields = [];
	}

	eloquaConfig.hidePrepopulatedFields.push('Email');
	eloquaConfig.hidePrepopulatedFields.push('C_EmailAddress');
}
// end deprecated config

if (eloquaConfig.prepopulate !== false) {
	eloquaConfig.prepopulate = true;
}

if (!eloquaConfig.errorMessageText) {
	eloquaConfig.errorMessageText = 'Please fill out all fields marked in red.';
}

if (!eloquaConfig.rhOmniFooterUrl) {
	eloquaConfig.rhOmniFooterUrl = "https://www.redhat.com/j/rh_omni_footer.js";
}

/* private utility methods */
var utils = {

	errorMessageId : 'rhErrorMessage',

	invalidFieldClass : 'elqFieldValidation',
	invalidFieldLabelClass : 'invalidFieldLabel',

	stateOptionsFormUrl : STATE_OPTIONS_FORM,

	// maintain a list of custom validators
	validators : [],

	// cross-browser event handling implementation
	// (so we don't clobber window.onload)
	addEvent : function( obj, type, fn ) {
		if (obj.addEventListener) {
			obj.addEventListener(type, fn, false);
		} else if (obj.attachEvent) {
                	obj.attachEvent('on' + type, function() { return fn.apply(obj, new Array(window.event));});
		}
	},

	// populate a form field
	buildError : function (field) {
		var err = new FieldObj();
		err.Field = field;
		err.ErrorMessage = FIELD_ERROR_MESSAGE.replace(/%%/g, field);
		return err;
	},

	// require the listed checkboxes to be checked
	buildRequiredCheckboxesValidator : function(list) {
		return function(errSet) {
			for (var i=0; i < list.length; i++) {
				var f = document.getElementById(list[i]);
				if (f && f.nodeName == 'INPUT' && f.type == 'checkbox') {
					if (!f.checked) {
						errSet.push(utils.buildError(f));
					}				
				}
			}

			return errSet;
		};
	},

	// if country has no state options, then don't require state!
	buildDynamicStateValidator : function() {
		return function(eSet) {
			var stateField = utils.getStateField();
			var countryField = utils.getCountryField();

			for (var i=0; i<eSet.length; i++) {
				var f = eSet[i].Field;
				if (f == stateField && utils.getStateOptions(countryField.value) === undefined) {
					eSet.splice(i,1);
					break;
				}
			}

			return eSet;
		};
	},	

	buildErrorMessageContainer : function() {
		var errMsg = document.createElement('div');
		errMsg.setAttribute('id', this.errorMessageId );

		// insert before the first (non-hidden) input field row
		var firstInputRow = this.getFirstInputRow();
		if (firstInputRow) {
			firstInputRow.parentNode.insertBefore(errMsg, firstInputRow);
		}

		// clear it
		this.displayErrorMessage('');
	},

	displayErrorMessage : function(msg) {
		var ct = document.getElementById(this.errorMessageId);
		if (ct) {
			ct.innerHTML = msg;
			ct.style.display = msg ? 'block' : 'none';
		}
	},

	doSiteSearch : function() {
		var site = 'redhat';
		var endpoint = 'http://www.redhat.com/search';

		var queryField = document.forms[0]['q'];
		if (queryField) {
			var qs = 'site=' + site + '&q=' + escape(queryField.value);
			window.location = endpoint + '?' + qs;
		}

		return false;
    	},

	// find an ancestor of a given element that is of a specific type
	findAncestor : function(el, nodeName) {
   		while (el.tagName != nodeName && el.parentNode) {
			el = el.parentNode;
    		}
    		if (el.tagName == nodeName){
			return el;
 		}
	},

	// IE-supported className selector
	findChildrenWithClassName : function(el, className) {
		if (typeof el.getElementsByClassName == 'function') {
		   	return el.getElementsByClassName(className);
		} else {
	   		var els = [];
	   		if (typeof el.childNodes != 'undefined') {
	   			for (var i=0; i<el.childNodes.length; i++) {
			 	  	var matches = this.findChildrenWithClassName(el.childNodes[i], className);
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
    	},

	fireEvent : function(el, eventType){
		if (document.createEventObject){
			var evt = document.createEventObject();
			return el.fireEvent('on'+eventType, evt)
		} else {
			var evt = document.createEvent("HTMLEvents");
			evt.initEvent(eventType, true, true);
			return !el.dispatchEvent(evt);
		}
	},

	// convenience method for getting a cookie's value
	getCookie : function(name) {
		// use an existing global implementation if present (Omniture)
		if (typeof getCookie == 'function') {
			return getCookie(name);
		} else {
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
	},

	getCountryField : function() {
		return document.getElementById('Country') || document.getElementById('C_Country');
	},

	getFieldLabels : function(field) {
      		var tr = utils.findAncestor(field, 'TR');

       		if (tr) {
	    		return this.findChildrenWithClassName( tr, "elqLabel" );
		}
    	},

	// finds the first row in the table containing a user input
	getFirstInputRow : function(){
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
	},
	
	// extract Red Hat login from cookie
	getRedHatLoginFromCookie : function() {
		var rh_user_cookie = utils.getCookie('rh_user');

		if (rh_user_cookie) {
			// some cookies are quote-wrapped, fix this
			rh_user_cookie = rh_user_cookie.replace(/^"(.*)"$/, '$1');
			return rh_user_cookie.split('|')[0];	
		}

		return false;
	},

	getStateField : function() {
		return document.getElementById('StateProvince') || document.getElementById('C_State_Prov');
	},

	getStateOptions : function(code) {
		var ifr = document.getElementById(STATE_OPTIONS_IFRAME);

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
	},
	
	indexOf : function(arr, val) {
		if (typeof arr.indexOf == 'function') {
			return arr.indexOf(val);
		} else {
			for (var i=0; i<arr.length; i++) {
				if (arr[i] == val) {
					return i;
				}
			}
			return -1;
		}
	},

	initStateOptions : function() {
		// load the state options in a hidden iframe
		var ifr = document.createElement('iframe');
		ifr.setAttribute('src', this.stateOptionsFormUrl);
		ifr.setAttribute('id', STATE_OPTIONS_IFRAME);
		ifr.style.display = 'none';
		document.body.appendChild(ifr);
	},

	popField : function(fieldId, fieldVal, hideAfter) {
		try {
			if (fieldVal) {
				var oField = document.getElementById(fieldId);

				if (oField && oField.tagName == 'SELECT' && oField.getAttribute('multiple') && oField.options) {
					var vals = fieldVal.split('::');
					for (var i=0; i<vals.length; i++){
						for (var j=0; j<oField.options.length; j++) {
							if (oField.options[j].value == vals[i]) {
								oField.options[j].selected = true;
								utils.fireEvent(oField, 'change');
								break;
							}
						}
					}
				} else if (oField) {
					oField.value = fieldVal;

		    			if (hideAfter && oField && oField.type == 'text') {
		    				var tr = utils.findAncestor(oField, 'TR');
		    				tr.style.display = 'none';
		    			}
					
					utils.fireEvent(oField, 'change');
				}
			}
    		} catch(e) { /* could not find the field to populate */ }
	},

	prepopulateFromLookup : function(lookup, fieldsToHideIfPopulated) {
		for (var i=0; i<ELOQUA_PREPOPULATE_FIELDS.length; i++) {
			var field = ELOQUA_PREPOPULATE_FIELDS[i][0];
			var cField = ELOQUA_PREPOPULATE_FIELDS[i][1];

			var value = lookup.get(cField) || lookup.get(field);

			utils.popField(field, value, fieldsToHideIfPopulated && this.indexOf(fieldsToHideIfPopulated, field) != -1);
			utils.popField(cField, value, fieldsToHideIfPopulated && this.indexOf(fieldsToHideIfPopulated, cField) != -1);
		}
	},

	toggleClass : function(el, className, on) {
		var curClasses = (el.className || '').split(/\s+/);
		var curIndex = this.indexOf(curClasses, className);
		if (on === undefined) {
			on = (curIndex == -1);
		}
		if (on && curIndex == -1) {
			curClasses.push(className);
		} else if (!on && curIndex != -1) {
			curClasses.splice(curIndex, 1);
		}
		el.className = curClasses.join(' ');
	},

	toggleFieldValidation : function(field, invalid) {
		var labels = this.getFieldLabels(field);

		if (labels) {
			for (var i=0; i<labels.length; i++) {
				this.toggleClass(labels[i], this.invalidFieldLabelClass, invalid);
			}
		}

		this.toggleClass(field, this.invalidFieldClass, invalid);
    	},

	updateState : function(e){
		var stateField = utils.getStateField();
		var countryField = utils.getCountryField();

		var curState = stateField.value;
		var opts = utils.getStateOptions(countryField.value);
		
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
		var tr = utils.findAncestor(stateField, 'TR');
		if (tr) { tr.style.display = opts ? 'block' : 'none'; }
	}
};

/**
 * Basic campaign tracking strategy that just copies values
 * from a cookie into a hidden form field
 **/
BasicCampaignTrackingStrategy = function() {
	var cookie_map = {
		externalCampaignId : COOKIE_EXTERNAL_CAMPAIGN_ID,
		internalCampaignId : COOKIE_INTERNAL_CAMPAIGN_ID
	};

	return {
		fetchCampaignIds : function(form, callback) {
			var campaigns = {};

			for (var k in cookie_map) {
				if (cookie_map.hasOwnProperty(k)) {
					var val = utils.getCookie( cookie_map[k] );
					campaigns[k] = val ? val : '';
				}
			}

			if (typeof callback === 'function') {
				callback(campaigns);
			}
		}
	};
}

/**
 * Campaign strategy which takes into account both tactics and offers
 * when determining the campaign IDs to associate with a form submission
 **/
TacticOfferCampaignTrackingStrategy = function() {

	var internalUtils = {
        	evaluate : function(user, form) {
			var result = {};

			if (user.offer == form.general) {
				result.externalCampaignId = this.getDefault(user, form) || user.external;
			} else {
				result.externalCampaignId = this.getDefault(user, form) || form.general;
			}

			result.internalCampaignId = user.internal || '';

			return result;
		},

		getDefault : function(user, form) {
			if (user.direct) {
				return form.direct;
			} else if (user.natural) {
				return form.natural;
			}
		}
	};

	return {
		fetchCampaignIds : function(form, callback) {
			var formName = form.name;
			var campaignLookup = EloquaDataLookupHelper.buildLookup(SITE_ID, CAMPAIGN_LOOKUP_KEY, 'HTML_Form_Name1', formName, function(){

				var form = {
					general : this.get('General_Campaign_ID1'),
					natural : this.get('Natural_Referrer_Campaign_ID1'),
					direct : this.get('Direct_Entry_Campaign_ID1')
				};

				var user = {
					direct : utils.getCookie(COOKIE_EXTERNAL_CAMPAIGN_ID) == DEFAULT_DIRECT_CAMPAIGN_ID,
					natural : utils.getCookie(COOKIE_EXTERNAL_CAMPAIGN_ID) == DEFAULT_NATURAL_CAMPAIGN_ID,
					external : utils.getCookie(COOKIE_EXTERNAL_CAMPAIGN_ID),
					internal : utils.getCookie(COOKIE_INTERNAL_CAMPAIGN_ID),
					offer : utils.getCookie(COOKIE_OFFER_CAMPAIGN_ID)
				};

				var campaigns = internalUtils.evaluate(user, form);

				if (typeof callback === 'function') {
					callback(campaigns);
				}
			});
		}
	};
}

/**
 * Helper class for Eloqua which augments built-in JS
 *  - adds prepopulation
 *  - improves validation logic
 *  - adds Red Hat specific functionality
 **/
EloquaHelper = function(cfg) {

	if (typeof cfg.getFieldLabels == 'function') {
		utils.getFieldLabels = cfg.getFieldLabels;
	}

	return {
		form : cfg.form || document.forms[0],

		// initializer
		init : function() {

			var useLegacyCampaignTracking = false;

			if (useLegacyCampaignTracking) {
				this.setCampaignTrackingFields(new BasicCampaignTrackingStrategy());
			} else {
				this.setCampaignTrackingFields(new TacticOfferCampaignTrackingStrategy());
			}

			this.addOmniFooter();

			this.overrideValidation();
			this.addDynamicStates();

			if (cfg.prepopulate) {
				if (cfg.useRedHatLoginLookup) {
					this.prepopulate('user', utils.getRedHatLoginFromCookie());
				} else {
					this.prepopulate('visitor');
				}
			}

			if (cfg.copyRedHatLogin) {
				this.copyRedHatLogin(false);
			}

			this.copyQueryStringParameters(QUERY_STRING_FORM_PREFIX);
			this.fixSiteSearch();

			// add custom form validation
			this.addCustomValidation(utils.buildDynamicStateValidator());

			if (!document.getElementById(utils.errorMessageId)) {
				utils.buildErrorMessageContainer();
			}

			if (cfg.requiredCheckboxes && cfg.requiredCheckboxes.length) {
				this.addCustomValidation(utils.buildRequiredCheckboxesValidator(cfg.requiredCheckboxes));
			}
		},

		// add custom validation logic
		addCustomValidation : function(validatorFn) {

			if (typeof validatorFn !== 'function') {
				return false;
			} else {
				utils.validators.push(validatorFn);
			}
		},

		// add dynamic state field which changes in response to country choice
		addDynamicStates : function() {

			if (cfg.stateOptionsFormUrl) {
				utils.stateOptionsFormUrl = cfg.stateOptionsFormUrl;
			}

			var stateField = utils.getStateField();
			var countryField = utils.getCountryField();

			if (stateField && countryField && stateField.nodeName == 'SELECT' && countryField.nodeName == 'SELECT') {
				utils.initStateOptions();
	
				countryField.onchange = utils.updateState;
			}
		},

		// dynamically include rh_omni_footer.js if appropriate
		addOmniFooter : function() {
			var host = window.location.host;
			if (host.indexOf('engage.redhat.com') == -1 && host.indexOf('engage.jboss.com') == -1) {
				return; // only track if on a hypersite
			}

			var scripts = document.getElementsByTagName('script');
			for (var i=0; i<scripts.length; i++) {
				var src = scripts[i].getAttribute('src');
				if (src && src.indexOf('rh_omni_footer.js') != -1) {
					return; // already present
				}
			}

			var script = document.createElement('script');
			script.setAttribute('src', cfg.rhOmniFooterUrl);
			document.body.appendChild(script);
		},

		// copy the Red Hat login from its cookie and optionally hide the field
		copyRedHatLogin : function(andHide) {
			var loginField = document.getElementById('RedHatLogin');
			var rh_login = utils.getRedHatLoginFromCookie();

			if (loginField && rh_login) {
				utils.popField('RedHatLogin', rh_login, andHide);
			}
		},

		// copy query string parameters
		// Usage:
		//  <input type="hidden" id="${fieldPrefix}foo" name="${fieldPrefix}foo" />
		//  /forms/myform?foo=bar will set "bar" as the value for field with ID: ${fieldPrefix}foo
		copyQueryStringParameters : function(fieldPrefix) {
			var qs = window.location.search;

			if (qs && qs.length > 1) {
				var parts = qs.substr(1).split('&');
				for (var i=0; i<parts.length; i++) {
					var kv = parts[i].split('=');
					if (kv.length == 2) {
						var fieldId = fieldPrefix + kv[0];
						var f = document.getElementById(fieldId);
						if (f && f.nodeName == 'INPUT' && f.type == 'hidden') {
							utils.popField(fieldId, kv[1]);
						}
					}
				}
			}
		},

		// Since Eloqua will wrap our entire layout with a FORM tag,
		// many browsers will strip out the site search form.  This fixes search.
		fixSiteSearch : function() {
			var siteSearchWrap = document.getElementById("site-search");
			if (siteSearchWrap) {
				var inputs = siteSearchWrap.getElementsByTagName('input');
				for (var i=0; i<inputs.length; i++) {
	    				if (inputs[i].type == 'text' || inputs[i].type == 'submit') {
						// handle "Enter"
						inputs[i].onkeyup = function(e) {
		    					if (e.keyCode == 13) {
								return utils.doSiteSearch();
		    					}
						}
	    				}
	    				if (inputs[i].type == 'submit') {
						// handle click
						inputs[i].onclick = function(e) {
		    					return utils.doSiteSearch();
						}
	    				}
				}
    			}
		},

		// override Eloqua's default validation functions
		//  - allow custom validators
		//  - improve error handling
		overrideValidation : function() {

			if (typeof CheckElqForm == 'undefined') {
				// if validation is not pre-configured, do nothing
				return;
			}

			// append a stylesheet for validation purposes
			var stylesheet = document.createElement('link');
			stylesheet.setAttribute('href', stylesheetURL);
			stylesheet.setAttribute('rel', 'stylesheet');
			stylesheet.setAttribute('type', 'text/css');
			document.body.appendChild(stylesheet);

			// create a closure on current validation implementation
			var _CheckElqForm = (function(){ return CheckElqForm; }());

			// override a built-in Eloqua validation function
			CheckElqForm = function(elqForm) {
				var valid = _CheckElqForm(elqForm);

				// execute custom validators
				for (var i=0; i<utils.validators.length; i++) {
					errorSet = utils.validators[i](errorSet);
				}
				
            			if (errorSet.length) {
                			DisplayErrorSet(errorSet);

					if (typeof cfg.onError == 'function') {
						cfg.onError.apply(this);
					}

                			return false;
            			} else {
					ResetHighlight();
					return true;
				}

			}

			// overrides a built-in Eloqua validation function
    			DisplayErrorSet = function(ErrorSet) {
       				for (var i = 0; i < ErrorSet.length; i++) {
          				utils.toggleFieldValidation( errorSet[i].Field, true );
       				}

       				// display a general "please fill out all fields marked in red" type message
       				if (ErrorSet.length) {
					utils.displayErrorMessage(cfg.errorMessageText);
       				}
    			}

    			// overrides a built-in Eloqua validation function
    			ResetHighlight = function() {
       				var field;

       				if (errorSet != null) {
          				for (var i = 0; i < errorSet.length; i++) {
             					utils.toggleFieldValidation( errorSet[i].Field, false );
          				}
        			}
       				errorSet = new Array();

				utils.displayErrorMessage('');
    			}
		},

		// prepopulate a form from a given context
		// valid type values are "user", "contact", or "visitor"
		prepopulate : function(type, payload) {
			var that = this;
			if ('user' == type) {
				if (payload) {
					EloquaDataLookupHelper.buildLookup(SITE_ID, USER_LOOKUP_KEY, 'C_Red_Hat_Login1', payload, function(){
						that.prepopulate('contact', this.get('C_EmailAddress'));
					});
				} else {
					this.prepopulate('visitor');
				}
			} else if ('contact' == type && payload) {
				EloquaDataLookupHelper.buildLookup(SITE_ID, CONTACT_LOOKUP_KEY, 'C_EmailAddress', payload, function(){
					utils.prepopulateFromLookup(this, cfg.hidePrepopulatedFields);
				});
			} else if ('visitor' == type) {
				// visitor lookup used as default
				EloquaDataLookupHelper.buildLookup(SITE_ID, VISITOR_LOOKUP_KEY, null, null, function(){
					that.prepopulate('contact', this.get('V_Email_Address'));
				});
			}
		},

		setCampaignTrackingFields : function(strategy) {
			var field_mapping = {
				'OmnitureExternalCampaignId' : 'externalCampaignId',
				'OmnitureInternalCampaignId' : 'internalCampaignId'
			}

			strategy.fetchCampaignIds(this.form, function(campaigns) {
				for (var k in field_mapping) {
					if (field_mapping.hasOwnProperty(k)) {
						var el = document.getElementById(k);
						if (el) {
							el.value = campaigns[field_mapping[k]] || '';
						}
					}
				}
			});
		}
	};
}


/**
 * Helper class for more robust data lookup handling
 * (supports multiple lookups within a page)
 **/
EloquaDataLookupHelper = function(config) {
	if (!config) { var config = {}; }
	var INTERVAL = config.interval || 10;
	var BASE_URL = config.baseURL || "https://secure.eloqua.com/visitor/v200/svrGP.aspx";
	var PPS = config.pps || 50;

	return {
		buildLookup : function(siteId, key, field, query, onload) {
			var lookup = {};

			var scr = document.createElement("SCRIPT");
			scr.setAttribute("type", "text/javascript");
			scr.setAttribute('src', this.getURL(siteId, key, field, query));
			scr.onload = scr.onreadystatechange = function() {
				if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
					if (typeof GetElqContentPersonalizationValue === 'function') {
						lookup.get = (function(){ return GetElqContentPersonalizationValue; })();
                                        	GetElqContentPersonalizationValue = undefined;
					} else {
						lookup.get = function(){ return false; }
					}
					if (typeof onload == 'function') {
						onload.call(lookup);
					}
				}
			}
			document.body.appendChild(scr);
			return lookup;
		},

		getURL : function(siteId, key, field, query) {
			if (field && query) {
				var search = "<" + field + ">" + query + "</" + field + ">";
			} else {
				var search = "";
			}
			var fmt = "%0?pps=%1&siteid=%2&DLKey=%3&DLLookup=%4&ms=%5";
			var vals = [ BASE_URL, PPS, siteId, key, search, new Date() % 1000 ];
			return fmt.replace(/%([0-9])/g, function(m, i){ return vals[i]; });
		}
	};
}();


// onload handler
utils.addEvent(window, 'load', function(){
	var elqHelper = new EloquaHelper(eloquaConfig);
	elqHelper.init();
});
