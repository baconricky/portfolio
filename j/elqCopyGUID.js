/**
 * Copies elqCustomerGUID value into a form field
 *   also, create a cookie on RedHat.com so our servers can read it
 **/

var FIELD_ID = 'elqCustomerGUID';
var COOKIE_NAME = 'rh_elqCustomerGUID';
var COOKIE_DOMAIN = '.redhat.com';
var COOKIE_TTL = 30 * 24 * 60 * 60 * 1000; // 30d

var _onload = function() {
	if (typeof GetElqCustomerGUID == 'function') {
		var elqCustomerGUID = GetElqCustomerGUID();
		var field = document.getElementById(FIELD_ID);

		if (field) {
			field.value = elqCustomerGUID;
		}
		
		var now = new Date;
		var expires = new Date(now.getTime() + COOKIE_TTL);
		document.cookie = COOKIE_NAME + "=" + escape(elqCustomerGUID) + ";expires=" + expires.toGMTString() + ";path=/;domain=" + COOKIE_DOMAIN;
	}
}

if (window.addEventListener) {
	window.addEventListener('load', _onload, false);
} else if (window.attachEvent) {
	window.attachEvent('onload', function() { return _onload.apply(window, new Array(window.event)); });
}
