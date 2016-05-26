
function popflash(pagename){
	popwindow=window.open(pagename,'foo','width=800,height=600,scrollbars=yes');
	if (window.focus) {popwindow.focus()}
	return false;
}
