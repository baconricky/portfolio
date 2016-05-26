$(function(){ 
	var urlHere = location.href.split('/'); //ugly nav highlighting hack
	var urlHereDir = urlHere[urlHere.length - 2];
	var urlHerePage = urlHere[urlHere.length - 1];
	if (urlHereDir == 'migrate') {
		if (urlHerePage != 'migrate_now.html') {$('div#sidenav ul li:first-child').addClass('navon').children().addClass('urhere');};
	} else if (urlHereDir == 'rhel_overview') {$('div#sidenav ul li:nth-child(2)').addClass('navon').children().addClass('urhere');
	} else if (urlHereDir == 'jboss') {$('div#sidenav ul li:nth-child(3)').addClass('navon').children().addClass('urhere');
	} else if (urlHereDir == 'systems_management') {$('div#sidenav ul li:nth-child(4)').addClass('navon').children().addClass('urhere');
	} else if (urlHereDir == 'unix_to_linux') {$('div#sidenav ul li:nth-child(5)').addClass('navon').children().addClass('urhere'); 
	} else if (urlHereDir == 'solaris_to_linux') {$('div#sidenav ul li:nth-child(6)').addClass('navon').children().addClass('urhere');
	} else if (urlHereDir == 'older_versions') {$('div#sidenav ul li:nth-child(7)').addClass('navon').children().addClass('urhere');
	} else if (urlHereDir == 'migration_services') {$('div#sidenav ul li:nth-child(8)').addClass('navon').children().addClass('urhere');
	} else if (urlHereDir == 'partners') {$('div#sidenav ul li:nth-child(9)').addClass('navon').children().addClass('urhere');
	} else if (urlHereDir == 'news') {$('div#sidenav ul li:nth-child(10)').addClass('navon').children().addClass('urhere');
	} else if (urlHereDir == 'resources') {$('div#sidenav ul li:nth-child(11)').addClass('navon').children().addClass('urhere')};

//tabs script for CoC and other campaigns
	$('ul#jqTabber li a').click(function(){
		$('ul#jqTabber li a, ul#jqTabber li').removeClass('selected');
		var tabUrl = (this).href.split('/');
		var tabAnchor = tabUrl[tabUrl.length - 1];
		if(tabAnchor == ''){ tabAnchor = 'index.html' };
		var tabAjax = tabAnchor + ' #jqTabcontent';
		$('#jqTabcontent').load(tabAjax);
		$(this).addClass('selected');
		$(this).parent('li').addClass('selected');
	});
//ajax-loader, using feed-grabber
	function ziftNormal(data, target){
	    var targetClass = '.' + target;
		var ink = 0;
		$('item', data).each(function() {
			var someThing = target + 'House' + ink;
			$('<div></div>').addClass(someThing).addClass('feedUnit').appendTo(targetClass);
			var ziftTitle = $('title', this).text();
			var ziftDesc = $('description', this).text();
			var ziftLink = $('guid', this).text();
			$('<h4 class="ookie"></h4>').html(ziftTitle).appendTo('.' + someThing);
			$('<p></p>').html(ziftDesc).appendTo('.' + someThing);
			$('<a></a>').html('Read More').addClass('zifty').attr('href', ziftLink).appendTo('.' + someThing);
			$(someThing + 'a.zifty').addClass('moreLink');
			ink++;
			});
		};
	function ziftSuccess(data, target){
	    var targetClass = '.' + target;
		var ink = 0;
		$('item', data).each(function() {
			var someThing = target + 'House' + ink;
			$('<div></div>').addClass(someThing).addClass('feedUnit').appendTo(targetClass);
			var ziftTitle = $('title', this).text();
//			var ziftDesc = $('description', this).text();
			var ziftLink = $('guid', this).text();
			$('<h4 class="ookie"></h4>').html(ziftTitle).appendTo('.' + someThing);
//			$('<p></p>').html(ziftDesc).addClass('hide').appendTo('.' + someThing);
			$('<a></a>').html('Read more of this success story').addClass('zifty').attr('href', ziftLink).appendTo('.' + someThing);
			$(someThing + 'a.zifty').addClass('moreLink');
			ink++;
			});
		};
	function ziftSuccessFeat(data, target){
	    var targetClass = '.' + target;
		var ink = 0;
		$('item', data).each(function() {
			var someThing = target + 'House' + ink;
			$('<div></div>').addClass(someThing).addClass('feedUnit').appendTo(targetClass);
			var ziftTitle = $('title', this).text();
//			var ziftDesc = $('description', this).text();
			var ziftLink = $('guid', this).text();
			$('<h4 class="ookie"></h4>').html(ziftTitle).appendTo('.' + someThing);
//			$('<p></p>').html(ziftDesc).appendTo('.' + someThing);
			$('<a></a>').html('Read More').addClass('zifty').attr('href', ziftLink).appendTo('.' + someThing);
			$(someThing + 'a.zifty').addClass('moreLink');
			ink++;
			});
		};

	var bigCount = 0;
	var littleCount = $('.feedGrab').size();
	$('.feedGrab').each(function(i) {
        var target = 'buildSite' + i;
		$('<div>').insertAfter(this).addClass(target);
        //get the feed url
        var ziftUrl = ($(this).attr('rel')).split('/');
        var rhZiftUrl = '/promo/feed_grabber/' + ziftUrl[ziftUrl.length - 1];
        //get the function name
        var parseType = $(this).attr('rev');

        $.ajax({
		url: rhZiftUrl,
		type: 'GET',
		timeout: 5000,
//		error: function(foo,bar,baz){ alert(bar); },
		success: function(resp){
			eval(parseType + '(resp, target)');
			},
		complete: function(){
			bigCount++;
			if (bigCount == littleCount)
			{
				$('h4.ookie').siblings().hide('fast');
				$('h4.ookie').wrap('<a href="#" class="showhide"></a>');
				$('.showhide').each(function()
				        {
				                $(this).toggle(
	            			            function() {
				                        $('h4', this).toggleClass('on');
		                                        $(this).siblings().not('h4').not('.showhide').show('slow');
	                 			        },
	                 			        function() {
				                        $('h4', this).toggleClass('on');
	                 			        $(this).siblings().not('h4').not('.showhide').hide('slow');
							});
				        });
				}
			}
		});

	});
                return false;

});

