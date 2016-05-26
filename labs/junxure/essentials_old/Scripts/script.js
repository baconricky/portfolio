/* Author:
(c)2012 CRM Software


*/

/*****************************************************************
 ** Readme
 *****************************************************************

1. id, name and class naming ##

Per HTML Spec: ID and NAME attributes must begin with a letter ([A-Za-z]) and may be followed by any number of letters, digits ([0-9]), hyphens ("-"), underscores ("_"), colons (":"), and periods (".")


Contents
0. Global Variables
1. essentials object
2. essentials.util helper classes
*****************************************************************/

/*****************************************************************\
0. Namespace
\*****************************************************************/
var GLOBAL = "constant",
    globalVar = 0;
    
/*****************************************************************\
 1. essentials

 The heart of the beast - all reusable methods and functions should be added here.

 Available Functions:
  * Setup
  * SetSidebar
  * SetAutoResize

 Usage:
	External: 
		jxEssentials.Setup();
	Internal: 
		o.Setup();

 Private Functions/Variables:
  * isFirstRun - used to determine if some functions should be run only at load time

 Usage:
	Internal: 
		p.isFirstRun

 @$ - jQuery
 @w - window
 @undefined - 
\*****************************************************************/
//
// create closure
//

;(function($, undefined) {
    /**
     * @name essentials
     */
    var essentials = window.essentials = window.essentials || {},
        extend = $.extend,
        each = $.each,
        proxy = $.proxy,
        isArray = $.isArray,
        noop = $.noop,
        isFunction = $.isFunction,
        math = Math,
        retryCount = 0,
        JSON = window.JSON || {},
        _o = {
            ready: false,
            debug: true
        };

    essentials.Options = function() {
        function set(opts) {
            $.extend(_o, opts);
        }

        function get() {
            return _o;
        }

        function getValue(key) {
            return _o[key];
        }

        return {
            Set: set,
            Get: get,
            GetValue: getValue
        }
    }

    essentials.Debug = function(msg) {
        var UseDebug = essentials.Options().Get("debug"),
            HasConsole = (window.console && window.console.log);

        if (UseDebug) {
            if (HasConsole) {
                window.console.log('[Essentials]: ' + msg);
                window.console.log();
            } else {
                alert('[Essentials]: ' + msg);
            }
        }
    }

    essentials.LoadContent = function(opts) {
        var $source = $(opts.src),
            $target = $source,
            url = $source.attr("data-url") ? $source.attr("data-url") : $source.attr("href"); 
    
        essentials.Debug("[LoadContent]: " + url + " for " + opts.src);
            
        try {
            if (typeof url !== 'undefined' && url !== false) { 
                if (opts.target) $target = $(opts.target);  
            
                $target.html('<center><img alt="Updating...Please wait" src="Content/Images/loading.gif" /></center>').load(url, {cache:false}, function (response, status, xhr) {
                    essentials.Debug("[LoadContent] response:");
                    essentials.Debug(response);
    
                    if (status == "error") {
                        essentials.Debug("Error loading pView, Error " + response);
                    } else {
                        essentials.Debug("STATUS: " + status);
                    }
                });
            }
        } catch (e) {
            essentials.Debug("[essentials.LoadContent] ERROR");
            essentials.Debug(e);
			throw e;
        }
    }

    essentials.IsReady = function(status) { 
        if (typeof status !== 'undefined' ) {
            essentials.Options().Set({"ready":status});
       	}
   	    return essentials.Options().GetValue("ready");
	}
	
	essentials.EssentialsHeader = function() {
        essentials.LoadContent({from: "EssentialsHeader", src: '#app-header'});
    }
    essentials.EssentialsBody = function() {
        essentials.LoadContent({from: "EssentialsBody", src: '#app-workspace'});
    }   
    essentials.EssentialsFooter = function() {
        essentials.LoadContent({from: "EssentialsFooter", src:'#app-footer'});
	}

    essentials.Setup = function() {
        /**
        $("select").kendoComboBox();
        $("button, input[type=button], input[type=submit], input[type=reset]").addClass("k-button");
        **/
        try {
            //essentials.SetAutoResize();
            //essentials.SetExpandables();
            //essentials.SetOpenDialog();
        
            //essentials.IsReady(true);
        
            //if (essentials.IsReady) {
                essentials.EssentialsHeader();
                essentials.EssentialsBody();
				essentials.Sidebar();
                essentials.EssentialsFooter();
            //}
        } catch (e) {
            essentials.Debug("[essentials.Setup] ERROR");
            essentials.Debug(e);
			throw e;
        }
    }

    essentials.SetAutoResize = function(c,o) {
        var context = c || "textarea.expand",
            opts = o || { maxHeight: 200, minHeight: 20, extraSpace: 10 };
    
        try {
            $(context).autoResize(opts);
        } catch(e) {
            essentials.Debug('An error has occurred: '+e.message);
        }
    }

	essentials.SetExpandables = function() {
      	var $theExpandables = $(".expandable");
      	
        try {
			$theExpandables.on("click", function() {
				var $this = $(this),
					isVisible = $this.is(":visible");

		    	$this.removeClass('expand-btn minimize-btn');
		    	$this.addClass(isVisible ? "expand-btn" : "minimize-btn");
        
		    	$this.slideToggle( 500, "easeOutBounce", function() { 
	        		$this.removeClass('expand-btn minimize-btn');
	        		$this.addClass(isVisible ? "expand-btn" : "minimize-btn");
        		});
        	});
		} catch (e) {
			//console.log("[SetExpandables] ERROR: ");
			//console.log(e);
			throw e;
		}

        /*$(".toggle").on("click", function() {
               $(this).next().toggle(150, function() {
                   if ($(this).is(":hidden")) {
                       $("#summary-toggle-img").attr("src", "Content/junxure/icons/down_circular.png");
                   } else {
                       $("#summary-toggle-img").attr("src", "Content/junxure/icons/up_circular.png");
                   }
               });
               return false;
           });
           */

    }

    essentials.SetOpenDialog = function() {
        $(".open-dialog").on("click", function(e) {
            essentials.Debug("essentials.OpenDialog:");
    		essentials.Debug("e:");
    		essentials.Debug(e);
    	});
    }

	essentials.Sidebar = function() {
		//console.log("== essentials.Sidebar ==");
		var $sideBar = $('#app-sidebar'),
		    retryCount = 0;
		
		var onSelect = function(e) {
               e.preventDefault();
            var clicked = $("a", e.item);
            
            var url = $(e.item).attr('data-url'),
                href = $(e.item).attr('href');
                
            // For some browsers, `attr` is undefined; for others,
            // `attr` is false.  Check for both.
            if ((typeof url !== 'undefined' && url !== false) || (typeof href !== 'undefined' && href !== false)) {
                essentials.LoadContent({from: "Sidebar", src: clicked, target: "#app-body"});
            }
        };
    
        var side = $sideBar.kendoPanelBar({
            dataSource:jxSampleData.Sidebar,
            animation: {
                open: {
                    effects: "slideIn:down"
                }
            },
            hoverDelay: 150,
            select: onSelect
        });
		//console.log(side);
	}

    essentials.SetWorkspaceToolbar = function() {
        essentials.LoadContent({from: "RecordsToolbar", src: '#app-workspace-toolbar'});
        $("#tabs").tabs();
        $("#tabs-1").tabs();
    }
    
})(jQuery);

$(document).ready(function() {
    essentials.Setup();
    //essentials.Debug("-- Essentials should be ready --");
    //$(".app-tiles").tile(4);
});

// Close open dropdown slider by clicking elsewhwere on page
$(document).on('click', function(e) {    
    if (e.target.id != $('.dropdown').attr('class')) {
        $('.dropdown-slider').slideUp();
        //$('span.toggle').removeClass('active');
    }
});

$(window).on("load", function() {
    //$(".app-tiles").tile(4);
}).on("resize", function() {
    //$(".app-tiles").tile(4);
});

/**
 * Flatten height same as the highest element for each row.
 *
 * Copyright (c) 2011 Hayato Takenaka
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * @author: Hayato Takenaka (http://urin.take-uma.net)
 * @version: 0.0.2
**/
;(function($) {
    $.fn.tile = function(columns) {
        var tiles, max, c, h, last = this.length - 1, s;
        if(!columns) columns = this.length;
        this.each(function() {
            if ($(this).is("visible")) {
                s = this.style;
                if(s.removeProperty) s.removeProperty("height");
                if(s.removeAttribute) s.removeAttribute("height");
            }
        });
        return this.each(function(i) {
            if ($(this).is("visible")) {
                c = i % columns;
                if(c == 0) tiles = [];
                tiles[c] = $(this);
                h = tiles[c].height();
                if(c == 0 || h > max) max = h;
                if(i == last || c == columns - 1) $.each(tiles, function() { this.height(max); });
            }
        });
	};
})(jQuery);

var fluid = {
    Toggle : function(){
    	var default_hide = {"grid": true };
    	$.each(
    		["div", "paragraphs", "blockquote", "list-items", "section-menu", "tables", "forms", "login-forms", "search", "articles", "accordion"],
    		function() {
    			var el = $("#" + (this == 'accordon' ? 'accordion-block' : this) );
    			if (default_hide[this]) {
    				el.hide();
    				$("[id='toggle-"+this+"']").addClass("hidden")
    			}
    			$("[id='toggle-"+this+"']")
    			.bind("click", function(e) {
    				if ($(this).hasClass('hidden')){
    					$(this).removeClass('hidden').addClass('visible');
    					el.slideDown();
    				} else {
    					$(this).removeClass('visible').addClass('hidden');
    					el.slideUp();
    				}
    				e.preventDefault();
    			});
    		}
    	);
    } 
};

jQuery(function ($) {
	if($("[id^='toggle']").length){fluid.Toggle();}
});



