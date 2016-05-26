function collit(arg1) {
	$(arg1).each(function() {
		var ct = $('li', this).size();
		$('li:gt(' + Math.round((ct/2) - 1) + ')', this).wrapAll('<ul></ul>');
		$('ul ul', this).appendTo(this);
	});
};

$(document).ready(function() {
	$('.certhome .left h4').siblings('.listing').hide('fast');
	$('.certhome .left h4').wrap('<a class="showhide"></a>');
	$('.showhide').each(function() {
			$(this).click(function() {
				$('.on').toggleClass('on');
				$('h4', this).toggleClass('on');
				$(this).next('.listing').toggleClass('on');
				$(this).next('.listing').slideToggle('slow');
				$('.listing').not('.on').hide('slow');
			});
	});

collit('.certhome .left .listing');

});

