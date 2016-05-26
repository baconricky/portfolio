;(function($, undefined) {
    /**
     * @name Essentials
     */
     var SampleData = window.SampleData = window.SampleData || {},
         Advisors = ["Liam Williams","Alexandra Gould"],
         Admins = ["Logan Johnson","Kessie Ashley"],
         Cities = ["Seattle", "Tacoma", "Kirkland", "Redmond", "London", "Philadelphia", "New York", "Seattle", "London", "Boston"],
         Titles = ["Accountant", "Vice President, Sales", "Sales Representative", "Technical Support", "Sales Manager", "Web Designer", "Software Developer", "Inside Sales Coordinator", "Chief Techical Officer", "Chief Execute Officer"],
         Companies = ["'s Pub", ", LLC", " ", " &amp Kids", " ", " ", " Toys"],
         Classifications = ["Client"],
         Expandable = ['true','false'],
         Flagged = ['true','false'],
         Directions = ['in','out'],
         Types = ["Phone", "Email", "Fax", "Meeting"],
         Categories = ["Cat 1", "Cat 2", "Cat 3", "Cat 4"],
         Priorities = ["High", "Normal", "Low", "Emergency"],
         BirthDates = [new Date("1948/12/08"), new Date("1952/02/19"), new Date("1963/08/30"), new Date("1937/09/19"), new Date("1955/03/04"), new Date("1963/07/02"), new Date("1960/05/29"), new Date("1958/01/09"), new Date("1966/01/27"), new Date("1966/03/27")],
         ContactDates = [new Date("2012/05/30"),new Date("2012/05/31"),new Date("2012/06/01"),new Date("2012/06/02")],
         DueDates = [new Date("2012/05/30"),new Date("2012/05/31"),new Date("2012/06/01"),new Date("2012/06/02"),new Date("2012/06/03"),new Date("2012/06/04"),new Date("2012/06/05"),new Date("2012/06/06"),new Date("2012/06/07"),new Date("2012/06/08"),new Date("2012/06/09"),new Date("2012/06/10")],
         EnteredDates = [new Date("2012/05/30"),new Date("2012/05/31"),new Date("2012/06/01"),new Date("2012/06/02"),new Date("2012/06/03"),new Date("2012/06/04"),new Date("2012/06/05"),new Date("2012/06/06"),new Date("2012/06/07"),new Date("2012/06/08"),new Date("2012/06/09"),new Date("2012/06/10")],
         Tiers = ['Wood','Lead','Bronze','Silver','Gold','Platinum','Diamond','Unobtanium'];
        
        
    SampleData.BuildDataSource = function(o) {
    	var _type			= o.type 		|| "json",
    		_data			= o.data		|| {},
    		_url 			= o.url 		|| "",
    		_dataType 		= o.dataType 	|| "jsonp",
    		_q 				= o.q 			|| "*",
    		_schemaData 	= o.schemaData	|| "results",
    		dataObj 		= {};
	    
	    switch (_type) {
		    case ("array"):
	    		dataObj = new kendo.data.DataSource({
		    		data: _data
		    	});
		    	break;
	    	case ("json"):
	    		dataObj = new kendo.data.DataSource({
		    		transport: {
		    			read: {
		    				// the remote service url
		    				url: _url,
		    				// JSONP is required for cross-domain AJAX
		    				dataType: _dataType,
		    				// additional parameters sent to the remote service
		    				data: {
		    					q: _q
		    				}
		    			}
		    		},
		    		// describe the result format
		    		schema: {
		    			// the data which the data source will be bound to is in the "results" field
		    			data: _schemaData
		    		}
				});
				break;
	    }
	    return dataObj;
    }
        
    SampleData.GetNavData = function() {
        return [{
                text: "Records",
                url: "records.html"
            },{
                text: "Actions",
                url: "actions.html",
                items: [{
                    text: "Workspace",
                    url: "actions.html"
                },
                {
                    text: "Workflow Setup",
                    url: "actions-workflows.html"
                }]
            },{
                text: "Opportunities",
                url: "opportunities.html"
            },{
                text: "Accounts",
                url: "accounts-workspace.html"
            },{
                text: "Insurance",
                url: "insurance-workspace.html"
            },{
                text: "Correspondence & Documents",
                items: [{
                    text: "Wizard",
                    url: "docs-wizard.html"
                },
                {
                    text: "Workspace",
                    url: "docs-workspace.html"
                },{
                    text: "Templates",
                    url: "docs-templates.html"
                },
                {
                    text: "Global",
                    url: "docs-global.html"
                }]
            },{
                text: "Reports",
                url: "reports.html"
            },{
                text: "Dashboards",
                items: [{
                    text: "My Dashboard",
                    url: "dashboard-mine.html"
                },
                {
                    text: "BI Dashboard",
                    url: "dashboard-bi.html"
                },{
                    text: "Business Intelligence",
                    url: "dashboard-bi2.html"
                },
                {
                    text: "Opportunity Dashboard",
                    url: "dashboard-opportunity.html"
                }]
            }];
    }
        
    SampleData.GetActionData = function(count) {
        var arr = [],
            count = count || 5,
            now = new Date(),
            i=0;
    
        for (i = 0; i < count; i++) {
            var ns = new Nonsense(i),
                expandable = Expandable[Math.floor(Math.random() * Expandable.length)],
                type = Types[Math.floor(Math.random() * Types.length)],
                enteredBy = ns.name(),
                enteredDate = DueDates[Math.floor(Math.random() * DueDates.length)],
                assignedTo = ns.name(),
                assignedDate = DueDates[Math.floor(Math.random() * DueDates.length)],
                subject = ns.sentences(1),
                direction = Directions[Math.floor(Math.random() * Directions.length)];
                type = Types[Math.floor(Math.random() * Types.length)],
            	category = Categories[Math.floor(Math.random() * Categories.length)],
    			priority = Priorities[Math.floor(Math.random() * Priorities.length)],
    			note = ns.sentences(3),
    			timeSpent = Math.floor(Math.random() * 360);
    			
    		arr.push({
                Id: i + 1,
                Expandable: expandable,
                Type: type,
                EnteredBy: enteredBy,
                EnteredDate: enteredDate,
                AssignedTo: assignedTo,
                AssignedDate: assignedDate,
                Subject: subject,
                Direction: direction,
                Category: category,
    			Priority: priority,
    			TimeSpent: timeSpent,
    			Note: note
            });
        }
        return arr;
    }
	
	SampleData.GetTags = function(count) {
        var arr = [],
            count = count || 25,
            now = new Date(),
            i=0;
    
        for (i = 0; i < count; i++) {
            var ns = new Nonsense(i),
                tag = ns.buzzPhrase();

			arr[i] = tag;
        }
        return arr;	
	}
	
    SampleData.GetRecordData = function(count) {
		var arr = [],
            count = count || 25,
            now = new Date(),
            i=0;
    
        for (i = 0; i < count; i++) {
            var ns = new Nonsense(i),
                record = ns.lastName() + " Family",
                flag = Flagged[Math.floor(Math.random() * Flagged.length)],
                alert = ns.sentences(1),
                email = ns.firstName() + "@" + ns.lastName() + ".com",
                priAdv = ns.name(),
                priContact = ns.name(),
                priContactBday = BirthDates[Math.floor(Math.random() * BirthDates.length)],
                priContactEmail = ns.firstName() + "@" + ns.lastName() + ".com",
                priContactPhone = "9195555555",
                secAdv = ns.name(),
                secContact = ns.name(),
                secContactBday = BirthDates[Math.floor(Math.random() * BirthDates.length)],
                secContactEmail = ns.firstName() + "@" + ns.lastName() + ".com",
                secContactPhone = "9195555555",
                csr = ns.name(),
                lastContact = ContactDates[Math.floor(Math.random() * ContactDates.length)],
                //aum = ns.formattedMoney(),
                aum  = ns.integerInRange(10000, 10000000),
                company = ns.company(),
                tier = Tiers[Math.floor(Math.random() * Tiers.length)],
                classification = Classifications[Math.floor(Math.random() * Classifications.length)];
                
            arr.push({
                Id: i + 1,
                Record: record,
                AlertFlag: flag,
                Alert: alert,
                Email: email,
                
                Advisor1: priAdv,
                Advisor2: secAdv,
                
                Contact1: priContact,
                Contact1BDay: priContactBday,
                Contact1EmailType: "Work",
                Contact1Email: priContactEmail,
                Contact1Phone: priContactPhone,
                Contact1PhoneType: "Cell",
                
                Contact2: secContact,
                Contact2BDay: secContactBday,
                Contact2EmailType: "Personal",
                Contact2Email: secContactEmail,
                Contact2Phone: secContactPhone,
                Contact2PhoneType: "Cell",
                
                CSR: csr,
                
                LastContacted: lastContact,
                
                AUM: aum,
                
                Company: company,
                Tier: tier,
                Classification:classification 
            });
        }
        return arr;    }
    
    SampleData.NewActionData = function() {
        return [{
            /** Used by Header **/
            id: 0,
            text: "", 
            expanded: false, 
            Status: "new",
            Type: "", 
            EnteredBy: "Alexandra Gould",
            EnteredDate: new Date(),
            AssignedTo: "Alexandra Gould",
            AssignedDate: new Date(),
            Subject: "",
            Direction: "out",
            /** Used by Intermediate and Detail Views **/
            Category: "",
            Priority: "Normal",
            TimeSpent: 0,
            Note: ""
        }];
    }
    
    SampleData.NewWorkflowData = function() {
        return [{
            /** Used by Header **/
            id: 0,
            text: "", 
            expanded: false, 
            Status: "",
            Type: "", 
            EnteredBy: "Alexandra Gould",
            EnteredDate: new Date(),
            AssignedTo: "Alexandra Gould",
            AssignedDate: new Date(),
            Subject: "",
            Direction: "",
            /** Used by Intermediate and Detail Views **/
            Category: "",
            Priority: "",
            TimeSpent: 0,
            Note: "",
            items: [{
                id:1,
                Status: "",
                Type: "", 
                EnteredBy: "",
                EnteredDate: "",
                AssignedTo: "",
                AssignedDate: "",
                Subject: "",
                Direction: "",
                Category: "",
                Priority: "",
                TimeSpent: 0,
                Note: "",
                Type: "", 
                EnteredBy: "",
                EnteredDate: "",
                AssignedTo: "",
                AssignedDate: "",
                Subject: "",
                Direction: "",
                Category: "",
                Priority: "",
                TimeSpent: 0,
                Note: "",
                Type: "", 
                EnteredBy: "",
                EnteredDate: "",
                AssignedTo: "",
                AssignedDate: "",
                Subject: "",
                Direction: "",
                Category: "",
                Priority: "",
                TimeSpent: 0,
                Note: "",
                Type: "", 
                EnteredBy: "",
                EnteredDate: "",
                AssignedTo: "",
                AssignedDate: "",
                Subject: "",
                Direction: "",
                Category: "",
                Priority: "",
                TimeSpent: 0,
                Note: "",
                Type: "", 
                EnteredBy: "",
                EnteredDate: "",
                AssignedTo: "",
                AssignedDate: "",
                Subject: "",
                Direction: "",
                Category: "",
                Priority: "",
                TimeSpent: 0,
                Note: "",
                Type: "", 
                EnteredBy: "",
                EnteredDate: "",
                AssignedTo: "",
                AssignedDate: "",
                Subject: "",
                Direction: "",
                Category: "",
                Priority: "",
                TimeSpent: 0,
                Note: "",
                Type: "", 
                EnteredBy: "",
                EnteredDate: "",
                AssignedTo: "",
                AssignedDate: "",
                Subject: "",
                Direction: "",
                Category: "",
                Priority: "",
                TimeSpent: 0,
                Note: "",
                Type: "", 
                EnteredBy: "",
                EnteredDate: "",
                AssignedTo: "",
                AssignedDate:  "",
                Subject: "",
                Direction: "",
                Category: "",
                Priority: "",
                TimeSpent: 0,
                Note: "",
                Type: "", 
                EnteredBy: "",
                EnteredDate: "",
                AssignedTo: "",
                AssignedDate:  "",
                Subject: "",
                Direction: "",
                Category: "",
                Priority: "",
                TimeSpent: 0,
                Note: "",
                Type: "", 
                EnteredBy: "",
                EnteredDate: "",
                AssignedTo: "",
                AssignedDate: "",
                Subject: "",
                Direction: "",
                Category: "",
                Priority: "",
                TimeSpent: 0,
                Note: "",
                Type: "",
                EnteredBy: "",
                EnteredDate: "",
                AssignedTo: "",
                AssignedDate: "",
                Subject: "",
                Direction: "",
                Category: "",
                Priority: "",
                TimeSpent: 0,
                Note: "",
                Type: "", 
                EnteredBy: "",
                EnteredDate: "",
                AssignedTo: "",
                AssignedDate: "",
                Subject: "",
                Direction: "",
                Category: "",
                Priority: "",
                TimeSpent: 0,
                Note: "",
                Type: "", 
                EnteredBy: "",
                EnteredDate: "",
                AssignedTo: "",
                AssignedDate: "",
                Subject: "",
                Direction: "",
                Category: "",
                Priority: "",
                TimeSpent: 0,
                Note: "note"
            }]
        }];
    }
        
    SampleData.SavedAction = function() {
        return [{
            /** Used by Header **/
            id: 0,
            text: "My Documents", 
            expanded: false, 
            Status: "active",
            Type: "Meeting", 
            EnteredBy: "Alexandra Gould",
            EnteredDate: "04/30/2012",
            AssignedTo: "Alexandra Gould",
            AssignedDate: "06/31/2012",
            Subject: "Approach Meeting",
            Direction: "out",
            /** Used by Intermediate and Detail Views **/
            Category: "Business Development",
            Priority: "Normal",
            TimeSpent: 10,
            Note: "These are notes about this Approach Meeting. I should write something interesting here about this meeting."
        }]
    }
        
    SampleData.SavedWorkflow = function() {
        return [{
            /** Used by Header **/
            id: 0,
            text: "My Documents", 
            expanded: false, 
            Status: "active",
            Type: "Meeting", 
            EnteredBy: "Alexandra Gould",
            EnteredDate: "04/30/2012",
            AssignedTo: "Alexandra Gould",
            AssignedDate: "06/31/2012",
            Subject: "Approach Meeting",
            Direction: "out",
            /** Used by Intermediate and Detail Views **/
            Category: "Business Development",
            Priority: "Normal",
            TimeSpent: 10,
            Note: "These are notes about this Approach Meeting. I should write something interesting here about this meeting.",
            items: [{
                id:1,
                Status: "complete",
                Type: "Note", 
                EnteredBy: "Alexandra Gould",
                EnteredDate: "04/31/2012",
                AssignedTo: "Alexandra Gould",
                AssignedDate: "04/31/2012",
                Subject: "Prospect meeting reminder",
                Direction: "out",
                Category: "Note",
                Priority: "Normal",
                TimeSpent: 0,
                Note: "Prospect meeting tomorrow, call to confirm the Approach Meeting the day before to make sure they have the directions to the office."
            },{
                id:2,
                Status: "complete",
                Type: "Expense", 
                EnteredBy: "Alexandra Gould",
                EnteredDate: "04/31/2012",
                AssignedTo: "Alexandra Gould",
                AssignedDate: "04/31/2012",
                Subject: "Bought lunch from Pizza Inn.",
                Direction: "out",
                Category: "Expense",
                Priority: "Normal",
                TimeSpent: 0,
                Note: "It was pretty OK"
            },{
                id:3,
                Status: "active",
                Type: "Email", 
                EnteredBy: "Ruby Kerr",
                EnteredDate: "05/01/2012",
                AssignedTo: "Alexandra Gould",
                AssignedDate: "05/07/2012",
                Subject: "",
                Direction: "in",
                Category: "Email",
                Priority: "Normal",
                TimeSpent: 0,
                Note: "Email content here"
            },{
                id:4,
                Status: "active",
                Type: "Phone", 
                EnteredBy: "Alexandra Gould",
                EnteredDate: "05/05/2012",
                AssignedTo: "Alexandra Gould",
                AssignedDate: "05/12/2012",
                Subject: "Phone Call",
                Direction: "out",
                Category: "Phone Call",
                Priority: "Normal",
                TimeSpent: 0,
                Note: ""
            },{
                id:5,
                Status: "inactive",
                Type: "Meeting", 
                EnteredBy: "Alexandra Gould",
                EnteredDate: "",
                AssignedTo: "Alexandra Gould",
                AssignedDate: "05/12/2012",
                Subject: "",
                Direction: "out",
                Category: "Phone Call",
                Priority: "Normal",
                TimeSpent: 0,
                Note: "note"
            },{
                id:6,
                Status: "inactive",
                Type: "Note", 
                EnteredBy: "Alexandra Gould",
                EnteredDate: "",
                AssignedTo: "Alexandra Gould",
                AssignedDate: "05/14/2012",
                Subject: "",
                Direction: "out",
                Category: "Phone Call",
                Priority: "Normal",
                TimeSpent: 0,
                Note: "note"
            },{
                id:7,
                Status: "inactive",
                Type: "Letter", 
                EnteredBy: "Alexandra Gould",
                EnteredDate: "",
                AssignedTo: "Alexandra Gould",
                AssignedDate: "05/15/2012",
                Subject: "",
                Direction: "out",
                Category: "Phone Call",
                Priority: "Normal",
                TimeSpent: 0,
                Note: "note"
            },{
                id:8,
                Status: "inactive",
                Type: "Meeting", 
                EnteredBy: "Alexandra Gould",
                EnteredDate: "",
                AssignedTo: "Alexandra Gould",
                AssignedDate:  "",
                Subject: "",
                Direction: "out",
                Category: "Meeting",
                Priority: "Normal",
                TimeSpent: 0,
                Note: "note"
            },{
                id:9,
                Status: "inactive",
                Type: "Letter", 
                EnteredBy: "Alexandra Gould",
                EnteredDate: "",
                AssignedTo: "Alexandra Gould",
                AssignedDate:  "",
                Subject: "",
                Direction: "out",
                Category: "Letter",
                Priority: "Normal",
                TimeSpent: 0,
                Note: "note"
            },{
                id:10,
                Status: "inactive",
                Type: "Meeting", 
                EnteredBy: "Alexandra Gould",
                EnteredDate: "",
                AssignedTo: "Alexandra Gould",
                AssignedDate: "05/19/2012",
                Subject: "",
                Direction: "out",
                Category: "Meeting",
                Priority: "Normal",
                TimeSpent: 0,
                Note: "note"
            },{
                id:11,
                Status: "inactive",
                Type: "Letter",
                EnteredBy: "Alexandra Gould",
                EnteredDate: "",
                AssignedTo: "Alexandra Gould",
                AssignedDate: "05/20/2012",
                Subject: "",
                Direction: "out",
                Category: "Letter",
                Priority: "Normal",
                TimeSpent: 0,
                Note: "note"
            },{
                id:12,
                Status: "inactive",
                Type: "Service", 
                EnteredBy: "Alexandra Gould",
                EnteredDate: "",
                AssignedTo: "Alexandra Gould",
                AssignedDate: "05/21/2012",
                Subject: "",
                Direction: "out",
                Category: "Service",
                Priority: "Normal",
                TimeSpent: 0,
                Note: "note"
            },{
                id:13,
                Status: "inactive",
                Type: "Service", 
                EnteredBy: "Alexandra Gould",
                EnteredDate: "",
                AssignedTo: "Alexandra Gould",
                AssignedDate: "05/22/2012",
                Subject: "",
                Direction: "out",
                Category: "Service",
                Priority: "Normal",
                TimeSpent: 0,
                Note: "note"
            }]
        }];
    }
})(jQuery);


var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var tags = SampleData.GetTags(200);


