
function popwin(pagename){
	popwindow=window.open(pagename,'foo','width=350,height=350,scrollbars=no');
	if (window.focus) {popwindow.focus()}
	return false;
}
