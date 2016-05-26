/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL = 'resources/images/db/s.gif'; // Ext 2.0
    var tree = new Ext.tree.TreePanel({
        renderTo:'tree-div',
        title: 'Select Level',
        width: 400,
        useArrows:true,
        autoScroll:true,
        animate:true,
        enableDD:true,
        containerScroll: true,
        rootVisible: false,
        frame: true,
        root: {
            nodeType: 'async'
        },
        
        // auto create TreeLoader
        dataUrl: 'js/check-nodes.json',
        
        listeners: {
            'checkchange': function(node, checked){
                if(checked){
                    node.getUI().addClass('complete');
                }else{
                    node.getUI().removeClass('complete');
                }
            }
        }        
    });
	
	tree.on('checkchange', function(node, checked) {
        node.eachChild(function(n) {
            n.getUI().toggleCheck(checked);
        });
    });


    tree.getRootNode().expand(true);
});