/**********************************************\
 Records Workspace Initialiation
 
 0. Prototype-only - these calls are only used in the prototype, or as a stepping stone for the "real" app.
 1. Records-Specific - UI init and interaction code that may be used in roduction. Will likely be configuration and init of plugins.
\**********************************************/

//in: 9195556666
//out: (919) 555-6666
function fmtPhone(src) {
	//(xxx) xxx-xxxx ext xxx

	return "(" + src.slice(0,3) + ") " + src.slice(3,6) + "-" + src.slice(6,10);
}

function fmtCurrency(src) {
	return kendo.toString(src,"$##,#.00");
}
 
!function ($) {
	$(function () {
		"use strict"; // jshint ;_;
		
		/**********************************************\
			0. Prototype-only - unless we decide to 
				move to web-service based data sources, 
				this code will be of little use to 
				the final app.
		\**********************************************/
		var $modal = $("#new-modal");
				
		$("#action-list li a").on("click", function() {
			window.actionClickHandler();
		});
	
		$("#cboActionType").on("change", function(e) {
			var $this = $(this),
				actionType = $(":selected", $this).text();
			
			$(".action-type-label").html(actionType);
        });
		
		var grid = $("#jx-workspace-grid").kendoGrid({
			dataSource: {
	            data: SampleData.GetRecordData(50),
	            schema: {
	                model: {
	                    fields: {
							AlertFlag: { type: "boolean" },
							Email: { type: "email" },
							Record: { type: "string" },
							Contact1Phone: { type: "phone" },
							Contact2Phone: { type: "phone" },			 	
							Advisor1: { type: "string" },
							Advisor2: { type: "string" },
							LastContacted: { type: "date" },
							Company: { type: "string" },
							AUM: { type: "currency" },
							Classification: { type: "string" }
						}
					}
	            },
	            
	            pageSize: 10,
	            serverPaging: true,
	            serverFiltering: true,
	            serverSorting: true
	        },
	        selectable: "multiple row",
	        height: 500,

	        columns: [{
	                field:"Record",
	                title: "Record"
	            },{
	                field:"Contact1Phone",
	                title: "Primary Phone",
	                template: '<div style="text-align:right;">${ fmtPhone(Contact1Phone) }</div>',
	                width: 125
	            },{
	                field:"Contact2Phone",
	                title: "Secondary Phone",
	                template: '<div style="text-align:right;">${ fmtPhone(Contact2Phone) }</div>',
	                width: 125
	            },{
	                field:"Advisor1",
	                title: "Primary Advisor"
	            },{
	                field:"Advisor2",
	                title: "Secondary Advisor"
	            },{
	                field: "LastContacted",
	                title: "Last Contacted",
	                template: '<div style="text-align:right;">${ kendo.toString(LastContacted,"MM/dd/yyyy") }</div>',
	                width: 125

	            }, {
	                field: "Company",
	                title: "Company"
	            }, {
	                field: "AUM",
	                title: "AUM",
	                template: '<div style="text-align:right;">${ fmtCurrency(AUM) }</div>',
	                width: 100

	            }, {
	                field: "Classification",
	                title: "Classification"
	            }
	        ]
	    });
		
		var dropDown = grid.find("#jx-workspace-view").kendoComboBox({
		    dataTextField: "ViewName",
		    dataValueField: "ViewID",
		    autoBind: false,
		    optionLabel: "All",
		    dataSource: {
		        type: "odata",
		        severFiltering: true,
		        transport: {
		            read: "/SampleData/Views.xml"
		        }
		    }
		    , change: function() {
		        var value = this.value();
		        if (value) {
		            grid.data("kendoGrid").dataSource.filter({ field: "CategoryID", operator: "eq", value: parseInt(value) });
		        } else {
		            grid.data("kendoGrid").dataSource.filter({});
		        }
		    }
		});

	});
}(window.jQuery);