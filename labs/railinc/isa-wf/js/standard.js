/*-------------------------------------*\
    RailInc 2012 Standard JS Contents
\*-------------------------------------*/
/*
0. INITIALIZE VARIABLES - variables to store the variables most used in the applications
1. JQUERY FUNCTIONS - extend the capabilities of jQuery
2. JAVASCRIPT FUNCTIONS - pure JS functions, usually utilities
3. RAIL BASE - Object that contains the base functionality of our applications
*/

/*-------------------------------------*\
    0. INITIALIZE VARIABLES
\*-------------------------------------*/

var rail = this.rail || {};
var images = this.images || "/images";
var $mainContent = $("#rail-app-container");
var isHeaderLocked = false
var isDirty = false;
var isValidationEnabled = false;
var hintClass = "hint";
var altColor = 'even';

/*-------------------------------------*\
    1. JQUERY FUNCTIONS
\*-------------------------------------*/

$.fn.addRequired = function() {"use strict";
    var id = $(this).attr("id") ? $(this).attr("id") : $(this).attr("name");
    var $req = $("<span/>").addClass('requiredSymbol', $mainContent).append("* ");
    var $src = $("label[for = '" + id + "']", $mainContent);
    $src.children(".requiredSymbol").remove();
    $src.prepend($req);
};

/*-------------------------------------*\
    2. JAVASCRIPT FUNCTIONS
\*-------------------------------------*/

var applyRequiredLabels = function() {"use strict";
    var $req = $("<span/>").addClass('requiredSymbol').append("* ");

    $("label[class*=required]", $mainContent).each(function() {
        $(this).children(".requiredSymbol").remove();
        $(this).prepend($req);
    });

    $(":input[data-input-group-label=*]", $mainContent).each(function() {
        var $src = $("label[for=" + $(this).parent("dd").attr("id") + "]", $mainContent);
        $src.children(".requiredSymbol").remove();
        $src.prepend($req);
    });
    $(":input[class*=groupRequired], :input[class*=required]", $mainContent).each(function() {
        var getRules = /validate\[(.*)\]/.exec($(this).attr("class"));

        if(getRules) {
            $(this).addRequired();
        }
    });

    $('.ui-buttonset').find(".requiredSymbol").remove();
};

var resetCache = function(src, tgt) {
    src = $("#" + tgt);
};

/*-------------------------------------*\
    3. RAIL BASE
\*-------------------------------------*/

rail.base = (function() {"use strict";
    var i = {
        options : {},
        init : function() {
            $("input[readonly], select[readonly]").addClass("disabled");
            
            $(':input[class~="uc"]').on("change", function() { 
                var index = $(':input[class~="uc"]').index(this);
                if ($(this).val() !== '') {
                    var $v = $(':input[class~="uc"]').eq(index).val();
                    $(':input[class~="uc"]').eq(index).val( $v.toUpperCase() );
                }
            });
            
            $(':input:first', $mainContent).focus().trigger('change').scrollTo( 0 );
        },
        enableValidation : function() {
            isValidationEnabled = true;

            $("form", $mainContent).on("submit", function() {
                return $(this).validationEngine('validate');
            });
            
            $("form", $mainContent).validationEngine('init');
        },
        enableMaskingAndHinting : function() {
           resetCache($mainContent, 'rail-app-container');
            
            var $hinted = $(":input[placeholder]", $mainContent);

            if (typeof appMasking === 'function') {
                //update app specific masking while we're at it
                appMasking();
            }
                
            if (typeof appHinting === 'function') {
                //update app specific masking while we're at it
                appHinting();
            }
                

            $hinted.on({
                change : function(e) {
                    $(this).removeClass(hintClass);
                    if($.trim($(this).val()) === ($(this).attr('placeholder'))) {
                        $(this).addClass(hintClass);
                    }
                },
                focus : function(e) {
                    $(this).removeClass(hintClass);
                    if($.trim($(this).val()) === ($(this).attr('placeholder'))) {
                        $(this).addClass(hintClass);
                    }
                    this.select();
                },
                blur : function(e) {
                    $(this).removeClass(hintClass);
                    if($.trim($(this).val()) === ($(this).attr('placeholder'))) {
                        $(this).addClass(hintClass);
                    }
                }
            }).coolinput({
                blurClass : hintClass,
                useHtml5 : false,
                clearOnFocus : true,
                clearOnSubmit : true
            }).each(function(e) {
                $(this).removeClass(hintClass);
                if($.trim($(this).val()) === ($(this).attr('placeholder'))) {
                    $(this).addClass(hintClass);
                }
            });

            $(":input.splc", $mainContent).mask('999999', {
                placeholder : "-"
            });
            $(":input.r260", $mainContent).mask('999', {
                placeholder : "-"
            });
            $(":input.mark", $mainContent).mask("aa?aa", {
                placeholder : "-"
            });
            // date fields
            $(":input.dpField", $mainContent).mask("99/99/9999", {
                placeholder : "-"
            });
            // phone fields
            $(":input.phone", $mainContent).mask("999-999-9999", {
                placeholder : "-"
            });
        },
        requiredLabel : function() {
            applyRequiredLabels();
        },
        warnBeforeLeave : function(msg) {
            /**
            $mainContent.on("change", ":input", function() {
                isDirty = true;
            });

            $("form").submit(function() {
                window.onbeforeunload = function(e) {
                    e.preventDefault();
                    if(isDirty) {
                        $("#dialog-confirm").attr("title", "ISA not saved");
                        $("#dialog-confirm .msgContent").html(msg);

                        $("#dialog-confirm").dialog({
                            resizable : true,
                            height : 140,
                            modal : true,
                            buttons : {
                                "It's ok" : function() {
                                    return true;
                                },
                                "I'll fix that" : function() {
                                    $(this).dialog("close");
                                }
                            }
                        });
                    } else {
                        return true;
                    }
                };
            });
            **/
        },
        listSwapper : function() {
            $(".swap input[type = 'button']").on("click", function() {
                var arr = $(this).attr("name").split("2");
                var from = arr[0];
                var to = arr[1];
                $("#" + from + " option:selected").each(function() {
                    $("#" + to).append($(this).clone());
                    $(this).remove();
                });
            });
        },
        megaHoverOver : function() {
            $(this).find("#rail-launch-pad").stop().fadeTo('fast', 1).show();
            var rowWidth = 0;

            //Find sub and fade it in
            (function($) {
                //Function to calculate total width of all ul's
                $.fn.calcSubWidth = function() {
                    //Calculate row
                    $(this).find("ul").each(function() {//for each ul...
                        rowWidth += $(this).width();
                        //Add each ul's width together
                    });
                };
            })(jQuery);

            if($(this).find(".row").length > 0) {//If row exists...

                var biggestRow = 0;

                $(this).find(".row").each(function() {//for each row...
                    $(this).calcSubWidth();
                    //Call function to calculate width of all ul's
                    //Find biggest row
                    if(rowWidth > biggestRow) {
                        biggestRow = rowWidth;
                    }
                });

                $(this).find("#rail-launch-pad").css({
                    'width' : biggestRow
                });
                //Set width
                $(this).find(".row:last").css({
                    'margin' : '0'
                });
                //Kill last row's margin
            } else {//If row does not exist...
                $(this).calcSubWidth();
                //Call function to calculate width of all ul's
                $(this).find(".sub").css({
                    'width' : rowWidth
                });
                //Set Width
            }
        },
        megaHoverOut : function() {
            $(this).find("#rail-launch-pad").stop().fadeTo('fast', 0, function() {//Fade to 0 opactiy
                $(this).hide();
                //after fading, hide it
            });
        },
        megaConfig : function() {
            var config = {
                sensitivity : 2, // number = sensitivity threshold (must be 1 or higher)
                interval : 100, // number = milliseconds for onMouseOver polling interval
                over : i.megaHoverOver, // function = onMouseOver callback (REQUIRED)
                timeout : 500, // number = milliseconds delay before onMouseOut
                out : i.megaHoverOut // function = onMouseOut callback (REQUIRED)
            };

            $("#rail-launch-pad").css({
                'opacity' : '0'
            });
            //Fade sub nav to 0 opacity on default
            $("#util-nav li").hoverIntent(config);
            //Trigger Hover intent with custom configurations
        },
        applicationNavMenu : function() {
            $('#rail-app-nav').superfish({
                delay : 100,
                pathClass : 'current',
                speed : 'fast'
            });
        },
        datePicker : function() {
            var img = images ? images + "/calendar.gif" : "/images/calendar.gif";
            $(".dpField").datepicker({
                showOn : "both",
                buttonImage : img,
                buttonImageOnly : true
            });
        },
        checkButtons : function() {
            $('button,input[type=button],input[type=submit]').each(function() {
                if(!$(this).hasClass('button')) {
                    $(this).addClass("button");
                }
            });
        },
        accordion : function(target) {
            var $target = $("#" + target);
            $("h3", $target).html('<a href = "#">' + $("h3", $target).html() + "</a>");

            //jQuery UI needs to be loaded for this to work!
            $target.accordion({
                collapsible : true,
                clearStyle : true,
                active : 1
            });
        },
        lockHeader : function() {
            isHeaderLocked = true;
        },
        selectableTable : function(table, selectAll, selectId, valueIdx) {
            var showSelectAll = selectAll ? selectAll : false;
            selectId = selectId ? selectId : 'checkbox';
            valueIdx = valueIdx ? valueIdx : 1;

            var $table = $("#" + table);
            // tablesorter

            var $header = $("thead tr", $table).prepend($('<th class = "selectHeader"></th>'));

            if(showSelectAll) {
                $("th.selectHeader").append($('<input />').attr({
                    name : 'checkbox-select-all'
                }).attr({
                    id : 'checkbox-select-all'
                }).attr({
                    type : 'checkbox'
                }));
            }

            //add checkbox to rows in the body
            var ct = 1;
            $("tbody tr", $table).each(function() {
                var $this = $(this), $chkVal = $('td:eq(' + valueIdx + ')', $this).html();

                $this.prepend($('<td />').append($('<input />').attr({
                    id : selectId + '-' + ct
                }).attr({
                    name : selectId + '-' + ct
                }).attr({
                    value : $chkVal
                }).attr({
                    type : 'checkbox'
                })));
                ct++;
            });

            $("#checkbox-select-all").on("click", function() {
                var $checkboxes = $("tbody tr td input:checkbox", $table);

                if($(this).is(":checked")) {
                    $checkboxes.each(function() {
                        $(this).prop('checked', true).parents("tr").addClass("selectedRow");
                    });
                } else {
                    $checkboxes.each(function() {
                        $(this).prop('checked', false).parents("tr").removeClass("selectedRow");

                    });
                }
            });
        },
        tableUtil: function(tableId) {
            var $table = $("#" + tableId);
            
            if ($table.hasClass("tablesorter")) {
                i.tableSorterUtil($table);
            } else {
                i.tableStyleUtil($table);
            }
            
            var target = $(".rowCount", $table.parent());
            var count = $('tbody tr', $table).length;
            var countMsg = "";
            
            if(count !== 1 && target) {
                countMsg = "Showing " + count + " entries.";
            } else {
                countMsg = "Showing " + count + " entry.";
            }

            if (target) {
                target.html(countMsg);
            } else {
                $table.before($("<div />").addClass('rowCount').append(countMsg));
            }
        },
        tableStyleUtil: function(tableObj) {
            var $tbody = $('tbody', tableObj);
            $('tr:odd', $tbody).addClass('dark');
            
            $('td, :radio, :checkbox', $tbody).on("click", function() {
                var $row = $(this).parents('tr'), $select = $(":radio, :checkbox", $row);

                if($select.is(':checked')) {
                    $select.attr('checked', false);
                    $row.removeClass("selectedRow");
                } else {
                    $select.attr('checked', true);
                    $row.addClass("selectedRow");
                }
            });
        },
        tableSorterUtil : function(tableObj) {
            // tablesorter

            if(tableObj.length) {
                if(isHeaderLocked) {
                    tableObj.fixedHeaderTable({
                        altClass : altColor
                    });
                }

                $("th", tableObj).each(function() {
                    /*
                    $(this).on("click", function() {
                        var idx = $(this).index();
                        $("tr", $(this).parent('table')).each(function() {
                            $("td").removeClass("headerSort");
                            $("td").eq(idx).addClass("headerSort");
                        });
                    });
                    */
                    
                    $(this).width( $(this).width() + 19 );
                });
                
                tableObj.tablesorter({
                    widgets : ['zebra']
                });
            }
        }
    };
    return i;
}
)();
