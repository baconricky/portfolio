if(m2l_width==undefined) {
	var m2l_width='130px';	
}
if(m2l_title==undefined) {
	var m2l_title='Newsletter';	
}
if(m2l_description==undefined) {
	var m2l_description='Receive information on Cloud products and trends';	
}
document.write('<div class="m2lbox" style="width:' + m2l_width +'"><div class="corner_topleft"></div><div class="corner_topright"></div><div class="corner_bottomleft"></div><div class="corner_bottomright"></div><div class="m2lboxcontent"><h3>' + m2l_title + '</h3><iframe src="https://engage.redhat.com/forms/' + m2l_form + '" style="width:130px; height:' + m2l_height + '" frameborder="0" scrolling="no"></iframe><div style="font-size: 10px">' + m2l_description + '</div></div></div>');
