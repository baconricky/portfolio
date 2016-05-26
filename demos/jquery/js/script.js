var getHour = function(mins) {
	var date = new Date();
	var hour = mins/60;

	var suffix = "am";
  	if (hour >= 12) {
  		suffix = "pm";
  		hour = hour - 12;
  	}
  	if (hour == 0) {
 		hour = 12;
 	}

	return hour + "" + suffix;
};

$(function() {
	$( "#slider-range" ).slider({
		animate: true,
		range: true,
		min: 0,
		max: 1440,
		step: 60,
		values: [ 60, 1320 ], //1am - 10pm
		slide: function( event, ui ) {
			//don't let both sliders land on the same value
			if (ui.values[1] === ui.values[0]) return false;

			//update time
			$( "#time" ).val( getHour(ui.values[ 0 ]) + " to " + getHour( ui.values[ 1 ] ) );
		}
	});

	//set inital time display
	$( "#time" ).val(getHour($("#slider-range").slider("values")[0]) + " to " + getHour($("#slider-range").slider("values")[1]));
});