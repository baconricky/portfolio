$(document).ready(function() {
	// setup ul.tabs to work as tabs for each div directly under div.panes
	//$("#menu").tabs("#submenu", {effect: 'ajax'}, {event:'mouseover'}).history();
	$("#menu").tabs("#submenu > div", {effect: 'ajax'},{event:'mouseover, click'}).history();
	$(window).unbind("scroll").scroll(function(){
		var b=Math.max(e.scrollTop,a.scrollTop)/8;
		a.style.backgroundPosition="0px "+-b+"px"
	});
});