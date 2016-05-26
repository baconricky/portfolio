
function rhmpop(pagename){
	popwindow=window.open(pagename,'foo','width=500,height=500,scrollbars=yes');
	if (window.focus) {popwindow.focus()}
	return false;
}
