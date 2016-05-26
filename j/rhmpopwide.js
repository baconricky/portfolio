
function rhmpopwide(pagename){
	popwindow=window.open(pagename,'foo','height=500,scrollbars=yes');
	if (window.focus) {popwindow.focus()}
	return false;
}
