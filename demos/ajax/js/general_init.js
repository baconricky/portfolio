$(document).ready(function()
{
	DD_roundies.addRule('.rounded', '8px', true);
	DD_roundies.addRule('.roundedRight', '0 8px 8px 0', true);
	DD_roundies.addRule('.roundedBottom', '0px 0px 8px 8px', true);
});

$(window).load(function()
{
	/* THIS FILE HAS BEEN DEPRECATED, ALERT THE USER SO THEY CAN REMOVE IT */
	alert("PAGE OUT OF DATE:\n\nThe JavaScript file 'general_init.js' has been deprecated.  Please remove its script tag and load 'nctracks_init.js' instead.\n\nPlease contact the UI Team if you experience any issues.");
	
	// adds a drop shadow to the main content container
	$("#tileBtm").after("<div id='dropShadowBox'><div class='dropShadow'><div id='tileLeft'></div><div id='tileRight'></div></div></div>");
	$("#tileBtm").html("<div id='cornerLeft'></div><div id='cornerRight'></div>");
	
	// add new window icon to off-site links
	$("#mainContent a[href^='http']").after("<img src='../images/icons/new_window.gif' class='offsiteLink' width='12' height='12' alt='off-site link' title='Navigate away from NCTracks'>");
	
	// site-wide text hinting (login box, search, etc)
	$(":input.hint").coolinput(
	{
		blurClass:	'formHint'
	});
		
	// scale the drop shadow box if the user resizes the browser window
	$(window).resize(function(){resizeShadow()});
		
	//ID, class and tag element that font size is adjustable in this array
	//Put in html or body if you want the font of the entire page adjustable
	var scalableText = new Array("#mainContent","th","td");
	scalableText = scalableText.join(',');

	$(document).click(function(event)
	{
		// text scaling
		if($(event.target).parent().hasClass("textScaling"))
		{
			var currentFontSize = $(scalableText).css('font-size');
			var currentFontSizeNum = parseFloat(currentFontSize, 10);	
			if($(event.target).parent().attr("id") == "increaseFont")
				var newFontSize = currentFontSizeNum + 3;
			else if($(event.target).parent().attr("id") == "decreaseFont")
				var newFontSize = currentFontSizeNum - 3;	
			$(scalableText).css('font-size', newFontSize);
		}
		else if($(event.target).is("#hide_button"))
			$("#panel").animate({height: "0px"}, "fast");
		else if($(event.target).hasClass("panel_button"))
		{
			$("#panel").animate({height: "225px"})
			$(event.target).toggle();
		}
			
		// if the user is clicking on something, it might be showing or hiding something else, so let's recalculate the drop shadow height, just in case
		resizeShadow();
	});
	resizeShadow();
});
	
// recalculates the height of the drop shadow DIV based on the height of the content container
// called whenever the user does something that changes the height of the page
function resizeShadow(animate)
{
	var shadowHeight = $("#tileBtm").offset().top - $("#dropShadowBox .dropShadow").offset().top;
	if(animate)
		$("#tileLeft,#tileRight").animate({height: shadowHeight},"medium");
	else
		$("#tileLeft,#tileRight").height(shadowHeight);
}

// performs alphabetical sorting via the sort() method
function sortAlpha(a,b)
{
	return a.innerHTML > b.innerHTML ? 1 : -1;
}