/**  
author:Nicholas Harris
purpose: this file is specific to the Hazmat application.
dependancy: jQuery 1.6.1 library
**/

// selector constants, assists in minification
var modal_html;
	
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

function changeCar(src, dir) {
	var sIdx = $(src).prop("selectedIndex");
	var length = $(src).prop("length");

	if (dir == "next") {
		sIdx += 1;
		if (sIdx >= length) sIdx = length -1;
	} else if (dir == "prev") {
		sIdx -= 1;
		if (sIdx < 0) sIdx = 0;
	}
	
	$(src).prop("selectedIndex", sIdx);
	$(src).click();
}

$(function() {


	//required field styler
	rail.base.requiredLabel();
	
	// list swapper control
	rail.base.listSwapper();
	
	// table sort
	rail.base.tableSorterUtil("sortableTable-ewn");	
	rail.base.tableSorterUtil("sortableTable-ehms");	
	rail.base.tableSorterUtil("sortableTable-mileage");	

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
	$("#tabs").tabs();
	
	$("#carSearch").click(function() {
		$("#carsFound").accordion({
			collapsible: true,
			clearStyle: true,
			active: 0
		});
		$('#carsFound').slideDown();
		$('#carsFound .count').html($('#carsFound select').prop('length'));
	});
	
	$('#carsFound select').click(function() {
		alert('Page should reload with the info for the car selected...');
	});

	$('#carsFound .previous').click(function() {
		changeCar($('#carsFound select'), 'prev');
	});

	$('#carsFound .next').click(function() {
		changeCar($('#carsFound select'), 'next');
	});	
	
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
            jQuery('#submit').focus().click();
        }
    });
	
	$("#hazmatForm").validationEngine();
    
	$("#hazmatForm").submit(function() {
		if ($('#hazmatForm').validationEngine('validate')) {
			$('button, .button').button();
			$(".ui-tabs").tabs();
			$results = $("#searchResultsGrid").html();
			$("#searchResultsGrid").html('<div class="loading"><img src="images/lite/loading_progress.gif" alt="Please wait"> Loading Hazmat information...</div>');
			$("#searchResultsGrid").slideDown();
		
			setTimeout(function() { 
				$("#searchResultsGrid").html($results); 
				rail.base.tableSorterUtil("sortableTable");
			}, 
			1000); 
		}
		return false;
    });
		
    $("#sortableTable th[title]").tooltip();
    $("label[title], th[title]").tooltip();
    $(".hidden, #detailWindow").hide();
	
	$("#clearBtn").click(function() {
		$("#searchResultsGrid").hide();
	});
	
	$("#sortableTable tbody tr").click(function() {
		$row = $(this);
		rowClickAction(1);
	});

	$('.ui-tabs-nav li a').click(function() {
		$('#searchType').val($(this).attr('id'));
	});
	
	var toggleID = 'shippingDescriptionElementsDetails';
});
