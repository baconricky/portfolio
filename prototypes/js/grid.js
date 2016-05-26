Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = 'resources/images/db/s.gif'; // Ext 2.0
    Ext.QuickTips.init();
    
    var win;
    
    var _selectedCount = 0;
    var itemsPerPage = 10; // set the number of items you want per page
    var bAllItemsSelected = false;
    
    // for this demo configure local and remote urls for demo purposes
    var _dataSource = {
        remote: 'grid.json', // static data file
        local: 'js/grid.json' // static data file
    };
    
    var _statusMap = {
        STATUS_AP: "Approved",
		STATUS_RB: "Received By Bank",
        STATUS_WAIT: "Waiting",
        STATUS_WAIT_AUTH: "Waiting for Auth",
        STATUS_W2: "Waiting for 2nd Auth",
        STATUS_DE: "Incomplete"
    };
    
    var _statusIconMap = {
        ICON_AP: '../prototypes/images/icon-AP.png',
        ICON_PE: '../prototypes/images/icon-PE.png',
        ICON_DE: '../prototypes/images/icon-DE.png',
        ICON_ERROR: '../prototypes/images/icon-DE.png'
    };

    // configure whether data source is local
    var _local = true;
    
    // row expander
    var expander = new Ext.ux.grid.RowExpander({
        tpl: new Ext.Template('<p style="padding-left:50px;">Instruction Details</p>', '<hr style="clear:both;padding-left:50px;">', '<ul style="padding-left:50px;float:left">', '<li style="padding-bottom:10px;"><b>Ordering Account Name:</b><br>{detail1}</li>', '<li style="padding-bottom:10px;"><b>Ordering Account Number/CCY:</b><br>{detail2}</li>', '<li style="padding-bottom:10px;"><b>Number of Transactions/Inst. Info:</b><br>{detail3}</li>', '</ul>', '<ul style="padding-left:40px;float:left">', '<li style="padding-bottom:10px;"><b>Template Code:</b><br>{detail1}</li>', '<li style="padding-bottom:10px;"><b>Origin:</b><br>{detail2}</li>', '</ul>', '<ul style="padding-left:40px;float:left">', '<li style="padding-bottom:10px;"><b>Schedule Date:</b><br>{detail3}</li>', '<li style="padding-bottom:10px;"><b>Maturity Date:</b><br>{detail1}</li>', '</ul>', '<ul style="padding-left:40px;float:left">', '<li style="padding-bottom:10px;"><b>Company:</b><br>{detail2}</li>', '<li style="padding-bottom:10px;"><b>File Upload Checksum:</b><br>{detail3}</li>', '</ul>', '<ul style="padding-left:40px;float:left">', '<li style="padding-bottom:10px;"><b>Clearing Reference:</b><br>{detail1}</li>', '<li style="padding-bottom:10px;"><b>Document Code:</b><br>{detail2}</li>', '</ul>', '<ul style="padding-left:40px;float:left">', '<li style="padding-bottom:10px;"><b>Control Number:</b><br>{detail3}</li>', '<li style="padding-bottom:10px;"><b>Reference:</b><br>{detail1}</li>', '</ul>', '<ul style="padding-left:40px;float:left">', '<li style="padding-bottom:10px;"><b>Input ID:</b><br>{detail2}</li>', '<li style="padding-bottom:10px;"><b>Verifier ID:</b><br>{detail3}</li>', '</ul>', '<hr style="clear:both;padding-left:50px;">', '<div style="padding-left:50px;text-align:right">', '<button>Edit</button>', '<div><br>')
    });
    
    // custom column plugin example
    var sm = new Ext.grid.CheckboxSelectionModel({
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
	
    var myData = [["SEPA","Single","45,425.00","EUR","49,850.00 EUR<br> Accountants","774121094<br>Harry Abrasive Blast Cleaning Services","0","04/010/2011","Waiting for Auth","Dave Smith","Harry Smith<br>Emily Jones",""],["SEPA","Single","94,424.00","EUR","54,056.00 EUR<br>Emily Abrasive Blast Cleaning Services","125292968<br>Harry Accountants","0","010/07/2011","Waiting for Auth","Dave Smith","Emily Jones<br>",""],["Salary","Bulk","16,860.00","EUR","5,667.00 EUR<br> Accountants","151464843<br>Harry Acoustical Analysis Services","1","02/01/2011","Approved","Dave Smith","Harry Smith<br>Emily Jones",""],["Domestic","Bulk","82,734.00","EUR","3,685.00 EUR<br> Abrasive Blast Cleaning Services","852636719<br>Harry Accountants","1","09/03/2010","Waiting for Auth","Dave Smith","Harry Smith",""],["SEPA","Bulk","22,046.00","EUR","48,110.00 EUR<br> Abrasive Blast Cleaning Services","628808594<br>Harry Accountants","0","03/01/2010","Waiting for Auth","Dave Smith","Emily Jones<br>",""],["Domestic","Bulk","14,795.00","EUR","39,941.00 EUR<br>Harry Accountants","279980468<br>Emily Accountants","0","03/07/2010","Waiting","Dave Smith","Emily Jones<br>",""],["International","Bulk","60,982.00","EUR","78,178.00 EUR<br>Emily Abrasive Blast Cleaning Services","606152344<br> Acoustical Analysis Services","1","08/010/2010","Waiting","Dave Smith","Emily Jones<br>Harry Smith",""],["Salary","Single","70,606.00","EUR","63,821.00 EUR<br>Harry Abrasive Blast Cleaning Services","807324219<br>Harry Accountants","1","010/010/2011","Waiting for Auth","Dave Smith","Emily Jones<br>",""],["International","Single","43,667.00","EUR","95,870.00 EUR<br> Accountants","883496094<br> Abrasive Blast Cleaning Services","0","07/08/2010","Incomplete","Dave Smith","Harry Smith<br>Emily Jones",""],["Domestic","Bulk","70,166.00","EUR","75,326.00 EUR<br>Harry Abrasive Blast Cleaning Services","834667969<br>Emily Abrasive Blast Cleaning Services","1","01/02/2011","Approved","Dave Smith","Emily Jones<br>Harry Smith",""]];
    
    var reader = new Ext.data.ArrayReader({}, [{
        name: 'tnxtype'
    }, {
        name: 'pmtType'
	},{
		name: 'amount'
    }, {
        name: 'ccy'
    }, {
        name: 'from'
    }, {
        name: 'to'
    }, {
        name: 'urgent'
    }, {
        name: 'exec_date'
    }, {
        name: 'status'
    }, {
        name: 'created_by'
    }, {
        name: 'authorizers'
    }, {
        name: 'notes'
    }]);
    
    //build the store from the json object
    var store = new Ext.data.GroupingStore({
		sorters:{field: 'exec_date', direction:'ASC'},
        id: 'reviewInstructionStore',
		localSort: true,
        reader: reader,
        data: myData
    });
    
    // manually load local data
    store.loadData(myData);
	
	var btnFilterToggleHandler = function(button,event) {
		if (pTopFilters.hidden) {
			pTopFilters.show();
			btnToggleFilters.setText("Hide Filters");
		} else {
			pTopFilters.hide();
			btnToggleFilters.setText("Show All Filters");
		}
	};
    
    function renderSelectedCount(){
        var _selectedText = String.format('{0} of {1} Instructions Selected', sm.getCount(), store.getTotalCount());
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
	
	var amtCellRenderer = function(value,metaData) {
		if (value > 75000.00) {
			metaData.css = 'db-amt-higher';
		} else if (value > 50000.00) {
			metaData.css = 'db-amt-high';
		} else if (value > 25000.00) {
			metaData.css = 'db-amt-low';
		} else if (value > 0.00) {
			metaData.css = 'db-amt-lower';
		}
		return value;
	};
    
    var view = new Ext.grid.GroupingView({
        forceFit: true,
        groupTextTpl: '<input class="grpCheckbox" type="checkbox"> {text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
    });
    
	function renderUrgentIcon(input) {
        return input == 0 ? "N" : "Y";
	}
	
    //Renderer Functions
    function renderIcon(input){
        iconImg = '';
		className = '';
        switch (input) {
            case _statusMap.STATUS_AP:
            case _statusMap.STATUS_RB:
                iconImg = _statusIconMap.ICON_AP;
                break;
            case _statusMap.STATUS_WAIT:
			case _statusMap.STATUS_WAIT_AUTH:
            case _statusMap.STATUS_W2:
            case _statusMap.STATUS_PE:
                iconImg = _statusIconMap.ICON_PE;
                break;
            case _statusMap.STATUS_DE:
                iconImg = _statusIconMap.ICON_DE;
                break;
            case _statusMap.STATUS_ERROR:
                iconImg = _statusIconMap.ICON_ERROR;
                break;
        }
        return '<img class="'+className+'" src="' + iconImg + '" alt="' + input + '">';
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
		if (value == "Bulk") {
		    createPmtTypeButton.defer(1, this, ['Bulk', extId, r]);
		   return('<div class="db-icn-pmt-bulk" id="' + extId + '"></div>');
		} else {
		    return('<div class="db-icn-pmt-single"></div>');
		}
    }

    function createPmtTypeButton(value, id, record) {
		record.height = 0;
		if (value == "Bulk") {
        	new Ext.Button({
				id: id,
				iconCls: 'db-icn-pmt-bulk',
				listeners: {
				 	click: {
						fn: function() {
							if (!win) {
								win = new Ext.Window({
									modal: true,
						        	layout:'fit',
						        	width:800,
						        	height:300,
						        	closeAction:'hide',
						        	items: [pnlReviewInstructions],
						 		});
							}
				        	win.show(this);
			    		}
					}
				}
       		}).render(document.body, id);
		}
    }

    var renderAvailBal = new Ext.ux.NumericField({
        //currencySymbol: '&euro;',
        decimalPrecision: 2,
        allowDecimals: true,
        alwaysDisplayDecimals: true
    });
    
    var cboCompanies = new Ext.form.ComboBox({
        typeAhead: true,
        triggerAction: 'all',
        autocomplete: "off",
        mode: 'local',
        store: new Ext.data.ArrayStore({
            id: 'sCompany',
            fields: ['cboCompanies', 'txtCompany'],
            data: [[1, 'All Companies'], [2, '2 page'], [3, '3 page'], [4, '4 page']]
        }),
        valueField: 'cboCompanies',
        displayField: 'txtCompany',
        width:211
    });
    cboCompanies.setValue('1');
    
    var cboCurrency = new Ext.form.ComboBox({
        typeAhead: true,
        triggerAction: 'all',
        autocomplete: "off",
        mode: 'local',
        store: new Ext.data.ArrayStore({
            id: 'sCurrency',
            fields: ['cboCurrency', 'txtCurrency'],
            data: [[1, 'EUR'], [2, 'USD'], [3, 'YEN']]
        }),
        valueField: 'cboCurrency',
        displayField: 'txtCurrency',
		width: 50
    });
    cboCurrency.setValue('1');
    
    var cboPerPage = new Ext.form.ComboBox({
        typeAhead: true,
        triggerAction: 'all',
        autocomplete: "off",
        mode: 'local',
        store: new Ext.data.ArrayStore({
            id: 0,
            fields: ['cboPerPage', 'txtPerPage'],
            data: [[25, '25 per page'], [50, '50 per page'], [75, '75 per page'], [100, '100 per page']]
        }),
        valueField: 'cboPerPage',
        displayField: 'txtPerPage',
        width: 100
    });
    
    cboPerPage.setValue('25');
    cboPerPage.on('select', function(combo, record){
        tbar.pageSize = parseInt(record.get('cboPerPage', 10));
        //tbar.doLoad(tbar.cursor);
    }, this);
    
    var filterHandler = function(src, event){
        //alert(src.name);
        var val = "";
        if (src.name === "filter-insttype-bulk") {
            val = "Bulk";
        }
        else 
            if (src.name === "filter-insttype-ffi") {
                val = "Free Format Instruction";
            }
        //alert("VAL: " + val);
    };
    
    var btnHandler = function(button, event){
        switch (button.text) {
            case 'Select All Instructions':
                if (btnSelectAll.pressed) {
                    gpReviewInstructions.getSelectionModel().selectAll();
                }
                else {
                    gpReviewInstructions.getSelectionModel().clearSelections();
                }
                updateSelectedCount();
                break;
            case 'Configure':
                Ext.MessageBox.confirm('Grid Configuration', 'This will give you the configuration window...');
                break;
            case 'Delete':
            case 'Print':
            case 'Report':
            case 'Export':
            case 'Combine':
                Ext.MessageBox.confirm(button.text, 'Are you sure you want to do this?');
                break;
            case 'Save View':
                Ext.MessageBox.alert('Save View', 'The view has been saved successfully.');
                break;
            case 'Set Schedule Date':
                Ext.MessageBox.alert('Set Schedule Date', 'The Schedule Date has been set...');
                break;
            case 'Notify Authoriser':
                Ext.MessageBox.alert('Notify Authoriser', 'The authoriser has been notified...');
                break;
        }
        
    };
    
    var tbGridTools = new Ext.Toolbar();
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
		
		tbGridTools.add(cboCompanies);
		tbGridTools.add(cboCurrency);
		
		var btnGrpCurr = new Ext.ButtonGroup();
			btnGrpCurr.add(new Ext.Button({
				enableToggle : true, 
				allowDepress : true, 
				toggleGroup: 'toggleGroup',
				text : 'Current', 
				handler : btnHandler,
				pressed: true
			}));
		
		var btnGrpHist = new Ext.ButtonGroup();
			btnGrpHist.add(new Ext.Button({
				enableToggle : true, 
				allowDepress : true, 
				toggleGroup: 'toggleGroup',
				text : 'Historical', 
				handler : btnHandler
			}));
			tbGridTools.add(btnGrpCurr);
			tbGridTools.add(btnGrpHist);
		tbGridTools.add('->');
		tbGridTools.add(new Ext.Toolbar.TextItem({
			text: 'Show: '
		}));
		tbGridTools.add(cboPerPage);
		tbGridTools.add(pagingToolbar);

		var btnGrpConf = new Ext.ButtonGroup();
			btnGrpConf.add(new Ext.Button({
				text: 'Configure',
				cls: 'db-grid-config-btn',
				handler: btnHandler
			}));
		tbGridTools.add(btnGrpConf);
    
    var tbar = new Ext.Toolbar();
		var btnGrpFilters = new Ext.ButtonGroup();
		var btnToggleFilters = new Ext.Button({
			cls: 'db-toolbar-btn',
			text : 'Show All Filters', 
			handler : btnFilterToggleHandler
		});
		
		btnGrpFilters.add(btnToggleFilters);
		
		tbar.insert('0',btnGrpFilters);
		tbar.add('->');
		var btnGrpSaveView = new Ext.ButtonGroup();
			btnGrpSaveView.add(new Ext.Button({
				cls: 'db-toolbar-btn',
				text: 'Save View',
				handler: btnHandler
			}));
		tbar.add(btnGrpSaveView);
    
    
    var btnSelectAll = new Ext.Button({
		cls: 'db-toolbar-btn',
        text: 'Select All Instructions',
        handler: btnHandler,
        enableToggle: true
    });
    
    var bbar = new Ext.Toolbar();
    //bbar.insert(0, btnSelectAll);
    //bbar.insert(1, '-');
    bbar.insert(2, txtSelectedCount);
    //END -- Top Bar Configuration
    
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
    
    
    var pTopFilters = new Ext.Panel({
        title: 'Filters',
        layout: 'column',
        items: [{
            title: 'Company',
            columnWidth: .2,
            items: [new Ext.form.CheckboxGroup({
                id: 'grpCompany',
                xtype: 'checkboxgroup',
                fieldLabel: 'Single Column',
                itemCls: 'x-check-group-alt',
                // Put all controls in a single column with width 100%
                columns: 1,
                items: [{
                    boxLabel: 'DEMO',
                    name: 'cb-col-1'
                }, {
                    boxLabel: 'P09000000000022',
                    name: 'cb-col-2'
                }, {
                    boxLabel: 'DFMSPEC',
                    name: 'cb-col-3'
                }, {
                    boxLabel: 'SPO1026622',
                    name: 'cb-col-4'
                }, {
                    boxLabel: 'NY0437566',
                    name: 'cb-col-5'
                }, {
                    boxLabel: 'SPO1026623',
                    name: 'cb-col-6'
                }]
            })]
        }, {
            title: 'Instruction Type',
            columnWidth: .2,
            items: [new Ext.form.CheckboxGroup({
                id: 'gpInstType',
                xtype: 'checkboxgroup',
                fieldLabel: 'Single Column',
                itemCls: 'x-check-group-alt',
                // Put all controls in a single column with width 100%
                columns: 1,
                
                items: [{
                    boxLabel: 'Free Format Inststruction',
                    handler: filterHandler,
                    name: 'filter-insttype-ffi'
                }, {
                    boxLabel: 'Bulk',
                    handler: filterHandler,
                    name: 'filter-insttype-bulk'
                }]
            })]
        }, {
            title: 'Counterparty Name',
            columnWidth: .2,
            items: [new Ext.form.CheckboxGroup({
                id: 'grpCpName',
                xtype: 'checkboxgroup',
                fieldLabel: 'Single Column',
                itemCls: 'x-check-group-alt',
                // Put all controls in a single column with width 100%
                columns: 1,
                items: [{
                    boxLabel: 'Amy\'s Alligator Bags',
                    name: 'cb-col-1'
                }, {
                    boxLabel: 'Joel\'s Jackets',
                    name: 'cb-col-2'
                }, {
                    boxLabel: 'Olga\'s Oranges',
                    name: 'cb-col-3'
                }, {
                    boxLabel: 'Shannon\'s Smoothies',
                    name: 'cb-col-4'
                }]
            })]
        }, {
            title: 'Amount',
            columnWidth: .2,
            items: [new Ext.form.CheckboxGroup({
                id: 'grpAmount',
                xtype: 'checkboxgroup',
                fieldLabel: 'Single Column',
                itemCls: 'x-check-group-alt',
                // Put all controls in a single column with width 100%
                columns: 1,
                items: [{
                    boxLabel: '0 to 70K',
                    name: 'cb-col-1'
                }, {
                    boxLabel: '70K to 300K',
                    name: 'cb-col-2'
                }, {
                    boxLabel: '300K to 500K',
                    name: 'cb-col-3'
                }, {
                    boxLabel: '500K to 2M',
                    name: 'cb-col-4'
                }, {
                    boxLabel: '2M to 10M',
                    name: 'cb-col-5'
                }, {
                    boxLabel: '10M+',
                    name: 'cb-col-6'
                }]
            })]
        }, {
            title: 'Exec./Value Date',
            columnWidth: .2,
            items: [new Ext.form.CheckboxGroup({
                id: 'grpExecValueDate',
                xtype: 'checkboxgroup',
                fieldLabel: 'Single Column',
                itemCls: 'x-check-group-alt',
                // Put all controls in a single column with width 100%
                columns: 1,
                items: [{
                    boxLabel: 'Last Month',
                    name: 'cb-col-1'
                }, {
                    boxLabel: '01/01/2009 to 01/01/2010',
                    name: 'cb-col-2'
                }, {
                    boxLabel: '01/02/2009 to 01/02/2010',
                    name: 'cb-col-3'
                }, {
                    boxLabel: '01/03/2009 to 01/03/2010',
                    name: 'cb-col-4'
                }, {
                    boxLabel: '01/04/2009 to 01/04/2010',
                    name: 'cb-col-5'
                }, {
                    boxLabel: '01/05/2009 to 01/05/2010',
                    name: 'cb-col-6'
                }, {
                    boxLabel: '01/06/2009 to 01/06/2010',
                    name: 'cb-col-7'
                }]
            })]
        }]
    });
    pTopFilters.hide();
    
    
    var gpReviewInstructions = new Ext.grid.GridPanel({
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
			columns: [sm, 
				{
					dataIndex: 'tnxtype',
					header: 'Payment Type',
					id: 'tnxtype',
					width: 50
				}, 
				{
					dataIndex: 'pmtType',
					header: 'Entry Type',
					css: 'text-align:center;',
					id: 'pmtType',
					renderer: renderInstructionType,
					width: 30
				}, 
				{
					dataIndex: 'amount',
					header: 'Amount',
					css: 'text-align:right;',
					renderer: renderAvailBal,
					width: 50
				}, {
					dataIndex: 'ccy',
					header: 'CCY',
					id: 'ccy',
					width: 40
				}, {
					dataIndex: 'from',
					header: 'From',
					width: 160
				}, {
					dataIndex: 'to',
					header: 'To',
					width: 160
				}, {
					dataIndex: 'urgent',
					header: 'Urgent',
					renderer: renderUrgentIcon,
					css: 'text-align:center;',
					width: 40
				}, {
					dataIndex: 'exec_date',
					header: 'Execution Date',
					renderer: Ext.util.Format.dateRenderer('m/d/Y'),
					width: 65
				}, {
					dataIndex: 'status',
					header: 'Status',
					css: 'text-align:center;',
					renderer: renderIcon,
					width:40
				}, {
					dataIndex: 'created_by',
					header: 'Created By',
					width: 65
				}, {
					dataIndex: 'authorizers',
					header: 'Authorizers',
					width: 65
				}, {
					dataIndex: 'notes',
					header: 'Notes'
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
        plugins: [expander, gridSearch],
        tbar: tbar,
        bbar: bbar,
        autoHeight: true
    });
    
//on store change
	store.on('datachanged', function(){
		Ext.select('.db-icn-pmt-bulk').hide();
		updateSelectedCount();
	});
 
    gpReviewInstructions.on('groupclick', function(grid, field, value, e){
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
    
    
	var btnGrpScheduleDate = new Ext.ButtonGroup();
		btnGrpScheduleDate.add(new Ext.Button({
	        text: 'Set Schedule Date',
	        handler: btnHandler
		}));
	var btnGrpNotifyAuthoriser = new Ext.ButtonGroup();
		btnGrpNotifyAuthoriser.add(new Ext.Button({
	        text: 'Notify Authoriser',
	        handler: btnHandler
		}));

    
        var btnGrpReport = new Ext.ButtonGroup({
	    	items: [new Ext.Button({
        text: 'Report',
        handler: btnHandler})]
    });
		
    var btnGrpCombine = new Ext.ButtonGroup({
    	items: [new Ext.Button({
        text: 'Combine',
        handler: btnHandler})]
    });
		
    var btnGrpExport = new Ext.ButtonGroup({
    	items: [new Ext.Button({
        text: 'Export',
        handler: btnHandler})]
    });
		

	    var btnGrpPrint = new Ext.ButtonGroup({
	    	items: [new Ext.Button({
        text: 'Print',
        handler: btnHandler})]
    });

    var btnGrpDelete = new Ext.ButtonGroup({
    	items: [new Ext.Button({
        	text: 'Delete',
        	handler: btnHandler
		})]
    });
    
    var tbGridActions = new Ext.Toolbar();
    tbGridActions.add(btnGrpReport);
    tbGridActions.add(btnGrpCombine);
    tbGridActions.add(btnGrpExport);
    tbGridActions.add(btnGrpPrint);
    tbGridActions.add(btnGrpDelete);
    tbGridActions.add('->');
    tbGridActions.add(btnGrpScheduleDate);
    tbGridActions.add(btnGrpNotifyAuthoriser);

    // combine all that into one huge form
    var pnlReviewInstructions = new Ext.Panel({
        title: 'Review Instructions',
        frame: true,
        tbar: tbGridTools,
        bbar: tbGridActions,
        renderTo: 'grid',
        bodyPadding: 10,
        items: [pTopFilters, gpReviewInstructions]
    });
});

