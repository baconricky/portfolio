// cross-browser event handling implementation (so we don't clobber window.onload)
var addEvent = function( obj, type, fn ) {
        if (obj.addEventListener)
                obj.addEventListener(type, fn, false);
        else if (obj.attachEvent)
                obj.attachEvent('on' + type, function() { return fn.apply(obj, new Array(window.event));});
}

// define omniture variable mapping by content type
var omni_event_mapping = {
    "contact-red-hat"	    : { "evar"  :   "eVar17",   "event" :  "event9"},
    "evaluation"            : { "evar"  :   "eVar16",   "event" :  "event10"},
    "event"		    : { "evar"  :   "eVar11",   "event" :  "event11"},
    "whitepaper"            : { "evar"  :   "eVar15",   "event" :  "event21"},
    "webinar-registration"  : { "evar"  :   "eVar14",   "event" :  "event15"},
    "archived-webinar"      : { "evar"  :   "eVar14",   "event" :  "event16"},
    "newsletter-signup"	    : { "evar"  :   "eVar17",	"event" :  "event9"},
    "contact-sales"	    : { "evar"  :   "",		"event" :  "event7"}
};

//URL Link for redirect.
var whathref;

// create a closure on formName
var formName = function(){ return formName }();

// onload handler
addEvent(window, 'load', function(){

	// hide the submit button!
	var sub = document.getElementById('submit');
	if (sub) { sub.style.display = 'none'; }

	// custom conversion tracking
	if (typeof elqContentType != 'undefined') {
		if (typeof formName == 'undefined') {
			var formName = document.forms ? document.forms[0].name : '';
		}

		// set the evar/events based on content type
		var config = omni_event_mapping[elqContentType];
		if (s && config) {
			s[config.evar] = formName;
			s.events = config.event;
		}

		// append the rh_omni_footer script (which fires the tracking code)
		var scr = document.createElement('script');
		scr.setAttribute('src', 'https://www.redhat.com/j/rh_omni_footer.js');
		document.body.appendChild(scr);
	}

	//Redirect "Thank you" form to webinar form after 5s.
	if (typeof elqContentType != 'undefined' && elqContentType == 'archived-webinar') {
		var i=0;
 		var max = document.links.length;
		for (i=0;i<max;i++)  {
			if (document.links[i].href.indexOf("webex")>-1){
        		  whathref = document.links[i].href; 
			  setTimeout("window.location = whathref",5000); 
			  break;
			}
   		}
	}

}); // end onload
