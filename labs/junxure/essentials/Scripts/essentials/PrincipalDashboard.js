var my_overall_aum_container = $("#my_overall_aum_container"),
    overall_aum_container = $("#overall_aum_container"),
    
    my_new_aum_container = $("#my_new_aum_container"),
    new_aum_container	= $("#new_aum_container"),
    
    my_actions_container = $("#my_actions_container"),
    actions_container = $("#actions_container"),
    
    top_holdings_by_aum_container = $("#top_holdings_by_aum_container"),
    aum_by_advisor_container = $("#aum_by_advisor_container"),
    accounts_container = $("#accounts_container");
    
function createCharts() {
	my_overall_aum_container.load("my_overall_aum.html");
	overall_aum_container.load("overall_aum.html");
	
	my_new_aum_container.load("my_new_aum.html");
	new_aum_container.load("new_aum.html");
	
	my_actions_container.load("my_actions.html");
	actions_container.load("actions.html");
	
	overall_aum_container.load("overall_aum.html");
	top_holdings_by_aum_container.load("top_holdings_by_aum.html");
	aum_by_advisor_container.load("aum_by_advisor.html");
	accounts_container.load("accounts.html");
}

$(document).ready(function() {
    setTimeout(function() {
        // Initialize the chart with a delay to make sure
        // the initial animation is visible
        createCharts();
        //Init();
    }, 10);
});