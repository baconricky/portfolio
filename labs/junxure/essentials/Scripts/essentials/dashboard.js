
/**
 * THIS SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */


$(function() {
	
	// Initialize
	Init();
	
	
	
	/**********************************
		Settings and CSS junk
	***********************************/
	
	$('head').append('<style type="text/css">' +
		'.icon { width:75px; height:75px; }' +
		'.ticon { float:left; margin: .3em .5em; width:25px; height:25px; box-shadow:1px 1px 1px #aaa; }' +
		'.ui-dialog { text-align:left; }'+
		'.ui-dialog input[type="text"], .ui-dialog textarea { display:block; width:90%; }' +
		'</style>');
	
	
	/**********************************
		Dashboard initialization
	***********************************/
	
	function Init() {
		
		// Initialize dialogs
		initDialogs();
		
		// Portlet and sort related CSS classes
		var sortClasses = "ui-widget ui-widget-content ui-helper-clearfix";
		
		// Set every ui-widget segment with .ui-widget-header element as a sortable widget
		$('.ui-widget:has(.ui-widget-header)').each(function() {
			
			var s = $(this);
			var p = s.parentsUntil('.dashboard-container').parent();
			var h = s.children('.ui-widget-header:first').eq(0);
			
			if(!p.hasClass('ui-widget'))
				p.addClass(sortClasses);
			
			// Function icons
			//h.append('<div class="k-window-actions pull-right"><a href="#refresh" title="refresh"><i class="icon-refresh"></i></a> <a href="#config" title="config"><i class="icon-cog"></i></a> <a href="#fullscreen" title="fullscreen"><i class="icon-resize-full"></i></a><span style="width:10px"></span><a href="#toggle" title="toggle"><i class="icon-minus"></i></a> <a href="#close" title="close"><i class="icon-remove"></i></a></div>');
			
			h.append('<div class="k-window-actions k-header pull-right"><a href="#" class="k-window-action k-link" title="config"><span class="k-icon k-i-custom">Configure</span></a><a href="#" class="k-window-action k-link" title="refresh"><span class="k-icon k-i-refresh">Refresh</span></a><a href="#" class="k-window-action k-link" title="toggle"><span class="k-icon k-i-restore">Fullscreen</span></a><a href="#" class="k-window-action k-link" title="toggle"><span class="k-icon k-i-minimize">Minimize</span></a><a href="#" class="k-window-action k-link" title="close"><span class="k-icon k-i-close">Close</span></a></div>');
			
			// Need this to drag not highlight
			h.disableSelection();
			
			// Interaction cues
			h.css('cursor', 'move');
			$('.k-window-actions').css('cursor', 'pointer');
	
			// Wrap control stuff (like icons and headers) in a widget-header div
			// and the rest in a widget-content div
			//s.children().not('img[alt="icon"], .ui-widget-header, .k-window-actions')
			//	.wrapAll('<div class="ui-widget-header" />');
			
			//s.children().not('.ui-widget-content').wrapAll('<div class="ui-widget" />');
		});

		if (!$(".span1")) {
			$("body").after($("<span>").addClass("span1"));
		}
		
		$('.ui-widget:not(.no-resize)').each(function() {
			$(this).resizable({
				grid: $(".span4").width()
			});
		});
		
		// Trigger control initialization
		setControls();
	}

	/**********************************
		Dialog boxes
	***********************************/
	
	function initDialogs() {
		
		$('.dashboard-container')
		// Close widget dialog
		.append('<div id="dialog-confirm-close-widget" title="Close widget" style="display:none;">' + 
			'<h2">' +
			'You are about to delete this widget. Are you sure?'+
			'</h2>'+
			'</div>').
		
		// Config widget dialog
		append('<div id="dialog-config-widget" title="Modify" style="display:none;">' +
			'<form><fieldset><legend>Change widget content</legend>' +
			'<p><label>Title <input type="text" id="widget-title-text" /></label></p>'+ 
			'<p><label>Content <textarea rows="5" cols="50" id="widget-content-text">Some test content</textarea></label></p>'+ 
			'<p id="icon-field"><label>Icon URL <span>Will be resized to 75x75 pixels</span><input type="text" id="widget-icon-text" /></label></p>'+ 
			'</fieldset></form></div>');
	
		// Create and destroy these dialogs to hide them
		$('#dialog-confirm-close-widget').dialog("destroy");
		$('#dialog-config-widget').dialog("destroy");
	}

	/**********************************
		Widget controls
	***********************************/
	
	// Control icons
	function setControls(ui) {
		ui = (ui)? ui : $('.k-window-actions a');
		ui.on("click", function(e) {
			e.preventDefault();
			
			var b = $(this);
			var p = b.parentsUntil('.ui-widget').parent();
			var i = p.children('img[alt="icon"]:first').eq(0);

			var h = p.children('.ui-widget .ui-widget-header:first').eq(0);
		
			//console.log("click: " + b.attr('title'));


			// Control functionality
			switch(b.attr('title').toLowerCase()) {
				case 'config':
					//console.log("config");
					widgetConfig(b, p);
					break;
				
				case 'toggle':
					//console.log("toggle");
					widgetToggle($("span,i",b), p, i);
					break;
				
				case 'close':
					//console.log("close");
					widgetClose(b, p);
					break;
			}
		});
	}
	
	// Toggle widget
	function widgetToggle(b, p, i) {
		// Change the + into - and visa versa
		b.toggleClass('k-i-minimize').toggleClass('k-i-maximize');
		
		// Show/Hide widget content
			
		p.children('.ui-widget-content').eq(0).slideToggle();
		
		//.resizable( "disable" )

	}
	
		
	// Toggle widget
	function widgetToggleSize(b, p, i) {
		// Change the + into - and visa versa
		b.toggleClass('icon-chevron-up').toggleClass('icon-chevron-down');
		
		// Turn the big icon into a small one or visa versa
		if(i.hasClass('icon'))
			i.switchClass('icon', 'ticon', '300');
		else
			i.switchClass('ticon', 'icon', '300');
		
		// Show/Hide widget content
			
		p.children('.ui-widget-content').eq(0).slideToggle();
		
		//.resizable( "disable" )

	}
	
	// Modify widget
	function widgetConfig(w, p) {
		
		// Input elements in the dialog
		var dt = $('#widget-title-text');
		var dc = $('#widget-content-text');
		var du = $('#widget-icon-text');
		
		// Widget elements to change
		var wt = p.children('.ui-widget-header:first').eq(0);
		var wc = p.children('.ui-widget-content').eq(0);
		
		// If there is no icon on the widget, there's nothing to change
		var wi = p.children('img[alt="icon"]:first');
		if(wi.length > 0) {
			wi = p.children('img[alt="icon"]:first').eq(0);
			$('#icon-field').show();
		}
		else {
			$('#icon-field').hide();
		}
		
		$("#dialog-config-widget").dialog({
			resizable: true,
			modal: true,
			width: 500,
			open: function() {
				if(wi != null)
					du.val(wi.attr('src'));
				
				dt.val(wt.text());
				dc.val(wc.html());
			},
			buttons: [
				{
					text: "Cancel",
					"class": "btn",
					click: function() {
						$(this).dialog("close");
					}
				},
				{
					text: "Save changes",
					"class": "btn btn-primary",
					click: function(e, ui) {
						// Some widgets don't have an icon
						if(wi.length > 0) {
							if(notEmpty(du.val()))
								wi.attr('src', du.val());
						}
						
						// Update
						if(notEmpty(dc.val()))
							wc.html(dc.val());
						
						// Careful here, don't wanna lose the control icons
						if(notEmpty(dt.val())) {
							var ci = wt.children('div.k-window-actions');
							wt.html(dt.val());
							
							// Reset controls
							wt.prepend(ci);
							setControls(ci);
						}
						
						$(this).dialog("close");
					}
				}
			]
		});
	}
	
	// Close widget with dialog
	function widgetClose(w, p) {
		$("#dialog-confirm-close-widget").dialog({
			resizable: false,
			modal: true,
			buttons: [
				{
					text: "Cancel",
					"class": "btn",
					click: function() {
						$(this).dialog("close");
					}
				},
				{
					text: "Close widget",
					"class": "btn btn-primary btn-warning",
					click: function() {
						p.toggle('slide', {}, 500, function() {
							p.remove();
						});
						$(this).dialog("close");
					}
				}
			]
		});
	}
	
	
	/**********************************
		Tabs for multiple dashboards 
	***********************************/
	
	$("#dashboard-tabstrip").kendoTabStrip({
		animation: { open: { effects: "fadeIn"} }
	});
	
	
	/**********************************
		Sort functionality 
	***********************************/
	$( ".sort-area" ).sortable({
		placeholder: "ui-state-highlight",
		connectWith: ".sort-area",
		containment: ".sort-area",
		helper: 'clone',
		opacity: 0.6,
		dropOnEmpty: true,
		forcePlaceholderSize: true,
		forceHelperSize: true
		
	}).disableSelection();	
	
	$( ".sort-area  .ui-widget" ).on("mousedown", function() {
		////console.log("width: " + $(this).width());
		////console.log("height: " + $(this).height());
		
		//$( ".sort-area" ).sortable( "option", "grid", [$(this).width(), $(this).height()] );
		
		$( ".sort-area .ui-state-highlight" ).width($(this).width()).height($(this).height());
	});	
	
	/**********************************
		Helpers
	***********************************/

	function notEmpty(t) {
		if(t) {
			if($.trim(t) != "")
				return true;
		}
		return false
	}
});





















































/*

WTF is juice?!
	- Dave Chappelle

*/