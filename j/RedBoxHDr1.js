//@requires([events.utils.js, parseuri.js, jquery-1.2.6.pack.js])
//@exports([loadRedBoxHD, playVideo, closeRedBoxHD, resizeVideo])
//@assumes access to window and document objects in browser


/*****
EXPECTS THE FOLLOWING MARKUP IDIOM:
<a class="video" href="url/of/video?ar=WxH" title="title of video">
  <img class="video-still" src="url/of/still" alt="description of video" width="..." height="..." />
</a>

SAMPLE USE IN PAGE MARKUP:
<ul class="gallery">
  <li class="gallery-item">
    <span class="video-title">...</span>
    <a class="video" href="url/of/video?ar=WxH" title="title of video">
      <img class="video-still" src="url/of/still" alt="description of video" width="..." height="..." />
    </a>
    <span class="video-links">Other video formats: [<a>]...</span>
  </li>
  ...
</ul>
*****/

// detect IE versions which are troublesome with OBJECT tag DOM manipulation
var IE6 = (navigator.appVersion.indexOf("MSIE 6.")==-1) ? false : true;
var IE7 = (navigator.appVersion.indexOf("MSIE 7.")==-1) ? false : true;

// HACK to control our RedBox module-shared variables until a proper object model can be created
var RedBoxEnv = {
  document: undefined,
  omnitureAccount: undefined,
  aspectRatio: '4x3'
};

// define player height (since it scales with the SWF)
var pHeight = function(w){
	var playerHeight = 40; // in px -- height of the player control panel
	var stageWidth = 640; // in px -- width of the flash player video "stage"; needs to match the actual flash file's dimensions
	return Math.round(playerHeight*w/stageWidth);
}

// convenience method for defining min/max dimensions
var getDimensions = function(aspectRatio){
  var dims = {};
  switch (aspectRatio) {
    case '16x9':
      dims.maxWidth = 640; // redesigned site max in-page size (656x369px)
      dims.maxHeight = 360 + pHeight(dims.maxWidth);
      dims.minWidth = 570; // current site max in-page size (570x320px)
      dims.minHeight = 320 + pHeight(dims.minWidth);
      break;
      
    case '4x3L':
      dims.maxWidth = 640;
      dims.maxHeight = 480 + pHeight(dims.maxWidth);
      dims.minWidth = 320;
      dims.midHeight = 240 + pHeight(dims.maxWidth);
      break;

    case '4x3M':
      dims.maxWidth = 395;
      dims.maxHeight = 296 + pHeight(dims.maxWidth);
      dims.minWidth = 320;
      dims.midHeight = 240 + pHeight(dims.maxWidth);
      break;

    case '4x3':
      // fall-through... 4x3 will be the default case
    default:
      dims.maxWidth = 492; // redesigned site new max size (492x369px)
      dims.maxHeight = 369 + pHeight(dims.maxWidth);
      dims.minWidth = 395; // current site max size is now the new min size (395x325px)
      dims.minHeight = 296 + pHeight(dims.minWidth);
      break;    
  }
  return dims;
}

//@constructor for the RedBoxHD object for videos
function RedBoxHD(title, filepath, preview, aspectRatio) {
  var playerURL = 'http://www.redhat.com/v/swf/redbox/redbox-player.swf';

  this.movieTitle = title;
  this.movieURL = filepath;
  this.previewImg = preview;

  // For Omniture tracking, otherwise would be '/path/to/redbox-player.swf' only
  this.omniFile = playerURL + '?oid=' + filepath;


  this.aspectRatio = aspectRatio;

  var dims = getDimensions(this.aspectRatio);

  // apply the dimensions
  this.maxWidth = dims.maxWidth;
  this.maxHeight = dims.maxHeight;
  this.minWidth = dims.minWidth;
  this.minHeight = dims.minHeight;
}
    
// convenience method for adding param tags
var addParams = function(obj, params){
    for (var k in params) if (params.hasOwnProperty(k)){
	var p = document.createElement('param');
	p.setAttribute('name', k);
	p.setAttribute('value', params[k]);
	obj.appendChild(p);
    }
}

var createObjectTag = function(parent, params, attributes){
   if (IE6 || IE7){
	// IE does not like building OBJECTs using the DOM, use innerHTML
	var attrParts = [];
	for (var a in attributes) if (attributes.hasOwnProperty(a)){
		attrParts.push(a + '="' + attributes[a] + '"');
	}
	var html = '<OBJECT ' + attrParts.join(' ') + '>';

	for (var p in params) if (params.hasOwnProperty(p)){
		html += '<param name="' + p + '" value="' + params[p] + '" />';
	}

	html += '</OBJECT>';
	parent.innerHTML += html; // append the HTML string
   } else {
	var obj = document.createElement("OBJECT");
	for (var a in attributes) if (attributes.hasOwnProperty(a)){
		obj.setAttribute(a, attributes[a]);
	}
	addParams(obj, params);
	parent.appendChild(obj);
   }
}


RedBoxHD.prototype.toDOM = function(document, s_account) {
  var redBoxWin = document.createElement('div');
  redBoxWin.setAttribute('id', 'redBoxWin');
  redBoxWin.setAttribute('style', 'width: ' + this.maxWidth + 'px');
  
  var redBoxClose = document.createElement('a');
  redBoxClose.setAttribute('id', 'redBoxClose');
  redBoxClose.setAttribute('title', 'Close');
  // redBoxClose.href = '#';
  redBoxClose.appendChild(document.createTextNode('Close'));
  // we can overwrite the default handler since this is a transient DOM subtree
  redBoxClose.onclick = function() { closeRedBoxHD(); return false; };
  redBoxWin.appendChild(redBoxClose);
  
  var redBoxTitle = document.createElement('h2');
  redBoxTitle.setAttribute('id', 'redBoxTitle');
  redBoxTitle.appendChild(document.createTextNode(this.movieTitle));
  redBoxWin.appendChild(redBoxTitle);
  
  var redBoxPlayer = document.createElement('div');
  redBoxPlayer.setAttribute('id', 'redBoxPlayer');

    // define attributes for the OBJECT tag
    var attrs = {
	id : this.movieTitle,
	type : 'application/x-shockwave-flash',
	data : this.omniFile,
	width : this.maxWidth,
	height : this.maxHeight,
	align : 'top'
    };  

    // define nested PARAM tags
    var params = {
        'movie' : this.omniFile,
        'bgcolor' : '#000000',
        'quality' : 'high',
	'flashvars' : 'file=' + this.movieURL + '&image=' + this.previewImg + '&omniEnv=' + s_account + '&aspect_ratio=' + this.aspectRatio
    };

    if (this.aspectRatio == '16x9'){
	params.scale = 'noborder';
    }

    // actually add the OBJECT tag to the DOM
    createObjectTag(redBoxPlayer, params, attrs);

    redBoxWin.appendChild(redBoxPlayer);

  
  var rBB = document.createElement('div');
  rBB.setAttribute('id', 'redBoxBg');
  rBB.setAttribute('class', 'fauxLink');
  rBB.setAttribute('title', 'Close');
  rBB.appendChild(document.createTextNode('&nbsp;'));
  // we can overwrite the default handler since this is a transient DOM subtree
  rBB.onclick = function() { closeRedBoxHD(); return false; };

  var vidDiv = document.createElement('div');
  vidDiv.setAttribute('id', 'redBox');
  vidDiv.setAttribute('style', 'display: none');
  vidDiv.appendChild(redBoxWin);
  vidDiv.appendChild(rBB);

  return vidDiv;
};

/*****
// The above DOM code rendered in JsonML (jsonml.org)... perhaps preferable to all of the DOM code above.
['div', {'id':'redBox', 'style':'display:none;'}, 
  ['div', {'id':'redBoxWin', 'style':'width:' + this.maxWidth + 'px;'},
    ['a', {'id':'redBoxClose', 'title':'Close', 'href':'#'}, 'Close'],
    ['h2', {'id':'redBoxTitle'}, this.movieTitle],
    ['div', {'id':'redBoxPlayer'},
      ['object', {'id':this.movieTitle, 'type':'application/x-shockwave-flash', 'data':this.omniFile, 'width':this.maxWidth, 'height':this.maxHeight},
        ['param', {'movie':this.omniFile}],
        ['param', {'bgcolor':'#000000'}],
        ['param', {'quality':'high'}],
        ['param', {'flashvars':'file=' + this.movieURL + '&image=' + this.previewImg + '&omniEnv=' + s_account}]
      ]
    ]
  ],
  ['div', {'id':'redBoxBg', 'class':'fauxLink', 'title':'Close'}, '&nbsp;']
]

// and the event handlers for the elements in the JsonML:
var clickClose = function() { closeRedBoxHD(); return false; };
$('#redBoxClose').onclick = clickClose;
$('#redBoxBg').onclick = clickClose;
*****/



function loadRedBoxHD(document, omnitureAccount) {
  RedBoxEnv.document = document;
  RedBoxEnv.omnitureAccount = omnitureAccount;
  
  findVideoLinks($('a.video'));
}
function findVideoLinks(anchors) {
  var vidCount         = 0,
      supportedFormats = /(\.flv)/i, // only FLVs are currently supported
      supportedAnchors = $(anchors).filter( function(i){return this.href.match(supportedFormats);} );
      
  for (var i = 0; i < supportedAnchors.length; i++) {
    vidCount++;
    updateVideoLinks(vidCount, supportedAnchors[i]);
  }
}
function updateVideoLinks(idNum, target) {
  // Creates and adds appropriate js link to open respective video (per link)
  // target.id = $(target).children($('img.video-still'))[0].title.split(' ').join('_') + '_' + idNum;
  
  var videoTitle = $(target).attr('title') || $(target).children($('img.video-still')).attr('title');
  $(target).attr('id', videoTitle.split(' ').join('_') + '_' + idNum);
  
  // NOTE this is OK, since we want to override the default click behavior completely, and the node is temporary
  target.onclick = function(){ playVideo(target); return false; };
}



function playVideo(videoLink) {
  closeRedBoxHD(); // Closes any 'old' instances of RedBoxHD if they exist
  
  var curID       = videoLink.id,
      scrollCoord = new getScrollXY(),
      stillFrame  = $(videoLink).children($('img.video-still')),
      videoTitle  = $(videoLink).attr('title') || stillFrame.attr('title'),
      aspectRatio = parseUri(videoLink.href).queryKey['ar'] || '4x3',
      newVideo,
      rBC,
      rBB;
  
  RedBoxEnv.aspectRatio = aspectRatio;
  
  // Creates a new div populating appropriate links and variables
  newVideo = new RedBoxHD(videoTitle, videoLink.href.split('?')[0], stillFrame.attr('src'), aspectRatio);

  // Adds the new redbox and places it appropriately on the page
  // $('body')[0].appendChild(newVideo.toDOM(document, RedBoxEnv.omnitureAccount));
  $('body').append(newVideo.toDOM(document, RedBoxEnv.omnitureAccount));

  rBC = $('#redBoxClose')[0];
  rBB = $('#redBoxBg')[0];
  rBC.onclick = rBB.onclick = function(){ closeRedBoxHD(scrollCoord.scrollY); return false; };

  // Add the resize listener... play nicely since this is a window event...
  addEvent(window, 'resize', resizeVideo);

  // Set the inital size and placement
  resizeVideo(); 
}



// closes any other videos should they already be open or hidden
function closeRedBoxHD(scrollHeight) {
  if ($('#redBox').length) {
    $('#redBox')[0].parentNode.removeChild(document.getElementById('redBox'));
    
    var theBody = $('body')[0];
    theBody.scroll = 'yes'; // re-enable scroll in IE and some Opera UAs (see alignCenter() for more info)
    theBody.style.overflow = 'auto';

    // be nice and remove the video's resize handler from the window object's resize handler chain
    removeEvent(window, 'resize', resizeVideo);

    window.scrollTo(0, scrollHeight || 0);
    
    // need to add a call to terminate the flash player
  }
}

// TO-DO: we need some explanation here regarding what the hard-coded numbers mean in this function
function resizeVideo() {
  var pageDims = new getPageDims(),
      flashObjTag = $('#redBoxPlayer').children('object')[0],
      vidDims = getDimensions(RedBoxEnv.aspectRatio); // to get default min/max values for height/width
  

  // what's the significance of the 30px addition for comparison?
  if ((pageDims.width > vidDims.maxWidth + 30) || (pageDims.height > vidDims.maxHeight + 30)) {
    flashObjTag.setAttribute('width', vidDims.maxWidth);
    flashObjTag.setAttribute('height', vidDims.maxHeight);
  }
  else {
    flashObjTag.setAttribute('width', vidDims.minWidth);
    flashObjTag.setAttribute('height', vidDims.minHeight);
  }
  
  $('#redBoxWin').css('width', flashObjTag.width + 'px');
  resizeBackground();
}

function resizeBackground(){
  var pageDims = new getPageDims();
  var scrollCoord = new getScrollXY();
  $('#redBoxBg')[0].style.height = pageDims.height + scrollCoord.scrollY + 'px';
  alignCenter($('#redBoxWin')[0]);
}

function alignCenter(elem) {
  // move aside before placing and showing to avoid flicker
  elem.style.left = '-3000px';
  elem.style.top = '-3000px';
  $('#redBox')[0].style.display = 'block'; // is this resetting the display style to the default for the element???
  
  var scrollPos = new getScrollXY();
  var pageSize = new getPageDims();
  var elemSize = new getElementSize(elem);
  
  elemSize.height = 550;
  
  elem.style.left = Math.round(pageSize.width * .5) - (elemSize.width * .5) + scrollPos.scrollX + 'px';
  elem.style.top = Math.round(pageSize.height * .5) - (elemSize.height * .5) + scrollPos.scrollY + 'px';
  
  theBody = $('body')[0];
  theBody.scroll = 'no'; // Disable scroll for some ie and opera browsers
  theBody.style.overflow = 'hidden'; // Disable scroll
  
  window.scrollTo(0,scrollPos.scrollY);
}



/*
Global sizing and scrolling
********************************************************
Thank you iBox. (For more information visit: http://www.ibegin.com/blog/p_ibox.html)
*/
getScrollXY = function() {
    var docElem = document.documentElement;
    return {
    	scrollX :  self.pageXOffset || (docElem&&docElem.scrollLeft) || document.body.scrollLeft,
    	scrollY : self.pageYOffset || (docElem&&docElem.scrollTop) || document.body.scrollTop
    }
}
getPageDims = function() {
    var docElem = document.documentElement;
    return {
    	width : self.innerWidth || (docElem&&docElem.clientWidth) || document.body.clientWidth,
    	height : self.innerHeight || (docElem&&docElem.clientHeight) || document.body.clientHeight
    }
}
getElementSize = function(elem) {
    return {
    	width : elem.offsetWidth ||  elem.style.pixelWidth,
    	height : elem.offsetHeight || elem.style.pixelHeight
    }
}

$(function() {
	loadRedBoxHD(document, s_account);
});
$(document).ready(function() {
	$('.video').each(function() {
		$(this).append('<span>Click to Play</span>');
		if ($('img', this).height() <= '100') {
			$('span', this).addClass('tinyVid');
		}
	});
});
