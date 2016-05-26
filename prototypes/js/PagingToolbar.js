 Ext.ns('Ext.ux.db');
 /**
 * @class Ext.ux.db.PagingToolbar
 * @extends Ext.ux.PagingToolbar
 */
    Ext.ux.db.PagingToolbar = Ext.extend(Ext.ux.PagingToolbar, {
        onRender : function(ct, position){
            Ext.ux.PagingToolbar.superclass.onRender.call(this, ct, position);
            this.first = this.addButton({
                tooltip: this.firstText,
                iconCls: "x-tbar-page-first",
                disabled: true,
                handler: this.onClick.createDelegate(this, ["first"])
            });
            this.prev = this.addButton({
                tooltip: this.prevText,
                iconCls: "x-tbar-page-prev",
                disabled: true,
                handler: this.onClick.createDelegate(this, ["prev"])
            });
            this.addSeparator();
            this.add(this.beforePageText);
            this.field = Ext.get(this.addDom({
               tag: "input",
               type: "text",
               size: "3",
               value: "1",
               cls: "x-tbar-page-number"
            }).el);
            this.field.on("keydown", this.onPagingKeydown, this);
            this.field.on("focus", function(){this.dom.select();});
            this.field.on("blur", this.onPagingBlur, this);
            this.afterTextEl = this.addText(String.format(this.afterPageText, 1));
            this.field.setHeight(18);
            this.addSeparator();
            this.next = this.addButton({
                tooltip: this.nextText,
                iconCls: "x-tbar-page-next",
                disabled: true,
                handler: this.onClick.createDelegate(this, ["next"])
            });
            this.last = this.addButton({
                tooltip: this.lastText,
                iconCls: "x-tbar-page-last",
                disabled: true,
                handler: this.onClick.createDelegate(this, ["last"])
            });
            this.addSeparator();
            
            this.loading = this.addButton({
                hidden: true,
                tooltip: this.refreshText,
                iconCls: "x-tbar-loading",
                handler: this.onClick.createDelegate(this, ["refresh"])
            });
    
            if(this.displayInfo){
                this.displayEl = Ext.fly(this.el.dom).createChild({cls:'x-paging-info'});
            }
            if(this.dsLoaded){
                this.onLoad.apply(this, this.dsLoaded);
            }
        }
    }); 
