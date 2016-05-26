
function popwinSlideshow(pagename){
	popwindow=window.open(pagename,'foo','width=575,height=430,scrollbars=yes');
	if (window.focus) {popwindow.focus()}
	return false;
}
