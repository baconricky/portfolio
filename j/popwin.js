
function popwin(pagename){
	popwindow=window.open(pagename,'foo','width=400,height=400,scrollbars=yes');
	if (window.focus) {popwindow.focus()}
	return false;
}