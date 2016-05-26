$.fn.elqTrack = function(siteid, elqid) {
	if (typeof elqid == "undefined") elqid = "";
	if (typeof siteid == "undefined") return false;

	var elqVer = "v200";
	var url = (document.location.protocol == "https:" ? "https://secure" : "http://now") + ".eloqua.com/visitor/" + elqVer + "/svrGP.aspx";
	var ref2 = document.referrer != "" ? document.referrer : "elqNone";

	this.each(function() {
		var ref = this.href;
		if(ref == "") return false;

		$(this).click(function() {
			var ms = new Date().getMilliseconds();
			var track = url + "?pps=10&siteid=" + siteid + "&elq=" + elqid + "&ref=" + ref + "&ref2=" + ref2 + "&ms=" + ms;

			$.ajax({
				url: track,
				async: false,
				dataType: "script"
			});
			return false;
		});
	});
};

//jQuery function
//
//usage:
//var elqTracker = new jQuery.elq(xxx);
//elqTracker.pageTrack();
$.elq = function(siteid) {
    console.log("starting elq for ", siteid);
    
	var elqVer = "v200";
	var url = (document.location.protocol == "https:" ? "https://secure" : "http://now") + ".eloqua.com/visitor/" + elqVer + "/svrGP.aspx";
	var siteid = siteid;
	var elqGUID;
    
    return {
        pageTrack : function(options) {
    		settings = $.extend({
    			url: "",
    			success: ""
    		}, options);

    		var ref2 = document.referrer != "" ? document.referrer : "elqNone";
    		var tzo = new Date(20020101).getTimezoneOffset();
    		var ms = new Date().getMilliseconds();



    		if(settings.url != "") {
    			//track the url specified
    			var elqSrc = url + "?pps=31&siteid=" + siteid + "&ref=" + settings.url + "&ref2=" + ref2 + "&tzo=" + tzo + "&ms=" + ms;

    			if($("#elqFrame").length > 0) {
    				$(elqFrame).load(function () {
    					if(typeof settings.success == "function"){
    						settings.success();
    					}
    				});
    				$("#elqFrame").attr("src", elqSrc);
    			} else {
    				var elqFrame = document.createElement("iframe");
    				elqFrame.style.display = "none";
    				elqFrame.id = "elqFrame";
    				$(elqFrame).load(function () {
    					if(typeof settings.success == "function"){
    						settings.success();
    					}
    				});
    				elqFrame.src = elqSrc;
    				document.body.appendChild(elqFrame);
    			}
    		} else {
    			//track this page
    			var elqSrc = url + "?pps=3&siteid=" + siteid + "&ref2=" + ref2 + "&tzo=" + tzo + "&ms=" + ms;

    			var elqImg = new Image(1,1);
    			$(elqImg).load(function () {
    				if(typeof settings.success == "function"){
    					settings.success();
    				}
    			});
    			elqImg.src = elqSrc;
    		}


    	},
        getGUID : function(callback) {
    		var ref = location.href;
    		var ms = new Date().getMilliseconds();
    		var guid = url + "?pps=70&siteid=" + siteid + "&ref=" + ref + "&ms=" + ms;
        
            console.log("this.getGUID guid url: ", guid);
        
    		var elqGUID;

    		$.ajax({
    			url: guid,
    			async: false,
    			dataType: "script",
    			success: function() {
    				var elqGUID;
    				if (typeof GetElqCustomerGUID == "function") {
    					elqGUID = GetElqCustomerGUID();
    				} else {
    					return false;
    				}

    				if (typeof callback == "function") {
    					callback(elqGUID);
    				} else {
    					return false;
    				}
    			}
    		});
    	},
        
        getData : function(options) {
       
    		var def = null;
    		var settings = $.extend({
    			src: "",
                lookupParam: "",
    			lookup: "",
    			success: ""
    		}, options);

    		console.warn("[elq tracking] getData settings: ", settings);
        
    		if(settings.key != "") {
    			var ms = new Date().getMilliseconds();
    			var dlookup = url + "?pps=50&siteid=" + siteid + "&DLKey=" + settings.lookup + "&DLLookup=" + encodeURIComponent(settings.lookupParam) + "&type=" + settings.lookupFunc + "&ms=" + ms ;

    			def = $.ajax({
    				url: dlookup,
    				async: true,
    				dataType: "script",
                    cache: false,
                    beforeSend: function() {
                        GetElqContentPersonalizationValue = false;
                    },
    				success: function() {
    					if (settings.lookupObj && settings.lookupFunc) {
    						if (typeof GetElqContentPersonalizationValue === 'function') {
                                settings.lookupObj[settings.lookupFunc] = (function(){ return GetElqContentPersonalizationValue; })();
    						} else {
    							settings.lookupObj[settings.lookupFunc] = false;
    						}
    					}
    					if (typeof settings.success == "function") {
    						settings.success();
    					}
    					console.warn("[elq tracking] " + settings.lookupFunc + " Lookup URL = " + dlookup);
    					console.warn("[elq tracking] success :: ", settings.lookupFunc);
                        console.warn("[elq tracking] to settings.lookupObj: ", GetElqContentPersonalizationValue);
    				},
    				error: function() {
    					if (settings.lookupObj && settings.lookupFunc) {
    						settings.lookupObj[settings.lookupFunc] = false;
                        }
    					console.error("[elq tracking] " + settings.lookupFunc + " Lookup URL = " + dlookup);
    				    console.error("[elq tracking] error :: " + settings.lookupFunc + " to settings.lookupObj ", settings.lookupObj);
    				}
    			});
    		}
    		return def;
    	},
        
        redirect : function(options) {
    		settings = $.extend({
    			url: "",
    			elq: ""
    		}, options);

    		if(settings.url == "") return false;

    		var ms = new Date().getMilliseconds();
    		var ref2 = document.referrer != "" ? document.referrer : "elqNone";
    		var redir = url + "?pps=10&siteid=" + siteid + "&elq=" + settings.elq + "&ref=" + settings.url + "&ref2=" + ref2 + "&ms=" + ms;

    		$.ajax({
    			url: redir,
    			async: false,
    			dataType: "script"
    		});
	    }
    };
};