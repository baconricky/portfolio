function redBox(title, filepath, preview) {
	// Defines new div and flash object tags containing appropriate links and settings 
	this.maxWidth = 395;
	this.maxHeight = 325;
	this.minWidth = 320;
	this.minHeight = 260;
	this.omniFile = '/v/swf/redbox/redbox-player.swf?oid=' + filepath; // For Omniture tracking, otherwise would be '/path/to/redbox-player.swf' only

	// define the divs and flash object
	this.flashHTML = '\n'+
	'<div id="redBoxWin" style="width: ' + this.maxWidth + 'px ">\n' +
	'	<a id="redBoxClose" href="javascript:closeRedBox()" title="close">close<\/a>\n' +
	'	<h2 id="redBoxTitle">' + title + '<\/h2>\n' +
	'	<div id="redBoxPlayer">\n' +
	'		<object id="' + this.omniFile + '" type="application/x-shockwave-flash" data="' + this.omniFile + '" width="' + this.maxWidth + '" height="' + this.maxHeight + '">\n' +
	'			<param name="movie" value="' + this.omniFile + '" \/>\n' +
	'			<param name="bgcolor" value="#000000" \/>\n' +
	'			<param name="quality" value="high" \/>\n' +
	'			<param name="flashvars" value="file=' + filepath + '&image=' + preview + '&omniEnv=' + s_account + '" \/>\n' +
	'		<\/object>\n' +
	'	<\/div>\n' +
	'<\/div>\n' +
	'<div id="redBoxBg" onClick="closeRedBox()" class="fauxLink" title="close">&nbsp;<\/div>\n';
	return;
}



function loadRedbox() {
	// Lets be sure we have a new enough browser before we do anything else
	if (!document.getElementsByTagName) {
		return;
	} else {
		findVideoLinks(document.getElementsByTagName("a"));
		document.getElementsByTagName("body")[0].scroll = 'auto';
	}
}

function findVideoLinks(anchors) {
	// Finds all links in page with a 'rel' attribute containing a '.flv' extension
	var vidCount = 0;
	for (var i=0; i<anchors.length; i++) {
		if (anchors[i].rel.match(".flv")) {
			vidCount++;
			updateVideoLinks(vidCount, anchors[i]);
		}
	}
	return;
}

function updateVideoLinks(id, target) {
	// Creates and adds appropriate js link to open respective video (per link)
	target.id = target.title.split(' ').join('_') + '_' + id;
	target.href = 'javascript:playVideo(\'' + target.id + '\')';;
	target.style.display = "inline";
	return;
}

function playVideo(curID) {
	closeRedBox(); // Closes any 'old' instances of RedBox if they exist
	var videoLink = document.getElementById(curID); // Get info from the anchor tag to load into the flash object
	var scrollCoord = new getScrollXY();
	
	// Creates a new div populating appropriate links and variables
	var newVideo = new redBox(videoLink.title, videoLink.rel, videoLink.rev);
	var vidDiv = document.createElement('div');
	vidDiv.id = "redBox";
	vidDiv.innerHTML = newVideo.flashHTML;
	vidDiv.style.display = 'none';
	
	// Adds the new redbox and places it appropriately on the page
	document.body.appendChild(vidDiv);
	document.getElementById('redBoxClose').href = 'javascript:closeRedBox(' + scrollCoord.scrollY + ')';
	window.onresize = resizeVideo; // Add the resize listener
	resizeVideo(); // Set the inital size and placment
	return;
}

function closeRedBox(scrollHeight) {
	// closes any other videos should they already be open or hidden
	if (document.getElementById("redBox")) {
		document.getElementById("redBox").parentNode.removeChild(document.getElementById("redBox"));
		document.getElementsByTagName("body")[0].scroll = 'yes';
		document.body.style.overflow = 'auto';
		window.onresize = '';
		window.scrollTo(0,scrollHeight);
		// need to add a call to terminate the flash player
	}
	return;
}

function resizeVideo() {
	var pageDims = new getPageDims();
	var vidRef = new redBox(null, null, null); // to get default min/max values for height/width
	var flashObjTag = document.getElementById('redBoxPlayer').getElementsByTagName('object')[0];
	
	flashObjTag.width = vidRef.minWidth;
	flashObjTag.height = vidRef.minHeight;
	
	if (pageDims.width > vidRef.maxWidth + 30 || pageDims.height > vidRef.maxHeight + 30) {
		flashObjTag.width = vidRef.maxWidth;
		flashObjTag.height = vidRef.maxHeight;
	}
	
	document.getElementById('redBoxWin').style.width = flashObjTag.width + 'px';
	resizeBackground();
	return;
}

function resizeBackground(){
	var pageDims = new getPageDims();
	var scrollCoord = new getScrollXY();
	document.getElementById('redBoxBg').style.height = pageDims.height + scrollCoord.scrollY + 'px';
	alignCenter(document.getElementById('redBoxWin'));
	return;
}

function alignCenter(elem) {
	// move aside before placing and showing to avoid flicker
	elem.style.left = -3000 + 'px';
	elem.style.top = -3000 + 'px';
	document.getElementById('redBox').style.display = '';
	
	var scrollPos = new getScrollXY();
	var pageSize = new getPageDims();
	var elemSize = new getElementSize(elem);
	
	elemSize.height = 550;
	
	elem.style.left = Math.round(pageSize.width * .5) - (elemSize.width * .5) + scrollPos.scrollX + 'px';
	elem.style.top = Math.round(pageSize.height * .5) - (elemSize.height * .5) + scrollPos.scrollY + 'px';
	document.getElementsByTagName("body")[0].scroll = 'no'; // Disable scroll for some ie and opera browsers
	document.body.style.overflow = 'hidden'; // Disable scroll
	window.scrollTo(0,scrollPos.scrollY);
	return;
}

/*
Global sizing and scrolling
********************************************************
Thank you iBox. (For more information visit: http://www.ibegin.com/blog/p_ibox.html)
*/
getScrollXY = function() {
	var docElem = document.documentElement;
	this.scrollX = self.pageXOffset || (docElem&&docElem.scrollLeft) || document.body.scrollLeft;
	this.scrollY = self.pageYOffset || (docElem&&docElem.scrollTop) || document.body.scrollTop;
}
getPageDims = function() {
	var docElem = document.documentElement
	this.width = self.innerWidth || (docElem&&docElem.clientWidth) || document.body.clientWidth;
	this.height = self.innerHeight || (docElem&&docElem.clientHeight) || document.body.clientHeight;
}
getElementSize = function(elem) {
	this.width = elem.offsetWidth ||  elem.style.pixelWidth;
	this.height = elem.offsetHeight || elem.style.pixelHeight;
}

// start it up
window.onload = loadRedbox;
