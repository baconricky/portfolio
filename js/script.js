/* Author:

*/
var screen_names = {
    'nick' : {
        'twitter': 'baconricky',
        'facebook': {
            'screen_name': 'baconricky',
            'token' : 'AAAAAAITEghMBAF5EpOGR77xQZCMC0xrJKAEbI83gElxyB1WX0dnU84cAXjoELddSxUSfRodfFWN0vKnFk5Q0TYSTYvg4ccxQpDCZBCPQZDZD'
        },
        'picasa': 'baconricky',
        'instagram': 'baconricky'
    }
};

var feeds = {
    'twitter' : "https://api.twitter.com/1/statuses/user_timeline.json?include_entities=true&include_rts=true&screen_name={screen_name}&callback=?",
    'facebook' : {
        'info' : "https://graph.facebook.com/{screen_name}",
        'feed' : "https://graph.facebook.com/me/feed?access_token={token}",
        'token_req' : 'https://graph.facebook.com/oauth/access_token?client_id=169113006445607&client_secret=88d68eff5ce2dbf30e7c63ab03a27994&grant_type=client_credentials&callback=?'
    }
};

/**
https://www.facebook.com/dialog/oauth?display=popup&client_id=169113006445607&redirect_uri=http://localhost&scope=offline_access,read_stream,email,read_insights,user_events,user_groups,user_interests,user_likes,user_location,user_notes,user_photo_video_tags,user_photos,user_relationships,user_religion_politics,user_status,user_videos,user_website,user_work_history,read_friendlists,read_requests,friends_likes,friends_location,friends_notes,friends_photo_video_tags,friends_photos,friends_relationships,friends_religion_politics,friends_status,friends_videos,friends_website,friends_work_history,user_checkins,friends_checkins

https://graph.facebook.com/oauth/access_token?client_id=169113006445607&redirect_uri=http://localhost&client_secret=88d68eff5ce2dbf30e7c63ab03a27994&code=AQA8zTicLolE13aNipq_xYXBlNisTwvN_8JFkyStiDicX9SQw6gLtBeLt_8lNKQPJVOBLXLuu0q6FG1Xk4WPvL85FrEnQ5LLeY5zBi-sjVS7ZDXa6bhOduynBs7lzAD1wKIt2eIyEV8mhhnjXFWrNRfLOs2jgdZA2ac6bs_QWuJehWd10VBBFzh4pnbzOsUCcNA#_=_
**/

var content = new Array();



  window.fbAsyncInit = function() {
    FB.init({
      appId      : '169113006445607', // App ID
      channelUrl : '//localhost/~nick/theharris/channel.html', // Channel File
      status     : true, // check login status
      cookie     : true, // enable cookies to allow the server to access the session
      xfbml      : true  // parse XFBML
    });

    // Additional initialization code here
  };

  // Load the SDK Asynchronously
  (function(d){
     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement('script'); js.id = id; js.async = true;
     js.src = "//connect.facebook.net/en_US/all.js";
     ref.parentNode.insertBefore(js, ref);
   }(document));

$(document).ready(function() {
    var fb_access_token = '';
    $.ajax({
        url: feeds.facebook.token_req,
        type: 'GET',
        dataType: 'jsonp',
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("jqXHR:");
            console.log(jqXHR);
            console.log("textStatus:");
            console.log(textStatus);
            console.log("errorThrown:");
            console.log(errorThrown);
        },
        success: function(data, textStatus, jqXHR) {
            var token = JSON.stringify(data);
            console.log("token: " + token);
            fb_access_token = token;
        }
    }).done(function() {
        console.log("Done!");
    });
    console.log("fb_access_token: " + fb_access_token);


    //facebook
    $.getJSON("https://graph.facebook.com/me/feed?until=yesterday&access_token="+fb_access_token+"&callback=?",
       {},
        function(feed) {
            $(feed).each(function(i,fb) {

                console.log(fb);

                /**

                var tw_templ = '<dl class="src_fb"><dt class="heading">Fb</dt><dd><img src="https://graph.facebook.com/baconricky/picture" class="icon"/>'+t.text;
                if (t.retweeted) {
                     tw_templ += '<p><a href="">Comment</a> | <a href="">Like</a></p> ' +t.retweet_count + " times!</p>";
                }
                tw_templ += '</dd><dt class="footing">Posted <abbr class="timeago" title="'+t.created_at+'">'+t.created_at+'</abbr> by <a href="https://twitter.com/#!/'+t.user.screen_name+'">'+ t.user.name + ' (' + t.user.screen_name + ')</a></dt></dl>';

                $("div[role='main']").append(tw_templ);
                $("abbr.timeago").timeago();
**/
            });
       }
    );

    //twitter
    $.getJSON("https://api.twitter.com/1/statuses/user_timeline.json?include_entities=true&include_rts=true&screen_name=baconricky&callback=?",
       {},
        function(feed) {
            $(feed).each(function(i,t) {
                var tw_templ = '<dl class="src_tw"><dt class="heading">Tw</dt><dd><img src="'+t.user.profile_image_url+'" class="icon">'+t.text;
                if (t.retweeted) {
                     tw_templ += '<p>Retweeted ' +t.retweet_count + " times!</p>";
                }
                tw_templ += '</dd><dt class="footing">Posted <abbr class="timeago" title="'+t.created_at+'">'+t.created_at+'</abbr> by <a href="https://twitter.com/#!/'+t.user.screen_name+'">'+ t.user.name + ' (' + t.user.screen_name + ')</a></dt></dl>';

                $("div[role='main']").append(tw_templ);
                $("abbr.timeago").timeago();

            });
       }
    );
});
