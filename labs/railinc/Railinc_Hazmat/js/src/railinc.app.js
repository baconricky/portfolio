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
	hidden = ".hidden";

/*!
 * jQuery UI Widget-factory plugin boilerplate (for 1.8/9+)
 * Author: @addyosmani
 * Further changes: @peolanha
 * Licensed under the MIT license
 */

$(function() {
//init jquery ui buttons
	$('button').button();
	
	$("dt > label").each(function() { // most effect types need no options passed by default
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
    
    var tabOpts = {
		tabTemplate: '<p><a href="#{href}"><span>#{label} </span></a></p>'
    };
    
    $("#tabs").tabs(tabOpts);
    
        $("#searchResultsGrid").showDataGrid({
        	targetId: "searchResultsTarget",
        	dataSrcType: "json",
        	dataSrc: "json/searchResults.json",
        	tableId: "sortableTable",
        	columns: [
        		{sTitle:"&nbsp;"},
				{sTitle:"HMRC",
				 sTitleLong:"Hazardous Material Response Code"},
				{sTitle: "Id No"},
				{sTitle: "Proper Shipping Name"},
				{sTitle: "Primary Haz Class"},
				{sTitle: "Packing Group"},
				{sTitle: "STCC"},
				{sTitle: "Short Description"}]
		});
        	
	$.tools.validator.fn("[minlength]", function(input, value) {
		var min = input.attr("minlength");
		
		return value.length >= min ? true : {     
			en: "Please provide at least " +min+ " character" + (min > 1 ? "s" : ""),
			fi: "Kentän minimipituus on " +min+ " merkkiä" 
		};
	});
	
	$.tools.validator.fn(".oneOrMoreRequired", function(input, value) {
		
		console.log("input");
		console.log(input);

		console.log("value");
		console.log(value);
		
		return true;
		
		/**	
	 	return value.length >= min ? true : {     
			en: "Please provide at least " +min+ " character" + (min > 1 ? "s" : ""),
			fi: "Kentän minimipituus on " +min+ " merkkiä" 
		};
		**/
	});
	
	
	
	$("#hazmatForm").validator();
    /*
	$("#hazmatForm").submit(function() {
    	console.log("Getting ready to run...");
    	
        $("#searchResultsGrid").showDataGrid({
        	targetId: "searchResultsTarget",
        	dataSrcType: "json",
        	dataSrc: "json/searchResults.json",
        	tableId: "sortableTable",
        	columns: [
        		{sTitle:"&nbsp;"},
				{sTitle:"HMRC",
				 sTitleLong:"Hazardous Material Response Code"},
				{sTitle: "Id No"},
				{sTitle: "Proper Shipping Name"},
				{sTitle: "Primary Haz Class"},
				{sTitle: "Packing Group"},
				{sTitle: "STCC"},
				{sTitle: "Short Description"}]
		});
        	
        rail.base.tableSorterUtil("example"); //return false;
		return false;
    });
    */
		
    $("a.openDetailWin").live("click", function(src) {
        console.log("SOURCE:");
        console.log(src.currentTarget().href);
    });
	
    $("#sortableTable th[title]").tooltip();
    $("label[title]").tooltip();

	var toggleID = 'shippingDescriptionElementsDetails';
});



//v --- NEW FILE --- v
/*!
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */

// the semi-colon before the function invocation is a safety
// net against concatenated scripts and/or other plugins
// that are not closed properly.
;(function ( $, window, document, undefined ) {

    // undefined is used here as the undefined global
    // variable in ECMAScript 3 and is mutable (i.e. it can
    // be changed by someone else). undefined isn't really
    // being passed in so we can ensure that its value is
    // truly undefined. In ES5, undefined can no longer be
    // modified.

    // window and document are passed through as local
    // variables rather than as globals, because this (slightly)
    // quickens the resolution process and can be more
    // efficiently minified (especially when both are
    // regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = 'showDetailModal',
        defaults = {
            propertyName: "value"
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        // jQuery has an extend method that merges the
        // contents of two or more objects, storing the
        // result in the first object. The first object
        // is generally empty because we don't want to alter
        // the default options for future instances of the plugin
        this.options = $.extend( {}, defaults, options) ;
        console.log("this.element: " + this.element);
        console.log("this.options: " + this.options);
        
        this._defaults = defaults;
        this._name = pluginName;

        this.init();


	}

    Plugin.prototype.init = function () {
		var title = $('<h2>Detail</h2>');
		
		var selectView = $('<select></select>')
			.append('<option value="0">0</option>')
			.append('<option value="1">1</option>')
			.append('<option value="2">2</option>')
			.append('<option value="3">3</option>');
			  
		var dl = $('<dl></dl>')
		    .append('<dt>Id:</dt><dd>' + data.id +'</dd>')
		    .append('<dt>First name:</dt><dd>' + data.firstName +'</dd>')
		    .append('<dt>Last name:</dt><dd>' + data.lastName +'</dd>')
		    .append('<dt>Birth date:</dt><dd>' + data.birthDate + '</dd>')
		    .append('<dt>Date created:</dt><dd>' + data.dateCreated + '</dd>')
		    .append('<dt>Last updated:</dt><dd>' + data.lastUpdated + '</dd>');
		 
		$('<div></div>')
				.append(title)
				.append(selectView)
				.append(dl)
				.dialog({
					modal: true
				});
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new Plugin( this, options ));
            }
        });
    }

})( jQuery, window, document );
//^ --- NEW FILE --- ^
