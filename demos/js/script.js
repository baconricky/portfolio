/* Author: 

*/

var getHour = function(mins) {
	console.log("-- getHour --");
	console.log("mins: " + mins);
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

var setButtons = function () {
	$(".addBtn").button({
        icons: {
            primary: "ui-icon-plus"
        },
        text: false
    });
};

$(function() {
	setButtons();

	$(".addBtn").on("click", function () {
		$(this).closest(".timer").clone().insertAfter($(this).closest(".timer"));
	});

	$( "#slider-range" ).slider({
		range: true,
		min: 0,
		max: 1440,
		step: 60,
		values: [ 60, 1380 ],
		slide: function( event, ui ) {
			$( "#amount" ).val( getHour(ui.values[ 0 ]) + " to " + getHour( ui.values[ 1 ] ) );
		}
	});

	$( "#amount" ).val(getHour($("#slider-range").slider("values")[0]) + " to " + getHour($("#slider-range").slider("values")[1]));
});