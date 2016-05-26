$(function() {
	$('#newPromoHome > a').removeClass('SPButtonNonJS') // remove hide if JS
	$('#newPromoHome > a').addClass('SPButton') // add css if JS
	startFlipper();
	function startFlipper() { // this is the main function that operates through two cycles
	    $('#newPromoSlides').cycle({
	    	fx: 'fade', // transition effect
	    	speed: 400, // transition speed
	    	timeout: 4000, // amount of time each promo displays before rotating
	    	pager: '#newPromoNav',
	    	autostop: 1, // set to true
	    	autostopCount: 7, // set to two cycles
	    	end: endFlipper,
	    	pagerAnchorBuilder: function(idx, slide) { 
	        	// return selector string for existing anchor 
	        	return '#newPromoNav li:eq(' + idx + ') a'; 
	    	}
	    });
	    $('.SPButton').text('Stop');
		$('.SPButton').removeClass('play');
		$('.SPButton').toggle(
			function() {
				$('#newPromoSlides').cycle('pause');
				$(this).text('Play');
				$(this).addClass('play');
			},
			function() {
				$('#newPromoSlides').cycle('resume', true);
				$(this).text('Stop');
				$(this).removeClass('play');
			}
		);
	    $('#newPromoNav a').click(function() {
	    	return stopFlipper(); // stop the rotation if user clicks
	    });
	}
	function startFlipperLite() { // this is non-running - only for flipping back and forth
		$('#newPromoSlides').cycle({
			fx: 'fade',
			speed: 400,
			timeout: 0, // set to non rotation
	    	pager: '#newPromoNav',
	    	pagerAnchorBuilder: function(idx, slide) { 
	        	// return selector string for existing anchor 
	        	return '#newPromoNav li:eq(' + idx + ') a'; 
	    	}
		});
		$('.SPButton').text('Play');
		$('.SPButton').addClass('play');
		$('.SPButton').click(function() {
			$('.SPButton').unbind('click');
			return startFlipper(); //restart if user clicks Play button
		});
	}
	function stopFlipper() { // this stops cycle when a small promo is clicked while running
		$('#newPromoSlides').cycle('pause');
		$('.SPButton').unbind('click');
		$('.SPButton').text('Play');
		$('.SPButton').addClass('play');
		$('.SPButton').click(function() {
			$('.SPButton').unbind('click');
			return startFlipper(); //restart if user clicks Play button
		});
	}
	function endFlipper() { // this is what happens when end of second cycle is reached
		$('.SPButton').unbind('click');
		return startFlipperLite(); // go to non-rotating function
	}
});