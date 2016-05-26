$(document).ready(function() {
        var enc = function (a) {
                return encodeURIComponent(a);
        };
        var cU = new String(document.location); 
        if (cU.indexOf('?') == '-1') {cU = cU + '?sc_cid='}
        else {cU = cU + '&sc_cid='};
        var cUE = enc(cU);
        var cH = $('h1:first').text();
        var cHP = cH.replace(/ /g,"+");
        var cHE = enc(cH);
if ($('.content_area_v2').length) {$('.content_area_v2').prepend('<div class="outer-share"></div>')}
else {$('#navWrap').after('<div class="outer-share"></div>')};
        $('.outer-share').append('<div class="inner-share"></div>');
        $('<p class="button"></p>').appendTo('.outer-share');
        $('.inner-share').append('<img class="close" alt="close" src="/g/chrome/x_15x15.png" /><h2>Share This Page</h2><ul class="shareCol"><li class="digg"><a href="http://digg.com/submit?phase=2&url=' + cU + '70160000000I49BAAS&title=' + cHP + '">Digg</a></li><li class="slashdot"><a href="http://slashdot.org/bookmark.pl?url=' + cUE + '70160000000I49uAAC&title=' + cHE + '">Slashdot</a></li><li class="facebook"><a href="http://www.facebook.com/share.php?u=' + cU + '70160000000I49kAAC">Facebook</a></li><li class="reddit"><a href="http://reddit.com/submit?url=' + cU + '70160000000I49VAAS">Reddit</a></li></ul><ul class="shareCol"><li class="twitter"><a href="http://twitter.com/home?status=' + cH + enc(': ') + cU + '70160000000I49fAAC">Twitter</a></li><li class="delicious"><a href="http://del.icio.us/post?url=' + cU + '70160000000I49LAAS&title=' + cHE + '">Del.icio.us</a></li><li class="linkedin"><a href="http://www.linkedin.com/shareArticle?mini=true&url=' + cUE + '70160000000I49aAAC&title=' + cHE + '&summary=&source=">LinkedIn</a></li><li class="stumbleupon"><a href="http://www.stumbleupon.com/submit?url=' + cU + '70160000000I49zAAC">StumbleUpon</a></li></ul>');   
        $('.inner-share').append('<p style="padding: 0; margin: 0; height: 0;"></p><div class="share-more"><ul class="shareCol"><li class="bebo"><a href="http://www.bebo.com/c/share?Url=' + cUE + '70160000000I4ATAA0&Title=' + cHE + '">Bebo</a></li><li class="bitly"><a href="http://bit.ly/?v=3&u=' + cUE + '70160000000I49gAAC&s=' + cHE + '">Bit.ly</a></li><li class="blogger"><a href="http://www.blogger.com/blog_this.pyra?t=' + enc('Hey, check out this page I saw on redhat.com.') + '&u=' + cUE + '70160000000I49hAAC&n=' + cHE + '">Blogger</a></li><li class="faves"><a href="http://www.faves.com/Authoring.aspx?u=' + cUE + '70160000000I4AxAAK&t=' + cHE + '">Faves</a></li><li class="gmail"><a href="https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=&su=' + cHE + '&body=' + enc('Hey, check out this page I saw on redhat.com') + enc('\n') + cUE + '70160000000I4B7AAK&zx=RANDOMTEXT&shva=1&disablechatbrowsercheck=1&ui=1">Gmail</a></li><li class="google"><a href="http://www.google.com/bookmarks/mark?op=edit&bkmk=' + cUE + '70160000000I4BCAA0&title=' + cHE + '">Google Bookmarks</a></li></ul><ul class="shareCol"><li class="hotmail"><a href="http://mail.live.com/default.aspx?rru=' + enc('compose?subject=redhat.com: ' + cHE + '&body=' + cUE + '70160000000I4BHAA0') + '">Hotmail</a></li><li class="identica"><a href="http://identi.ca/?action=newnotice&status_textarea=' + cHE + enc(': ') + cUE + '70160000000I4BMAA0">Identi.ca</a></li><li class="kudos"><a href="http://www.kudos.no/nysak/?kudosKnapp=1&url=' + cUE + '70160000000I4B9AAK&tittel=' + cHE + '&type=0&kategori=&beskrivelse=&tag=">Kudos</a></li><li class="livejournal"><a href="http://www.livejournal.com/update.bml?subject=' + enc('redhat.com: ') + cHE + '&event=' + enc('Hey, check out this page I saw on redhat.com') + enc('\n') + cUE + '70160000000I4BRAA0">LiveJournal</a></li><li class="printpage"><a href="#">Print</a></li><li class="technorati"><a href="http://technorati.com/cosmos/search.html?url=' + cU + '70160000000I4BbAAK">Technorati</a></li><li class="ymail"><a href="http://us.mg2.mail.yahoo.com/dc/launch?.gx=0&.rand=397571764&action=compose&To=&Subj=' + enc('redhat.com: ') + cH + '&Body=' + enc('Hey, check out this page I saw on redhat.com') + enc('\n') + cU + '70160000000I4BgAAK">YMail</a></li></ul></div><p class="sharemore-link"><a href="#">Show More</a></p>');
if (cU.indexOf('rhev') != '-1') {$('.outer-share').css('margin','0 15px 0 400px')};
        $('.outer-share .button').toggle(
                function() {
                        $('div.inner-share').fadeIn('fast');
                }, 
                function() {
                        $('div.inner-share').fadeOut('fast');
                        if ($('.sharemore-link a').text() == 'Show Less') {$('.inner-share .sharemore-link').click()};
                });
	$('.inner-share .close').click(function() {
			$('.outer-share .button').click();
			if ($('.sharemore-link a').text() == 'Show Less') {$('.inner-share .sharemore-link').click()};
		});

                        var sH = -$('.inner-share').height();
        $('.inner-share .sharemore-link').toggle(
                function(){
                        $('.sharemore-link a').text('Show Less');
                        $('.share-more').fadeIn('slow');
                },
                function(){
                        $('.sharemore-link a').text('Show More');
                        $('.share-more').hide();
                }
        );
        $('.printpage').click(function() {
                window.print();
		
        });
        $('.shareCol li').click(function() {
		s.linkTrackVars = "eVar24";
		s.eVar24 = $(this).attr('class');
		s.tl(true, 'o', 'Share Link');
        });
});
