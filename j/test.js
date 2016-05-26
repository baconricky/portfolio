// redhat.com master javascript file
// created June 2004

// jQuery functions for promotion cycler

$('html').addClass('js');
$(document).ready(function() {
        $('html').removeClass('js');
        $('.buttons').css('display', 'block'); // set to none in css for non-js users
        i = 1; j = 1; k = 1;
        $.fn.cycle.defaults.fx = 'fade';
        $.fn.cycle.defaults.speed = 600;
        $.fn.cycle.defaults.pager = '#nav';
    bannerFlip();
        function bannerFlip() {
                $('#flipBanner').after('<div id="nav" class="nav">').cycle({
               timeout: 6000,
              autostop: 1,
         autostopCount: 7,
                   end: bannerFlipEnd
                });
        $('#stopPlay').html('<img src="/g/chrome/pause-small.png" alt="pause" width="12" height="12" />');
                $("#stopPlay").toggle(
                        function() {
                                $('#flipBanner').cycle('pause');
                                $(this).html('<img src="/g/chrome/play-small.png" alt="play" width="12" height="12" />');
                        },
                        function() {
                                $('#flipBanner').cycle('resume');
                                $(this).html('<img src="/g/chrome/pause-small.png" alt="pause" width="12" height="12" />');
                        }
                );
        }
		$('#s2').cycle({
			timeout: 18000,
			next:   '#next2', 
			prev:   '#prev2' 
		});
        function bannerFlipAfter() {
        $('#flipBanner').after('<div id="nav" class="nav">').cycle({
                timeout: 0
        });
        $('#stopPlay').html('<img src="/g/chrome/play-small.png" alt="play" width="12" height="12" />');
        $('#stopPlay').click(function() {
                $('#nav').remove();
                $('#stopPlay').unbind('click');
                $('#nav a').unbind('click');
                return bannerFlip();
        });
    }
        function bannerFlipEnd() {
        $('#stopPlay').unbind('click');
        $('#nav a').unbind('click');
        $('#nav').remove();
        return bannerFlipAfter();
    }
});

// end jQuery functions for promotion cycler


function popflash(pagename){
	popwindow=window.open(pagename,'foo','width=800,height=600,scrollbars=yes');
	if (window.focus) {popwindow.focus()}
	return false;
}

function popflash2(pagename){
	popwindow=window.open(pagename,'foo','width=735,height=735,scrollbars=yes');
	if (window.focus) {popwindow.focus()}
	return false;
}


function popwin(pagename){
	popwindow=window.open(pagename,'foo','width=400,height=400,scrollbars=yes');
	if (window.focus) {popwindow.focus()}
	return false;
}


function init(){
     if( navigator.appVersion.indexOf('Mac')!=-1 && document.all){
      /* Pass the ids of the containers */
          clearContainer("mainNavOuter");
          clearContainer("secNavOuter");
          clearContainer("contentWrap");
          clearContainer("compare"); 
          clearContainer("prod"); 
          clearContainer("promoHome");
          /*clearContainer("contentWrapHome"); causing promo area to double up on home page */
          clearContainer("formrow");
          clearContainer("contentWrap1Col");
          clearContainer("content2Col"); 
          clearContainer("content2ColHR"); 
          clearContainer("imgLeft");     
     }
}

function clearContainer(theid){  
   if(document.getElementById(theid)){        
       document.getElementById(theid).innerHTML+="<div class='cb'></div>";        
   }        
} 
   
window.onload=init;


function mailpage()
{
mail_str = "mailto:?subject=Check out the " + document.title;
mail_str += "&body=I thought you might be interested in the " + document.title;
mail_str += ". You can view it at, " + location.href;
location.href = mail_str;
}

function popstore(pagename){
	popwindow=window.open(pagename,'foo','width=600,height=600,resizable=yes,scrollbars=yes');
	if (window.focus) {popwindow.focus()}
	return false;
}

function popchart(pagename){
	popwindow=window.open(pagename,'foo','width=750,height=600,resizable=yes,scrollbars=yes');
	if (window.focus) {popwindow.focus()}
	return false;
}

function remote2(url){
	if (window.opener) {
		window.opener.location=url;
		this.window.close();
	} else {
		this.location=url;	
	}
}

function loadInto(url, nodeId) {
	//usage: loadInto('/promo/blogs/somefile.html', 'target_elem_id');
	var xhr;
	var loader = '';
	var defaultHtml = document.getElementById(nodeId).innerHTML;
	// Check for browser compatibility
	if (!document.getElementsByTagName) { // Lets be sure we have a new enough browser before we do anything else
		xhr = false;
		return xhr;
	} else {
		document.getElementById(nodeId).style.display = 'none';
		try { xhr = new ActiveXObject('Msxml2.XMLHTTP'); }
		catch (e) {
			try { xhr = new ActiveXObject('Microsoft.XMLHTTP'); }
			catch (e2) {
				try { xhr = new XMLHttpRequest(); }
				catch (e3) { xhr = false; }
			}
		}
	}
	
	loader = '<img style="padding: 15px 10px 0 15px;" src="/g/chrome/throbber_dickie.gif" alt="loading cart..." border="0" /> <span style="font-size: smaller">Loading ...</span>';
    xhr.onreadystatechange  = function() { 
		if (xhr.readyState  == 4) {
			if (xhr.status  == 200) {
				// Received
				var tmpNode = document.getElementById(nodeId);
				tmpNode.innerHTML = xhr.responseText;
				document.getElementById(nodeId).innerHTML = tmpNode.getElementsByTagName('div')[0].innerHTML;
				document.getElementById(nodeId).style.display = '';
			} else {
				document.getElementById(nodeId).innerHTML = defaultHtml;
			}
		} else {
			document.getElementById(nodeId).innerHTML = loader;
			document.getElementById(nodeId).style.display = '';
		}
	}
	xhr.open('GET', url,  true);
	xhr.send(null);
}

// following bit of JS included for survey popup June 2008
// can be reused - unobstusive JS courtesy of Jeremy Keith...

window.onload = function() {
  if (!document.getElementsByTagName) return false;
  var lnks = document.getElementsByTagName("a");
  for (var i=0; i<lnks.length; i++) {
    if (lnks[i].getAttribute("class") == "popup") {
      lnks[i].onclick = function() {
        popUp(this.getAttribute("href"));
        return false;
      }
    }
  }
}

function popUp(winURL) {
  window.open(winURL,"popup","width=780,height=560,scrollbars=1,resizable=1");
}

function m2lform() {
        var url = document.getElementById('m2lurl').href;
        var height = document.getElementById('m2lheight').innerHTML;
        var width = document.getElementById('m2lwidth').innerHTML;
        document.getElementById('m2lform').innerHTML = '<iframe style="height:' + height + ';width:' + width + '" src="' + url + '_i"></iframe>';
}

//NOTE: tabberClassRename() and tabber() work together
//tabberClassRename() gets all of the ids that are children of tabcontent and creates classes to setup tabber().  This setup is required so the page doesn't jump to anchors when the tabs are clicked but still shows the anchors in the url bar of the browser for deep linking.

function tabberClassRename() {
	var tabcontent=document.getElementById('tabcontent').getElementsByTagName('div');
	for(i=0;i<tabcontent.length;i++) {
		if (tabcontent[i].parentNode.id=='tabcontent') {
			tabcontent[i].className=tabcontent[i].id;
		}
	}
}

function tabber(id) {
	var tabber=document.getElementById('tabber').getElementsByTagName('a');
	var tabcontent=document.getElementById('tabcontent').getElementsByTagName('div');
	var tabid=new Array();
	for (i=0;i<tabcontent.length;i++) {
		if (tabcontent[i].parentNode.id=='tabcontent') {
			tabid[i]=tabcontent[i].className;
		}
	}
	if (!(id)) {
		if (!(location.hash)) {
			id=tabcontent[0].className;
		} else {
			id=location.hash.split('#');
			id=id[1];
			if (tabid.indexOf(id)==-1) {
				id=tabcontent[0].className;
			}
		}
	}
	for (i=0;i<tabber.length;i++) {
		selected=tabber[i].href.split('#');
		if (selected[1]==id) {
			tabber[i].className='selected';
			tabber[i].parentNode.className='selected';
		} else {
			tabber[i].className='default';
			tabber[i].parentNode.className='default';
		}
	}
	for(i=0;i<tabcontent.length;i++) {
		if (tabcontent[i].parentNode.id=='tabcontent') {
			if(tabcontent[i].className!=id) {
				tabcontent[i].style.display='none';
				tabcontent[i].id==tabcontent[i].className;
			} else {
				tabcontent[i].style.display='block';
				tabcontent[i].id='';
			}
		}
	}
}

function hideAll() {
	var link = document.getElementById('jsevents').getElementsByTagName('div');
	for (i=0;i<link.length;i++) {
		var lid = link[i].id;
		var linka = link[i].getElementsByTagName('h3')[0].getElementsByTagName('a')[0];
		var linko = linka.href;
		linka.href = 'javascript:showHide(\'' + lid + '\',\'show\');';
		linka.target = '_self';
		var newspan = document.createElement('span');
		var newspantext = document.createTextNode(' ');
		var newa = document.createElement('a');
		newa.href = linko;
		newa.target = '_blank';
		newa.innerHTML = 'Read More';
		newspan.appendChild(newspantext);
		newspan.appendChild(newa);
		var p = link[i].getElementsByTagName('p');
		for(j=1;j<p.length;j++) {
			p[j].style.display = 'none';
			if (j+1 == p.length) {
				p[j].appendChild(newspan);
			}
		}
	}
}

function showHide(id,action) {
	var link = document.getElementById(id);
	var linka = link.getElementsByTagName('h3')[0].getElementsByTagName('a')[0];
	var p = link.getElementsByTagName('p');
	if (action == 'hide') {
		linka.href = 'javascript:showHide(\'' + id + '\',\'show\');';
		for(j=1;j<p.length;j++) {
			p[j].style.display = 'none';
		}
	} else {
		linka.href = 'javascript:showHide(\'' + id + '\',\'hide\');';
		for(j=1;j<p.length;j++) {
			p[j].style.display = 'block'; 
		}
	}

}
