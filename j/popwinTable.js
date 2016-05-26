
function popwinTable(pagename){
	popwindow=window.open(pagename,'foo','width=650,height=500,scrollbars=yes');
	if (window.focus) {popwindow.focus()}
	return false;
}
