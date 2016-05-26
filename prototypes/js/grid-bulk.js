Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = 'resources/images/db/s.gif'; // Ext 2.0
    Ext.QuickTips.init();
    
    var _selectedCount = 0;
    var itemsPerPage = 10; // set the number of items you want per page
    var bAllItemsSelected = false;
    
    // for this demo configure local and remote urls for demo purposes
    var _dataSource = {
        remote: 'grid.json', // static data file
        local: 'js/grid.json' // static data file
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
        }
    });
    var myData = [["0", "48754883", "2", "Amy's Alligator Bags", "CL85509500", "Instruction Details", "20691711.00", "05/01/2011", "hkuser77", "spauth56", "2469470", "bank land 5487357", "mask england 17586367", "53694206", "EUR"], ["1", "60620117", "1", "Amy's Alligator Bags", "CL65253897", "Free Format Instruction", "41870698.00", "07/01/2010", "hkuser16", "spauth23", "79207402", "mask land 61963643", "bank bene 5368350", "28049798", "EUR"], ["2", "49204102", "1", "Amy's Alligator Bags", "CL69778177", "Instruction Details", "66760586.00", "09/09/2011", "hkuser67", "spauth16", "29981368", "bank bene 33878073", "bank south 74978089", "22520566", "EUR"], ["3", "32006836", "1", "Joel's Jackets", "CL33522964", "Instruction Details", "42236906.00", "02/08/2010", "hkuser28", "spauth95", "26649181", "mask england 5597209", "bank england 23310892", "96475573", "EUR"], ["4", "66528321", "3", "Joel's Jackets", "CL40778885", "Free Format Instruction", "65173688.00", "03/06/2011", "hkuser46", "spauth69", "91083656", "mark south 11492616", "mask england 97217076", "59308879", "EUR"], ["5", "10268554", "3", "Olga's Oranges", "CL25986563", "Free Format Instruction", "82446465.00", "02/04/2010", "hkuser18", "spauth98", "95172602", "four england 35940855", "mask land 93591950", "70379549", "EUR"], ["6", "80727539", "2", "Olga's Oranges", "CL73436624", "Free Format Instruction", "90930267.00", "05/010/2011", "hkuser90", "spauth90", "60788834", "mark bene 13323487", "mask land 59305828", "39071645", "EUR"], ["7", "55405274", "2", "Shannon's Smoothies", "CL17669693", "Free Format Instruction", "37500625.00", "03/06/2010", "hkuser60", "spauth6", "59800163", "bank land 28007078", "mark land 91224023", "24754229", "EUR"], ["8", "71801758", "1", "Shannon's Smoothies", "CL42876395", "Free Format Instruction", "19031571.00", "02/09/2011", "hkuser74", "spauth54", "14089402", "mask bene 14373187", "bank bene 36236846", "36801364", "EUR"], ["9", "71801758", "1", "Shannon's Smoothies", "CL42876395", "Free Format Instruction", "19031571.00", "02/09/2011", "hkuser74", "spauth54", "14089402", "mask bene 14373187", "bank bene 36236846", "36801364", "EUR"]];
    
    var reader = new Ext.data.ArrayReader({}, [{
        name: 'id'
    }, {
        name: 'initiation'
    }, {
        name: 'status'
    }, {
        name: 'cp_name'
    }, {
        name: 'cp_acct'
    }, {
        name: 'instruction_type'
    }, {
        name: 'amt'
    }, {
        name: 'exec_value_date'
    }, {
        name: '1st_sign'
    }, {
        name: '2nd_sign'
    }, {
        name: 'detail1'
    }, {
        name: 'detail2'
    }, {
        name: 'detail3'
    }, {
        name: 'available_bal'
    }, {
        name: 'currency'
    }]);
    
    //build the store from the json object
    var store = new Ext.data.GroupingStore({
        id: 'reviewInstructionStore',
        reader: reader,
        data: myData
    });
    
    // manually load local data
    store.loadData(myData);
    
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
    
    var view = new Ext.grid.GroupingView({
        forceFit: true,
        groupTextTpl: '<input class="grpCheckbox" type="checkbox"> {text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
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
        var currency = record.get('currency');
        var value = value ? Ext.util.Format.number(value, '0,0.00') : 0;
        return value + " " + currency;
    }
    
    
    function instructionType(value, meta, record, rowIndex, colIndex, store){
        if (value == "Bulk") {
            return '<a href="index.html" target="_blank">' + value + '</a>';
        }
        else {
            return value;
        }
    }
    
    var renderAvailBal = new Ext.ux.NumericField({
        currencySymbol: '&euro;',
        decimalPrecision: 2,
        allowDecimals: true,
        alwaysDisplayDecimals: true
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
            case 'Apply to All':
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
    tbGridTools.insert(0, '->');
    tbGridTools.insert(1, txtGridCount);
    
    var tbar = new Ext.Toolbar();
    tbar.add('->');
    tbar.add(new Ext.Toolbar.TextItem({
        text: 'Show: '
    }));
    tbar.add(cboPerPage);
    
    var pagingToolbar = new Ext.PagingToolbar({
        pageSize: 10,
        store: store,
        displayInfo: true,
        displayMsg: '',
        emptyMsg: ''
    });
    tbar.add(pagingToolbar);
    tbar.add('-');
    tbar.add(new Ext.Button({
        text: 'Configure',
        handler: btnHandler
    }));
    
    var btnSelectAll = new Ext.Button({
        text: 'Apply to All',
        handler: btnHandler,
        enableToggle: true
    });
    
    var bbar = new Ext.Toolbar();
    bbar.insert(0, btnSelectAll);
    bbar.insert(1, '-');
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
    
    
    
    var gpReviewInstructions = new Ext.grid.GridPanel({
        border: false,
        store: store,
        columns: [sm, expander, {
            header: 'Ordering Account Name',
            dataIndex: '',
            hidden: true
        }, {
            header: 'Ordering Account Number/CCY',
            dataIndex: '',
            hidden: true
        }, {
            header: 'Number of Transactions/Inst. Info',
            dataIndex: '',
            hidden: true
        }, {
            header: 'Template Code',
            dataIndex: '',
            hidden: true
        }, {
            header: 'Origin',
            dataIndex: '',
            hidden: true
        }, {
            header: 'Schedule Date',
            dataIndex: '',
            hidden: true
        }, {
            header: 'Maturity Date',
            dataIndex: '',
            hidden: true
        }, {
            header: 'Company',
            dataIndex: '',
            hidden: true
        }, {
            header: 'File Upload Checksum',
            dataIndex: '',
            hidden: true
        }, {
            header: 'Clearing Reference',
            dataIndex: '',
            hidden: true
        }, {
            header: 'Document Code',
            dataIndex: '',
            hidden: true
        }, {
            header: 'Control Number',
            dataIndex: '',
            hidden: true
        }, {
            header: 'Reference',
            dataIndex: '',
            hidden: true
        }, {
            header: 'Input ID',
            dataIndex: '',
            hidden: true
        }, {
            header: 'Verifier ID',
            dataIndex: '',
            hidden: true
        }, {
            dataIndex: 'initiation',
            header: 'Initiation No.',
            id: 'initiation'
        }, {
            dataIndex: 'status',
            header: 'Status',
            renderer: renderIcon,
            width: 80
        }, {
            dataIndex: 'cp_name',
            header: 'Counterparty Name',
            id: 'cp_name'
        }, {
            dataIndex: 'cp_acct',
            header: 'Counterparty Account Number'
        }, {
            dataIndex: 'instruction_type',
            header: 'Instruction Type',
            renderer: instructionType
        }, {
            dataIndex: 'amt',
            header: 'CCY/Amount',
            align: 'right',
            renderer: combineCols
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
            header: '1st Sign/Proxy'
        }, {
            dataIndex: '2nd_sign',
            header: '2nd Sign/Proxy'
        }, {
            dataIndex: 'available_bal',
            header: 'Available Balance',
            align: 'right',
            renderer: function(v){
                return renderAvailBal.getFormattedValue(v);
            }
        }],
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
    var bgPageActions = new Ext.ButtonGroup({
        items: [btnSaveView, btnSetScheduleDate, btnNotifyAuthoriser]
    });
    
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
        items: [btnDocument, btnCombine, btnExport, btnPrint, btnDelete]
    });
    
    var tbGridactions = new Ext.Toolbar();
    tbGridactions.insert(0, bgCommonActions);
    tbGridactions.insert(1, '->');
    tbGridactions.insert(2, bgPageActions);
    
    // combine all that into one huge form
    var pnlReviewInstructions = new Ext.Panel({
        title: 'Review Instructions - Bulk Detail',
        frame: true,
        tbar: tbGridTools,
        bbar: tbGridactions,
        renderTo: 'gridSample',
        bodyPadding: 10,
        items: [pTopFilters, gpReviewInstructions]
    });
    
});

