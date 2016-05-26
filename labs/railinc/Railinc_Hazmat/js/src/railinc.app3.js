/**  
author:Nicholas Harris
purpose: this file is specific to the Hazmat application.
dependancy: jQuery 1.6.1 library


$('#triggerFind').click({
	window.location.replace('find.html');
});
**/
// selector constants, assists in minification
var required = "required",
hideRequired = "hideRequired",
hidden = ".hidden",
oTable, arrGridData, gridConfig;


jQuery.fn.displaySearchResults = function(searchResultsTarget, searchResultsDataSrc) {	
    var $targetEl = $('#' + searchResultsTarget);
	    $targetEl.html('<div class="clear"><br><br></div><h2>Your Results</h2><div class="clear">User information and instructions go here.</div><table cellpadding="0" cellspacing="1" border="0" class="tablesorter display" id="sortableTable"></table>');
	
	var $gridConfig;
		$gridConfig = {
			"aoColumns": [
			{
				"sTitle": "HMRC"
			},
			{
				"sTitle": "Id No"
			},
			{
				"sTitle": "Proper Shipping Name"
			},
			{
				"sTitle": "Primary Haz Class"
			},
			{
				"sTitle": "Packing Group"
			},
			{
				"sTitle": "STCC"
			},
			{
				"sTitle": "Short Description"
			}],
			"fnInitComplete": function() {
				$("#sortableTable tr").mouseover(function() {
					$(this).attr("style", "cursor:pointer;");
				});
				$("#sortableTable tr").click(function() {
					$(".dialog-modal").dialog({
						width: 900,
						height: 500,
						modal: true
					});
				});
			},
			"bSearchable": false,
			"bProcessing": false,
			"bPaginate": true,
			"bStateSave": true,
			"sAjaxSource": searchResultsDataSrc,
			"sScrollY": "200px"
		};
    
	
	oTable = $('#sortableTable').dataTable($gridConfig);
    //oTable.fnAdjustColumnSizing();
	
    $targetEl.stop().fadeTo('fast', 1).show();
	
	return false;
}

/*!
 * jQuery UI Widget-factory plugin boilerplate (for 1.8/9+)
 * Author: @addyosmani
 * Further changes: @peolanha
 * Licensed under the MIT license
 */

$(function() {
	//init jquery ui buttons
	//$('button').button();
	
    $("label").each(function() { // most effect types need no options passed by default
		$text = $(this).text();
			
		if ( $text.indexOf(":") < 0 ) {
			$(this).append(":");
		}
		
	});

    $(".advancedIcon").each(function() { // most effect types need no options passed by default
        $(this).addClass("ui-icon-carat-1-e");
    }); //toggle the componenet with class msg_body
    $("h2.advancedHeading").click(function(src) { // most effect types need no options passed by default
		$icon = $(this).children(".icon");
		if ($icon.hasClass("rightIcon")) {
			$icon.removeClass("rightIcon").addClass("downIcon");
		} else {
			$icon.removeClass("downIcon").addClass("rightIcon");
		}

		$(this).next(".advanced").slideToggle(500);
    });
	
	$(".advanced, .hideable").hide();
    $(".init-show").show();
    $("#tabs, #tabs2").tabs();
    
    $("#hazmatForm").submit(function() {
		$searchButton = $("#search");
		
		$searchButton.button('option', 'label', 'Searching...');

		//pretend to be slow
		setTimeout(function() {
			$('#resutlsGrid').displaySearchResults('searchResultsTarget', 'json/searchResults2.json');
	        rail.base.tableSorterUtil("example"); //return false;
		$searchButton.button('option', 'label', 'Search');
		},1500);
       
		return false;
    });
		
    $("a.openDetailWin").live("click", function(src) {
        console.log("SOURCE:");
        console.log(src.currentTarget().href);
    });
	
    $("#sortableTable th[title]").tooltip();

	var toggleID = 'shippingDescriptionElementsDetails';
});