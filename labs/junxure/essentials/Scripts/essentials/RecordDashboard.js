var open_actions_container = $("#open_actions_container"),
    client_news_container = $("#client_news_container"),
    record_aum_container = $("#record_aum_container"),
    notes_container	= $("#notes_container"),
    client_story_container = $("#client_story_container"),
    client_opps_container = $("#client_opps_container");
    
function initDashboard() {
	var d = Date.parse( new Date() );
	open_actions_container.load("dashboard/open_actions.html?"+d);
	client_news_container.load("dashboard/client_news.html?"+d);
	record_aum_container.load("dashboard/record_aum.html?"+d);
	notes_container.load("dashboard/notes.html?"+d);
	client_story_container.load("dashboard/client_story.html?"+d);
	client_opps_container.load("dashboard/client_opps.html?"+d);
}

$(document).ready(function() {
    setTimeout(function() {
        // Initialize the chart with a delay to make sure
        // the initial animation is visible
        initDashboard();
        //Init();
    }, 10);
});