// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function f(){ log.history = log.history || []; log.history.push(arguments); if(this.console) { var args = arguments, newarr; args.callee = args.callee.caller; newarr = [].slice.call(args); if (typeof console.log === 'object') log.apply.call(console.log, console, newarr); else console.log.apply(console, newarr);}};

// make it safe to use console.log always
(function(a){function b(){}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})
(function(){try{console.log();return window.console;}catch(a){return (window.console={});}}());


// place any jQuery/helper plugins in here, instead of separate, slower script files.

/**
 * Flatten height same as the highest element for each row.
 *
 * Copyright (c) 2011 Hayato Takenaka
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * @author: Hayato Takenaka (http://urin.take-uma.net)
 * @version: 0.0.2
**/
;(function($) {
    $.fn.tile = function(columns) {
        var tiles, max, c, h, last = this.length - 1, s;
        if(!columns) columns = this.length;
        this.each(function() {
            if ($(this).is("visible")) {
                s = this.style;
                if(s.removeProperty) s.removeProperty("height");
                if(s.removeAttribute) s.removeAttribute("height");
            }
        });
        return this.each(function(i) {
            if ($(this).is("visible")) {
                c = i % columns;
                if(c == 0) tiles = [];
                tiles[c] = $(this);
                h = tiles[c].height();
                if(c == 0 || h > max) max = h;
                if(i == last || c == columns - 1) $.each(tiles, function() { this.height(max); });
            }
        });
	};
})(jQuery);

/** jQuery Ribbon **/
(function( $ ){
	$.fn.ribbon = function(id) {
		if (!id) {
			if (this.attr('id')) {
				id = this.attr('id');
			}
		}
		
		var that = function() { 
			return thatRet;
		};
		
		
		
		var thatRet = that;
		
		that.selectedTabIndex = -1;
		
		var tabNames = [];
		
		that.goToBackstage = function() {
			ribObj.addClass('backstage');
		}
			
		that.returnFromBackstage = function() {
			ribObj.removeClass('backstage');
		}	
		var ribObj = null;
		
		that.init = function(id) {
			if (!id) {
				id = 'ribbon';
			}
		
			ribObj = $('#'+id);
			ribObj.find('.ribbon-window-title').after('<div id="ribbon-tab-header-strip"></div>');
			var header = ribObj.find('#ribbon-tab-header-strip');
			
			ribObj.find('.ribbon-tab').each(function(index) {
				var id = $(this).attr('id');
				if (id == undefined || id == null)
				{
					$(this).attr('id', 'tab-'+index);
					id = 'tab-'+index;
				}
				tabNames[index] = id;
			
				var title = $(this).find('.ribbon-title');
				var isBackstage = $(this).hasClass('file');
				header.append('<div id="ribbon-tab-header-'+index+'" class="ribbon-tab-header"></div>');
				var thisTabHeader = header.find('#ribbon-tab-header-'+index);
				thisTabHeader.append(title);
				if (isBackstage) {
					thisTabHeader.addClass('file');
					
					thisTabHeader.click(function() {
						that.switchToTabByIndex(index);
						that.goToBackstage();
					});
				} else {
					if (that.selectedTabIndex==-1) {
						that.selectedTabIndex = index;
						thisTabHeader.addClass('sel');
					}
					
					thisTabHeader.click(function() {
						that.returnFromBackstage();
						that.switchToTabByIndex(index);
					});
				}
				
				
				
				$(this).hide();
			});
			
			ribObj.find('.ribbon-button').each(function(index) {
				var title = $(this).find('.button-title');
				title.detach();
				$(this).append(title);
				
				var el = $(this);
				
				this.enable = function() {
					el.removeClass('disabled');
				}
				this.disable = function() {
					el.addClass('disabled');
				}
				this.isEnabled = function() {
					return !el.hasClass('disabled');
				}
								
				if ($(this).find('.ribbon-hot').length==0) {
					$(this).find('.ribbon-normal').addClass('ribbon-hot');
				}			
				if ($(this).find('.ribbon-disabled').length==0) {
					$(this).find('.ribbon-normal').addClass('ribbon-disabled');
					$(this).find('.ribbon-normal').addClass('ribbon-implicit-disabled');
				}
				
				$(this).tooltip({
					bodyHandler: function () {
						if (!$(this).isEnabled()) { 
							$('#tooltip').css('visibility', 'hidden');
							return '';
						}
						
						var tor = '';

						if (jQuery(this).children('.button-help').size() > 0)
							tor = (jQuery(this).children('.button-help').html());
						else
							tor = '';

						if (tor == '') {
							$('#tooltip').css('visibility', 'hidden');
							return '';
						}

						$('#tooltip').css('visibility', 'visible');

						return tor;
					},
					left: 0,
					extraClass: 'ribbon-tooltip'
				});
			});
			
			ribObj.find('.ribbon-section').each(function(index) {
				$(this).after('<div class="ribbon-section-sep"></div>');
			});

			ribObj.find('div').attr('unselectable', 'on');
			ribObj.find('span').attr('unselectable', 'on');
			ribObj.attr('unselectable', 'on');

			that.switchToTabByIndex(that.selectedTabIndex);
		}
		
		that.switchToTabByIndex = function(index) {
			var headerStrip = $('#ribbon #ribbon-tab-header-strip');
			headerStrip.find('.ribbon-tab-header').removeClass('sel');
			headerStrip.find('#ribbon-tab-header-'+index).addClass('sel');

			$('#ribbon .ribbon-tab').hide();
			$('#ribbon #'+tabNames[index]).show();
		}
		
		$.fn.enable = function() {
			if (this.hasClass('ribbon-button')) {
				if (this[0] && this[0].enable) {
					this[0].enable();
				}	
			}
			else {
				this.find('.ribbon-button').each(function() {
					$(this).enable();
				});
			}				
		}
		
		
			
				
		$.fn.disable = function() {
			if (this.hasClass('ribbon-button')) {
				if (this[0] && this[0].disable) {
					this[0].disable();
				}	
			}
			else {
				this.find('.ribbon-button').each(function() {
					$(this).disable();
				});
			}				
		}
	
		$.fn.isEnabled = function() {
			if (this[0] && this[0].isEnabled) {
				return this[0].isEnabled();
			} else {
				return true;
			}
		}
	
	
		that.init(id);
	
		$.fn.ribbon = that;
	};

})( jQuery );