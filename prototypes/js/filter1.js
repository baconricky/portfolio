Ext.onReady(function(){

    var btnFilterToggleHandler = function(button, event){
        console.log("pressed: " + button.pressed);
        if (button.pressed) {
            pnlFilterGroups.show();
            console.log("generatedFilterPanel: " + pnlFilterGroups.isVisible());
        }
        else {
            pnlFilterGroups.hide();
            console.log("generatedFilterPanel: " + pnlFilterGroups.isVisible());
        }
    };
    
    var filterPanel = new Ext.Panel({
        id: 'filterPanel'
    });
    
    var filterBar = new Ext.Toolbar();
    filterBar.add(new Ext.Button({
        enableToggle: true,
        allowDepress: true,
        pressed: true,
        text: 'Filters',
        handler: btnFilterToggleHandler
    }));
    
    var pnlFilterGroups = {
        height: 250,
        autoWidth: true,
        layout: {
            type: 'hbox',
            padding: '5',
            align: 'stretch'
        },
        defaults: {
            margins: '0 5 0 0'
        },
        items: [new Ext.Panel({
            title: 'Company',
            width: '20%'
        }), new Ext.Panel({
            id: 'Instruction Type',
            width: '20%'
        }), new Ext.Panel({
            id: 'Counterparty Name',
            width: '20%'
        }), new Ext.Panel({
            id: 'Amount',
            width: '20%'
        }), new Ext.Panel({
            id: 'Exec./Value Date',
            width: '20%'
        })]
    };
    
    filterPanel.add(filterBar);
    filterPanel.add(pnlFilterGroups);
    
    var tbar = new Ext.Toolbar();
    tbar.insert(1, txtSelectedCount);
    tbar.insert(2, new Ext.Button({
        id: 'btnSelectAll',
        text: 'Select All',
        scope: this,
    }));
    //END -- Top Bar Configuration
    
    
    var grid = new Ext.grid.GridPanel({
        border: false,
        id: 'gridpanel',
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
        view: view,
        trackMouseOver: true,
        stripeRows: true,
        autoHeight: true
    });
    
    panel.add(grid);
    
    var pPageActions = new Ext.Panel();
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
    pPageActions.add(btnSaveView);
    pPageActions.add(btnSetScheduleDate);
    pPageActions.add(btnNotifyAuthoriser);
    
    panel.add(pPageActions);
    
    panel.render(document.body);
    
    Ext.select('.tab-buttons-panel').on('click', function(e, t){
        Ext.fly(t).radioClass('tab-show');
        Ext.get('content' + t.id.slice(-1)).radioClass('tab-content-show');
    }, null, {
        delegate: 'li'
    });
    
    /*Ext.get('ext-gen57').on('click', function(){
     Ext.MessageBox.show({
     title: 'Please wait',
     msg: 'Saving view...',
     progressText: 'Saving view...',
     width: 300,
     progress: true,
     closable: false,
     animEl: 'ext-gen57'
     });
     
     // this hideous block creates the bogus progress
     var f = function(v){
     return function(){
     if (v == 12) {
     Ext.MessageBox.hide();
     Ext.example.msg('Done', 'Your changes have been saved.');
     }
     else {
     var i = v / 11;
     Ext.MessageBox.updateProgress(i, Math.round(100 * i) + '% completed');
     }
     };
     };
     for (var i = 1; i < 13; i++) {
     setTimeout(f(i), i * 500);
     }
     });
     */
});

