var DEBUG = false;

String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

function dbDebug(label, str) {
	if (DEBUG) {
		if (Ext.isChrome || Ext.isGecko || Ext.isGecko2 || Ext.isGecko3) {
			console.log(label + ": " + str);
		} else {
			alert(label + ": " + str);
		}
	}
}

RegExp.escape = function(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

var addBulkTab, tabPanel, win, configWin, saveWin, sortAscText = 'Sort Ascending', sortDescText = 'Sort Descending', objSelectedFilterIds = [], filterCount = 0;
var addReviewInstructionsTab, addBulkTab, getSelectedCount , updateSelectedCount ;

	Ext.enableFx = true;
    Ext.BLANK_IMAGE_URL = '../../resources/images/db/s.gif'; // Ext 2.0
	
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
                }, this, {delegate: 'a'});
            }
        }
    });
    Ext.QuickTips.init();
	
	window.showEditWin = function(record) {
		if (!window.editWin) {
			var col1 = new Ext.form.FieldSet({
				columnWidth: 0.25,
				defaultType: 'textfield',
				autoHeight:true,
				items :[
					{
						fieldLabel: 'Status',
						value: record.data.status
					}, {
						fieldLabel: 'Name',
						value: 'AT EURO2'
					}, {
						fieldLabel: 'Account No/CCY',
						value: '003054000 SDG'
					}, {
						fieldLabel: 'Name',
						value: "003054000"
					}, {
						fieldLabel: 'Account No',
						value: "CL00272403"
					}, {
						fieldLabel: 'Amount/CCY',
						value: '100,000 SDG'
					}
				]
			});
			var col2 = new Ext.form.FieldSet({
				columnWidth: 0.25,
				defaultType: 'textfield',
				autoHeight:true,
				items: [{
					fieldLabel: 'No of Trans/Inst Info',
					value: '28 -/R/-/-/-/-/-/-'
				}, {
					fieldLabel: 'Template Code',
					value: 'SALLUX'
				}, {
					fieldLabel: 'Origin',
					value: 'Manual Entry'
				}, {
					fieldLabel: 'Exec/Value Date',
					xtype: 'datefield',
					value: record.data.exec_date
				}, {
					fieldLabel: 'Schedule Date',
					xtype: 'datefield',
					value: record.data.schedule_date
				},{
					fieldLabel: 'Maturity Date',
					xtype: 'datefield',
					value: '25/07/2011'
				}]
			});
			var col3 = new Ext.form.FieldSet({
				columnWidth: 0.25,
				defaultType: 'textfield',
				autoHeight:true,
				items :[
					{
						fieldLabel: 'Company',
						value: record.data.company
					},{
						fieldLabel: 'Instruction Type',
						value: 'Free Format Instruction'
					},{
						fieldLabel: 'File Upload Checksum',
						value: '----'
					},{
						fieldLabel: 'Clearing Reference',
						value: '----'
					},{
						fieldLabel: 'Initiation No',
						value: '9845113111'
					},{
						fieldLabel: 'Document Code',
						value: '68169345'
					}]
			});
			var col4 = new Ext.form.FieldSet({
				columnWidth: 0.25,
				defaultType: 'textfield',
				autoHeight:true,
				items :[{
						fieldLabel: 'Control No',
						value: '----'
					},{
						fieldLabel: 'Reference',
						value: 'EDD/19.04-22:47'
					},{
						fieldLabel: 'Input ID',
						value: 'jchan'
					},{
						fieldLabel: 'Verifier ID',
						value: 'dlee'
					},{
						fieldLabel: '1st Sign/Proxy',
						value: 'mquah'
					},{
						fieldLabel: '2nd Sign/Proxy',
						value: '----'
					}]
			});

			window.editWin = new Ext.Window({
				applyTo: 'edit-win',
				xtype: 'window',
				layout: 'fit',
				width: 750,
				height: 400,
				modal: true,
				border: false,
				title: 'Edit Instruction',
				closeAction: 'hide',
			    items: [
					new Ext.form.FormPanel({
						header: false,
						labelWidth: 100,
						layout:'column', // arrange items in columns
						frame:true,
						labelAlign: 'top',
						bodyStyle:'padding:5px 5px 0',
						defaults: {      // defaults applied to items
							layout: 'form',
							border: false,
							bodyStyle: 'padding:4px'
						},
						items: [col1,col2,col3,col4]
					})
				],
				buttonAlign: 'right',
				buttons: [
					new Ext.Button({
						text: 'Cancel',
						handler: function() { editWin.hide() }
					}),
					new Ext.Button({
						text: 'Save Instruction',
						handler: function() { editWin.hide() }
					})
				]
			});
		}
		window.editWin.show(this);
	}
	
	window.showConfigWin = function() {
		if (!window.configWin) {
			window.configWin = new Ext.Window({
				applyTo: 'grid-config-win',
				xtype: 'window',
				layout: 'fit',
				modal: true,
				border: false,
				title: 'Grid Configuration',
				closeAction: 'hide',
				items: [new Ext.form.FormPanel({
					header: false,
					width: 550,
					height: 375,
					bodyStyle: 'padding: 10px;',
					items: [{
						xtype: 'itemselector',
						name: 'columnSelector',
						hideLabel: true,
						imagePath: '../ux/images/',
						multiselects: 
							[{
								bodyStyle: 'border: none;',
								height: 300,
								width: 200,
								store: [['pmt-type','Payment Type'],
									['pmt-entry','Entry Type'],
									['company','Company'],
									['authorizers','Input ID/Verifier'],
									['comments','Comments']],
								displayField: 'text',							
								valueField: 'value'
							},{
								bodyStyle: 'border: none;',
								height: 150,
								width: 200,
								store: [['pmt-type','Payment Type'],
									['pmt-entry','Entry Type'],
									['amount','Amount'],
									['ccy','CCY'],
									['ord-acct-name','Ordering Acct #/Acct Name'],
									['cp-acct-name','Counterparty Acct #/Acct Name'],
									['status','Status'],
									['exec_date','Exec/Value Date'],
									['schedule_date','Schedule Date'],
									['company','Company'],
									['authorizers','Input ID/Verifier'],
									['comments','Comments']],
								displayField: 'text',
								valueField: 'value'
							},{
								bodyStyle: 'border: none;',
								height: 150,
								width: 200,
								store: [['pmt-type','Payment Type'],
									['pmt-entry','Entry Type'],
									['amount','Amount'],
									['ccy','CCY'],
									['ord-acct-name','Ordering Acct #/Acct Name'],
									['cp-acct-name','Counterparty Acct #/Acct Name'],
									['status','Status'],
									['exec_date','Exec/Value Date'],
									['schedule_date','Schedule Date'],
									['company','Company'],
									['authorizers','Input ID/Verifier'],
									['comments','Comments']],
								displayField: 'text',
								valueField: 'value'
							}]
					}],
					buttons: [new Ext.Button({
						text: 'Save',
						handler: function() { window.configWin.hide() }
					}), new Ext.Button({
						text: 'Cancel',
						handler: function() { window.configWin.hide() }
					})]
				})
				]
			});
		}
		window.configWin.show(this);
	};
    
    window.showSaveWin = function() {
		if (!window.saveWin) {
			
			var txtSaveFilter = new Ext.form.TextField({
				fieldLabel: "This view will be saved as",
 				labelStyle: "margin-top: 20px;text-align: right;display: block;clear: both;",
 				style: "margin-top: 20px;",
		        triggerAction: "all",
				width: 220
		    });
			var SaveFilter = new Ext.Panel({layout: 'form',height: 125});
				SaveFilter.add(txtSaveFilter);
			
			var txtFilterLabel = new Ext.form.TextField({
				height: 1,
				width: 190,
				id: "saved-filter-label",
				fieldLabel: "Name",
				hideLabel: true
			});
			
			window.saveWin = new Ext.Window({
				applyTo: 'saveWin',
				xtype: 'window',
				width: 360,
				height: 130,
				id: 'save-window',
				layout: 'fit',
				modal: true,
				flex: 1,
				border: false,
				title: 'Save View',
				closeAction: 'hide',
			    items: [txtFilterLabel],
				buttons: [
					new Ext.Button({
						text: 'Cancel',
						handler: function() { saveWin.hide() }
					}),
					new Ext.Button({
						text: 'Save to Home',
						handler: function() { saveWin.hide() }
					}),
					new Ext.Button({
						text: 'Save View',
						handler: function() {
							var checkboxes = Ext.query('input:checked[id*=filter_]');
							var selectedCheckboxes = [];
							Ext.each(checkboxes, function(checkbox) {
								selectedCheckboxes.push(checkbox.id);
							});
							var rec = new Ext.data.Record({
								"value": storeSavedViews.getTotalCount(),
								"display": txtFilterLabel.getValue(),
								"keywords": sbsKeywords.getValue(),
								"filters": selectedCheckboxes
							});
							
							rec.commit();
							storeSavedViews.add(rec);
							saveWin.hide() 
						}
					})
				]
			});
		}
		window.saveWin.show(this);
	};

	window.getPaymentType = function(value, id, r) {
		return '<div class="x-grid3-row-expander">&nbsp;</div><div style="width: 48%;float: left">' + value + '</div>';
	}
        
    window.updateSelectedCount = function(sm, store, target){
		if (target) {
			try {
				return target.update(String.format('{0} of {1} Instructions Selected', sm.getCount(), store.getTotalCount()));
			} catch (e) {
				//console.log("error: ");
				//console.log(e);
			}
		}
	};

    window.setSelectedCount = function(sm, store){
		try {
			return txtSelCnt = new Ext.Toolbar.TextItem({	text: String.format('{0} of {1} Instructions Selected', sm.getCount(), store.getTotalCount())});
		} catch (e) {
			//console.log("error: ");
			//console.log(e);
		}
    }
	
	window.commentIconRenderer = function(value,metaData) { 	
		return String.format('<img src="../../resources/images/db/icons/comments.png" alt="{0} Comments" title="{0} Comments"> {0} ', value);
	};
	
	window.statusCellRenderer = function(value,metaData) {
		switch (value) {
			case 'Approved': 
				metaData.css = 'x-db-status-approved';
				break;
			case 'Pending': 
				metaData.css = 'x-db-status-pending';
				break;
			case 'Declined': 
				metaData.css = 'x-db-status-declined';
				break;
		}
		return value;
	};
	
	window.amtCellRenderer = function(value,metaData) {
		var value = value ? Ext.util.Format.number(value, '0,0.00') : 0;
		return value;
	};
	
    //Utility functions
    window.combineCols = function(value, meta, record, rowIndex, colIndex, store){
        var currency = record.get('currency');
        var value = value ? Ext.util.Format.number(value, '0,0.00') : 0;
        return value + " " + currency;
    }
	
	// Renderer function
    window.renderInstructionType = function(value, id, r)
    {
        var id = Ext.id();
		if (value > 0) {
			createGridButton.defer(1, this, ['Bulk', id, r, "../../resources/images/db/grid/pmt-bulk.gif", addBulkTab, "Click to view Bulk Payment"]);
            return('<div id="' + id + '"></div>');
		} else {
            createGridButton.defer(1, this, ['Single', id, r, "../../resources/images/db/grid/pmt-single.gif", null, "Single Payment"]);
            return('<div id="' + id + '"></div>');
		}
    }
	
    window.createGridButton = function(value, id, record, icon, handler, tooltip) {
        new Ext.Button({
			class: 'x-db-help-btn',
			enableToggle : false,
			id : 'bulk_' + id,
			icon: icon,
            handler : handler
        }).render(document.body, id);		
    }
	
	window.createEditDetailButton = function(value, id, record, handler, tooltip) {
        new Ext.Button({
			tooltip: "Edit Details",
			text: "Edit Details",
			class: 'x-db-edit-details-btn',
			enableToggle : false,
			id : 'edit_' + id,
			handler : handler
        }).render(document.body, id);		
    }
	
	window.addTab = function(title, panel) {
		tabPanel.add(panel).show();
		tabPanel.setActiveTab(panel);
		tabPanel.doLayout();
  	}

    window.renderAvailBal = function() {
		return new Ext.ux.NumericField({
	        //currencySymbol: '&euro;',
	        decimalPrecision: 2,
	        allowDecimals: true,
	        alwaysDisplayDecimals: true
	    });
	}

	window.tabPanel = new Ext.TabPanel({
		region: 'center',
		xtype: 'tabpanel', // TabPanel itself has no title
	});
	
	// combine all that into one huge form
    var vpReviewInstructionsGrid = new Ext.Viewport({
		layout: 'border',
	    items: [tabPanel]
    });
	