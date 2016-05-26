var DEBUG = false;

String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

function dbDebug(str) {
	if (DEBUG) {
		if (Ext.isChrome || Ext.isGecko || Ext.isGecko2 || Ext.isGecko3) {
			console.log(str);
		} else {
			alert(str);
		}
	}
}

Ext.ux.DbGrid = function(config){
	var myData = [["Salary", "0", "87387", "EUR", "6712952<br>Charlie Group Abrasive Blast Services", "7805481<br>Ruby Group Heavy Industries", "Approved", "05/09/2011", "09/010/2011", "Ruby and Sons Heavy Industries", "Ruby Jones<br>Jack Brown", "8"]
	,["SEPA", "0", "20426", "EUR", "3215943<br>Oliver Group Heavy Industries", "3590699<br>Oliver Partners Abrasive Blast Services", "Approved", "09/07/2010", "05/09/2010", "Ruby and Sons Heavy Industries", "Lily Smith<br>Charlie Robinson", "8"]
	,["Salary", "0", "9432", "EUR", "8633729<br>Alfie and Sons Abrasive Blast Services", "8739930<br>Charlie Partners Heavy Industries", "Approved", "03/01/2010", "010/05/2011", "Ruby and Sons Heavy Industries", "Alfie Taylor<br>Ruby Jones", "8"]
	,["Acceptgiro", "0", "13653", "EUR", "6740723<br>Charlie and Sons Accounting", "1168213<br>Lily Partners Abrasive Blast Services", "Declined", "01/09/2010", "06/02/2011", "Alfie and Sons Abrasive Blast Services", "Jack Wilson<br>Lily Wilson", "8"]
	,["International", "0", "13801", "EUR", "3166810<br>Charlie Partners Heavy Industries", "5333558<br>Charlie and Sons Heavy Industries", "Approved", "02/02/2011", "06/10/2010", "Lily Partners Abrasive Blast Services", "Sophie Johnson <br>Olivia Johnson ", "8"]
	,["Direct Debit", "1", "59231", "EUR", "6412964<br>Olivia Group Accounting", "9502564<br>Sophie Group Heavy Industries", "Declined", "09/03/2010", "03/010/2011", "Lily Partners Abrasive Blast Services", "Oliver Johnson <br>Emily Johnson ", "8"]
	,["Direct Debit", "0", "39778", "EUR", "6054383<br>Charlie Partners Accounting", "5203553<br>Lily Partners Accounting", "Approved", "03/02/2011", "02/02/2011", "Lily Partners Abrasive Blast Services", "Oliver Taylor<br>Jack Williams", "8"]
	,["Domestic", "0", "36119", "EUR", "4381104<br>Alfie Partners Abrasive Blast Services", "5117188<br>Charlie and Sons Heavy Industries", "Pending", "010/010/2011", "04/07/2010", "Ruby and Sons Heavy Industries", "Oliver Wright<br>Sophie Williams", "8"]
	,["Direct Debit", "0", "73054", "EUR", "2726136<br>Sophie Group Abrasive Blast Services", "654603<br>Sophie and Sons Heavy Industries", "Approved", "08/07/2011", "08/05/2011", "Ruby and Sons Heavy Industries", "Jack Williams<br>Jack Taylor", "8"]
	,["Direct Debit", "1", "30554", "EUR", "8731080<br>Emily Partners Accounting", "5473023<br>Lily and Sons Abrasive Blast Services", "Approved", "05/010/2010", "05/01/2011", "Ruby and Sons Heavy Industries", "Jack Davis<br>Sophie Davis", "8"]
	,["Domestic", "1", "21976", "EUR", "5799256<br>Charlie Group Abrasive Blast Services", "6178895<br>Olivia and Sons Heavy Industries", "Declined", "08/010/2011", "09/08/2011", "Ruby and Sons Heavy Industries", "Alfie Wilson<br>Alfie Williams", "8"]
	,["Direct Debit", "0", "14305", "EUR", "986329<br>Lily Group Abrasive Blast Services", "6468506<br>Sophie and Sons Abrasive Blast Services", "Pending", "06/01/2011", "04/010/2010", "Ruby and Sons Heavy Industries", "Charlie Jones<br>Lily Smith", "8"]
	,["International", "0", "88801", "EUR", "2578431<br>Oliver and Sons Abrasive Blast Services", "5956116<br>Oliver Partners Accounting", "Approved", "02/08/2011", "09/010/2010", "Ruby and Sons Heavy Industries", "Charlie Smith<br>Olivia Brown", "8"]
	,["International", "0", "17925", "EUR", "3607789<br>Lily and Sons Abrasive Blast Services", "9939576<br>Lily Partners Abrasive Blast Services", "Pending", "04/05/2011", "05/02/2010", "Lily Partners Abrasive Blast Services", "Sophie Wright<br>Ruby Johnson ", "8"]
	,["SEPA", "0", "51935", "EUR", "2555848<br>Ruby Group Abrasive Blast Services", "1353455<br>Lily and Sons Accounting", "Declined", "03/08/2011", "02/04/2010", "Lily Partners Abrasive Blast Services", "Alfie Johnson <br>Harry Taylor", "8"]
	,["Direct Debit", "1", "6994", "EUR", "7493897<br>Ruby Partners Abrasive Blast Services", "1159668<br>Emily Group Accounting", "Approved", "03/06/2011", "08/010/2010", "Lily Partners Abrasive Blast Services", "Alfie Robinson<br>Harry Brown", "8"]
	,["Domestic", "1", "33197", "EUR", "4911194<br>Ruby and Sons Accounting", "8425599<br>Olivia Partners Heavy Industries", "Approved", "08/06/2011", "07/06/2011", "Lily Partners Abrasive Blast Services", "Lily Johnson <br>Jack Robinson", "8"]
	,["Domestic", "1", "55376", "EUR", "9480591<br>Lily Group Abrasive Blast Services", "6339722<br>Olivia and Sons Abrasive Blast Services", "Approved", "05/09/2011", "03/010/2011", "Alfie and Sons Abrasive Blast Services", "Sophie Johnson <br>Emily Brown", "8"]
	,["Domestic", "1", "77060", "EUR", "6011658<br>Jack Partners Abrasive Blast Services", "5414734<br>Ruby Partners Abrasive Blast Services", "Approved", "01/04/2011", "07/08/2011", "Alfie and Sons Abrasive Blast Services", "Jack Jones<br>Sophie Brown", "8"]
	,["International", "0", "23466", "EUR", "9841309<br>Alfie Partners Abrasive Blast Services", "128174<br>Lily Group Heavy Industries", "Declined", "09/06/2010", "03/09/2010", "Alfie and Sons Abrasive Blast Services", "Jack Wright<br>Sophie Taylor", "8"]
	,["International", "0", "26901", "EUR", "6911927<br>Oliver and Sons Abrasive Blast Services", "250550<br>Alfie and Sons Abrasive Blast Services", "Approved", "06/07/2010", "06/05/2010", "Ruby and Sons Heavy Industries", "Harry Davis<br>Sophie Jones", "8"]];
		
	// custom column plugin example
	var checkboxSelectionModel = new Ext.grid.CheckboxSelectionModel({
		singleSelect: false,
		listeners: {
			click: {
				fn: function(){
					updateSelectedCount();
				}
			}
		},
		selectionchange: {
			fn: function(){
				updateSelectedCount();
			}
		}
	});
		
	var reader = new Ext.data.ArrayReader({}, [
		{name: 'pmt-type'}
		,{name: 'pmt-entry'}
		,{name: 'amount'}
		,{name: 'ccy'}
		,{name: 'ord-acct-name'}
		,{name: 'cp-acct-name'}
		,{name: 'status'}
		,{name: 'exec_date'}
		,{name: 'schedule_date'}
		,{name: 'company'}
		,{name: 'authorizers'}
		,{name: 'comments'}
	]);
		
	var writer = new Ext.data.JsonWriter({
		encode: false   // <--- false causes data to be printed to jsonData config-property of Ext.Ajax#reqeust
	});
	
	var multiGroupStore = new Ext.ux.grid.MultiGroupingStore({
		data: myData
		,writer: writer
		,sortInfo:[
				{field:'pmt-type', 		direction:'ASC'},
				{field:'pmt-entry', 	direction:'ASC'},
				{field:'amount', 		direction:'ASC'},
				{field:'ccy', 			direction:'ASC'},
				{field:'ord-acct-name', direction:'ASC'},
				{field:'cp-acct-name', 	direction:'ASC'},
				{field:'status', 		direction:'ASC'},
				{field:'exec_date', 	direction:'ASC'},
				{field:'schedule_date', direction:'ASC'},
				{field:'company', 		direction:'ASC'},
				{field:'authorizers', 	direction:'ASC'},
				{field:'comments', 		direction:'ASC'}
		]
		,localSort: true
		,reader: reader
	});	
	
    var groupStore = new Ext.data.GroupingStore({
        id: 'reviewInstructionStore',
        reader: reader,
        data: myData
    });  
	
	//on store change
	groupStore.on('datachanged', function(){
		updateSelectedCount();
	});

	var groupView = new Ext.ux.grid.MultiGroupingView({
		forceFit: true
		,hideGroupedColumn :true
		,emptyGroupText: 'All Group Fields Empty'
		,displayEmptyFields: true //you can choose to show the group fields, even when they have no values	
		,groupTextTpl: '<input class="grpCheckbox" type="checkbox"> {text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
	});

    Ext.BLANK_IMAGE_URL = 'resources/images/db/s.gif'; // Ext 2.0
    
	var win;
	var configWin;
	var saveWin;
	
	var filterCount = 0;
	
	new Ext.ToolTip({        
        title: 'Tooltip',
        id: 'content-anchor-tip',
        target: 'leftCallout',
        anchor: 'left',
        html: null,
        width: 415,
        autoHide: true,
        closable: true,
        contentEl: 'content-tip', // load content from the page
        listeners: {
            'render': function(){
                this.header.on('click', function(e){
                    e.stopEvent();
                    Ext.Msg.alert('Link', 'Link to something interesting.');
                    Ext.getCmp('content-anchor-tip').hide();
                }, this, {delegate:'a'});
            }
        }
    });
    Ext.QuickTips.init();
	

	
	var cboSavedFilters = new Ext.form.ComboBox({
		id: 'saved-filters',
		tooltip:"Select Saved View",
		fieldLabel :"Saved Filters",
		hideLabel: true,
        typeAhead: true,
        triggerAction: 'all',
		width: 220,
        autocomplete: "off",
        mode: 'local',
        store: new Ext.data.ArrayStore({
            fields: ['value', 'display'],
            data: [['0','Select Saved View']]
        }),
        valueField: 'value',
        displayField: 'display'
    });
	cboSavedFilters.setValue(0);
	
	
	function showConfigWin() {
		if (!configWin) {
			configWin = new Ext.Window({
				applyTo: 'grid-config-win',
				xtype: 'window',
				layout:'fit',
				modal: true,
				border: false,
				title: 'Grid Configuration',
				closeAction:'hide',
				items:[new Ext.form.FormPanel({
					header:false,
					width:550,
					height:375,
					bodyStyle: 'padding:10px;',
					items:[{
						xtype: 'itemselector',
						name: 'columnSelector',
						hideLabel: true,
						imagePath: '../ux/images/',
						multiselects: 
							[{
								bodyStyle: 'border:none;',
								height: 300,
								width: 200,
								store: [['pmt-type','Payment Type'],
									['pmt-entry','Entry Type'],
									['company','Company'],
									['authorizers','Input ID<br>Verifier'],
									['comments','Comments']],
								displayField: 'text',							
								valueField: 'value'
							},{
								bodyStyle: 'border:none;',
								height: 150,
								width: 200,
								store: [['pmt-type','Payment Type'],
									['pmt-entry','Entry Type'],
									['amount','Amount'],
									['ccy','CCY'],
									['ord-acct-name','Ordering Acct #<br>Acct Name'],
									['cp-acct-name','Counterparty Acct #<br>Acct Name'],
									['status','Status'],
									['exec_date','Exec/Value Date'],
									['schedule_date','Schedule Date'],
									['company','Company'],
									['authorizers','Input ID<br>Verifier'],
									['comments','Comments']],
								displayField: 'text',
								valueField: 'value'
							},{
								bodyStyle: 'border:none;',
								height: 150,
								width: 200,
								store: [['pmt-type','Payment Type'],
									['pmt-entry','Entry Type'],
									['amount','Amount'],
									['ccy','CCY'],
									['ord-acct-name','Ordering Acct #<br>Acct Name'],
									['cp-acct-name','Counterparty Acct #<br>Acct Name'],
									['status','Status'],
									['exec_date','Exec/Value Date'],
									['schedule_date','Schedule Date'],
									['company','Company'],
									['authorizers','Input ID<br>Verifier'],
									['comments','Comments']],
								displayField: 'text',
								valueField: 'value'
							}]
					}],
					buttons: [new Ext.Button({
						text: 'Save',
						handler: function() { configWin.hide() }
					}), new Ext.Button({
						text: 'Cancel',
						handler: function() { configWin.hide() }
					})]
				})
				]
			});
		}
		configWin.show(this);
	};
    
    function showSaveWin() {
		if (!saveWin) {
			cboSaveNewFilters = cboSavedFilters;
			var pnlSaveFilters = new Ext.Panel({layout:'form',height:60});
				cboSaveNewFilters.fieldLabel = "Save as";
				cboSaveNewFilters.labelStyle = "padding-top:20px;text-align:right",
				cboSaveNewFilters.hideLabel = false;
				pnlSaveFilters.add(cboSaveNewFilters);
				
			saveWin = new Ext.Window({
				applyTo: 'saveWin',
				xtype: 'window',
				id: 'save-window',
				layout:'fit',
				modal: true,
				border: false,
				title: 'Save View',
				closeAction:'hide',
				items:[new Ext.form.FormPanel({
					header:false,
					width:400,
					height:175,
					style:'border:none',
					items:[
						{
							html: '<div style="padding:10px;border:none;color:#333;font-size:1.2em">This view will be saved under:</div>'
						},
						pnlSaveFilters,
						{
							html: '<div style="margin-left:115px;top:-110px;border:none;color:#333;font-size:0.8em">Select saved view or type new name.</div>'
						}
					],
					buttons: [new Ext.Button({
						text: 'Cancel',
						handler: function() { saveWin.hide() }
					}),new Ext.Button({
						text: 'Save to Home',
						handler: function() { saveWin.hide() }
					}),new Ext.Button({
						text: 'Save View',
						handler: function() { saveWin.hide() }
						/*
						handler: function() { 
							var tmpStore = cboSaveNewFilters.store;
							dbDebug("Value: " + cboSaveNewFilters.getValue() )
							var newFilterData = [{value: cboSaveNewFilters.getValue()}];							
							var p = new tmpStore.recordType(newFilterData, 1); // create new record
			                tmpStore.add(p); // insert a new record into the store (also see add)
						}
						*/
					})]
				})
				]
			});
		}
		saveWin.show(this);
	};
    
    var _selectedCount = 0;
    var itemsPerPage = 10; // set the number of items you want per page
    var bAllItemsSelected = false;
    
    // for this demo configure local and remote urls for demo purposes
    var _dataSource = {
        remote: 'grid.json', // static data file
        local: 'js/grid.json' // static data file
    };
    
    // configure whether data source is local
    var _local = true;
    
    // row expander
    var expander = new Ext.ux.grid.RowExpander({
        tpl: new Ext.Template(
		'<div style="margin-left:50px">', 
		'<button type="button" class="x-btn">Edit Details</button>',
		'</div>',
		'<div style="margin-left:50px">', 
		'<div style="width:48%;float:left">', 
		'<p class="db-detail-title">Instruction Details</p>',
		'<hr>', 
		'<dl class="clear">',
		'<dt>Reference:</dt>',
		'<dd>135791113</dd>',
		'</dl>',
		'<dl>',
		'<dt>Control Number:</dt>',
		'<dd>1234567890</dd>',
		'</dl>',
		'<dl>',
  		'<dt>Document Code:</dt>',
		'<dd>0987654321</dd>',
		'</dl>',
		'<dl class="clear">',
		'<dt>Initiation Number:</dt>',
		'<dd>2468101214</dd>',
		'</dl>',
		'<dl>',
  		'<dt>Clearing Reference:</dt>',
 		'<dd>1020304050</dd>',
		'</dl>',
		'<dl>',
  		'<dt>Number Of Txns/<br>Inst. Info:</dt>',
 		'<dd>12<br>11</dd>',
		'</dl>',
		'<dl>',
		'<dt>Template Code:</dt>',
		'<dd>2468101214</dd>',
		'</dl>',
		'<dl>',
		'<dt>Origin:</dt>',
		'<dd>2468101214</dd>',
		'</dl>',
		'<dl>',
		'<dt>Maturity Date:</dt>',
		'<dd>01/01/2012</dd>',
		'</dl>',
		'<dl class="clear">',
		'<dt>File Upload Checksum:</dt>',
		'<dd>e7f96a666052fd43d16ffc5f54e99858</dd>',
		'</dl>',
		'<hr style="clear:both">', 
		'</div>',
		'</div>',
		'<div style="margin-left:25px;width:40%;float:left;">', 
		'<p class="db-detail-title">Comments (8)</p>', 
		'<div style="border:1px solid #222;background:#fff;padding:10px">', 
		'<ul class="comments">',
		'<li><span class="comment-date">06.01.2011</span><span class="comment"><b class="comment-author">s. trunta: </b>Fooky napster treemo exaroom skobee wufoo mikonoclast. Orkut geni shelfari scrybe librivox. Goowy manjam platial revver zlango; voo2do yoono piczo. Loopt oyogi fooky rebtel venyo jyve mecanbe yedda. Klostu oyogi coastr, plaxo renkoo, idio fonpods, plazes! Mikonoclast ingenio kiko? Diigo xuqa fim nimbuzz. Zookoda jibjab xobni sonos azureus chumby odeo.</span><hr></li>',
		'<li><span class="comment-date">05.24.2011</span><span class="comment"><b class="comment-author">a. joiner: </b>Eskobo goowy manjam. Guba simpy bebo, zecco plazes moola gpokr. Idio moola umundo zingee jaxtr mikons foldera doostang! Soonr mog xuqa picasa wablet librivox calcoolate gpokr etsy. Meebo rollyo gataga, moo zingee geesee, fooky areae. Jangl loomia zapr meetro plazes megite tello. Vimeo bordee wikio furl zudeo klostu.</span><hr></li>',
		'<li><span class="comment-date">04.10.2011</span><span class="comment"><b class="comment-author">j. fernandez: </b>Fooky napster treemo exaroom skobee wufoo mikonoclast. Orkut geni shelfari scrybe librivox. Goowy manjam platial revver zlango; voo2do yoono piczo. Loopt oyogi fooky rebtel venyo jyve mecanbe yedda. Klostu oyogi coastr, plaxo renkoo, idio fonpods, plazes! Mikonoclast ingenio kiko? Diigo xuqa fim nimbuzz. Zookoda jibjab xobni sonos azureus chumby odeo.</span><hr></li>',
		'<li><span class="comment-date">03.14.2011</span><span class="comment"><b class="comment-author">n. harris: </b>Eskobo goowy manjam. Guba simpy bebo, zecco plazes moola gpokr. Idio moola umundo zingee jaxtr mikons foldera doostang! Soonr mog xuqa picasa wablet librivox calcoolate gpokr etsy. Meebo rollyo gataga, moo zingee geesee, fooky areae. Jangl loomia zapr meetro plazes megite tello. Vimeo bordee wikio furl zudeo klostu.</span><hr></li>',
		'<li><span class="comment-date">02.01.2011</span><span class="comment"><b>s. trunta: </b>Fooky napster treemo exaroom skobee wufoo mikonoclast. Orkut geni shelfari scrybe librivox. Goowy manjam platial revver zlango; voo2do yoono piczo. Loopt oyogi fooky rebtel venyo jyve mecanbe yedda. Klostu oyogi coastr, plaxo renkoo, idio fonpods, plazes! Mikonoclast ingenio kiko? Diigo xuqa fim nimbuzz. Zookoda jibjab xobni sonos azureus chumby odeo.</span><hr></li>',
		'<li><span class="comment-date">01.24.2011</span><span class="comment"><b class="comment-author">a. joiner: </b>Eskobo goowy manjam. Guba simpy bebo, zecco plazes moola gpokr. Idio moola umundo zingee jaxtr mikons foldera doostang! Soonr mog xuqa picasa wablet librivox calcoolate gpokr etsy. Meebo rollyo gataga, moo zingee geesee, fooky areae. Jangl loomia zapr meetro plazes megite tello. Vimeo bordee wikio furl zudeo klostu.</span><hr></li>',
		'<li><span class="comment-date">12.12.2010</span><span class="comment"><b class="comment-author">j. fernandez: </b>Fooky napster treemo exaroom skobee wufoo mikonoclast. Orkut geni shelfari scrybe librivox. Goowy manjam platial revver zlango; voo2do yoono piczo. Loopt oyogi fooky rebtel venyo jyve mecanbe yedda. Klostu oyogi coastr, plaxo renkoo, idio fonpods, plazes! Mikonoclast ingenio kiko? Diigo xuqa fim nimbuzz. Zookoda jibjab xobni sonos azureus chumby odeo.</span><hr></li>',
		'<li><span class="comment-date">11.04.2010</span><span class="comment"><b class="comment-author">n. harris: </b>Eskobo goowy manjam. Guba simpy bebo, zecco plazes moola gpokr. Idio moola umundo zingee jaxtr mikons foldera doostang! Soonr mog xuqa picasa wablet librivox calcoolate gpokr etsy. Meebo rollyo gataga, moo zingee geesee, fooky areae. Jangl loomia zapr meetro plazes megite tello. Vimeo bordee wikio furl zudeo klostu.</span></li>',
		'</ul>',
		'</div>',
		'<input type="text" class="db-add-comment" value="Add Comment to Payment"><button alt="Add Comment" title="Add Comment" class="db-btn-add-comment">Add Comment</button>',
		'</div>')
    });
    

	
    var myData = [["Salary", "0", "87387", "EUR", "6712952<br>Charlie Group Abrasive Blast Services", "7805481<br>Ruby Group Heavy Industries", "Approved", "05/09/2011", "09/010/2011", "Ruby and Sons Heavy Industries", "Ruby Jones<br>Jack Brown", "8"],
	["SEPA", "0", "20426", "EUR", "3215943<br>Oliver Group Heavy Industries", "3590699<br>Oliver Partners Abrasive Blast Services", "Approved", "09/07/2010", "05/09/2010", "Ruby and Sons Heavy Industries", "Lily Smith<br>Charlie Robinson", "8"],
	["Salary", "0", "9432", "EUR", "8633729<br>Alfie and Sons Abrasive Blast Services", "8739930<br>Charlie Partners Heavy Industries", "Approved", "03/01/2010", "010/05/2011", "Ruby and Sons Heavy Industries", "Alfie Taylor<br>Ruby Jones", "8"],
	["Acceptgiro", "0", "13653", "EUR", "6740723<br>Charlie and Sons Accounting", "1168213<br>Lily Partners Abrasive Blast Services", "Declined", "01/09/2010", "06/02/2011", "Alfie and Sons Abrasive Blast Services", "Jack Wilson<br>Lily Wilson", "8"],
	["International", "0", "13801", "EUR", "3166810<br>Charlie Partners Heavy Industries", "5333558<br>Charlie and Sons Heavy Industries", "Approved", "02/02/2011", "06/10/2010", "Lily Partners Abrasive Blast Services", "Sophie Johnson <br>Olivia Johnson ", "8"],
	["Direct Debit", "1", "59231", "EUR", "6412964<br>Olivia Group Accounting", "9502564<br>Sophie Group Heavy Industries", "Declined", "09/03/2010", "03/010/2011", "Lily Partners Abrasive Blast Services", "Oliver Johnson <br>Emily Johnson ", "8"],
	["Direct Debit", "0", "39778", "EUR", "6054383<br>Charlie Partners Accounting", "5203553<br>Lily Partners Accounting", "Approved", "03/02/2011", "02/02/2011", "Lily Partners Abrasive Blast Services", "Oliver Taylor<br>Jack Williams", "8"],
	["Domestic", "0", "36119", "EUR", "4381104<br>Alfie Partners Abrasive Blast Services", "5117188<br>Charlie and Sons Heavy Industries", "Pending", "010/010/2011", "04/07/2010", "Ruby and Sons Heavy Industries", "Oliver Wright<br>Sophie Williams", "8"],
	["Direct Debit", "0", "73054", "EUR", "2726136<br>Sophie Group Abrasive Blast Services", "654603<br>Sophie and Sons Heavy Industries", "Approved", "08/07/2011", "08/05/2011", "Ruby and Sons Heavy Industries", "Jack Williams<br>Jack Taylor", "8"],
	["Direct Debit", "1", "30554", "EUR", "8731080<br>Emily Partners Accounting", "5473023<br>Lily and Sons Abrasive Blast Services", "Approved", "05/010/2010", "05/01/2011", "Ruby and Sons Heavy Industries", "Jack Davis<br>Sophie Davis", "8"],
	["Domestic", "1", "21976", "EUR", "5799256<br>Charlie Group Abrasive Blast Services", "6178895<br>Olivia and Sons Heavy Industries", "Declined", "08/010/2011", "09/08/2011", "Ruby and Sons Heavy Industries", "Alfie Wilson<br>Alfie Williams", "8"],
	["Direct Debit", "0", "14305", "EUR", "986329<br>Lily Group Abrasive Blast Services", "6468506<br>Sophie and Sons Abrasive Blast Services", "Pending", "06/01/2011", "04/010/2010", "Ruby and Sons Heavy Industries", "Charlie Jones<br>Lily Smith", "8"],
	["International", "0", "88801", "EUR", "2578431<br>Oliver and Sons Abrasive Blast Services", "5956116<br>Oliver Partners Accounting", "Approved", "02/08/2011", "09/010/2010", "Ruby and Sons Heavy Industries", "Charlie Smith<br>Olivia Brown", "8"],
	["International", "0", "17925", "EUR", "3607789<br>Lily and Sons Abrasive Blast Services", "9939576<br>Lily Partners Abrasive Blast Services", "Pending", "04/05/2011", "05/02/2010", "Lily Partners Abrasive Blast Services", "Sophie Wright<br>Ruby Johnson ", "8"],
	["SEPA", "0", "51935", "EUR", "2555848<br>Ruby Group Abrasive Blast Services", "1353455<br>Lily and Sons Accounting", "Declined", "03/08/2011", "02/04/2010", "Lily Partners Abrasive Blast Services", "Alfie Johnson <br>Harry Taylor", "8"],
	["Direct Debit", "1", "6994", "EUR", "7493897<br>Ruby Partners Abrasive Blast Services", "1159668<br>Emily Group Accounting", "Approved", "03/06/2011", "08/010/2010", "Lily Partners Abrasive Blast Services", "Alfie Robinson<br>Harry Brown", "8"],
	["Domestic", "1", "33197", "EUR", "4911194<br>Ruby and Sons Accounting", "8425599<br>Olivia Partners Heavy Industries", "Approved", "08/06/2011", "07/06/2011", "Lily Partners Abrasive Blast Services", "Lily Johnson <br>Jack Robinson", "8"],
	["Domestic", "1", "55376", "EUR", "9480591<br>Lily Group Abrasive Blast Services", "6339722<br>Olivia and Sons Abrasive Blast Services", "Approved", "05/09/2011", "03/010/2011", "Alfie and Sons Abrasive Blast Services", "Sophie Johnson <br>Emily Brown", "8"],
	["Domestic", "1", "77060", "EUR", "6011658<br>Jack Partners Abrasive Blast Services", "5414734<br>Ruby Partners Abrasive Blast Services", "Approved", "01/04/2011", "07/08/2011", "Alfie and Sons Abrasive Blast Services", "Jack Jones<br>Sophie Brown", "8"],
	["International", "0", "23466", "EUR", "9841309<br>Alfie Partners Abrasive Blast Services", "128174<br>Lily Group Heavy Industries", "Declined", "09/06/2010", "03/09/2010", "Alfie and Sons Abrasive Blast Services", "Jack Wright<br>Sophie Taylor", "8"],
	["International", "0", "26901", "EUR", "6911927<br>Oliver and Sons Abrasive Blast Services", "250550<br>Alfie and Sons Abrasive Blast Services", "Approved", "06/07/2010", "06/05/2010", "Ruby and Sons Heavy Industries", "Harry Davis<br>Sophie Jones", "8"]];
    
	var keywordStore = new Ext.data.SimpleStore({
            fields: ['id', 'name'],
            data: [],
            sortInfo: {field: 'name', direction: 'ASC'},
			multiSort: true
        });
		
var reader = new Ext.data.ArrayReader({}, [{
		name: 'pmt-type'
	},{
		name: 'pmt-entry'
	},{
		name: 'amount'
	},{
		name: 'ccy'
	},{
		name: 'ord-acct-name'
	},{
		name: 'cp-acct-name'
	},{
		name: 'status'
	},{
		name: 'exec_date'
	},{
		name: 'schedule_date'
	},{
		name: 'company'
	},{
		name: 'authorizers'
	},{
		name: 'comments'
	}]);
    
	var writer = new Ext.data.JsonWriter({
	    encode: false   // <--- false causes data to be printed to jsonData config-property of Ext.Ajax#reqeust
	});
	
    //build the store from the json object
    var store = new Ext.data.GroupingStore({
		sorters:[
			{field:'pmt-type', 		direction:'ASC'},
			{field:'pmt-entry', 	direction:'ASC'},
			{field:'amount', 		direction:'ASC'},
			{field:'ccy', 			direction:'ASC'},
			{field:'ord-acct-name', direction:'ASC'},
			{field:'cp-acct-name', 	direction:'ASC'},
			{field:'status', 		direction:'ASC'},
			{field:'exec_date', 	direction:'ASC'},
			{field:'schedule_date', direction:'ASC'},
			{field:'company', 		direction:'ASC'},
			{field:'authorizers', 	direction:'ASC'},
			{field:'comments', 		direction:'ASC'}
		],
        id: 'store-review-instructions',
		localSort: true,
		reader: reader,
		writer: writer,
        data: myData
    });
    
	
	var btnFilterToggleHandler = function(src) {
		if (gridFiltersPanel.hidden) {
			gridFiltersPanel.show();
			btnToggleFilters.setText("Hide All Filters ("+filterCount+" applied)");
			//btnToggleFilters.setIcon('../../resources/images/db/layout/ns-expand.gif');
		} else {
			gridFiltersPanel.hide();
			btnToggleFilters.setText("Show All Filters ("+filterCount+" applied)");
			//btnToggleFilters.setIcon('../../resources/images/db/layout/ns-collapse.gif');
		}
	};	
	
    
    function renderSelectedCount(count){
        var _selectedText = String.format('{0} of {1} Instructions Selected <a href="#">Show Selected Instructions</a> | <a href="#">Show All Instructions</a>', sm.getCount(), store.getCount());
        return _selectedText;
    }
    
    function updateSelectedCount(){
        txtSelectedCount.update(renderSelectedCount());
    }
    
    var txtSelectedCount = new Ext.Toolbar.TextItem({
        text: renderSelectedCount()
    });
    
    var txtGridCount = new Ext.Toolbar.TextItem({
        text: String.format('Showing 1-{0} of {0} Instructions', store.getTotalCount())
    });
	
	var commentIconRenderer = function(value,metaData) { 	
		return String.format('<img src="../../resources/images/db/icons/comments.png" alt="{0} Comments" title="{0} Comments"> {0} ', value);
	};
	
	var statusCellRenderer = function(value,metaData) {
		switch (value) {
			case 'Approved':
				metaData.css = 'db-status-approved';
				break;
			case 'Pending':
				metaData.css = 'db-status-pending';
				break;
			case 'Declined':
				metaData.css = 'db-status-declined';
				break;
		}
		return value;
	};
	
	var amtCellRenderer = function(value,metaData) {
		var value = value ? Ext.util.Format.number(value, '0,0.00') : 0;
		return value;
	};
        
    var view = new Ext.grid.GroupingView({
        forceFit: true,
        groupTextTpl: '<input class="grpCheckbox" type="checkbox"> {text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
    });
    
	function renderUrgentIcon(input) {
        return input == 0 ? "N" : "Y";
	}
	
    //Utility functions
    function combineCols(value, meta, record, rowIndex, colIndex, store){
        var currency = record.get('currency');
        var value = value ? Ext.util.Format.number(value, '0,0.00') : 0;
        return value + " " + currency;
    }
    
    // Renderer function
    function renderInstructionType(value, id, r)
    {
		var extId = Ext.id();
		if (value != 0) {
		   createentryTypeButton.defer(1, this, ['Bulk', extId, r]);
		   return('<div class="db-icn-pmt-bulk" alt="Click to view Bulk Payment" title="Click to view Bulk Payment" id="bulk_' + extId + '"></div>');
		} else {
		    return('<div class="db-icn-pmt-single" alt="Single Payment" title="Single Payment"></div>');
		}
    }

    var renderAvailBal = new Ext.ux.NumericField({
        //currencySymbol: '&euro;',
        decimalPrecision: 2,
        allowDecimals: true,
        alwaysDisplayDecimals: true
    });
    
    var pnlCompanies = new Ext.Panel({style:"padding-right:4px",layout:'form'});
    var cboCompanies = new Ext.form.ComboBox({
        typeAhead: true,
        triggerAction: 'all',
		labelStyle : "text-align:right",
		hideLabel: true,
        autocomplete: "off",
        mode: 'local',
        store: new Ext.data.ArrayStore({
            id: 'company-store',
            fields: ['cboCompanies', 'txtCompany'],
            data: [[1, 'All Companies'], [2, 'Amy\'s Accounting'], [3, 'JoelEmily Abrasive Blast Cleaning Services'], [4, 'Harry Accountants']]
        }),
        valueField: 'cboCompanies',
        displayField: 'txtCompany'
    });
    cboCompanies.setValue('1');
	pnlCompanies.add(cboCompanies);
	
    var pnlCurrency = new Ext.Panel({layout:'form'});
    var cboCurrency = new Ext.form.ComboBox({
        id: 'display-currency',
        typeAhead: true,
        triggerAction: 'all',
        autocomplete: "off",
		hideLabel: true,
		labelStyle: 'text-align:right;border:1px solid red;',
		fieldLabel :"Display currency",
        mode: 'local',
        store: new Ext.data.ArrayStore({
            fields: ['cboCurrency', 'txtCurrency'],
            data: [[1, 'EUR'], [2, 'USD'], [3, 'YEN']]
        }),
        valueField: 'cboCurrency',
        displayField: 'txtCurrency'
    });
    cboCurrency.setValue('1');
	pnlCurrency.add(cboCurrency);
    
    var pnlPerPage = new Ext.Panel({hideLabel: true,layout:'form'});
    var cboPerPage = new Ext.form.ComboBox({
        typeAhead: true,
        triggerAction: 'all',
        autocomplete: "off",
		fieldLabel :"Show",
		autoWidth : true,
		labelStyle: 'text-align:right;border:1px solid red;',
		mode: 'local',
        store: new Ext.data.ArrayStore({
            fields: ['cboPerPage', 'txtPerPage'],
            data: [[25, '25 per page'], 
			[50, '50 per page'], 
			[75, '75 per page'],
			[100, '100 per page']]
        }),
        valueField: 'cboPerPage',
        displayField: 'txtPerPage',
		width:95
    });
	pnlPerPage.add(cboPerPage);

    cboPerPage.setValue('25');
    cboPerPage.on('select', function(combo, record){
        tbar.pageSize = parseInt(record.get('cboPerPage', 10));
        //tbar.doLoad(tbar.cursor);
    }, this);
	
	
    var pnlPagePicker = new Ext.Panel({width:350,hideLabel: true,layout:'column'});
		pnlPagePicker.add(new Ext.form.Label({style:"padding:4px",width: 40,html:"Show:"}));
		pnlPagePicker.add(cboPerPage);
		pnlPagePicker.add(new Ext.Button({style:"margin-left:10px",width: 20,icon:'../../resources/images/db/icons/resultset_previous.png',tooltip:'Previous Page',handler:btnHandler}));
		pnlPagePicker.add(new Ext.form.Label({style:"padding:4px",width: 40,html:"Page "}));
		pnlPagePicker.add(new Ext.form.TextField({width:30,emptyText: "1"}));
		pnlPagePicker.add(new Ext.form.Label({style:"padding:4px",width: 40,html:" of 1"}));
		pnlPagePicker.add(new Ext.Button({style:"margin-right:10px",width: 20,icon:'../../resources/images/db/icons/resultset_next.png',tooltip:'Next Page',handler:btnHandler}));
		pnlPagePicker.add(new Ext.Button({width: 20,icon:'../../resources/images/db/icons/cog.png',tooltip:'Configure Grid Display',handler:btnHandler}));

    
	var origStore;
	var origStoreSaved = false;
	
	function filterHandler(col, ctl, event) {
		dbDebug("BEGIN filterHandler");
		dbDebug("event: " + event);
		dbDebug("col: " + col);
		var cmp = Ext.getCmp('review-instructions-panel');
		var currStore = cmp.getStore();

		var checkboxes = Ext.query('input:checked[id*=filter_][name='+col+']');
		currStore.clearFilter();
		filterCount = 0;

		dbDebug("checkboxes");
		dbDebug(checkboxes);
		
		dbDebug("count pre-filter: " + currStore.getCount());
		
		var checked = '';
		
		var strQuery = '';
		Ext.each(checkboxes, function(checkbox){
			if (checkbox.checked) {
				if (col == "pmt-entry") {
					if (checkbox.value == "Single") {
						checkbox.value = "0";
					} else if (checkbox.value == "Bulk") {
						checkbox.value = "1";
					}
				}
				filterCount++;
				if (!strQuery) {
					strQuery += '"{0}" == {1}'.format(checkbox.value, "record.get('"+col+"')");
				} else {
					strQuery += ' || "{0}" == {1}'.format(checkbox.value, "record.get('"+col+"')");
				}
			}
		});
		dbDebug("strQuery: " + strQuery);
		
		
		currStore.clearFilter();
		if (strQuery) {
			currStore.filterBy(function(record,id){
				return eval(strQuery);
			});
		}
		currStore.save();
			
			
		dbDebug("count post-filter: " + currStore.getCount());
		updateSelectedCount();
		dbDebug("END filterHandler\n");
    };

    var pmtTypeFilterHandler = function(ctl, event){
		filterHandler('pmt-type', ctl, event);
    };

    var entryTypeFilterHandler = function(ctl, event){
		filterHandler('pmt-entry', ctl, event);
    };

    var companyFilterHandler = function(ctl, event){
		filterHandler('company', ctl, event);
    };

    var authorizerFilterHandler = function(ctl, event){
		filterHandler('authorizers', ctl, event);
    };
	
	var statusFilterHandler = function(ctl, event){
		filterHandler('status', ctl, event);
    };
    
    var btnHandler = function(button, event){
		var buttonMagic = button.name != undefined ? button.name : button.icon;
		dbDebug("button.name: " + button.name);
		dbDebug("button.icon: " + button.icon);
		dbDebug("buttonMagic: " + buttonMagic);
		
        switch (buttonMagic) {
			case "Save":
				showSaveWin();
				break;
			case "btnFilterToggle":
			case "../../resources/images/db/layout/ns-expand.gif":
			case "../../resources/images/db/layout/ns-collapse.gif":
				btnFilterToggleHandler("btnFilterToggle");
				break;
            case 'Select All Instructions':
                if (btnSelectAll.pressed) {
                    reviewInstructionsPanel.getSelectionModel().selectAll();
                }
                else {
                    reviewInstructionsPanel.getSelectionModel().clearSelections();
                }
                updateSelectedCount();
                break;
            case '../../resources/images/db/icons/cog.png':
				showConfigWin();
                break;
            case '../../resources/images/db/icons/printer.png':
            case '../../resources/images/db/icons/report.png':
            case '../../resources/images/db/icons/arrow_merge.png':
            case '../../resources/images/db/icons/bin.png':
                Ext.MessageBox.confirm("Grid Action", 'Are you sure you want to do this?');
                break;
            case '../../resources/images/db/icons/disk.png':
                Ext.MessageBox.alert('Save View', 'The view has been saved successfully.');
                break;
            case '../../resources/images/db/icons/accept.png':
				//Apply
                break;
            case '../../resources/images/db/icons/arrow_undo.png':
				//Apply
                break;
            case '../../resources/images/db/icons/clock.png':
                Ext.MessageBox.alert('Set Schedule Date', 'The Schedule Date has been set...');
                break;
            case '../../resources/images/db/icons/user_comment.png':
                Ext.MessageBox.alert('Notify Authoriser', 'The authoriser has been notified...');
                break;
        }
        
    };
    
	var pagingToolbar = new Ext.PagingToolbar({
		pageSize: 100,
		hideBorders:true,
		store: store,
		displayInfo: true,
		displayMsg:'',
		emptyMsg:''
	});
		pagingToolbar.refresh.hide();
		pagingToolbar.first.hide();
		pagingToolbar.last.hide();
	
	var pnlKeywords = new Ext.form.FormPanel({
		id:'panel-keywords',
		autoWidth: true,
		autoHeight: true,
		style: 'vertical-align:middle;margin-top:1px;margin-left:10px;',
		bodyStyle: 'padding-left:5px;vertical-align:middle;',
		labelStyle: 'text-align:right;vertical-align:middle;',
		items: [{
			allowBlank:false,
			msgTarget: 'under',
			allowAddNewData: true,
			id:'selector-keyword',
			xtype:'superboxselect',
			style: 'display:inline-block;top:-20px;vertical-align:middle;margin-top:8px;margin-left:7px;',
			addNewDataOnBlur : true, 
			width:500,
			fieldLabel: 'Keywords',
			//emptyText: 'Filter this view',
			resizable: true,
			name: 'selector-keywords',
			anchor:'100%',
			store: keywordStore,
			mode: 'local',
			displayField: 'name',
			valueField: 'id',
			extraItemCls: 'x-tag',
			listeners: {
				beforeadditem: function(bs,v){
					dbDebug('beforeadditem:', v);
					//return false;
				},
				additem: function(bs,v){
					dbDebug('additem:', v);
				},
				beforeremoveitem: function(bs,v){
					dbDebug('beforeremoveitem:', v);
					//return false;
				},
				removeitem: function(bs,v){
					dbDebug('removeitem:', v);
				},
				newitem: function(bs,v, f){
					dbDebug(f);
					v = v.slice(0,1).toUpperCase() + v.slice(1).toLowerCase();
					var newObj = {
						id: v,
						name: v
					};
					bs.addItem(newObj);
				}
			}
        }]
	});
	
	var btnToggleFilters = new Ext.Button({
		text: 'Show All Filters ('+filterCount+' applied)',
		name: 'toggle-filter',
		id: 'toggle-filter',
		cls: 'db-filter-btn',
		width: '150px',
		tooltip: 'Click to show more filtering options',
		handler: btnFilterToggleHandler
	});
		
	var pnlFilterKeywords = new Ext.Panel({
		anchor:'100%',
		autoWidth: true,
		autoHeight: true,
		layout:'hbox',
		layoutConfig: {
			padding: 5
		},
		items:[
			btnToggleFilters,
			pnlKeywords,
			{
				xtype: 'button',
				icon: '../../resources/images/db/icons/help.png',
				tooltip: 'What are Keywords?',
				style: 'margin-top:2px;margin-left:17px;margin-right:7px;',
				handler: btnHandler
			}
		]
	});

	
	var gridControlPanel = new Ext.Panel({
		anchor:'100%',
		layout:'hbox',
		style:"padding-top:8px;padding-bottom:8px;",
		items:[
			pnlCompanies,
			pnlCurrency,
			{
				xtype:'spacer',
				flex:1
			},
			pnlPagePicker
		]
	});

	
    var bbar = new Ext.Toolbar();
	    bbar.add(txtSelectedCount);
    
    var gridSearch = new Ext.ux.grid.Search({
        iconCls: 'x-form-trigger',
        minChars: 3,
        autoFocus: true,
        position: top,
		searchTipText: 'Search this view...',
        align: 'left',
        mode: 'local',
        width: '250',
    });
	
    var gridFiltersPanel = new Ext.Panel();
		gridFiltersPanel.hide();

	var pnlFilters = new Ext.Panel({
		style:'border:1px solid #a9bfd3;background-color:#d0def0;background-image:url(../../resources/images/db/toolbar/bg.gif);',
		items: [
			pnlFilterKeywords,
			gridFiltersPanel
		]
	});

	
	var cbgPaymentTypes = new Ext.form.CheckboxGroup({
		id: 'pmt-type',
		xtype: 'checkboxgroup',
		width: '100%',
		itemCls: 'x-check-group-alt',
		// Put all controls in a single column with width 100%
		columns: 1,
		items: [{
			defaultAutoCreate:{tag: "input", type: "checkbox", value: "Acceptgiro"},
			boxLabel: 'Acceptgiro (1)',
			handler: pmtTypeFilterHandler,
			name: 'pmt-type',
			id: 'filter_pmtType_Acceptgiro',
			value: 'Acceptgiro'
		}, {
			defaultAutoCreate:{tag: "input", type: "checkbox", value: "Direct Debit"},
			boxLabel: 'Direct Debit (6)',
			handler: pmtTypeFilterHandler,
			name: 'pmt-type',
			id: 'filter_pmtType_Direct-Debit',
			value: 'Direct Debit'
		}, {
			defaultAutoCreate:{tag: "input", type: "checkbox", value: "SEPA"},
			boxLabel: 'SEPA (2)',
			handler: pmtTypeFilterHandler,
			name: 'pmt-type',
			id: 'filter_pmtType_sepa',
			value: 'SEPA'
		}, {
			defaultAutoCreate:{tag: "input", type: "checkbox", value: "Salary"},
			boxLabel: 'Salary (2)',
			handler: pmtTypeFilterHandler,
			name: 'pmt-type',
			id: 'filter_pmtType_salary',
			value: 'Salary'
		}, {
			defaultAutoCreate:{tag: "input", type: "checkbox", value: "Domestic"},
			boxLabel: 'Domestic (5)',
			handler: pmtTypeFilterHandler,
			name: 'pmt-type',
			id: 'filter_pmtType_dom',
			value: 'Domestic'
		}, {
			defaultAutoCreate:{tag: "input", type: "checkbox", value: "International"},
			boxLabel: 'International (5)',
			handler: pmtTypeFilterHandler,
			name: 'pmt-type',
			id: 'filter_pmtType_intl',
			value: 'International'
		}]
	});
	
	var cbgEntryTypes = new Ext.form.CheckboxGroup({
		id: 'gpEntryType',
		xtype: 'checkboxgroup',
		fieldLabel: 'Single Column',
		width: '100%',
		itemCls: 'x-check-group-alt',
		// Put all controls in a single column with width 100%
		columns: 1,
		items: [{
			defaultAutoCreate:{tag: "input", type: "checkbox", value: "Bulk"},
			boxLabel: 'Bulk (7)',
			handler: entryTypeFilterHandler,
			name: 'pmt-entry',
			id: 'filter_entryType_bulk',
			value: 'Bulk'
		}, {
			defaultAutoCreate:{tag: "input", type: "checkbox", value: "Single"},
			boxLabel: 'Single (14)',
			handler: entryTypeFilterHandler,
			name: 'pmt-entry',
			id: 'filter_entryType_single',
			value: 'Single'
	
		}]
	});
	
	var cbgCompanyNames = new Ext.form.CheckboxGroup({
		id: 'grpCpName',
		xtype: 'checkboxgroup',
		fieldLabel: 'Single Column',
		width: '100%',
		itemCls: 'x-check-group-alt',
		// Put all controls in a single column with width 100%
		columns: 1,
		items: [{
			defaultAutoCreate:{tag: "input", type: "checkbox", value: "Ruby and Sons Heavy Industries"},
			boxLabel: 'Ruby and Sons Heavy Industries (10)',
			name: 'company',
			value: 'Ruby and Sons Heavy Industries',
			id: 'filter_Ruby-and-Sons-Heavy-Industries',
			handler: companyFilterHandler
		},{
			defaultAutoCreate:{tag: "input", type: "checkbox", value: "Lily Partners Abrasive Blast Services"},
			boxLabel: 'Lily Partners Abrasive Blast Services (7)',
			name: 'company',
			value: 'Lily Partners Abrasive Blast Services',
			id: 'filter_Lily-Partners-Abrasive-Blast-Services',
			handler: companyFilterHandler
		},{
			defaultAutoCreate:{tag: "input", type: "checkbox", value: "Alfie and Sons Abrasive Blast Services"},
			boxLabel: 'Alfie and Sons Abrasive Blast Services (4)',
			name: 'company',
			value: 'Alfie and Sons Abrasive Blast Services',
			id: 'filter_Alfie-and-Sons-Abrasive-Blast-Services',
			handler: companyFilterHandler
		}]
	});
	
	var cbgAuthorizers = new Ext.form.CheckboxGroup({
		id: 'grpAuth',
		xtype: 'checkboxgroup',
		fieldLabel: 'Single Column',
		itemCls: 'x-check-group-alt',
		// Put all controls in a single column with width 100%
		columns: 1,
		width: '100%',
		items: [{
			defaultAutoCreate:{tag: "input", type: "checkbox", value: "Approved"},
			boxLabel: 'Approved (13)',
			value: 'Approved',
			name: 'status',
			id: 'filter_Approved',
			handler: statusFilterHandler
		}, {
			defaultAutoCreate:{tag: "input", type: "checkbox", value: "Pending"},
			boxLabel: 'Pending (3)',
			value: 'Pending',
			name: 'status',
			id: 'filter_Pending',
			handler: statusFilterHandler
		}, {
			defaultAutoCreate:{tag: "input", type: "checkbox", value: "Declined"},
			boxLabel: 'Declined (5)',
			value: 'Declined',
			name: 'status',
			id: 'filter_Declined',
			handler: statusFilterHandler
		}]
	});
				
    var gridFiltersLists = new Ext.Panel({
		anchor:'100%',
		autoWidth:true,
		style: 'width:100%;background:#eeeeee;',
		layout:'hbox',
		defaults:{
			margins:'15',
			bodyStyle:'padding: 10px;'
		},
		items:[{
				id: 'filter-payment-types-cell',
				cls: 'filter-cls',
				title: 'Payment Type',
				items: [cbgPaymentTypes]
			}, {
				id: 'filter-entry-types-cell',
				cls: 'filter-cls',
				title: 'Entry Type',
				items: [cbgEntryTypes]
			}, {
				id: 'filter-companies-cell',
				cls: 'filter-cls',
				title: 'Company',
				items: [cbgCompanyNames]
			}, {
				id: 'filter-authorizers-cell',
				cls: 'filter-cls',
				title: 'Status',
				items: [cbgAuthorizers]
			}
		]
    });
	gridFiltersPanel.add(gridFiltersLists);
	
	var btnSavedFiltersHelp = new Ext.Button({
		icon: '../../resources/images/db/icons/help.png',
		tooltip: 'What are saved filters?',
		handler: btnHandler
	});
	
	var btnClear = new Ext.Button({
		tooltip: 'Clear filter selections',
		text: 'Clear',
		name: "Clear",
		width: "80",
		handler: btnHandler
	});
		
	var btnSave = new Ext.Button({
		tooltip: 'Save filter...',
		text: 'Save',
		name: "Save",
		width: "80",
		handler: btnHandler
	});
	
	var btnApply = new Ext.Button({
		xtype:'button',
		tooltip: 'Apply filters to grid below',
		text: 'Apply',
		name: "Apply",
		width: "80",
		handler: btnHandler
	});
		
	var gridSaveFiltersPanel = new Ext.Panel({
		anchor:'100%',
		autoWidth:true,
		style: 'width:100%;background:#eeeeee;',
		layout:'hbox',
		defaults:{
			margins:'15',
			bodyStyle:'padding: 10px;'
		},
		items:[
			cboSavedFilters,
			btnSavedFiltersHelp,
			{
				xtype:'spacer',
				flex:1
			},
			btnClear,
			btnSave,
			btnApply
		]
	});
	
	var gridFiltersSelectionPanel = new Ext.Panel();

	var gridFiltersConfigPanel = new Ext.Panel({layout:'column'});
		var gridFiltersTemplatePanel = new Ext.Panel({
			layout:'form', 
			columnWidth:1,		
			margins: {
				top: 10,
				right: 0,
				bottom: 10,
				left: 10
			},        
			padding:10
		});
		
	gridFiltersConfigPanel.add(gridFiltersTemplatePanel);
	
	gridFiltersPanel.add(gridFiltersSelectionPanel);
	gridFiltersPanel.add(gridSaveFiltersPanel);	

	var gridFiltersConfigPanel = new Ext.Panel({layout:'column'});
			
//    var reviewInstructionsPanel = new Ext.grid.GridPanel({
	var gridFiltersConfigPanel = new Ext.ux.grid.MultiGroupingView({
		hideGroupedColumn :true,
		internalSetAllColumn: function(column, newValue) {
		    var store = this.grid.getStore(),
		        gridView = this.grid.getView();

		    column.masterValue = newValue;

		    store.suspendEvents();
		    store.each(function(rec) {
		        rec.set(this.dataIndex, newValue);
		    }, this);
		    store.resumeEvents();

		    column.renderHeaderCheck();
		    gridView.refresh();
		},
        store: store,
		colModel: new Ext.grid.ColumnModel({
			defaults: {
				sortable: true,
				forceFit: true
			},
			columns: [sm, expander,
				{
					dataIndex: 'pmt-type',
					header: 'Payment Type',
					css: 'text-align:left;',
					id: 'pmt-type',
					width: 50
				}, 
				{
					dataIndex: 'pmt-entry',
					header: 'Entry Type',
					css: 'text-align:center;',
					id: 'pmt-entry',
					renderer: renderInstructionType,
					width: 25
				}, 
				{
					dataIndex: 'amount',
					id: 'amount',
					header: 'Amount',
					css: 'text-align:right;',
					renderer: amtCellRenderer,
					width: 50
				}, {
					dataIndex: 'ccy',
					id: 'ccy',
					header: 'CCY',
					width: 40
				}, {
					dataIndex: 'ord-acct-name',
					id: 'ord-acct-name',
					header: 'Ordering Acct #<br>Acct Name',
				}, {
					dataIndex: 'cp-acct-name',
					id: 'cp-acct-name',
					header: 'Counterparty Acct #<br>Acct Name',
				}, {
					dataIndex: 'status',
					id: 'status',
					header: 'Status',
					width: 50,
					renderer: statusCellRenderer
				}, {
					dataIndex: 'exec_date',
					id: 'exec_date',
					header: 'Exec/Value Date',
					renderer: Ext.util.Format.dateRenderer('m/d/Y'),
					width: 65
				}, {
					dataIndex: 'schedule_date',
					id: 'schedule_date',
					header: 'Schedule Date',
					renderer: Ext.util.Format.dateRenderer('m/d/Y'),
					width: 65
				}, {
					dataIndex: 'company',
					id: 'company',
					header: 'Company',
					width: 65
				}, {
					dataIndex: 'authorizers',
					id: 'authorizers',
					header: 'Input ID<br>Verifier',
					width: 65
				}, {
					dataIndex: 'comments',
					id: 'comments',
					header: 'Comments',
					renderer: commentIconRenderer,
					width: 50
				}
			]
		}),
        sm: sm,
        stripeRows: true,
        loadMask: true,
        align: 'left',
        view: view,
        trackMouseOver: true,
        stripeRows: true,
        plugins: [expander],
        bbar: bbar,
        autoHeight: true,
		name: "review-instructions-panel",
		id: "review-instructions-panel"
    });

	//on store change
	store.on('datachanged', function(){
		updateSelectedCount();
	});
 
    reviewInstructionsPanel.on('groupclick', function(grid, field, value, e){
        var t = e.getTarget('.grpCheckbox');
        if (t) {
            var checked = t.checked;
            grid.getStore().each(function(rec, index){
                if (rec.get(field) == value) {
                    if (checked) {
                        grid.getSelectionModel().selectRow(index, true);
                    }
                    else {
                        grid.getSelectionModel().deselectRow(index);
                    }
                }
            });
        }
    });
    
    var pageActionsPanel = new Ext.Panel({
		anchor:'100%',
		baseCls:'x-plain',
		layout:'hbox',
		layoutConfig: {
			padding: 5
		},
		defaults:{
			margins:'0 5 0 0',
			pressed: false,
			toggleGroup:'btns',
			allowDepress: false
		},
		items:[
			{
				xtype:'button',
				icon: '../../resources/images/db/icons/report.png',
				text: 'Report',
				tooltip: 'Report',
				handler: btnHandler
			},{
				xtype:'button',
				icon: '../../resources/images/db/icons/arrow_merge.png',
				text: 'Merge',
				tooltip: 'Merge',
				handler: btnHandler
			},{
				xtype:'button',
				icon: '../../resources/images/db/icons/cog.png',
				text: 'Export',
				tooltip: 'Export',
				handler: btnHandler
			},{
				xtype:'button',
				icon: '../../resources/images/db/icons/printer.png',
				text: 'Print',
				tooltip: 'Print',
				handler: btnHandler
			},{
				xtype:'button',
				icon: '../../resources/images/db/icons/bin.png',
				text: 'Delete',
				tooltip: 'Delete',
				handler: btnHandler
			},{
				xtype:'spacer',
				flex:1
			},{
				xtype:'button',
				icon: '../../resources/images/db/icons/clock.png',
				text: 'Schedule Date',
				tooltip: 'Schedule Date',
				handler: btnHandler
			},{
				xtype:'button',
				icon: '../../resources/images/db/icons/user_comment.png',
				text: 'Notify Authoriser',
				tooltip: 'Notify Authoriser',
				handler: btnHandler
			}
		]
	});
	
    function createentryTypeButton(value, id, record) {
		record.height = 0;
		var bulkButtons = Ext.query("div[id*=bulk_]");
		Ext.each(bulkButtons, function(button) {
			var btn = Ext.get(button.id);
			btn.on('click', function() {
				if (!win) {
					win = new Ext.Window({
						applyTo: 'bulkWin',
						layout:'fit',
						modal: true,
						width:922,
						height:528,
						title: 'Bulk Payment Details',
						closeAction:'hide',
						html:'<img src="images/bulk.png" />'
					});
				}
				win.show(btn);
			});
		});
    }


    // combine all that into one huge form
    var pnlReviewInstructions = new Ext.Panel({
        title: 'Review Instructions',
        frame: true,
        renderTo: 'grid',
        items: [
			pnlFilters, 
			gridControlPanel,
			reviewInstructionsPanel, 
			pageActionsPanel
		]
    });
};

Ext.onReady(function(){
	var dbGrid = new Ext.ux.DbGrid();
	dbGrid();
});
