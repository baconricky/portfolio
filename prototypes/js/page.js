Ext.onReady(function(){
    Ext.QuickTips.init();
    
    var pnlPageContainer = {
        tbar: tbGridTools,
        bbar: tbGridActions,
        items: [gpReviewInstructions]
    };
    
    pnlPageContainer.render(Ext.getBody());
    
});

