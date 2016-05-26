function externalLinks() {
	if (!document.getElementsByTagName) return;
	var anchors = document.getElementsByTagName("a");
	
	for (var i=0; i<anchors.length; i++) {
		var anchor = anchors[i];
		if (anchor.getAttribute("href") &&
			anchor.getAttribute("rel") == "external")
			anchor.target = "external";
		if (anchor.getAttribute("href") &&
			anchor.getAttribute("rel") == "redhat")
			anchor.target = "redhat";
	}
}
window.onload = externalLinks;