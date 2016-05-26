/*****************************************************************
Notes and Readme:

1. id, name and class naming ##

Per HTML Spec: ID and NAME attributes must begin with a letter ([A-Za-z]) and may be followed by any number of letters, digits ([0-9]), hyphens ("-"), underscores ("_"), colons (":"), and periods (".")


Contents
1. opts

This is a placeholder object with useful constant data (icons, etc) and some example data (samples)
*****************************************************************/

/*****************************************************************\
0. Globally Available
\*****************************************************************/
var status = new $.Deferred();

/*****************************************************************\
 1. jxEssentials

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
    var Essentials = window.Essentials = window.Essentials || {},
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
            debug: false
        };

    Essentials.Options = function() {
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

    Essentials.ResetInputs = function(s) {
        var $scope = $(s) || $(document);
        
        $(".button", $scope).button();
        $(".TimeSpent", $scope).kendoNumericTextBox();
        $(".DatePicker", $scope).kendoDatePicker();
        $("select", $scope).kendoDropDownList();
    }
    Essentials.Debug = function(msg) {
        var UseDebug = Essentials.Options().Get("debug"),
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

    Essentials.LoadContent = function(opts) {
        var $source = $(opts.src),
            $target = $source,
            url = $source.attr("data-url") ? $source.attr("data-url") : $source.attr("href"); 

        var content = {};
        
        function getContent( url ) {
            //always reset for dev
            content = {};
            // return either the cached value or an
            // jqXHR object (which contains a promise)
            return content[ url ] || $.ajax(url, {
                cache: false,
                success: function( resp ){
                    content[ url ] = resp;
                }
            });
        }
        
        $target.html('<center class="spinner"><img alt="Updating...Please wait" src="Content/Images/loading.gif" /></center>');
        
        $.when(getContent(url)).then(function(r){
            $target.html(r);
            // do something with the response, which may
            // or may not have been retreived using an
            // XHR request.
        }, function(r) {
            Essentials.Debug("Error loading pView, Error " + r);
        }, function() {
            $target.remove(".spinner");
        });
   
    }

    Essentials.IsReady = function(status) { 
        if (typeof status !== 'undefined' ) {
            Essentials.Options().Set({"ready":status});
       	}
   	    return Essentials.Options().GetValue("ready");
	}
	
	Essentials.EssentialsHeader = function() {
        Essentials.LoadContent({from: "EssentialsHeader", src: '#app-header'});
    }
    Essentials.EssentialsBody = function() {
        Essentials.LoadContent({from: "EssentialsBody", src: '#app-workspace'});
    }   
    Essentials.EssentialsFooter = function() {
        Essentials.LoadContent({from: "EssentialsFooter", src:'#app-footer'});
	}
	
    Essentials.Setup = function() {
        try {
            Essentials.EssentialsHeader();
            Essentials.EssentialsBody();
			Essentials.Sidebar();
            Essentials.EssentialsFooter();

            Essentials.SetCollapsible();
            $("select").kendoComboBox();
            $("button, input[type=button], input[type=submit], input[type=reset]").addClass("k-button");
        } catch (e) {
            //console.log("[Essentials.Setup] ERROR");
            //console.log(e);
			throw e;
        }
    }

    Essentials.SetAutoResize = function(c,o) {
        var context = c || "textarea.expand",
            opts = o || { maxHeight: 200, minHeight: 20, extraSpace: 10 };
    
        try {
            $(context).autoResize(opts);
        } catch(e) {
            Essentials.Debug('An error has occurred: '+e.message);
        }
    }

    Essentials.SetOpenDialog = function() {
        $(".open-dialog").on("click", function(e) {
            Essentials.Debug("jxEssentials.OpenDialog:");
    		Essentials.Debug("e:");
    		Essentials.Debug(e);
    	});
    }

	Essentials.Sidebar = function() {
		console.log("== Essentials.Sidebar ==");
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
                Essentials.LoadContent({from: "Sidebar", src: clicked, target: "#app-body"});
            }
        };
        
        $sideBar.kendoPanelBar({
            dataSource: SampleData.GetSidebarData(),
            animation: {
                open: {
                    effects: "slideIn:down"
                }
            },
            hoverDelay: 150,
            select: onSelect
        });
        
	}

    Essentials.SetWorkspaceToolbar = function() {
        Essentials.LoadContent({from: "RecordsToolbar", src: '#app-workspace-toolbar'});
        $("#tabs").tabs();
        $("#tabs-1").tabs();
    }
    
    Essentials.GUnits = function() {
        var $container = $('.gunit-container'),
            $container_gunits = $container.attr("data-available-gunits"),
            $available_gunits = $container_gunits,
            gunit_width = ($container.width() / $available_gunits);
            
        $container.children("div, li").each( function() {
            var $this = $(this),
                u = $this.attr("data-gunits") ? $this.attr("data-gunits") : 1;
            
                $this.width((92/$container_gunits)*u+"%");
                
            if ($available_gunits <= u) {
                $this.addClass("last");
                $available_gunits = $container_gunits;
            } else {
                $available_gunits = $available_gunits - u;
            }            
        });
        
        //$container.width( gunit_width * $container_gunits);
    }
    
    Essentials.SetCollapsible = function() {
        $(".collapsible").each(function() {
            $(this).addClass("ui-widget");
            
            // Check if there are any child elements, if not then wrap the inner text within a new div.
            if ($(this).children().length == 0) {
                $(this).wrapInner("<div></div>");
            } 
            
            // Wrap the contents of the container within a new div.
            $(this).children().wrapAll("<div class='collapsible-content ui-widget-content'></div>");
            
            // Create a new div as the first item within the container.  Put the title of the panel in here.
            $("<div class='collapsible-title ui-widget-header'><h2>" + $(this).attr("title") + "</h2></div>").prependTo($(this));
        
            // Assign a call to collapsible-titleOnClick for the click event of the new title div.
            $(".collapsible-title", this).on("click", function() {
                 $(".collapsible-content", $(this).parent()).slideToggle();
            });
        });
    }
    
})(jQuery);

$(document).ready(function() {
    Essentials.Setup();
    Essentials.Debug("-- Essentials should be ready --");
});

// Close open dropdown slider by clicking elsewhwere on page
$(document).on('click', function(e) {    
    if (e.target.id != $('.dropdown').attr('class')) {
        $('.dropdown-slider').slideUp();
        $('span.toggle').removeClass('active');
    }
});
