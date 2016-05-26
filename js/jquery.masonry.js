var grid;
var id;
var container;
var total_placed = 0;
var resizing = 1;

function create_grid(grid_dimensions) {
	grid = new Array(grid_dimensions.cols);
	for (var i = 0; i < grid_dimensions.rows; i++) {
		grid[i] = new Array(grid_dimensions.rows);
	}
	for (var i = 0; i < grid_dimensions.rows; i++) {
		for (var j = 0; j < grid_dimensions.cols; j++) {
			grid[i][j] = "#";
		}
	}
}
function does_item_fit(item_dims, x, y) { // does 1x1 fit in the grid at position x, y
	var fits = false;
	var grid_location;
	for (var i = 0; i < item_dims.rows; i++) { // for the left most cell of the item to the right most
		for (var j = 0; j < item_dims.cols; j++) { // top most to bottom most
			try {
				grid_location = grid[x + i][y + j];
			} catch (e) {
				return false;
			}
			if (grid_location == "#") { // if the current cell in the item fits it destination
				fits = true; // then set does to true
			} else {
				return false;
			}
		}
	}
	return fits;
}
function cell_size(elem) {
	return {
		"rows": Math.floor($(elem).height() / 130),
		"cols": Math.floor($(elem).width() / 185)
	}
}
function find_place_for_item(elem) {
	item_dims = cell_size(elem);
	container_dims = cell_size(container); // loop through the grid trying to see if the item fits
	for (var i = 0; i < container_dims.rows; i++) {
		for (var j = 0; j < container_dims.cols; j++) {
			if (grid[i][j] == "#") { // the top left placement tile is 1 so it wont fit
				fits = does_item_fit(item_dims, i, j);
				if (fits) {
					return {
						"x": i,
						"y": j
					};
				}
			}
		}
	}
	return false;
}
function place_item(item, label, place) {
	item_dims = cell_size(item); // fill the grid with the item
	for (var i = 0; i < item_dims.rows; i++) {
		for (var j = 0; j < item_dims.cols; j++) {
			try {
				grid[i + place.x][j + place.y] = label;
			} catch (e) {
				return false;
			}
		}
	} //draw_array(grid, grid_dimensions);
}
function draw_array(arr, dimensions) {
	for (var i = 0; i < dimensions.rows; i++) {
		var row_str = "";
		for (var j = 0; j < dimensions.cols; j++) { // build the row
			row_str += arr[i][j];
		}
	}
}
function fit_tiles(items) { // for each item, determine its grid size, ie 1x1, 2x1...
	for (var i = 0; i < items.length; i++) {
		cur_item = items[i];
		place = find_place_for_item(cur_item);
		if (place) { // if a space is found in the current grid then place it in
			place_item(cur_item, i.toString(16), place);
			absolute_x = place.x * 130;
			absolute_y = place.y * 185;
			if (resizing) {
				$(cur_item).css({
					position: 'absolute'
				}).animate({
					top: absolute_x + 'px',
					left: absolute_y + 'px'
				}, 800, function() {
					resizing = 0;
				});
			} else {
				$(cur_item).css({
					position: 'absolute'
				}).css({
					top: absolute_x + 'px',
					left: absolute_y + 'px'
				});
			}
			if ($(cur_item).css('top') != absolute_x + 'px' && $(cur_item).css('left') != absolute_y + 'px') {
				total_placed++;
			}
		} else { // else make the grid and container taller.
			$(cur_item).css({
				position: 'absolute',
				"top": -1500,
				"left": 0
			});
		}
	}
}
function set_container(item) { // get height
	container = item;
	var grid_dimensions = cell_size(item); // create an array for the grid of 100x100px squares.
	create_grid(grid_dimensions);
	draw_array(grid, grid_dimensions);
}
function doneResizing() {
	set_container($("#panels"));
	fit_tiles($("#panels > .box"));
}
$(document).ready(function() {
	$('.article-link').live({
		mouseenter: function() {
			$(this).css("color", $(this).attr('color'));
		},
		mouseleave: function() {
			$(this).css("color", '#000');
		}
	});
	if ($('#filter span#handle').hasClass('opened')) {
		$('#filter div').slideToggle(0);
	}
	$('#filter span#handle').click(function() {
		$('#filter div').slideToggle(400);
		return false;
	});
	$('#filter span#handle').click(function() {
		if ($(this).hasClass('closed')) {
			$(this).addClass('opened').removeClass('closed');
		} else {
			$(this).addClass('closed').removeClass('opened');
		}
	});
	$('.twitter span').live('hover', function(event) {
		id = $(this).attr('id').replace('show-', '');
		o = $(this).offset();
		$('#' + id).css({
			top: o.top - $("#header").height() - $("#filter").height() - 3,
			left: o.left + 22
		});
		$('#' + id).toggle();
	}); // Sign In
	$('.signin > span').click(function(event) {
		$('.signin .drop').toggle();
		$('.register .drop').hide();
		$('#overlay').show();
	});
	$('.form span').click(function(event) {
		$('.drop .form').hide();
	});
	$('.form span').click(function(event) {
		$('.reset').show();
	});
	$('.reset span').click(function(event) {
		$('.reset').hide();
		$('.form').show();
	}); // Register
	$('.register > span').click(function(event) {
		$('.register .drop').toggle();
		$('.signin .drop').hide();
		$('#overlay').show();
	});
	$('#overlay').click(function(event) {
		$(this).hide();
		$('.drop').hide();
	});
	$("#submit-login").live('click', function(event) {
		event.preventDefault();
		$.post("/users/signin", {
			'User[email]': $("#login-email").val(),
			'User[password]': $("#login-password").val()
		}, function(data) {
			if ($.trim(data) == "You have entered an incorrect username or password.") {
				$("#login-error").text(data);
			} else {
				window.location.reload();
			}
		});
	});
	$("#submit-register").click(function(event) {
		event.preventDefault();
		$.post("/users/register", {
			'User[email]': $("#register-email").val(),
			'User[password]': $("#register-password").val()
		}, function(data) {
			if ($.trim(data) == "Thanks for registering!") {
				window.location.reload();
			} else {
				$("#register-error").text(data);
			}
		});
	});
	$('.slideshow').each(function() {
		$(this).cycle({
			fx: 'scrollHorz',
			prev: '#back' + $(this).attr('id'),
			next: '#next' + $(this).attr('id')
		});
	});
	$('.slideshow').addClass("loaded");
	var docHeight = $(document).height();
	$('.close').click(function() {
		$('.overlay').slideUp(500);
	});
	$(".article-link").live('click', function(event) {
		event.preventDefault();
	});
	$('.article').live('click', function(event) {
		event.preventDefault();
		window.open($(this).find('.article-link').attr('href'));
	});
	$('.video').live('click', function() {
		var vid = $(this).find('img').attr('id').replace("yt-", "");
		$(this).html("<iframe width='340px' height='230px' frameborder='0' src='http://www.youtube.com/embed/" + vid + "?autoplay=1'></iframe>");
		$(this).removeClass('overlayed');
	});
	$.ajaxSetup({
		async: false
	});
	window.scroll(0, 0);
	set_container($("#panels"));
	fit_tiles($("#panels > .box"));
	$(window).resize(function() {
		resizing = 1;
		clearTimeout(id);
		id = setTimeout(doneResizing, 500);
	});
});
