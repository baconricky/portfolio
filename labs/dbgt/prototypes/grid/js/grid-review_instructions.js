var reviewInstructionsData = [
	["0", "Local", "0", "-87387", "SDG", "HKD 0002386000<br>BASF", "SGD 2546000000<br>BASF", "Pending", "05/09/2011", "09/10/2011", "Caltex", "Jackie Chan<br>David Lee", "2"],
	["1", "International", "0", "-20426", "SDG", "HKD 0003335000<br>Caltex", "SGD 2547818000<br>BASF", "Pending", "09/07/2010", "05/09/2010", "Nike", "Sachin Tendulkarh<br>Alison Chan", "2"],
	["2", "International", "0", "9432", "SDG", "HKD 0002386000<br>BASF", "SGD 2547818000<br>Nike", "Pending", "03/01/2010", "10/05/2011", "BASF", "Jackie Chan<br>Jet Li", "2"],
	["3", "Asian Local", "0", "13653", "SDG", "HKD 0002386000<br>Nike", "SGD 2547818000<br>Caltex", "Pending", "01/09/2010", "06/02/2011", "Daimler", "Magie Quah<br>Alison Chan", "2"],
	["4", "International", "0", "13801", "SDG", "HKD 0002386000<br>Nike", "SGD 2547818000<br>Caltex", "Pending", "02/02/2011", "06/10/2010", "Nike", "David Lee<br>Alison Chan ", "2"],
	["5", "Free Format", "1", "59231", "SDG", "HKD 0002386000<br>Nike", "SGD 2547818000<br>Caltex", "Pending", "09/03/2010", "03/10/2011", "Puma", "David Lee<br>Jet Li", "2"],
	["6", "Asian Cheque", "0", "39778", "SDG", "HKD 0002386000<br>Nike", "SGD 2547818000<br>Caltex", "Pending", "03/02/2011", "02/02/2011", "Caltex", "Sachin Tendulkar<br>Jack Neo", "2"],
	["7", "Local", "0", "36119", "SDG", "HKD 0003335000<br>GE", "SGD 2547818000<br>BASF", "Pending", "10/10/2011", "04/07/2010", "BASF", "Magie Quah<br>Jack Neo", "2"],
	["8", "International", "0", "-73054", "SDG", "HKD 0002386000<br>Nike", "SGD 2547818000<br>Puma", "Pending", "08/07/2011", "08/05/2011", "BMW", "Jackie Chan<br>Alison Chan", "2"],
	["9", "Local", "1", "30554", "SDG", "HKD 0003335000<br>Nike", "SGD 2547818000<br>Caltex", "Pending", "05/10/2010", "05/01/2011", "BASF", "Jackie Chan<br>Alison Chan", "2"],
	["10", "Local", "1", "21976", "SDG", "HKD 0002386000<br>BASF", "SGD 2546000000<br>GE", "Pending", "08/10/2011", "09/08/2011", "BASF", "Sachin Tendulkar<br>Alison Chan", "2"],
	["11", "Quick", "0", "-14305", "SDG", "HKD 0002386000<br>BASF", "SGD 2547818000<br>BASF", "Pending", "06/01/2011", "04/10/2010", "Puma", "David Lee<br>Brett Lee", "2"],
	["12", "International", "0", "88801", "SDG", "HKD 0002386000<br>GE", "SGD 2546000000<br>BASF", "Pending", "02/08/2011", "09/10/2010", "Daimler", "Sachin Tendulkar<br>Brett Lee", "2"],
	["13", "International", "0", "17925", "SDG", "HKD 0002386000<br>GE", "SGD 2547818000<br>BASF", "Pending", "04/05/2011", "05/02/2010", "Puma", "David Lee<br>Brett Lee", "2"],
	["14", "Local", "0", "51935", "SDG", "HKD 0003335000<br>Nike", "SGD 2546000000<br>Caltex", "Pending", "03/08/2011", "02/04/2010", "BMW", "Jackie Chan<br>Jack Neo", "2"],
	["15", "Quick", "1", "6994", "SDG", "HKD 0003335000<br>BASF", "SGD 2546000000<br>BASF", "Pending", "03/06/2011", "08/10/2010", "GE", "Magie Quah<br>Jack Neo", "2"],
	["16", "Asian Local", "1", "33197", "SDG", "HKD 0003335000<br>GE", "SGD 2547818000<br>BASF", "Pending", "08/06/2011", "07/06/2011", "GE", "Magie Quah<br>Jack Neo", "2"],
	["17", "Asian Local", "1", "55376", "SDG", "HKD 0003335000<br>BASF", "SGD 2547818000<br>BASF", "Pending", "05/09/2011", "03/10/2011", "Daimler", "David Lee<br>Jack Neo", "2"],
	["18", "Asian Local", "1", "77060", "SDG", "HKD 0002386000<br>BASF", "SGD 2547818000<br>BASF", "Pending", "01/04/2011", "07/08/2011", "BMW", "Magie Quah<br>Jack Neo", "2"],
	["19", "International", "0", "23466", "SDG", "HKD 0003335000<br>GE", "SGD 2546000000<br>BASF", "Pending", "09/06/2010", "03/09/2010", "Caltex", "David Lee<br>Jet Li", "2"]
];

// custom column plugin example
var sm = new Ext.grid.CheckboxSelectionModel({
    singleSelect: false,
	headerAsText: false,
	sortable: false,
	checkOnly: false,
	width: 36,
	style: "height:24px!important;padding-top:5px;align:center;",
	listeners: {
		headercontextmenu: {
			fn: function(){
				//console.log("CheckboxSelectionModel: headercontextmenu");
			}
		},
		contextmenu: {
			fn: function(){
				//console.log("CheckboxSelectionModel: contextmenu");
			}
		},
		click: {
			fn: function(){
				window.updateSelectedCount(this, store, txtSelectedCount, "update");
			}
		}, 
		selectionchange: {
			fn: function(){
				window.updateSelectedCount(this, store, txtSelectedCount, "update");
			}
		}
	}
});

	var reader = new Ext.data.ArrayReader({
	}, [
		{"name": "id", "type": "float"},
		{"name": "pmt-type"},
		{"name": "pmt-entry"},
		{"name": "amount"},
		{"name": "ccy"},
		{"name": "ord-acct-name"},
		{"name": "cp-acct-name"},
		{"name": "status"},
		{"name": "exec_date", "type": "date"},
		{"name": "schedule_date", "type": "date"},
		{"name": "company"},
		{"name": "authorizers"},
		{"name": "comments"}
	]);
    
	var writer = new Ext.data.JsonWriter({
		doRequest: false,
	    encode: false   // <--- false causes data to be printed to jsonData config-property of Ext.Ajax#reqeust
	});
	
	var store = new Ext.data.GroupingStore({
		proxy: new Ext.data.HttpProxy({
			url:    'http://localhost',
			method: 'GET',
			listeners: {
				beforeload : function(proxy, opts) {
				},
				exception: function(proxy, type, action, opts, response, arg )  {
				}
			}
		}),
        id: 'store-review-instructions',
		localSort: true,
		reader: reader,
		writer: writer,
        data: reviewInstructionsData
    });    

	//store.getRange(0,9);
	store.load();
	

	var txtSelectedCount = window.setSelectedCount(sm,store);

	var btnHandler = function(button, event){
		var buttonMagic = button.name != undefined ? button.name : button.icon;
        switch (buttonMagic) {
            case '../../resources/images/db/icons/btn-delete.png': 
                Ext.Msg.confirm('Delete Rows', 'Are you sure you want to delete these rows?', function(btn, text){
                    if (btn == 'yes'){
                        // process text value...
                        var selected = sm.getSelections();
						if (selected) {
	                        Ext.each(selected, function(record){
	                            store.remove(record);
	                            store.commitChanges();
		                    });
			                window.updateSelectedCount(sm, store, txtSelectedCount);
						}
                    }
                });
                break;
			case "Clear": 
				resetFilters();
				break;
			case "Save": 
				window.showSaveWin();
				break;
			case "btnFilterToggle": 
			case "../../resources/images/db/layout/ns-expand.gif": 
			case "../../resources/images/db/layout/ns-collapse.gif": 
				btnFilterToggleHandler();
				break;
            case 'Select All Instructions': 
                if (btnSelectAll.pressed) {
                    pnlReviewInstructionsGridPanel.getSelectionModel().selectAll();
                }
                else {
                    pnlReviewInstructionsGridPanel.getSelectionModel().clearSelections();
                }
                window.updateSelectedCount(sm,store,txtSelectedCount);
                break;
            case '../../resources/images/db/icons/btn-print.png': 
            case '../../resources/images/db/icons/btn-download.png': 
            case '../../resources/images/db/icons/btn-report.png': 
            case '../../resources/images/db/icons/btn-merge.png':
                Ext.MessageBox.confirm("Grid Action", 'Are you sure you want to do this?');
                break;
            case 'Apply': 
				filterHandler();
                break;
            case 'Schedule Date': 
                Ext.MessageBox.alert('Set Schedule Date', 'The Schedule Date has been set...');
                break;
            case 'Notify Authoriser': 
                Ext.MessageBox.alert('Notify Authoriser', 'The authoriser has been notified...');
                break;
        }
        
    };
	
	var filterCount = 0;
	
	var storeSavedViews = new Ext.data.ArrayStore({
		id: 'id',
		fields: [
			{name: 'id', type: 'int'},
			{name: 'display', type: 'string'},
			{name: 'active', type: 'boolean'},
			{name: 'keywords', type: 'array'},
			{name: 'filters', type: 'array'}
		],
		data: [
			[0, "Puma Local Single",true, ["Single","Puma"], ["filter_pmtType_Local", "filter_entryType_single", "filter_Puma"]],
			[1, "BASF International Bulk", true, ["Bulk","BASF"], ["filter_pmtType_intl", "filter_entryType_bulk", "filter_BASF"]]
		]
    });	
    
	var view = new Ext.grid.GroupingView({
		collapsible: true,
	    animCollapse: true,
        forceFit: true,
		groupMode: 'display',
		showGroupsText: "Display Groups",
        groupTextTpl: '<input class="grpCheckbox" type="checkbox"> {text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
	});
	
	var keywordStore = new Ext.data.JsonStore({
		id: 'id',
		root: 'rows',
		fields: [
			{name: 'id', type: 'int'},
			{name: 'name', type: 'string'}	
		],
		url: 'js/keywordStore.json'
	});
	
	
		
	var notRedirected = true;

	
	var btnToggleDisplay = function(obj, toggle) {
		if (pnlGridFilters.isVisible()) {
			btnToggleFilters.setText("Show All Filters ("+filterCount+")");
		} else {
			btnToggleFilters.setText("Hide All Filters ("+filterCount+")");
		}
		
		if (toggle) {
			if (pnlGridFilters.isVisible()) {
				var bleh = pnlGridFilters.hide('t', {
					easing: 'easeOut',
					duration: .5,
					remove: false,
					useDisplay: true
				});
			} else {
				pnlGridFilters.show('t', {
					easing: 'easeOut',
					duration: .5,
					remove: false,
					useDisplay: true
				});
			}
		}
	};
    
    var txtGridCount = new Ext.Toolbar.TextItem({
        text: 'Showing 1- of  Instructions'
    });
	
	
	var view = new Ext.grid.GroupingView({
		collapsible: true,
	    animCollapse: true,
        forceFit: true,
		groupMode: 'display',
		showGroupsText: "Display Groups",
        groupTextTpl: '<input class="grpCheckbox" type="checkbox"> {text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
	});

    var renderAvailBal = new Ext.ux.NumericField({
        //currencySymbol: '&euro;',
        decimalPrecision: 2,
        allowDecimals: true,
        alwaysDisplayDecimals: true
    });
    
    var pnlCompanies = new Ext.Panel({width: 190});
    var cboCompanies = new Ext.form.ComboBox({
        typeAhead: true,
        triggerAction: 'all',
        autocomplete: "off",
        mode: 'local',
        height: 20,
        store: new Ext.data.ArrayStore({
            id: 'company-store',
            fields: ['cboCompanies', 'txtCompany'],
            data: [[1, 'All Companies'], [2, 'Nike'], [3, 'BASF'], [4, 'Caltex']]
        }),
		style: 'margin-left: 5px;',
		width: 190,
        valueField: 'cboCompanies',
        displayField: 'txtCompany'
    });
    cboCompanies.setValue('1');
	pnlCompanies.add(cboCompanies);
		
    var pnlPerPage = new Ext.Panel({width: 105});
    var cboPerPage = new Ext.form.ComboBox({
        typeAhead: true,
        triggerAction: 'all',
        autocomplete: "off",
		width: 105,
		mode: 'local',
        store: new Ext.data.ArrayStore({
            fields: ['cboPerPage', 'txtPerPage'],
            data: [[0, 'Show All'], 
			[10, '20 per page'], 
			[50, '50 per page'],
			[100, '100 per page']]
        }),
        valueField: 'cboPerPage',
        displayField: 'txtPerPage',
    });
    cboPerPage.setValue('10');
    cboPerPage.on('select', function(combo, record){
        //tbar.pageSize = parseInt(record.get('cboPerPage', 10));
        //tbar.doLoad(tbar.cursor);
    }, this);
	pnlPerPage.add(cboPerPage);


	var txtPageNumber = new Ext.form.TextField({
        width: 20,
        emptyText: "1",
        value: "1"
    });
	
	function filterHandler() {
		console.log("-- starting filterHandler --");
		var store = reviewInstructionsPanel.getStore();	
		var columnModel = reviewInstructionsPanel.getColumnModel();
		var checkboxes = Ext.query('input:checked[id*=filter_]');
		
		store.clearFilter();
		
		filters = [];
		
		console.log("-- filters --");
		Ext.each(checkboxes, function(checkbox){
			var col = checkbox.name;
			if (checkbox.checked) {
				if (col == "pmt-entry") {
					if (checkbox.id == "filter_entryType_single") {
						checkbox.value = "0";
					} else if (checkbox.id == "filter_entryType_bulk") {
						checkbox.value = "1";
					}
				}
				
				var filter = {};
					filter.type = 'filter';
					filter.value = checkbox.value.toLowerCase();
					filter.column = col;
				console.log("-- filter: " + filter.value);
				filters.push(filter);
			}
		});
		console.log("-------------");
		
		var keywords = sbsKeywords.getValueEx();
		if (keywords) {
			console.log("-- keywords --");
			Ext.each(keywords, function(kw){
				Ext.each(columnModel.columns, function(column){
					var col = column.id;
					if (col != "checker" && col != "expander") {
						var filter = {};
							filter.type = 'keyword';
							filter.value = kw.name.toLowerCase();
							filter.column = col;
						filters.push(filter);
						console.log(filter);
					}
				});
			});
			console.log("--------------");
		}
		filterCount = filters.length;
		
		
		var i = 0;
		var filterParts = []
		Ext.each(filters, function(filter) {
			if (filter.type == 'filter') {
				filterParts.push('new RegExp("^"+record.get("'+filter.column+'")+"$","i").test("'+filter.value+'")');
				//filterParts.push('("{0}" == {1})'.format(filter.value, 'record.get("'+filter.column+'").toLowerCase()'));
			} else if (filter.type == 'keyword') {
				filterParts.push('new RegExp(record.get("'+filter.column+'"),"gi").test("'+filter.value+'")');
				//filterParts.push('("{0}" indexOf {1})'.format(filter.value, 'record.get("'+filter.column+'").toLowerCase()'));
			}
		});
		
		//var strQuery = "(" + filterParts.join(" ||\n ") + ")";
		var strQuery = "(" + filterParts.join(" ||\n ") + ")";
			console.log("strQuery: " + strQuery);
		
		store.clearFilter();

		if (strQuery) {
			store.filterBy(function(record,id){
				return eval(strQuery);
			}, this);
		}

		console.log("------------------");
			
		btnToggleDisplay(this, false, filterCount);

		window.updateSelectedCount(sm, store, txtSelectedCount, "update");
		
		dbDebug("END filterHandler\n");
    };
	

	function resetFilters() {
		reviewInstructionsPanel.getStore().clearFilter();
		sbsKeywords.reset();
		var checkboxes = Ext.query('input:checked[id*=filter_]');
		Ext.each(checkboxes, function(checkbox) {
			chk = Ext.getCmp(checkbox.id);
			chk.setValue(false);
		});
	}
		
	var pnlKeywords = new Ext.Panel({width: 330});
	var sbsKeywords = new Ext.ux.form.SuperBoxSelect({
		id: 'x-db-sbs-keywords',
		height: 28,
		width: 326,
		allowBlank: true,
		msgTarget: 'under',
		allowAddNewData: true,
		id: 'selector2',
		xtype: 'superboxselect',
		addNewDataOnBlur : true, 
		fieldLabel: 'Tags',
		emptyText: 'Filter by Keyword',
		resizable: true,
		name: 'tags',
		anchor: '100%',
		store: keywordStore,
		mode: 'local',
		displayField: 'name',
		valueField: 'id',
		extraItemCls: 'x-tag',
		listeners: {
			beforeadditem: function(bs,v){
				//console.log('beforeadditem: ', v);
				//return false;
			},
			additem: function(bs,v){
				//console.log('additem: ', v);
			},
			beforeremoveitem: function(bs,v){
				//console.log('beforeremoveitem: ', v);
				//return false;
			},
			removeitem: function(bs,v){
				//console.log('removeitem: ', v);
			},
			newitem: function(bs,v, f){
				//console.log(f);
				/*
				v = v.slice(0,1).toUpperCase() + v.slice(1).toLowerCase();
				*/
				var newObj = {
					id: v,
					name: v
				};
				bs.addItem(newObj);
				filterHandler();
			}
		}
	});
	pnlKeywords.add(sbsKeywords);
	
	var btnKeywordsHelp = new Ext.Button({
		cls: 'x-db-help-btn',
		handler: btnHandler,
		icon: '../../resources/images/db/icons/btn-help.png',
		tooltip: 'What are Keywords?',
		height: 22,
		width: 22
	});
	
	var btnToggleFilters = new Ext.Button({
		text: 'Show All Filters (0)',
		iconAlign: 'right',
		colWidth: 130,
		width: 130,
		height: 22,
		cls: 'x-db-toggle-filter',
		id: 'x-db-toggle-filter',
		name: 'x-db-toggle-filter',
		tooltip: 'Click to show more filtering options',
		handler: btnToggleDisplay,
	});

	var btnSavedFiltersHelp = new Ext.Button({
		cls: 'x-db-help-btn',
		handler: btnHandler,
		icon: '../../resources/images/db/icons/btn-help.png',
		tooltip: 'What are Saved Views?',
		height: 22,
		width: 22
	});

	var cboSavedFilters = new Ext.form.ComboBox({
		allowBlank: true,
        autocomplete: "on",
		emptyText : 'Select Saved View',
		height: 22,
        displayField: 'display',
		fieldLabel : "Saved Filters",
		hideLabel: true,
		id: 'saved-filters',
		lazyRender: false,
        mode: 'local',
        store: storeSavedViews,
		tooltip: "Select Saved View",
        triggerAction: 'all',
        typeAhead: true,
        valueField: 'value',
		width: 180,
	    listeners: {
			render: function(cbo) {
				var _store = cbo.getStore();
				_store.each(function(record){
					if (!record.data.active) {
						_store.remove(record);
					}
				}, this);
			},
			select: function(cbo, record, index) {
				resetFilters();
				
				var data = record.data;
				//apply saved keywords
				if(data.keywords) {
					Ext.each(data.keywords, function(keyword){
						sbsKeywords.addItem({
							id: keyword,
							name: keyword,
							val: keyword,
							newItemObject: keyword
						});
					});	
				}
				//apply saved filters
				if (data.filters) {
					Ext.each(data.filters, function(filter) {
						Ext.getCmp(filter).setValue(true);
					});		
				}
			}
		}
    });
	
	var spacer = new Ext.form.TextField({
		hidden: true,
		labelSeparator: '&nbsp;'
	});

	var spacer = new Ext.Spacer({
		xtype: 'spacer',
		flex: 9000
	});
			
	var tbPagingToolbar = new Ext.PagingToolbar({
		store: store,
		height: 35,
		style: "border-left: 1px solid #B3B7BB;border-top: 1px solid #B3B7BB;border-right: 1px solid #B3B7BB",
		prependButtons: true,
		items: [
			cboCompanies,
			{
				html: "Edit",
				style: "margin-left: 5px;cursor: pointer;padding: 5px;color: #073459;text-decoration: underline;"
			},
			'->',
			{
				html: "Show",
				style: "padding: 5px 2px;",
			},
			cboPerPage
		]
	});
	tbPagingToolbar.refresh.hide();
	tbPagingToolbar.first.hide();
	tbPagingToolbar.last.hide();
	tbPagingToolbar.add({
		xtype: 'button',
		cls: 'x-db-icon-btn',
		icon: '../../resources/images/db/icons/btn-config.png',
		tooltip: 'Configure Grid',
		style: 'margin-top: -2px;',
		handler: window.showConfigWin
	});
				
    var bbar = new Ext.Toolbar({
        height: 30,
		style: "padding: 5px;border-left: 1px solid #B3B7BB;border-top: 1px solid #B3B7BB;border-right: 1px solid #B3B7BB",
		items: [
			txtSelectedCount
			/*,
			{style: "color: #073459;text-decoration: underline;",html: "Show Selected Instructions"},
			{html: "&nbsp;|&nbsp;"},
			{style: "color: #073459;text-decoration: underline;",html: "Show All Instructions"},
			{html: "&nbsp;|&nbsp;"}
			*/
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
			defaultAutoCreate: {tag: "input", type: "checkbox", value: "Asian Cheque"},
            boxLabel: 'Asian Cheque (1)',
			name: 'pmt-type',
			id: 'filter_pmtType_Asian_Cheque',
			value: 'Asian Cheque'
		}, {
			defaultAutoCreate: {tag: "input", type: "checkbox", value: "Asian\ Local"},
            boxLabel: 'Asian Local (4)',
			name: 'pmt-type',
			id: 'filter_pmtType_Asian_Local',
			value: 'Asian Local'
		}, {
			defaultAutoCreate: {tag: "input", type: "checkbox", value: "Free Format"},
            boxLabel: 'Free Format (1)',
			name: 'pmt-type',
			id: 'filter_pmtType_intl',
			value: 'Free Format'
		}, {
			defaultAutoCreate: {tag: "input", type: "checkbox", value: "International"},
            boxLabel: 'International (8)',
			name: 'pmt-type',
			id: 'filter_pmtType_International',
			value: 'International'
		}, {
			defaultAutoCreate: {tag: "input", type: "checkbox", value: "Local"},
			boxLabel: 'Local (5)',
			name: 'pmt-type',
			id: 'filter_pmtType_Local',
			value: 'Local'
		}, {
			defaultAutoCreate: {tag: "input", type: "checkbox", value: "Quick"},
            boxLabel: 'Quick (2)',
			name: 'pmt-type',
			id: 'filter_pmtType_dom',
			value: 'Domestic'
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
			defaultAutoCreate: {tag: "input", type: "checkbox", value: "Bulk"},
			boxLabel: 'Bulk (7)',
			name: 'pmt-entry',
			id: 'filter_entryType_bulk',
			value: 'Bulk'
		}, {
			defaultAutoCreate: {tag: "input", type: "checkbox", value: "Single"},
			boxLabel: 'Single (14)',
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
			defaultAutoCreate: {tag: "input", type: "checkbox", value: "BASF"},
			boxLabel: 'BASF (5)',
			name: 'company',
			value: 'BASF',
			id: 'filter_BASF',
		},{
			defaultAutoCreate: {tag: "input", type: "checkbox", value: "Caltex"},
			boxLabel: 'Caltex (3)',
			name: 'company',
			value: 'Caltex',
			id: 'filter_Caltex',
		},{
			defaultAutoCreate: {tag: "input", type: "checkbox", value: "Daimler"},
			boxLabel: 'Daimler (3)',
			name: 'company',
			value: 'Daimler',
			id: 'filter_Daimler',
		},{
			defaultAutoCreate: {tag: "input", type: "checkbox", value: "GE"},
			boxLabel: 'GE (2)',
			name: 'company',
			value: 'GE',
			id: 'filter_GE',
		},{
			defaultAutoCreate: {tag: "input", type: "checkbox", value: "Nike"},
			boxLabel: 'Nike (2)',
			name: 'company',
			value: 'Nike',
			id: 'filter_Nike',
		},{
			defaultAutoCreate: {tag: "input", type: "checkbox", value: "Puma"},
			boxLabel: 'Puma (3)',
			name: 'company',
			value: 'Puma',
			id: 'filter_Puma',
		}]
	});
	
	var cbgAuthorizers = new Ext.form.CheckboxGroup({
		id: 'filters-authorizers',
		xtype: 'checkboxgroup',
		fieldLabel: 'Single Column',
		itemCls: 'x-check-group-alt',
		// Put all controls in a single column with width 100%
		columns: 1,
		width: '100%',
		items: [{
			defaultAutoCreate: {tag: "input", type: "checkbox", value: "Pending"},
			boxLabel: 'Pending (21)',
			value: 'Pending',
			name: 'status',
			id: 'filter_Pending',
		}]
	});
				
    var gridFiltersLists = new Ext.Panel({
		anchor: '100%',
		autoWidth: true,
		cls: 'x-db-grid-filters-panel',
		style: 'width: 100%;background: #eeeeee;',
		layout: 'hbox',
		defaults: {
			margins: '15',
			bodyStyle: 'padding: 10px;'
		},
		items: [{
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
		xtype: 'button',
		tooltip: 'Apply filters to grid below',
		text: 'Apply',
		name: "Apply",
		width: "80",
		handler: btnHandler
	});
		
	var gridSaveFiltersPanel = new Ext.Panel({
		anchor: '100%',
		autoWidth: true,
		cls: 'x-db-filters-panel',
		layout: 'hbox',
		buttonAlign: 'right',
		defaults: {
			margins: '5',
			bodyStyle: 'padding: 5px;'
		},
		items: [
			{xtype: 'spacer', flex: 1},
			btnClear,
			btnSave,
			btnApply
		]
	});
	
	var gridFiltersConfigPanel = new Ext.Panel({layout: 'column'});
		var gridFiltersTemplatePanel = new Ext.Panel({
			layout: 'form', 
			columnWidth: 1,		
			margins: {
				top: 10,
				right: 0,
				bottom: 10,
				left: 10
			},        
			padding: 10
		});
		
	gridFiltersConfigPanel.add(gridFiltersTemplatePanel);

	var gridFiltersConfigPanel = new Ext.Panel({layout: 'column'});

// row expander
    var expander = new Ext.ux.grid.RowExpander({
			listeners: {
				expand: {
					fn: function(rowExp, record, body, rowIndex ) {
						var	editDetailBtns = Ext.query(".x-db-edit-details-btn");
						Ext.select('.x-db-edit-details-btn').on('click', function() {
							window.showEditWin(record);
						});
						
					}
				}
			},
			tpl: new Ext.Template(
			'<div class="x-db-detail-background clearfix">',
				'<div class="clearfix" style="width: 100%;padding-top: 14px;padding-left: 14px;">', 
					'<button class="x-db-edit-details-btn" type="button" class="x-btn">Edit Details</button>',
				'</div>',
				'<div class="clearfix" style="width: 100%;padding: 14px;">', 
					'<div style="width: 55%;float: left">', 
						'<b class="x-db-detail-title">Instruction Details</b>',
						'<hr>', 
						'<div class="clearfix">',
							'<dl>',
								'<dt>Status: </dt>',
								'<dd>Pending</dd>',
							'</dl>',
							'<dl>',
								'<dt>No Of Trans/Inst. Info: </dt>',
								'<dd>28 -/R/-/-/-/-/-/-</dd>',
							'</dl>',
							'<dl>',
								'<dt>Company: </dt>',
								'<dd>Caltex</dd>',
							'</dl>',
							'<dl>',
								'<dt>Control No: </dt>',
								'<dd>--------</dd>',
							'</dl>',
						'</div>',
						'<div class="clearfix">',
							'<dl>',
								'<dt>Ordering Acct Name: </dt>',
								'<dd>AT EURO2</dd>',
							'</dl>',
							'<dl>',
								'<dt>Template Code: </dt>',
								'<dd>SALLUX</dd>',
							'</dl>',
							'<dl>',
								'<dt>Instruction Type: </dt>',
								'<dd>Free Format Instruction</dd>',
							'</dl>',
							'<dl>',
								'<dt>Reference: </dt>',
								'<dd>EDD/19.04-22: 47</dd>',
							'</dl>',
						'</div>',
						'<div class="clearfix">',
							'<dl>',
								'<dt>Ordering Acct No/CCY: </dt>',
								'<dd>003054000</dd>',
							'</dl>',
							'<dl>',
								'<dt>Origin: </dt>',
								'<dd>Manual Entry</dd>',
							'</dl>',
							'<dl>',
								'<dt>File Upload Checksum: </dt>',
								'<dd>--------</dd>',
							'</dl>',
							'<dl>',
								'<dt>Input ID: </dt>',
								'<dd>jchan</dd>',
							'</dl>',
						'</div>',
						'<div class="clearfix">',
							'<dl>',
								'<dt>Counterparty Name: </dt>',
								'<dd>003054000</dd>',
							'</dl>',
							'<dl>',
								'<dt>Exec/Value Date: </dt>',
								'<dd>25/07/2011</dd>',
							'</dl>',
							'<dl>',
								'<dt>Clearing Reference: </dt>',
								'<dd>--------</dd>',
							'</dl>',
							'<dl>',
								'<dt>Verifier ID: </dt>',
								'<dd>dlee</dd>',
							'</dl>',
						'</div>',
						'<div class="clearfix">',
							'<dl>',
								'<dt>Counterparty Acct No: </dt>',
								'<dd>CL00272403</dd>',
							'</dl>',
							'<dl>',
								'<dt>Schedule Date: </dt>',
								'<dd>25/07/2011</dd>',
							'</dl>',
							'<dl>',
								'<dt>Initiation No: </dt>',
								'<dd>9845113111</dd>',
							'</dl>',
							'<dl>',
								'<dt>1st Sign/Proxy: </dt>',
								'<dd>mquah</dd>',
							'</dl>',
						'</div>',
						'<div class="clearfix">',
							'<dl>',
								'<dt>Amount/CCY: </dt>',
								'<dd>100,000 SDG</dd>',
							'</dl>',
							'<dl>',
								'<dt>Maturity Date: </dt>',
								'<dd>25/07/2011</dd>',
							'</dl>',
							'<dl>',
								'<dt>Document Code: </dt>',
								'<dd>68169345</dd>',
							'</dl>',
							'<dl>',
								'<dt>2nd Sign/Proxy: </dt>',
								'<dd>----</dd>',
							'</dl>',
						'</div>',
						'<hr class="clearfix">', 
					'</div>',
					'<div style="padding-left: 25px;width: 40%;float: left;">', 
						'<div class="clearfix">',
							'<b class="x-db-detail-title">Comments (2)</b>', 
							'<b class="x-db-detail-all">Show All</b>', 
						'</div>',
						'<hr class="clearfix">', 
						'<div class="clearfix comments">',
							'<div class="clearfix comment">',
								'<em class="comment-date">05/24/2011</em>',
								'<p><em class="comment-author">jli: </em>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
							'</div>',
							'<div class="clearfix comment">',
								'<em class="comment-date">06/01/2011</em>',
								'<p><em class="comment-author">jchan: </em>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
							'</div>',
						'</div>',
						'<hr class="clearfix">', 
						'<input class="x-db-add-comment-text clearfix" type="text" value="Add Comment to Payment"><input type="button" alt="Add Comment" title="Add Comment" value="Add Comment" class="x-db-add-comment-btn" />',
					'</div>',
				'</div>',
				'<div class="x-db-detail-background-bottom clearfix">',
			'</div>')
		});
	
    var reviewInstructionsPanel = new Ext.grid.GridPanel({
		listeners: {
			render: {
				fn: function(grid, columnIndex, event) {
					Ext.getBody().on("contextmenu", Ext.emptyFn, null, {preventDefault: true});
				}
			},
			headercontextmenu: {
				fn: function(grid, columnIndex, event) {
					var isMenuDisabled = grid.getColumnModel().isMenuDisabled(columnIndex);
					if (!isMenuDisabled) {
						grid.view.hdCtxIndex = columnIndex;
						grid.view.hmenu.beforeColMenuShow;
						grid.view.hmenu.show(event.target, 'tl-bl?');
					}
					return true;
				},
			}
		},
		internalSetAllColumn: function(column, newValue) {
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
		cm: new Ext.grid.ColumnModel({
			defaults: {
				sortable: true,
				forceFit: true,
				cls: 'x-db-col-hd'
			},
    		columns: [
	    		sm,
				{
					dataIndex: 'status',
					id: 'status',
					header: '<br>Status',
					width: 55,
					renderer: window.statusCellRenderer
				}, 
				expander,
				{
					dataIndex: 'pmt-type',
					header: 'Payment<br>Type',
					css: 'text-align: left;',
					id: 'pmt-type',
					renderer: window.getPaymentType,
					width: 75
				}, 
				{
					dataIndex: 'pmt-entry',
					header: 'Payment<br>Entry',
					css: 'text-align: center;',
					id: 'pmt-entry',
					renderer: window.renderInstructionType,
					width: 55
				}, 
				{
					dataIndex: 'amount',
					id: 'amount',
					header: '<br>Amount',
					css: 'text-align: right;',
					renderer: window.amtCellRenderer,
					width: 55
				}, {
					dataIndex: 'ccy',
					id: 'ccy',
					header: '<br>CCY',
					css: 'text-align: right;',
					width: 55
				}, {
					dataIndex: 'ord-acct-name',
					id: 'ord-acct-name',
					header: 'Ordering Acct #<br>Acct Name'
				}, {
					dataIndex: 'cp-acct-name',
					id: 'cp-acct-name',
					header: 'Counterparty Acct #<br>Acct Name'
				}, {
					dataIndex: 'exec_date',
					id: 'exec_date',
					header: 'Exec/Value<br>Date',
					renderer: Ext.util.Format.dateRenderer('m/d/Y'),
					css: 'text-align: right;',
					width: 65
				}, {
					dataIndex: 'schedule_date',
					id: 'schedule_date',
					header: 'Schedule<br>Date',
					renderer: Ext.util.Format.dateRenderer('m/d/Y'),
					css: 'text-align: right;',
					width: 65
				}, {
					dataIndex: 'company',
					id: 'company',
					header: '<br>Company',
					width: 55
				}, {
					dataIndex: 'authorizers',
					id: 'authorizers',
					header: 'Input ID<br>Verifier',
					width: 85
				}, {
					dataIndex: 'comments',
					id: 'comments',
					header: '<br>Comments',
					renderer: window.commentIconRenderer,
					width: 55
				}
			]
		}),
	 	columnLines: true,
        sm: sm,
        stripeRows: true,
        loadMask: true,
        align: 'left',
        view: view,
        trackMouseOver: true,
		enableHdMenu: true,
        stripeRows: true,
        plugins: [expander],
        //tbar: tbar,
        bbar: bbar,
        autoHeight: true,
		name: "review-instructions-panel",
		mode: 'local',
		style: "border-left: 1px solid #B3B7BB;border-top: 1px solid #B3B7BB;border-right: 1px solid #B3B7BB",
		id: "review-instructions-panel"
    });
	
	reviewInstructionsPanel.on('headercontextmenu',function(grid, columnIndex, e) {
		/*e.stopEvent();
		var hmenu = grid.HdMenu;
		hmenu.show();
		e.resumeEvents();
		grid.resumeEvents();
		*/
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
    
    var pnlPageActionsPanel = new Ext.Panel({
		anchor: '100%',
		cls: 'x-db-filters-panel',
		layout: 'hbox',
		style: "border: 1px solid #B3B7BB;",
		layoutConfig: {
			padding: 2
		},
		defaults: {
		    padding: 2,
			margins: '5',
			pressed: false,
			toggleGroup: 'btns',
			allowDepress: false,
		},
		items: [{
			xtype: 'buttongroup',
			cls: 'x-db-btn-group',
			columns: 5,
			layoutConfig: {
				padding: 2
			},
			items: [{
					xtype: 'button',
					icon: '../../resources/images/db/icons/btn-report.png',
					tooltip: 'Report',
					width: 30,
					height: 30,
					margins: 5,
					handler: window.btnHandler
				},{
					xtype: 'button',
					icon: '../../resources/images/db/icons/btn-merge.png',
					tooltip: 'Merge',
					margins: 5,
					width: 30,
					height: 30,
					handler: window.btnHandler
				},{
					xtype: 'button',
					icon: '../../resources/images/db/icons/btn-download.png',
					tooltip: 'Export',
					margins: 5,
					width: 30,
					height: 30,
					handler: window.btnHandler
				},{
					xtype: 'button',
					icon: '../../resources/images/db/icons/btn-print.png',
					tooltip: 'Print',
					margins: 5,
					width: 30,
					height: 30,
					handler: window.btnHandler
				},{
					xtype: 'button',
					icon: '../../resources/images/db/icons/btn-delete.png',
					tooltip: 'Delete',
					margins: 5,
					width: 30,
					height: 30,
					handler: window.btnHandler
				}]
		},{
			xtype: 'spacer',
			flex: 1
		},{
			xtype: 'buttongroup',
			cls: 'x-db-btn-group',
			columns: 2,
			defaults: {
				margins: "5 5 5 5"
			},
			items: [{
				xtype: 'button',
				text: 'Schedule Date',
    		    height: 30,
				width: 90,
				tooltip: 'Schedule Date',
				name: 'Schedule Date',
				handler: window.btnHandler
			},{
				xtype: 'button',
				text: 'Notify Authoriser',
				height: 30,
    		    width: 110,
				tooltip: 'Notify Authoriser',
				name: 'Notify Authoriser',
				handler: window.btnHandler
			}]
		}]
	});
	
	Ext.select('.tab-buttons-panel').on('click', function(e, t) {
		Ext.fly(t).radioClass('tab-show');
		Ext.get('content' + t.id.slice(-1)).radioClass('tab-content-show');
	}, null, {
		delegate: 'li'
	});
	
	var pnlGridFilterBar = new Ext.Panel({
		cls: 'x-db-filters-panel',
		layout: 'hbox',
		style: "border-left: 1px solid #B3B7BB;border-top: 1px solid #B3B7BB;border-right: 1px solid #B3B7BB",
		height: 45,
		layoutConfig: {
			padding: '5',
			align: 'middle'
		},
		items: [
			btnToggleFilters,
			{
				cls: "x-db-filter-bar-pad",
			    html: '&nbsp;',
			    width: 20,
			},			
			pnlKeywords,
			btnKeywordsHelp,
			{
			    xtype: "spacer",
			    flex: 1,
				cls: "x-db-filter-bar-pad",
			},
			cboSavedFilters,
			{
			    html: '&nbsp;',
			    width: 5,
				cls: "x-db-filter-bar-pad",
			},
			btnSavedFiltersHelp,
			{
			    html: '&nbsp;',
			    width: 20,
				cls: "x-db-filter-bar-pad",
			}
		]
	});	
	
	var pnlGridFilters = new Ext.Panel({
		style: "border-left: 1px solid #B3B7BB;border-top: 1px solid #B3B7BB;border-right: 1px solid #B3B7BB",
		items: [
			gridFiltersLists,
			gridSaveFiltersPanel
		]
	});
	pnlGridFilters.hide();
	

Ext.onReady(function() {	
	window.addTab("Review Instructions", 
		new Ext.Panel({
			title: "Review Instructions", 
			id: Ext.id(),
			items: [
				pnlGridFilterBar,
				pnlGridFilters,
				tbPagingToolbar,
				reviewInstructionsPanel, 
				pnlPageActionsPanel
			]
		}));
});