/**********************************************\
 Records Workspace Initialiation

 0. Prototype-only - these calls are only used in the prototype, or as a stepping stone for the "real" app.
 1. Records-Specific - UI init and interaction code that may be used in roduction. Will likely be configuration and init of plugins.
\**********************************************/

function Essentials() {}(function() {
	var $this = $(this),
		options = {};
		
	function defined(x) {
		return typeof x != 'undefined';
	}

	this.getObject = function(obj) {
		var $obj = false;
		
		if (typeof obj === 'object' && obj) {
			$obj = obj;
		} else if (typeof obj === 'string' && obj) {
			$obj = $(obj);
		}
	};
	
	this.define = function(key, value) {
		if (defined(options[key])) {
			options[key] = value;
		}
	};

	this.params = function(p) {
		Essentials.params = p;
	}
	
	this.updateBreadcrumb = function(trail) {
		$("#breadcrumb").html(
			'<ul class="breadcrumb"><li><a href="#">'+
				trail.join('</a> <span class="divider"><i class="icon-chevron-right"></i></span></li><li><a href="#">') +
			'</a></li></ul>');
	};
	
	this.ready = false;

	this.init = function() {
	    var $form = $("form[data-actions]"),
	    	form = $form.attr("id"),
	    	actions = $form.data("actions"),
        	$actions = $("#"+actions);

        this.reInit();
        

    };
        
	this.reInit = function() {
	    var $form = $("form[data-actions]"),
	    	form = $form.attr("id"),
	    	actions = $form.data("actions"),
        	$actions = $("#"+actions);
        	
       	this.initInputs();
       	
       	this.initForm( Essentials.params["mode"], form );
        	
        $("button", $actions).off("click").on("click", function(e) {
			e.preventDefault();

			var action = $(this).data("intent");
			
			switch (action) {
				case "edit":
				case "cancel":
				case "save":
					Essentials.toggleForm( action, form );
					break;
					
				case "delete":
					Essentials.deleteForm("Are you sure you want to delete this?");
					break;
			}
		});
		
		//Bootcamp
		$(".alert").alert();
		
		//jQuery UI
		$( ".squish" ).accordion({
			collapsible: true
		});
	}
		
	this.initInputs = function() {
		//console.log("== Essentials.initInputs ==");

		//these are safe to "re-run" at any time
		this.initSummary(".summary");
		this.initDatePicker(".datepicker");
		this.initChosenSelect(".chzn-select");
		this.initChosenMultiSelect(".chzn-select-deselect");
		this.initTabBar(".tabs");
		
		$( ".switch" ).button({
			className: "btn"
		});
		
		$( ".switch-group" ).buttonset({
			className: "btn"
		});
		
		//console.log("== /Essentials.initInputs ==");
	};

	this.initSummary = function(summary) {
		$(summary).kendoTreeView();
	};

	this.initChosenSelect = function(chzn) {
		//console.log("-- initChosenSelect --", $(chzn));

		$(chzn).chosen({ width: "100%"});
	};

	this.initChosenMultiSelect = function(chzn) {
		//used for "tags", search and other multi select text inputs
		$(chzn).chosen({
			disable_search_threshold: 0,
			width: "100%"
		});
	};

	this.initDatePicker = function(datepicker) {
		var $dp = $(datepicker),
			dt = new Date();

		$dp.each(function() {
			dt = $(this).val() || dt;

			$(this).kendoDatePicker({
				dateFormat: "mm/dd/yy",
				value: dt
			});
		});
		
		
		//$(".k-i-calendar").removeClass("k-icon").removeClass("k-i-calendar").addClass("icon-calendar");
		$(".k-i-calendar").parent(".k-select").remove(".k-i-calendar").addClass("icon-calendar");
	};
	
	this.initTabBar = function(tabbar) {
		$(tabbar).tabs({
			fx: { opacity: 'toggle' },
			spinner: "Retrieving content...",
			cookie: { expires: 30 }
		}).find( ".ui-tabs-nav" ).sortable({ axis: "x" });
	};

	this.navpanel = function(context) {
		var timeout = null,
			$nav = $(context);

		$(".toggle > div", $nav).on("click", function(){
			$("#panel, .toggle > div").slideToggle("fast", function() {
				$("#page_container").css("bottom", "35px");
			});
		});	
	};

	this.loadPview = function(target, url) {
		$(target).load(url, function() { /* loads external content into current div element */
			Essentials.reInit();
		});
	};
	
	this.initForm = function(act,form) {
		var $form = $("#"+form),
			actions = $form.data("actions"),
        	$actions = $("#"+actions),
			current_mode = Essentials.params["mode"];

		//if we're just resetting the form, don't change the mode (again)
			if ( act === "new" ) {
				Essentials.params["mode"] = "new";
				this.editForm(form, true);
			} else if ( act === "edit" ) {
				Essentials.params["mode"] = "edit";
				this.editForm(form);
			} else {
				this.viewForm(form);
			}
		
		this.formButtons(form);
	};
	
	this.toggleForm = function(act,form) {
		var $form = $("#"+form),
			actions = $form.data("actions"),
        	$actions = $("#"+actions),
			current_mode = Essentials.params["mode"];

 		if ( act === "save" ) {
			Essentials.params["mode"] = "view";
			this.viewForm(form);
 		} else if ( act === "cancel" ) {
			Essentials.params["mode"] = "view";
			this.viewForm(form);
		} else if ( act === "view" ) {
			Essentials.params["mode"] = "view";
			this.viewForm(form);
		} else if ( act === "new" ) {
			Essentials.params["mode"] = "new";
			this.editForm(form, true);
		} else if ( act === "edit" ) {
			Essentials.params["mode"] = "edit";
			this.editForm(form);
		}
	};
	
	this.viewForm = function(form) {
		var $form = $("#"+ form),
			actions = $form.data("actions"),
        	$actions = $("#"+actions),
			mode = Essentials.params["mode"],
			ctrlContainer = ".controls";
			
	    $(":input",$form).attr("disabled", "disabled").attr("readonly", "readonly");
	    
	    $(".chzn-select, .chzn-select-deselect").attr('disabled', true).trigger("liszt:updated");
	    
	    $(".datepicker").each(function(i,o) {
	    	$(o).data("kendoDatePicker").enable(false);
	    });
	    
	    this.formButtons(form);
	};
	
	this.deleteForm = function(message) {
		$( "#new-window:ui-dialog" ).dialog( "destroy" );
		
		$( "#new-window" ).attr("title", "Delete this?").html("Are you sure you want to delete this?").dialog({
			resizable: false,
			height: 200,
			width: "100%",
			modal: true,
			buttons: [
				{
					text: "Cancel",
					"class": "btn",
					click: function() {
						$( this ).dialog( "close" );
					}
				}, {
					text: "Delete",
					"class": "btn btn-warning",
					click: function() {
						$( this ).dialog( "close" );
					}
				}
			]
		});
	};


	this.editForm = function(form, isNew) {
		var isNew = isNew || false,
			$form = $("#"+ form),
			actions = $form.data("actions"),
        	mode = Essentials.params["mode"],
			$actions = $("#"+actions),
			ctrlContainer = ".controls";
			
		if ( isNew ) {
			$(":input", $form).val("").attr("checked", false);
			$(":input option", form).attr("selected", false);
			$("#ownership_liabilities, #net_value").hide();
		}
		
		$(":input",$form).attr("disabled", false).attr("readonly", false);
	    
	    $(".chzn-select, .chzn-select-deselect").attr("disabled", false).attr("readonly", false).trigger("liszt:updated");
	    
  	    $(".datepicker").each(function(i,o) {
	    	$(o).data("kendoDatePicker").enable(true);
	    });
		
		this.formButtons(form);
	};

	this.formButtons = function(form) {
		var $form = $("#"+ form),
			actions = $form.data("actions"),
        	mode = Essentials.params["mode"],
			$actions = $("#"+actions);

		
		//Hide all
		$("button", $actions).hide();
	    
	    $("button[data-display=all]", $actions).show();
	    
	    $("button[data-hide=" + mode + "]", $actions).hide();

	    $("button[data-display=" + mode + "]", $actions).show();
	};
	
	this.homeButton = function() {
		var that = this,
			home = $(".btn-home"),
			app_nav = $("#app_nav li:not(.home) a");
		
		setTimeout(function () {
			app_nav.fadeOut(700, "easeInOutExpo", false);
		}, 4000);
		
		home.on("mouseover", function() {
			app_nav.fadeIn(800, "easeInOutExpo", false);
		}).on("mouseout", function() {
			setTimeout(function () {
				app_nav.fadeOut(700, "easeInOutExpo", false);
			}, 8000);
		});
	};
	
}).apply(Essentials);

$(document).ready(function() {
	var $modal = $("#new-modal");

	Essentials.init();
	Essentials.homeButton();
	
	$(window).on("resize", function () {
		$(".chzn-select, .chzn-select-deselect").trigger("liszt:updated");
	})

	$(".remote-content").each(function() {
		var t = $(this),
			url = t.attr("data-src"),
			id = t.attr("id");

		$.ajax({
			url: url,
			success: function(html) { /* loads external content into current div element */
				t.html(html);
				$("#app-ribbon").officebar();
				$("#action-list li a").on("click", function() {
					Essentials.actionClickHandler();
				});

				if ($(t).attr("id") === "navpanel") {
					Essentials.navpanel("#navpanel");
				}
				
				t.removeClass("remote-content");
				Essentials.reInit();
				
			},
			error: function(e) {
				//console.log("ERR");
				//console.log(e);
			}
		});
	});
});