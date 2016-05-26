/*
 * Training newsletter prepopulation script for use with Eloqua
 *  - provides helper text for email address (configure placeholder_email)
 *  - provides a default country selection based on URL format
 */
// cross-browser event handling implementation (so we don't clobber window.onload)
var addEvent = function( obj, type, fn ) {
        if (obj.addEventListener)
                obj.addEventListener(type, fn, false);
        else if (obj.attachEvent)
                obj.attachEvent('on' + type, function() { return fn.apply(obj, new Array(window.event));});
}

var map = {
	'' : 'US', // default option
	'au' : 'AU',
	'cn' : 'CN',
	'de' : 'DE',
	'emea-es' : 'ES',
	'fr' : 'FR',
	'in' : 'IN',
	'it' : 'IT',
	'jp' : 'JP',
	'kr' : 'KR',
	'latam-es' : 'AR',
	'nl' : 'NL',
	'pt' : 'PT',
	'uk' : 'UK'
}
var placeholder_email = 'my@email.address';

// onload handler
addEvent(window, 'load', function(){
	
	// set the email address to a placeholder
	var em_field = document.getElementById('C_EmailAddress');
	if (em_field) {
		em_field.value = placeholder_email;
		em_field.onfocus = function(){
			if (this.value == placeholder_email) {
				this.value = '';
			}
		}
		em_field.onblur = function(){
			if (this.value == '') {
				this.value = placeholder_email;
			}
		}
	}

	// based on the URL, pre-set "Country"
	var loc = window.location.href;
	var matches = loc.match(/training-newsletter-?(.*)$/);

	if (matches) {
		var ct_field = document.getElementById('C_Country');

		var country = map[ matches[1] ];

		if (country && ct_field) {
			ct_field.value = country;
		}
	}

}); // end onload
