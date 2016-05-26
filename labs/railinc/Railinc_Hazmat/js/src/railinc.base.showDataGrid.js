/*!
 * jQuery UI Widget-factory plugin boilerplate (for 1.8/9+)
 * Author: @addyosmani
 * Further changes: @peolanha
 * Licensed under the MIT license
 */

;(function ( $, window, document, undefined ) {

    // define your widget under a namespace of your choice
    //  with additional parameters e.g.
    // $.widget( "namespace.widgetname", (optional) - an
    // existing widget prototype to inherit from, an object
    // literal to become the widget's prototype ); 

    $.widget( "railinc.dataGrid" , {
        //Options to be used as defaults
        options: {
           	dataSrcType: "json", //json, html, xml
	   		dataSrc: "#",
	   		targetId: "target",
	   		tableId: "sortableTable",
        },

        //Setup widget (eg. element creation, apply theming
        // , bind events etc.)
        _create: function () {

			element.targetEl = null,
		gridConfig: {
		
            // _create will automatically run the first time
            // this widget is called. Put the initial widget
            // setup code here, then you can access the element
            // on which the widget was called via this.element.
            // The options defined above can be accessed
            // via this.options this.element.addStuff();
        },

        // Destroy an instantiated plugin and clean up
        // modifications the widget has made to the DOM
        destroy: function () {

            // this.element.removeStuff();
            // For UI 1.8, destroy must be invoked from the
            // base widget
            $.Widget.prototype.destroy.call(this);
            // For UI 1.9, define _destroy instead and don't
            // worry about
            // calling the base widget
        },

        methodB: function ( event ) {
            //_trigger dispatches callbacks the plugin user
            // can subscribe to
            // signature: _trigger( "callbackName" , [eventObject],
            // [uiObject] )
            // eg. this._trigger( "hover", e /*where e.type ==
            // "mouseenter"*/, { hovered: $(e.target)});
            this._trigger('methodA', event, {
                key: value
            });
        },

        methodA: function ( event ) {
            this._trigger('dataChanged', event, {
                key: value
            });
        },

        // Respond to any changes the user makes to the
        // option method
        _setOption: function ( key, value ) {
            switch (key) {
            case "someValue":
                //this.options.someValue = doSomethingWith( value );
                break;
            default:
                //this.options[ key ] = value;
                break;
            }

            // For UI 1.8, _setOption must be manually invoked
            // from the base widget
            $.Widget.prototype._setOption.apply( this, arguments );
            // For UI 1.9 the _super method can be used instead
            // this._super( "_setOption", key, value );
        }
    });

})( jQuery, window, document );





/*!
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */

// the semi-colon before the function invocation is a safety
// net against concatenated scripts and/or other plugins
// that are not closed properly.
;(function ( $, window, document, undefined ) {
    // undefined is used here as the undefined global
    // variable in ECMAScript 3 and is mutable (i.e. it can
    // be changed by someone else). undefined isn't really
    // being passed in so we can ensure that its value is
    // truly undefined. In ES5, undefined can no longer be
    // modified.

    // window and document are passed through as local
    // variables rather than as globals, because this (slightly)
    // quickens the resolution process and can be more
    // efficiently minified (especially when both are
    // regularly referenced in your plugin).

    // Create the defaults once

    var $;
    
    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;

        // jQuery has an extend method that merges the
        // contents of two or more objects, storing the
        // result in the first object. The first object
        // is generally empty because we don't want to alter
        // the default options for future instances of the plugin
        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
        this.loadGrid();
	}
        
    Plugin.prototype.init = function () {
    	//this.options.dataSrcType
   		this.options.targetId = this.options.targetId ? this.options.targetId : this._defaults.targetId;
   		this.options.tableId  = this.options.tableId  ? this.options.tableId : this._defaults.tableId;

		return false;
    };

    Plugin.prototype.loadGrid = function () {

			$gridConfig = {
				aoColumns: this.options.columns,
				fnHeaderCallback: function( nHead, aasData, iStart, iEnd, aiDisplay ) {
					headers = $(nHead).children('th');
					$(headers).each(function(header) {
						console.log("Header: ");
						console.log($(header));
					});
				},
				fnInitComplete: function() {
					$("#sortableTable tr").mouseover(function() {
						$(this).attr("style", "cursor:pointer;");
					});
				},
				bSearchable: false,
				bProcessing: false,
				bPaginate: false,
				bStateSave: false,
				sSearch: false,
				sAjaxSource: this._defaults.dataSrc,
				sScrollY: "200px"
			};
	    
		var oTable = $('#'+this.options.tableId).dataTable($gridConfig).trigger("update");
		
		console.log("this.options.tableId");
		console.log(this.options.tableId);
	
		//if rows == 0 - show noticeWarning box
		//if error - show noticeError box
		var $targetEl = $('#' + this.options.targetId),
			markup = '<h2>Your Results</h2><table cellpadding="0" cellspacing="1" border="0" class="tablesorter display" id="${tableId}"></table>';
			
			
		var dataGridViewTpl = $.template( "dataGridView", markup);
		
		console.log("this._defaults.targetId");
		console.log(this.options.targetId);
		console.log("$targetEl");
		console.log($targetEl);
		console.log("dataGridViewTpl");
		console.log(dataGridViewTpl);
		
		// Render the template with the movies data and insert
		// the rendered HTML under the "movieList" element
		$.tmpl( dataGridViewTpl, this.options ).appendTo( $targetEl );

		console.log($targetEl);
		
	    //oTable.fnAdjustColumnSizing();
	    $targetEl.stop().slideDown('slow');
    };
    
    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new Plugin( this, options ));
            }
        });
    }

})( jQuery, window, document );