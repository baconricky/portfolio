/**  
* Dependancies: this library depends on the jQuery Library, as well as the jQuery UI Library
* Author: Adrian Pomilio
* Purpose: Railinc Base Standard JavaScript Library 
**/
var rail = this.rail || {};
rail.base = (function() {
    var i = {
        initForm: function() {
            $labels = $("label");
            
            //Ensure that the label has the ":" after it
            $labels.each(function() {
                if ($(this).html().indexOf(":")) {
					if (!$(this).html().indexOf("ui-button-text")) {
                    	$(this).append(':');
                	}
				}
			});
			
			//If it's required, add the requiredSymbol
            $("label.required").prepend('<span class="requiredSymbol">* </span>');

            //init buttons
            $("button, input[type=button], input[type=submit], input[type=[clear]").button();
        },
        requiredLabel: function() {
            $("label.required").prepend('<span class="requiredSymbol">* </span>');
        },
        listSwapper: function() {
            $(".swap input[type='button']").click(function() {
                var arr = $(this).attr("name").split("2");
                var from = arr[0];
                var to = arr[1];
                $("#" + from + " option:selected").each(function() {
                    $("#" + to).append($(this).clone());
                    $(this).remove();
                });
            });
        },
        tableSorterUtil: function(table) {
            var $table = $("#" + table); // tablesorter
            
			if ($table.length) {
				$table.tablesorter({
                	widgets: ['zebra']
				});
				$("#sortableTable tbody tr td").click(function() {
					$('#sortableTable tbody tr').removeClass('selectedRow');
					$(this).parents('tr').addClass('selectedRow');
				},
				function() {
					$(this).parents('tr').removeClass('selectedRow');
				});
			}
        },
        megaHoverOver: function() {
            $(this).find(".sub").stop().fadeTo('fast', 1).show(); //Find sub and fade it in
            (function($) { //Function to calculate total width of all ul's
                jQuery.fn.calcSubWidth = function() {
                    rowWidth = 0; //Calculate row
                    $(this).find("ul").each(function() { //for each ul...
                        rowWidth += $(this).width(); //Add each ul's width together
                    });
                };
            })(jQuery);
            if ($(this).find(".row").length > 0) { //If row exists...
                var biggestRow = 0;
                $(this).find(".row").each(function() { //for each row...
                    $(this).calcSubWidth(); //Call function to calculate width of all ul's
                    //Find biggest row
                    if (rowWidth > biggestRow) {
                        biggestRow = rowWidth;
                    }
                });
                $(this).find(".sub").css({
                    'width': biggestRow
                }); //Set width
                $(this).find(".row:last").css({
                    'margin': '0'
                }); //Kill last row's margin
            } else { //If row does not exist...
                $(this).calcSubWidth(); //Call function to calculate width of all ul's
                $(this).find(".sub").css({
                    'width': rowWidth
                }); //Set Width
            }
        },
        megaHoverOut: function() {
            $(this).find(".sub").stop().fadeTo('fast', 0,
            function() { //Fade to 0 opactiy
                $(this).hide(); //after fading, hide it
            });
        },
        megaConfig: function() {
            var config = {
                sensitivity: 2,
                // number = sensitivity threshold (must be 1 or higher)
                interval: 100,
                // number = milliseconds for onMouseOver polling interval
                over: i.megaHoverOver,
                // function = onMouseOver callback (REQUIRED)
                timeout: 500,
                // number = milliseconds delay before onMouseOut
                out: i.megaHoverOut // function = onMouseOut callback (REQUIRED)
            };
        },
        datePicker: function() {
            $(".dpField").datepicker({
                showOn: "button",
                buttonImage: "images/calendar.gif",
                buttonImageOnly: false
            });
        }
    }
    return i;
})();