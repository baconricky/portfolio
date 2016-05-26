//Usage: 	goalChart("#my-overall-aum-chart", "../Scripts/sample_data/json/MyOverallAum.json")
//			goalChart("#my-new-aum-chart", "../Scripts/sample_data/json/MyNewAum.json")
//			infoChart("#top-holdings-by-aum-chart", "../Scripts/sample_data/json/TopHoldingsByAum.json")
//			infoChart("#aum-by-advisor-chart", "../Scripts/sample_data/json/AumByAdvisor.json")
//			infoChart("#accounts-by-chart", "../Scripts/sample_data/json/AcctsByPolicy.json")

function getDataSource(url) {
	
	return new kendo.data.DataSource({
		transport: {
			read: url,
			cache: false
		},
		errors: function(response) {
			return response.errors;
		},
		aggregates: function(response) {
			return response.aggregates;
		},
		data: function(response) {
			return response.data;
		},
		total: function(response) {
			return response.totalCount;
		},
		parse: function(response) {
			return response.data;
		}
	});
}

function topRankings(target, url, type) {
	return infoChart(target, url, type);
}

var countTemplate = "#= category # - #= value # / (#= kendo.format('{0:P}', percentage) #)",
	valueTemplate = "#= category # - $#= kendo.format('{0:N}', value/1000000)# M / (#= kendo.format('{0:P}', percentage) #)";

function infoChart(target, url, type) {
	var useTpl = countTemplate;
	
	if (type === "value") useTpl = valueTemplate;
	
	return $(target).kendoChart({
		dataSource: {
			transport: {
				read: url,
				cache: false
			},
			sort: {
				field: "value",
				dir: "asc"
			}
		},
		legend: {
			visible: false
		},
		seriesDefaults: {
			labels: {
				position: "outsideEnd",
				font: '0.8em "Segoe UI",Frutiger,"Frutiger Linotype","DejaVu Sans","Helvetica Neue",Arial,sans-serif',
				template: useTpl,
				visible: true,
				align: "column"
			},
			type: "pie",
			field: "value",
			categoryField: "name",
			colorField: "color",
			explodeField: "explode"
		},
		series: [{
			field: "value",
			categoryField: "name",
			connectors: {
				width: 2,
				color: "#333"
			}
		}],
		tooltip: {
			visible: true,
			font: '0.8em "Segoe UI",Frutiger,"Frutiger Linotype","DejaVu Sans","Helvetica Neue",Arial,sans-serif',
			template: useTpl
		}
	});
}

function goalChart(target, url, type) {
	return true;
}