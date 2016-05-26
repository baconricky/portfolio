
function popwin(pagename){
	popwindow=window.open(pagename,'foo','width=425,height=675,scrollbars=yes');
	if (window.focus) {popwindow.focus()}
	return false;
}