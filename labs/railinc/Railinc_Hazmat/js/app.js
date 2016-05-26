/**  
author:Nicholas Harris
purpose: this file is specific to the Hazmat application.
dependancy: jQuery 1.6.1 library


$('#triggerFind').click({
	window.location.replace('find.html');
});
**/
// selector constants, assists in minification
var modal_html,
	modal_html,
	modal_html,
	modal_html,
	modal_html;
	
function rowClickAction(idx) {
	var dialogOpts = {
        modal: true,
        autoOpen: false,
		width: 980,
        draggable: true,
        resizeable: true,
		title: 'Hazmat Detail for - hmrc'
       };


	$modal = $("#detailWindow");
	$modal.dialog(dialogOpts);  //end dialog
	$modal.dialog("open");
	return false;	
}
/*!
 * jQuery UI Widget-factory plugin boilerplate (for 1.8/9+)
 * Author: @addyosmani
 * Further changes: @peolanha
 * Licensed under the MIT license
 */


$(function() {
	$("#tabs").tabs();

	//required field styler
	rail.base.requiredLabel();
	
	// list swapper control
	rail.base.listSwapper();
	
	// table sort
	rail.base.tableSorterUtil("sortableTable");
	
	/*_data = $('#sortableTable').html();
	
	$('#sortableTable').html('');
	
	buildtable('#sortableTable', _data);
	*/

	// mega menu
	rail.base.megaHoverOver();
	rail.base.megaHoverOut();
	
	//Set custom configurations for mega menu
	rail.base.megaConfig();
	
	// app nav menu
	rail.base.applicationNavMenu();

	// datepicker util
	rail.base.datePicker();

	//initalize form elements
	rail.base.initForm();

	//init jquery ui buttons
	$('button, .button').button();
	
	$("dt > label").each(function() { // most effect types need no options passed by default
		$text = $(this).text();
			
		if ( $text.indexOf(":") < 0 ) {
			$(this).append(":");
		}
		
	});
	
	$('input[type=submit]').keypress(function(e) {
        if(e.which == 13) {
            jQuery(this).blur();
            jQuery('#searchBtn').focus().click();
        }
    });

	$("#hazmatForm").validationEngine({
		validationEventTrigger: 'submit'
	});
    
	$("#hazmatForm").submit(function() {
		var valid = false;
		
		valid = $('#hazmatForm').validationEngine('validate');
		console.log("is valid: " + valid);
		if (valid) {
			$('button, .button').button();
			$(".ui-tabs").tabs();
			$results = $("#searchResultsGrid").html();
			$("#searchResultsGrid").html('<div class="loading"><img src="images/lite/loading_progress.gif" alt="Please wait"> Loading Hazmat information...</div>');
			$("#searchResultsGrid").slideDown();
		
			setTimeout(function() { 
				$("#searchResultsGrid").html($results); 
		
				count = $("#sortableTable tbody tr").length;
		
				if (count !== 1) {
					$("#rowCount").html("Showing " + count + " entries.");
				} else {
					$("#rowCount").html("Showing " + count + " entry.");

				}
				rail.base.tableSorterUtil("example"); //return false;
			}, 
			1000); 
		}
		return false;
    });
	
    $("#sortableTable th[title]").tooltip();
    $("label[title]").tooltip();
    $(".hidden, #detailWindow").hide();

	$("#clearBtn").click(function() {
		$('#hazmatForm').validationEngine('hideAll')
		$("#searchResultsGrid").hide();
	});
	
	$("#sortableTable tbody tr").click(function() {
		$row = $(this);
		rowClickAction(1);
	});

	$('.ui-tabs-nav li a').click(function() {
		$('#hazmatForm').validationEngine('hideAll')
		$('#searchType').val($(this).attr('id'));
	});
	
	var toggleID = 'shippingDescriptionElementsDetails';
});
