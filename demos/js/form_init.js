/* this file handles script initialization for dynamic form elements, such as tabs, drop-downs and datepickers */

// adds IE focus support for styling input fields
suckerfish(sfFocus,"input");

$(window).load(function()
{
	/* THIS FILE HAS BEEN DEPRECATED, ALERT THE USER SO THEY CAN REMOVE IT */
	alert("PAGE OUT OF DATE:\n\nThe JavaScript file 'form_init.js' has been deprecated.  Please remove its script tag and load 'nctracks_init.js' instead.\n\nPlease contact the UI Team if you experience any issues.");
	
/* BEGIN INITIALIZATION */	
	// editable table row inputs are hidden initially, so take their value and print it out until the user clicks on the row
	$("tr.editable :input").each(function()
	{
		if($(this).is("select"))
			$(this).before("<span>" + $(this).children("option:selected").html() + "</span>");
		else
			$(this).before("<span>" + $(this).val() + "</span>");
	});
	// construct detail rows for editable table rows with detail drop-downs
	$("tr.hasDetail").each(function()
	{
		$(this).after("<tr class='rowDetails hidden'><td colspan='" + $(this).children("td").length + "'></td></tr>");
	});
	// if a table row contains a link, make the entire row clickable
	$("tr:has(a), tr:has(:radio)").each(function()
	{
		// if the row has more than one link or input, don't make the row clickable
		if($("tr a, tr :input").length <= 1)
			$(this).addClass("clickable");
	});
	
	// hide tagged elements initially
	$(".hidden").css("display","none");
	
	/*$("ul.tabs").tabs("div.panes > div.formSection",
	{
		// when the user clicks on a tab, recalculate the drop shadow height
		onClick: function()
		{
			resizeShadow();
		}
	});*/
	
	// if there are too many tabs on the page, make them scrollable
	if($("ul.tabs li").length > 8)
	{
		$("ul.tabs").wrap("<div id='scrollableTabs'></div>");
		$("#scrollableTabs").before("<div id='tabPrev'><button type='button' class='prev browse left'></button></div>");
		$("#scrollableTabs").after("<div id='tabNext'><button type='button' class='next browse right'></button></div>");
		$("#scrollableTabs").scrollable(
		{
			size:			1,
			items:			".tabs",
			onReload:		function()
			{
				this.seekTo($("ul.tabs a").index($("a.current")),0);
			}
		});
	}
	
	// loops through input fields marked with the "required" class, finds their corresponding labels and adds the required icon to the left
	$(":input.required").each(function()
	{
		// if the required fields are in an optional additive fieldset, hide them initially so they can be shown once the user starts typing
		if($(this).parents("fieldset").hasClass("hideRequired"))
			var $icon = $("#requiredLegend img").clone().hide();
		else
			var $icon = $("#requiredLegend img").clone();
		$("label[for='" + $(this).attr("id") + "']").prepend($icon);
	});
	$("label.required").each(function()
	{
			var $icon = $("#requiredLegend img").clone();
			$(this).prepend($icon);
	});
	$("legend.required").each(function()
	{
		var $icon = $("#requiredLegend img").clone();
		$(this).children("span").prepend($icon);
	});
	
	// add audit icon
	$(":input.audit, td.audit").each(function()
	{
		// clone the img tag out of the form legend so the relative path is correct
		var $icon = $("#formLegend ul img[src$='audit.png']").addClass("fieldIcon").wrap("<a href='help.html' rel='#overlay'></a>");
		if($(this).is(":checkbox, :radio"))
			// to the right of the label on checkboxes and radio buttons
			$("#" + $(this).attr("id") + " + label").after($icon.clone());
		else if($(this).is("td"))
			// inside the <td> to the right on table cells
			$(this).append($icon.clone());
		else
			// to the right of text and select inputs
			$(this).after($icon.clone());
		
	});
	$("img.fieldIcon").wrap("<a href='help.html' rel='#overlay'></a>");
	
	// add datepicker icon to the right of date fields
	// clone the img tag out of the form legend so the relative path is correct
	var $icon = $("#formLegend ul img[src$='calendar.png']").addClass("fieldIcon");
	$(":input.dateInput").after($icon.clone());
	// hinting for date fields
	//$(":input.dateInput").coolinput(
	//{
	//	hint: 		"mm/dd/yyyy",
	//	blurClass: 	"formHint"
	//});

	// hinting for zip code fields
	$(":input.zip").coolinput(
	{
		hint: 		"12345-6789"
	});
	
	// hinting for SSN fields
	$(":input.ssn").coolinput(
	{
		hint: 		"123-45-6789"
	});
	
	// hinting for EIN fields
	$(":input.ein").coolinput(
	{
		hint: 		"12-3456789"
	});
	
	// hinting for phone number fields
	$(":input.phone").coolinput(
	{
		hint: 		"(123) 456-7890 x12345"
	});
	
	// remove blank options from empty cross-select boxes, they're only there for validation
	$("dl.crossSelect option[value='']:only-child").each(function()
	{
		$(this).remove();
	});
	
	// alternating row color-coding for data tables
	$evenRows = $("div.dataTable > table > tbody > tr:not(.emphasizeRow, .rowDetails):even").addClass("even");
	$oddRows = $("div.dataTable > table > tbody > tr:not(.emphasizeRow, .rowDetails):odd").addClass("odd");
/* END INITIALIZATION */
	
/* BEGIN EVENTS */
	$(document).click(function(event)
	{
		// only execute for left-clicks
		if(event.button == 0)
			$(event.target).parseElements();
		
		// if the user clicks anywhere else on the page, hide the calendar
		//if(!$(event.target).is("img.fieldIcon, :input.dateInput, #datepicker *"))
		//	$("#datepicker").slideUp("fast");	
	});
	
	$("select").change(function(event)
	{
		switch(true)
		{
			// show/hide code for select boxes
			case $(event.target).hasClass("showDetail"):
				// find the class of the selected option, that's the ID of the element we're showing
				var selectedClass = $(event.target).children("option:selected").getIdFromClass();
				// strip out "show-", add "-details" and format as ID
				var tagName = "#" + selectedClass + "-details";
				$(tagName).slideDown("fast",function()
				{
					resizeShadow();
				});
				// loop through all the other options; if they have triggered hidden elements, rehide them
				$(event.target).children("option:not(':selected')").each(function()
				{
					if(!$("option.show-" + $(this).getIdFromClass()).is(":selected"))
					{
						tagName = "#" + $(this).getIdFromClass() + "-details";
						$(tagName).slideUp("fast",function()
						{
							resizeShadow();
						});
					}
				});
				
			// if the user begins to fill out an optional fieldset, display the required icons for that fieldset
			case $(event.target).closest("fieldset").hasClass("hideRequired"):
				if($(event.target).val().length)
					$(event.target).closest("fieldset").find("img[src$='icon_required.gif']:hidden").css("display","inline");
				break;
		}
	});
	
	$("fieldset :input").keyup(function()
	{
		if($(this).parents("fieldset").hasClass("hideRequired"))
			if($(this).val().length)
				$(this).parents("fieldset").find("img[src$='icon_required.gif']:hidden").css("display","inline");
	});
	
	// when the user double-clicks an option in a cross-select box, move it to the other box
	$("select[multiple] option").live("dblclick",function()
	{
		var otherBox = $(this).parent().siblings("select[multiple]");
		$(otherBox).append($(this));
		$(otherBox).html($(otherBox).children("option").sort(sortAlpha));
	});
	
	// basic addition for adding input field values
	$(":input.add").keyup(function()
	{
		var sumTotal = 0;
		// get the other class name of the input they were editing
		var className = "." + $(this).attr("class").substr(4);
		// loop through all of the inputs greater than 0 in that class and add them together
		$(":input.add").each(function()
		{
			sumTotal += Number($(this).val());
		});
		// insert the total into the sum box
		$(":input.sum" + className).val(sumTotal);
	});
	
	// form legend
	$("#formLegend div").hover(
	function()
	{
		$("#formLegend ul").slideDown("fast");
	},
	function()
	{
		$("#formLegend ul").slideUp("fast");
	});
	
	$(':input.dateInput').bind("click focus", function() {
		// show calendar for date fields when the user clicks on the field or the button
		Date.firstDayOfWeek = 0;
		Date.format = 'mm/dd/yyyy';
		var dateString = new Date().asString();
		if ($(this).val() != "  /  /    ") {
			dateString = Date.fromString(jQuery(this).val()).asString();
		}
		$(this).datePicker({startDate:'01/01/1900', focusInput:true, clickInput:true, createButton:false, showYearNavigation:true}).dpSetOffset(20, -13);
		$(this).dpDisplay();
		$(this).removeClass('formHint');

	});

/* END EVENTS */
		
	// form section help
	$("a[rel]").overlay(
	{ 
		onBeforeLoad: function()
		{ 
			// grab wrapper element inside content 
			var wrap = this.getContent().find("div.wrap"); 
			// load the page specified in the trigger 
			wrap.load(this.getTrigger().attr("href")); 
		} 
	}); 
	
	// tooltip handling
	/*$(":input").tooltip(
	{
		position:	'center right',
		tip: 		'.tooltip'
	});	*/
	
	resizeShadow();
			
	// set focus on the first input field so the user can get started right away
	if(!$("#mainContent form").hasClass("noFirstFocus"))
		$("#mainContent :input:visible:enabled:first").focus();
});

// parses all of a trigger input's classes to get the identifier of the element it affects
jQuery.fn.getIdFromClass = function()
{
	var targetClasses = $(this).attr("class");
	var hideID;
	if(targetClasses)
	{
		targetClasses = targetClasses.split(' ');
		$(targetClasses).each(function()
		{
			if(this.indexOf("-") >= 0)
			{
				hideID = this.substr(this.indexOf("-") + 1);
			}
		});
	}
	return hideID;
}

// parses elements for show/hide, editable rows, and other dynamic actions; fired on load or when the user clicks anywhere on the page
jQuery.fn.parseElements = function()
{
	switch(true)
	{
		case $(this).hasClass("fieldIcon"):
			// if the user clicks on the calendar icon, show the calendar and focus on the date field
			if($(this).prev("input").hasClass("dateInput"))
			{
				var inputID = "#" + $(this).prev("input").attr("id");
				$(this).prev("input").focus();
			}
			break;
			
		// inputs that disable other inputs
		case $(this).hasClass("disable"):
			var tagName = "#" + $(this).getIdFromClass();
			if($(this).is(":checked"))
			{
				$(tagName).attr("disabled","disabled");
				$(tagName).addClass("disabled");
			}
			else
			{
				$(tagName).removeAttr("disabled");
				$(tagName).removeClass("disabled");
			}
			break;
			
		// collapsable elements header bar
		case $(this).is("fieldset h6") || $(this).is("fieldset h6 img"):
			var $target = $(this).closest("fieldset h6").next("div, fieldset");
			var $collapseIcon = $(this).closest("fieldset h6").children("img:first");
			
			if($target.css('display') !== "none")
			{
				var iconPath = $collapseIcon.attr("src").replace("down","right");
				$collapseIcon.attr("src",iconPath);
				$target.slideUp("medium",function()
				{
					resizeShadow();
				});
			}
			else
			{
				var iconPath = $collapseIcon.attr("src").replace("right","down");
				$collapseIcon.attr("src",iconPath);
				$target.slideDown("medium",function()
				{
					resizeShadow();
				});
			}
			break;
			
		// show hidden required field icons in optional fieldsets when the user clicks on an input (for checkboxes and radios)
		case $(this).is("input") && $(this).parents("fieldset").hasClass("hideRequired"):
			if($(this).val().length)
				$(this).parents("fieldset").find("img[src$='icon_required.gif']:hidden").css("display","inline");
		// show/hide event for dynamic form elements
		case $(this).closest(":input, tr").hasClass("showDetail") && !$(this).is("select"):
		case $(this).hasClass("hideDetail"):
		case $(this).is(":radio"):
			if($(this).is(":radio"))
			{
				var setName = $(this).attr("name");
				var $clickedElement = $(this);
				$(":input.showDetail[name='" + setName + "']").not(this).each(function()
				{
					var tagName = "#" + $(this).getIdFromClass() + "-details";
					// if the user clicked on a trigger, hide everything else instantly so we don't have animation overlap
					if($clickedElement.hasClass("showDetail"))
						$(tagName).hide();
					else
						$(tagName).slideUp("fast",function()
						{
							resizeShadow();
						});
				});
			}
			else if($(this).is(":checkbox"))
			{
				if(($(this).hasClass("hideDetail") && $(this).is(":checked")) || ($(this).hasClass("showDetail") && !$(".show-" + $(this).getIdFromClass()).is(":checked")))
				{
					var slideDir = 1;
				}
			}
			else if($(this).closest("tr").hasClass("showDetail") && $(this).closest("tr").next("tr.rowDetails").find("div").is(":visible"))
				var slideDir = 1;
				
			var tagName = "#" + $(this).closest(".showDetail, .hideDetail").getIdFromClass() + "-details";
			if(slideDir)
			{
				$(tagName).slideUp("fast",function()
				{
					if($(this).parent().is("td"))
						$(this).closest("tr").next("tr.rowDetails").hide();
					resizeShadow();
				});
			}
			else
			{
				$(this).closest("tr").next("tr.rowDetails").show();
				$(tagName).slideDown("fast",function()
				{
					resizeShadow();
				});
			}
			break;
			
		// cross-select buttons
		case $(this).hasClass("crossAdd"):
			// we'll assume that the first multi select box above the Add button is the box we're adding from
			var $firstBox = $(this).parent().prev("select[multiple]")
			// and the first multi select box below the Add button must be the box we're adding to
			var $secondBox = $(this).parent().next("select[multiple]")
			$secondBox.append($firstBox.children("option:selected"));
			// when the select boxes change, they need to be resorted in alphabetical order (sortAlpha called from general_init.js)
			$secondBox.html($secondBox.children("option").sort(sortAlpha));
			break;
		case $(this).hasClass("crossRemove"):
			var $firstBox = $(this).parent().prev("select[multiple]")
			var $secondBox = $(this).parent().next("select[multiple]")
			$firstBox.append($secondBox.children("option:selected"));
			$firstBox.html($firstBox.children("option").sort(sortAlpha));
			break;

		// clickable table rows
		case $(this).closest("tr").hasClass("clickable"):
			// row contains a link
			if($(this).closest("tr").find("a").length > 0)
				window.location = $(this).closest("tr").find("a:first").attr("href");
			// row contains a radio button
			else if($(this).closest("tr").find(":radio").length > 0)
				$(this).closest("tr").find(":radio:first").attr("checked","checked");
			break;
			
		// editable table rows
		case $(this).closest("tr").hasClass("editable"):
			var $parentRow = $(this).closest("tr");
			// if another row is already being edited, don't let them click a new one
			if(!$parentRow.hasClass("dimmed"))
			{
				// mark the target row so we don't hide its icons
				$parentRow.removeClass("editable");
				$parentRow.children("td:first").html($("#formLegend ul img[src$='table_edit.png']").clone());
				
				var colspan = $parentRow.children("td").length;
				
				// dim all the other rows so the user won't try to click on them
				$parentRow.siblings("tr.editable, tr.edited, tr.deleted").removeClass("odd even")
				$parentRow.siblings("tr.editable, tr.edited, tr.deleted").addClass("dimmed");
				$parentRow.siblings("tr.editable, tr.edited, tr.deleted").find("img.fieldIcon:visible").hide();
					
				// highlight the new editing row
				$parentRow.addClass("emphasizeRow");
				// hide the static text
				$parentRow.find("span").hide();
				// show the hidden input
				$parentRow.find(":input").show();
				
				// does the row have a detail drop-down?
				if($parentRow.hasClass("hasDetail"))
				{
					var $detailTrigger = $parentRow.find(":input.showDetail");
					$detailRow = $parentRow.next("tr.rowDetails");
					if($detailTrigger.length)
						var detailID = "#" + $detailTrigger.getIdFromClass() + "-details";
					else
						var detailID = "#" + $parentRow.getIdFromClass() + "-details";
					// if the row doesn't exist, make it
					if(!$detailRow.children("td").html())
					{
						$detailRow.children("td").html($(detailID));
					}
					$detailRow.show();
						
					if($detailTrigger.is(":checked") || !$detailTrigger.length)
						$parentRow.next("tr").find(detailID).slideDown("fast",function()
						{
							resizeShadow();
						});
					else
						$parentRow.next("tr").find(detailID).hide();
					$detailRow.after("<tr class='editBtns'><td colspan='" + colspan + "'><div class='roundedBottom'></div></td></tr>");
				}
				else
					$parentRow.after("<tr class='editBtns'><td colspan='" + colspan + "'><div class='roundedBottom'></div></td></tr>");	
				$parentRow.siblings("tr.editBtns").find("div").html("<button type='submit' class='rowUpdate submitBtn'>Update</button><button type='button' class='rowCancel'>Cancel</button><button type='button' class='rowDelete'>Delete</button>");	
			}
			break;
		case $(this).is("button.rowUpdate"):
			var $parentRow = $(this).closest("tr").prevAll("tr.emphasizeRow");
			// add edited color and icon
			$parentRow.addClass("edited");
			$parentRow.find("td:first").html($("#formLegend ul img[src$='pencil.png']").clone());
			// convert the edited row back to static
			$parentRow.find("span").show();
			$parentRow.find(":input").hide();
			$parentRow.removeClass("emphasizeRow");
			$(this).closest("tr.editBtns").remove();
			if($parentRow.is(".hasDetail, .showDetail"))
			{
				var $detailRow = $parentRow.next("tr.rowDetails");
				$detailRow.find("div:first").slideUp("fast",function()
				{
					$detailRow.hide();
					resizeShadow();
				});
			}
			// remove dimming and show icons
			$parentRow.siblings("tr.dimmed").removeClass("dimmed");
			$parentRow.siblings("tr.editable, tr.edited, tr.deleted").find("img.fieldIcon[src$='audit.png']").show();
			$parentRow.find(":input.dateInput + img.fieldIcon").hide();
			
			// restore zebra-striping
			$evenRows.addClass("even");
			$oddRows.addClass("odd");		
			break;
		case $(this).is("button.rowCancel"):
			var $parentRow = $(this).closest("tr").prevAll("tr.emphasizeRow");
			// convert the edited row back to static
			$parentRow.find("td:first").empty();
			$parentRow.find("span").show();
			$parentRow.find(":input").hide();
			$parentRow.removeClass("emphasizeRow");
			$(this).closest("tr.editBtns").remove();
			if($parentRow.is(".hasDetail, .showDetail"))
			{
				var $detailRow = $parentRow.next("tr.rowDetails");
				$detailRow.find("div:first").slideUp("fast",function()
				{
					$detailRow.hide();
					resizeShadow();
				});
			}
			// remove dimming and show icons
			$parentRow.siblings("tr.dimmed").removeClass("dimmed");
			$parentRow.siblings("tr.editable, tr.edited, tr.deleted").find("img.fieldIcon[src$='audit.png']").show();
			// restore zebra-striping
			$evenRows.addClass("even");
			$oddRows.addClass("odd");
			$parentRow.addClass("editable");
			break;
		case $(this).is("button.rowDelete"):
			var $parentRow = $(this).closest("tr").prevAll("tr.emphasizeRow");
			// add deleted color and icon
			$parentRow.addClass("deleted");
			$parentRow.find("td:first").html($("#formLegend ul img[src$='delete.png']").clone());
			// convert the edited row back to static
			$parentRow.find("span").show();
			$parentRow.find(":input").hide();
			$parentRow.removeClass("emphasizeRow");
			$(this).closest("tr.editBtns").remove();
			if($parentRow.is(".hasDetail, .showDetail"))
			{
				var $detailRow = $parentRow.next("tr.rowDetails");
				$detailRow.find("div:first").slideUp("fast",function()
				{
					$detailRow.hide();
					resizeShadow();
				});
			}
			// remove dimming and show icons
			$parentRow.siblings("tr.dimmed").removeClass("dimmed");
			$parentRow.siblings("tr.editable, tr.edited, tr.deleted").find("img.fieldIcon[src$='audit.png']").show();
			$parentRow.find(":input.dateInput + img.fieldIcon").hide();
			
			// restore zebra-striping
			$evenRows.addClass("even");
			$oddRows.addClass("odd");	
			break;
	}
}

/*jQuery.validator.setDefaults(
{ 
	onfocusout: false,
	onkeyup:false,
	onclick: false,
	ignoreTitle: true,
	highlight: function(element, errorClass) {
		$(element).parent("dd").addClass(errorClass);
	},
	errorPlacement: function(error, element) 
	{
		$(error).appendTo( $(element).parent("dd") );
	}
});*/
