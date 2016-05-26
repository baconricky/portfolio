$(function()
	{

	$.extend({
	 	loadHTML: function(tpltPath, onLoadFn) {
			// Load the html from template path and process it
			$.ajax({
				url: tpltPath,
				dataType: 'html',
				success: function(html){ // Once successfully loaded
					// Clean up data to process (remove extra whitespace and line breaks)
				//	html = (html.replace(/	/g, "").replace(/\n/g, ""));
					eval(onLoadFn + '(html, 5)'); // process the HTML
				}
			});
		},

		randomRHCEMain: function(code, limit) {
		    var pList = $("#storylist li", code);
		    var goodList = new Array(0);
		    var newList = new Array(0);
			$(pList).each(function() {
				newList.push(this);
			});
			
		    for (var i=0; i < limit; i++) {
		    	var indx = Math.random()* newList.length | 0;
 		    	goodList.push(newList.splice(indx,1));
		    }
			$("#storylist").empty();
			$(goodList).appendTo("#rhce_wrap #storylist");
			$("#storylist li").removeClass("last");
			$("#storylist li:last").addClass("last");
		
		},

		randomRHCENav: function(code, limit) {
			var pList = $("#storylist li", code);
			var goodList = new Array(0);
			var newList = new Array(0);
			$(pList).each(function() {
				newList.push(this);
			});
			
			for (var i=0; i < limit; i++) {
				var indx = Math.random()* newList.length | 0;
				goodList.push(newList.splice(indx,1));
			}

			$(goodList).each(function() {
				// unwrap p.roty and rewrap with a generic span 
				$(".roty", this).wrap("<span></span>").replaceWith($(".roty", this).html());
				// re-add the roty class to that span
				$("span", this).addClass("roty");
				// kill p.quote
				$(".quote", this).remove();
				// unwrap the h2
				$("h2", this).replaceWith($("h2", this).html());
				// plain js magic to extract country from a generic p 
				var temp = $("p:last", this).html();
				var newTemp = temp.slice(temp.lastIndexOf(",") +1);
				// place this country in a span tag
				$("p:last", this).wrap("<span></span>").replaceWith(newTemp);
				$("span", this).before("<br />");
				// wrap the whole thing in a generic p
				$(this).wrapInner("<p></p>").removeClass("browse_block");
                	});
			$(".navStories ul").empty();
			$(goodList).appendTo(".navStories .more");
			$(".navStories li").removeClass("last");
			$(".navStories li:last").addClass("last");
			$(".info_block li:last").addClass("last");
		},

		pleaseWait: function(selector, pHeight) {
                $(selector).empty().append("<p style='height:"+pHeight+"px;'>Please Wait...</p>");
		}

	});
	
});
	
