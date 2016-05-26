if(m2l_width==undefined) {
	var m2l_width='100%';	
}
if(m2l_title==undefined) {
	var m2l_title='Newsletter';	
}
if(m2l_description==undefined) {
	var m2l_description='Sign up for the latest promotions, expert tips, and news.';	
}
document.write('<div class="m2lbox" style="width:' + m2l_width +'"><div class="corner_topleft"></div><div class="corner_topright"></div><div class="corner_bottomleft"></div><div class="corner_bottomright"></div><div class="m2lboxcontent"><h2>' + m2l_title + '</h2><p><img class="iconLeft" src="http://www.redhat.com/g/chrome/icon_gls_newsletter.png" alt="'  + m2l_title + '" align="left" height="30" width="30">' + m2l_description + '</p><iframe src="https://engage.redhat.com/forms/' + m2l_form + '" style="height:' + m2l_height + '" frameborder="0"></iframe></div></div>');
