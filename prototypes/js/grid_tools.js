Ext.onReady(function(){
    var bgGridTools = new Ext.ButtonGroup({
        items: [new Ext.Button({
            text: 'Report',
            handler: btnHandler,
        }), new Ext.Button({
            text: 'Combine',
            handler: btnHandler
        }), new Ext.Button({
            text: 'Export',
            handler: btnHandler
        }), new Ext.Button({
            text: 'Print',
            handler: btnHandler
        }), new Ext.Button({
            text: 'Delete',
            handler: btnHandler
        })]
    });
});
