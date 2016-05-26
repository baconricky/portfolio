Ext.onReady(function(){
    //Ext.QuickTips.init();
    
    var _selectedCount = 0;
    
    // for this demo configure local and remote urls for demo purposes
    var _dataSource = {
        remote: 'grid.php', // static data file
        local: 'grid.json' // static data file
    };
    
    var _statusMap = {
        STATUS_AP: "1",
        STATUS_PE: "2",
        STATUS_DE: "3"
    };
    
    var _statusIconMap = {
        ICON_AP: 'images/icon-AP.png',
        ICON_PE: 'images/icon-PE.png',
        ICON_DE: 'images/icon-DE.png',
        ICON_ERROR: 'images/icon-DE.png'
    };
    
    // configure whether data source is local
    var _local = true;
    
    // row expander
    var expander = new Ext.ux.grid.RowExpander({
        tpl: new Ext.Template('<p><b>Detail 1:</b> {detail1}</p><br>', '<p><b>Detail 2:</b> {detail2}</p><br>', '<p><b>Detail 3:</b> {detail3}</p><br>')
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
        }
    });
    
    var reader = new Ext.data.JsonReader({
        root: 'data',
        totalProperty: 'results',
        fields: [{
            name: 'initiation',
            type: 'string'
        }, {
            name: 'status',
            type: 'string'
        }, {
            name: 'cp_name',
            type: 'string'
        }, {
            name: 'cp_acct',
            type: 'string'
        }, {
            name: 'instruction_type',
            type: 'string'
        }, {
            name: 'amt',
            type: 'float'
        }, {
            name: 'ccy',
            type: 'string'
        }, {
            name: 'exec_value_date',
            type: 'date',
            dateFormat: 'm/d/Y'
        }, {
            name: '1st_sign',
            type: 'string'
        }, {
            name: '2nd_sign',
            type: 'string'
        }, {
            name: 'detail1',
            type: 'string'
        }, {
            name: 'detail2',
            type: 'string'
        }, {
            name: 'detail3',
            type: 'string'
        }, {
            name: 'available_bal',
            type: 'float'
        }, {
            name: 'currency',
            type: 'string'
        }]
    });
    
    //build the store from the json object
    var store = new Ext.data.GroupingStore({
        id: 'reviewInstructionStore',
        reader: reader,
        proxy: new Ext.data.HttpProxy({
            url: (_local ? _dataSource.local : _dataSource.remote),
            autoAbort: true,
            disableCaching: true,
            timeout: 180000,
            method: 'POST'
        })
    });
	
	var stFilters = new Ext.data.SimpleStore({
            fields: ['id', 'name'],
            data: [
	             ['0','Status'],
	             ['1','Ordering Account Name'],
	             ['2','Ordering Account Number/CCY'],
	             ['3','Counterparty Name'],
	             ['4','Counterparty Account Number'],
	             ['5','CCY/Amount'],
	             ['6','Number of Transactions/Inst. Info'],
	             ['7','Template Code'],
	             ['8','Origin'],
	             ['9','Exec/Value Date'],
	             ['10','Schedule Date'],
	             ['11','Maturity Date'],
	             ['12','Company'],
	             ['13','Instruction Type'],
	             ['14','File Upload Checksum'],
	             ['15','Clearing Reference'],
	             ['16','Initiation No.'],
	             ['17','Document Code'],
	             ['18','Control Nr'],
	             ['19','Reference'],
	             ['20','Input ID'],
	             ['21','Verifier ID'],
	             ['22','1st Sign/Proxy'],
	             ['23','2nd Sign/Proxy']
            ],
            sortInfo: {field: 'name', direction: 'ASC'}
        });
	
    function renderSelectedCount(){
        var _selectedText = String.format('{0} of {1} Selected', sm.getCount(), store.getTotalCount());
        return _selectedText;
    }
    
    function updateSelectedCount(){
        txtSelectedCount.update(renderSelectedCount);
    }
    
    var txtSelectedCount = new Ext.Toolbar.TextItem({
        text: renderSelectedCount()
    });
    

    
    var view = new Ext.grid.GroupingView({
        forceFit: true,
        groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
    });
    
    //Renderer Functions
    function renderIcon(input){
        iconImg = '';
        switch (input) {
            case _statusMap.STATUS_AP:
                iconImg = _statusIconMap.ICON_AP;
                break;
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
        return '<img src="' + iconImg + '" alt="render_icon-' + input + '">';
    }
    
    //Utility functions
    function combineCols(value, meta, record, rowIndex, colIndex, store){
        var value = value ? Ext.util.Format.number(value, '0,0.00') : 0;
        return value + " " + record.get('ccy');
    }
    
    var renderAvailBal = new Ext.ux.NumericField({
        currencySymbol: '&euro;',
        decimalPrecision: 2,
        allowDecimals: true,
        alwaysDisplayDecimals: true
    });
    
    //Column Model 
    var cm = new Ext.grid.ColumnModel({
        defaults: [{
            sortable: true
        }],
        frame: true,
        columns: [sm, expander, {
            dataIndex: 'initiation',
            header: 'Initiation #',
            id: 'initiation',
            width: 80
        }, {
            dataIndex: 'status',
            header: 'ST',
            renderer: renderIcon,
            width: 35
        }, {
            dataIndex: 'cp_name',
            header: 'CP Name',
            id: 'cp_name'
        }, {
            dataIndex: 'cp_acct',
            header: 'CP Acct'
        }, {
            dataIndex: 'instruction_type',
            header: 'Instruction Type'
        }, {
            dataIndex: 'amt',
            header: 'CCY/Amt',
            align: 'right',
            renderer: combineCols,
            width: 150
        }, {
            dataIndex: 'ccy',
            hidden: true
        }, {
            dataIndex: 'detail1',
            hidden: true
        }, {
            dataIndex: 'detail2',
            hidden: true
        }, {
            dataIndex: 'detail3',
            hidden: true
        }, {
            dataIndex: 'exec_value_date',
            header: 'Exec/Value Date',
            renderer: Ext.util.Format.dateRenderer('m/d/Y')
        }, {
            dataIndex: '1st_sign',
            header: '1st Sign',
            width: 60
        }, {
            dataIndex: '2nd_sign',
            header: '2nd Sign',
            width: 60
        }, {
            dataIndex: 'available_bal',
            header: 'Available Balance',
            align: 'right',
            renderer: function(v){
                return renderAvailBal.getFormattedValue(v);
            }
        }]
    });
    
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
    
    var btnHandler = function(button, event){
        console.log('You clicked the ' + button.text + ' button!');
    };
	
    var sbs1 = new Ext.ux.form.SuperBoxSelect({
		emptyText: 'Search this View...',
		name: 'search',
		allowAddNewData: true,
		addNewDataOnBlur : true, 
		store: stFilters,
		stackItems : true,
        allowBlank:false,
        id:'selector1',
        xtype:'superboxselect',
        resizable: true,
        anchor:'100%',
        mode: 'local',
        displayField: 'name',
        valueField: 'id',
        extraItemCls: 'x-tag',
		listeners: {
	        beforeadditem: function(bs,v){
	            //console.log('beforeadditem:', v);
	            //return false;
	        },
	        additem: function(bs,v){
	            //console.log('additem:', v);
	        },
	        beforeremoveitem: function(bs,v){
	            //console.log('beforeremoveitem:', v);
	            //return false;
	        },
	        removeitem: function(bs,v){
	            //console.log('removeitem:', v);
	        },
	        newitem: function(bs,v, f){
	            //console.log(f);
	            v = v.slice(0,1).toUpperCase() + v.slice(1).toLowerCase();
	            var newObj = {
	                id: v,
	                name: v
	            };
	            bs.addItem(newObj);
	        }
        }
	});
       
	   

	     
    var tbar = new Ext.Toolbar();
        tbar.insert(0, sbs1);
        tbar.insert(1, new Ext.Button({
            text: '?',
            handler: btnHandler
        }));
        tbar.insert(2,'->');
        tbar.insert(3,new Ext.Toolbar.TextItem({
            text: 'Show: '
        }));
        tbar.insert(4,cboPerPage);
        tbar.insert(5,'-');
        tbar.insert(6,new Ext.Toolbar.TextItem({
            text: '&lt;&lt; PAGING HERE &gt;&gt;'
        }));
        tbar.insert(7,'-');
		tbar.insert(8, new Ext.Button({
            text: 'Grid Config',
            handler: btnHandler
        }));
		
    var bbar = new Ext.Toolbar();
	    bbar.insert(0, new Ext.Button({
	        text: 'Select All',
            handler: btnHandler
	    }));
        bbar.insert(1,'-');
        bbar.insert(2, txtSelectedCount);
	    //END -- Top Bar Configuration
    
    var gpReviewInstructions = new Ext.grid.GridPanel({
        border: false,
        store: store,
        cm: cm,
        sm: sm,
        stripeRows: true,
        loadMask: true,
        plugins: expander,
        listeners: {
            render: {
                fn: function(){
                    store.load({
                        params: {
                            start: 0,
                            limit: 25
                        }
                    });
                }
            }
        },
        tbar: tbar,
        bbar: bbar,
        view: view,
        trackMouseOver: true,
        stripeRows: true,
        autoHeight: true
    });
	
	var bgPageActions = new Ext.ButtonGroup();
        var btnSaveView = new Ext.Button({
            text: 'Save View',
            handler: btnHandler
        });
        var btnSetScheduleDate = new Ext.Button({
            text: 'Set Schedule Date',
            handler: btnHandler
        });
        var btnNotifyAuthoriser = new Ext.Button({
            text: 'Notify Authoriser',
            handler: btnHandler
        });
        bgPageActions.add(btnSaveView);
        bgPageActions.add(btnSetScheduleDate);
        bgPageActions.add(btnNotifyAuthoriser);

        var btnDocument = new Ext.Button({
            text: 'Report',
            handler: btnHandler,
        });
        var btnCombine = new Ext.Button({
            text: 'Combine',
            handler: btnHandler
        });
        var btnExport = new Ext.Button({
            text: 'Export',
            handler: btnHandler
        });
        var btnPrint = new Ext.Button({
            text: 'Print',
            handler: btnHandler
        });
        var btnDelete = new Ext.Button({
            text: 'Delete',
            handler: btnHandler
        });
        
		var bgCommonActions = new Ext.ButtonGroup({
            items: [
                btnDocument,
                btnCombine,
                btnExport,
                btnPrint,
                btnDelete
            ]
        });
	
    
	var tbGridactions = new Ext.Toolbar();
        tbGridactions.insert(0, bgCommonActions);
        tbGridactions.insert(1, '->');
        tbGridactions.insert(2, bgPageActions);
    
    var pnlPageContainer = {
        tbar: tbGridTools,
        bbar: tbGridactions,
		items: [gpReviewInstructions]
	};
	
    pnlPageContainer.render(Ext.getBody());
  
});

