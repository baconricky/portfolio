jQuery(function($) {
	$('ul.primeNav-sf').superfish({
		autoArrows: true,
		animation: {opacity: 'show', height: 'show'},
		onShow: function(){$(this).parent().children('a').addClass('sfHover')},
		onHide: function(){$(this).parent().children('a').removeClass('sfHover')}
	});
});
