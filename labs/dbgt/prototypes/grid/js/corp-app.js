Ext.onReady(function(){
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
	
	// This is the main content center region that will contain each example layout panel.
	// It will be implemented as a CardLayout since it will contain multiple panels with
	// only one being visible at any given time.
	var contentPanel = {
		id: 'content-panel',
		region: 'center', // this is what makes this panel into a region within the containing layout
		layout: 'fit',
		margins: '2 5 5 0',
		activeItem: 0,
		border: false,
		items: [pnlReviewInstructions]
	};
	console.log("loaded contentPanel");
	
	var leftNavigationPanel = {
		id: 'navigation-left-panel',
		region: 'west', // this is what makes this panel into a region within the containing layout
		layout: 'fit',
		margins: '2 5 5 0',
		activeItem: 0,
		border: false,
		items: [pnlReviewInstructions]
	};
	console.log("loaded leftNavigationPanel");
	
	var topNavigationPanel = {
		id: 'navigation-top-panel',
		region: 'north', // this is what makes this panel into a region within the containing layout
		layout: 'fit',
		margins: '2 5 5 0',
		activeItem: 0,
		border: false,
		items: [pnlReviewInstructions]
	};
	console.log("loaded topNavigationPanel");

	// Finally, build the main layout once all the pieces are ready.  This is also a good
	// example of putting together a full-screen BorderLayout within a Viewport.
    new Ext.Viewport({
		layout: 'border',
		title: 'Some App Name',
		items: [contentPanel, topNavigationPanel, leftNavigationPanel],
        renderTo: Ext.getBody()
    });

});