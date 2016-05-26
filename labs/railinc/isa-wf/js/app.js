/*-------------------------------------*\
    RailInc - ISA App JS Contents
\*-------------------------------------*/
/*
0. INITIALIZE VARIABLES - variables to store the variables most used in the applications
1. JQUERY FUNCTIONS - extend the capabilities of jQuery
2. JAVASCRIPT FUNCTIONS - pure JS functions, usually utilities
3. DOCUMENT.READY - Once the document has loaded, these commands will be executed
*/

/*-------------------------------------*\
    0. INITIALIZE VARIABLES
\*-------------------------------------*/

var isDirty = this.isDirty || false;
var menuName = "#rail-wizard .nav";
var panelName = "#rail-wizard .wizard-steps";
var hintClass = "hint";
var contextPath = contextPath || ".";
var rail = this.rail || {};
var wizard = this.wizard || {};
var railmarks = {};

/*-------------------------------------*\
    1. JQUERY FUNCTIONS
\*-------------------------------------*/

$.fn.cleanClone = function(count) {"use strict";
    var pattern = /\d/;
    var $this = $(this);
    var match = "";

    // for id

    var objId = $this.attr("id");
    if(objId !== undefined) {
        match = objId.match(pattern);
        $this.attr("id", objId.replace(match, (count)));
    }
    var grpLabelIdx = $this.attr("data-input-group-label");
    if(grpLabelIdx !== undefined) {
        match = grpLabelIdx.match(pattern);
        $this.attr("data-input-group-label", grpLabelIdx.replace(match, (count)));
    }

    // for name
    var strName = $this.attr("name");
    if(strName !== undefined) {
        match = strName.match(pattern);
        $this.attr("name", strName.replace(match, (count)));
    }
    // for for
    var strFor = $this.attr("for");
    if(strFor !== undefined) {
        match = strFor.match(pattern);
        $this.attr("for", strFor.replace(match, (count)));
    }
    // for for
    var strClass = $this.attr("class");
    if(strClass !== undefined && strClass !== "") {
        var reqGroup = /validate\[(.*)?groupRequired\[(.*)\](.*)\]/.exec($this.attr("class"));
        if(reqGroup) {
            match = strClass.match(pattern);
            $this.attr("class", strClass.replace(match, (count)));
        }
    }

    $this.removeClass("ui-state-active");

    return $this;
};

$.fn.cloneItem = function(i, t) {"use strict";
    var $new = $(this).clone();
        $new.hide();
    var $target = $("#" + t + "-list");

    $new.attr("id", t + "-" + i);
    $(".tpa-freq", $new).buttonset();
    if($new.attr("data-tpa-index")) {
        $new.attr("data-tpa-index", i);
    }

    if($new.attr("data-contact-index")) {
        $new.attr("data-contact-index", i);
    }

    //radio & checkboxes
    $('label', $new).each(function() {
        $(this).cleanClone(i);
    });
    //select lists
    $(':input:checkbox, :input:radio', $new).each(function() {
        $(this).removeAttr("checked").cleanClone(i);
    });
    //select lists
    $('select', $new).each(function() {
        $('option:first', $(this)).attr('selected', 'selected').parent('select').cleanClone(i);
    });
    //all others
    $('input[type=text], input[type=hidden], textarea', $new).each(function() {
        $(this).val("").cleanClone(i);
    });

    $target.append($new);
    
    resetCache($mainContent, 'rail-app-container');
    setValidation();
    rail.base.requiredLabel();
    rail.base.enableMaskingAndHinting();

    $new.show();
        
    $.scrollTo( '100%', 800 );

    return $new;
};

/*
 Custom App Validation Rules
 */
(function($) {"use strict";
    if($.validationEngineLanguage !== undefined || $.validationEngineLanguage.allRules !== undefined) {
        $.validationEngineLanguage.allRules["24hrClock"] = {
            "regex" : /^([01]\d|2[0-3])([0-5]\d){0,2}$/,
            "alertText" : "* Please enter the time in HHMM format (based on 24 hour clock)."
        };

        $.validationEngineLanguage.allRules.mark = {
            "regex" : /^[A-Z]{2,4}$/,
            "alertText" : "* Must contain 2 to 4 alphabetic characters specifying the railroad mark."
        };

        $.validationEngineLanguage.allRules.splc = {
            "regex" : /^\d{6}$/,
            "alertText" : "* Full 6 digit SPLC required (please populate any leading or trailing zeros)."
        };

        $.validationEngineLanguage.allRules.r260 = {
            "regex" : /^\d{3}$/,
            "alertText" : "* 3-digit R260 Code required (please populate any leading or trailing 0's)."
        };
    }
})(jQuery);

/*-------------------------------------*\
    2. JAVASCRIPT FUNCTIONS
\*-------------------------------------*/
var appHinting = function() {
    //Custom App Hinting Definitions
};

var appMasking = function() {
    //Custom App Masking Definitions
    $.mask.definitions['@'] = 'Y|y|N|n';
    $(":input.onlyYN", $mainContent).mask('@', {
        placeholder : "-"
    });
    $(":input.mark", $mainContent).mask('**?**', {
        placeholder : "-"
    });
    $(":input.tpaWindow", $mainContent).mask("9999", {
        placeholder : "-"
    });
    $(":input.weight, :input.length", $mainContent).mask("?999999", {
        placeholder : "-"
    });
    $(":input.offset", $mainContent).mask("?99", {
        placeholder : "-"
    });
};

var setValidation = function() {"use strict";
    resetCache($mainContent, 'rail-app-container');
    var $forms = $('form', $mainContent);
    if($forms.length > 0) {
        $forms.validationEngine('detach').validationEngine('attach');
    }
};

/**
 * populates the review page based on form input values for roadmark
 *
 * @param values
 */
var updateMarks = function() {
    "use strict";
    resetCache($mainContent, 'rail-app-container');
    
    var r1 = $("#railroad1", $mainContent).val();
    var r2 = $("#railroad2", $mainContent).val();

    var ckey = "";
    $("#contactFormList0\\.markName option").each(function() {
        ckey += $(this).val();
    });

    var tkey ="";
    $("#tpaFormList0\\.direction option").each(function() {
        var rrs = $(this).val().split(" > ");
        tkey += rrs.join("");
    });

    var isUpdated = (railmarks.key != r1+r2 && (ckey != r1+r2 || tkey != r1+r2+r2+r1));

    if (isUpdated) {
        railmarks = {
            key: r1+r2,
            railroad1 : $("#railroad1", $mainContent).val() ? $("#railroad1", $mainContent).val() : "----",
            railroad2 : $("#railroad2", $mainContent).val() ? $("#railroad2", $mainContent).val() : "----"
        };
        
        $(".tpaDirection", $mainContent).each(function() {
            $(this).empty();
            $(this).append( 
                $('<option />')
                .addClass( 'origin_railroad_tpa_ro')
                .html( railmarks.railroad1 + ' => ' + railmarks.railroad2)
                .val( railmarks.railroad1 + ' > ' + railmarks.railroad2)
            ).append( 
                $('<option />')
                .addClass( 'partner_railroad_tpa_ro')
                .html( railmarks.railroad2 + ' => ' + railmarks.railroad1)
                .val( railmarks.railroad2 + ' > ' + railmarks.railroad1)
            );
        });
    
        $(".contactMarkList", $mainContent).each(function() {
            $(this).empty();
            $(this)
                .append( 
                    $('<option />')
                        .addClass('origin_railroad_contact_ro')
                        .text(railmarks.railroad1)
                        .val(railmarks.railroad1)
                ).append( 
                    $('<option />')
                        .addClass('partner_railroad_contact_ro')
                        .text(railmarks.railroad2)
                        .val(railmarks.railroad2)
                );
        });
    }
 
    resetCache($mainContent, 'rail-app-container');
};

/*-------------------------------------*\
    3. DOCUMENT.READY
\*-------------------------------------*/

$(document).ready(function() {"use strict";
    rail.base.init();
    // list swapper control
    rail.base.listSwapper();
    // table sort
    rail.base.tableUtil("sortableTable");
    // mega menu
    rail.base.megaHoverOver();
    rail.base.megaHoverOut();
    // Set custom configurations for mega menu
    rail.base.megaConfig();
    // app nav menu
    rail.base.applicationNavMenu();
    // datepicker util
    rail.base.datePicker();
    //enable validation - custom rules defined below
    rail.base.enableValidation();

    if(wizard) {
        // Set up the wizards navigation patterns
        wizard.instance.init("isaForm");
        wizard.instance.enableReview();
    }

    //for edit isa functionality
    $(".tpa-freq").buttonset();

    $("#isa-contacts .buttons .next-tab").before('<button class="action blue add-contact">+ New Contact</button>');
    $("#isa-tpas .buttons .next-tab").before('<button class="action blue add-tpa">+ New TPA</button>');

    $(".remove").on("click", function() {
        $(this).closest('.panel').remove();
    });

    $("#cancelIsaCreate").on("click", function(e) {
        e.preventDefault();
        return document.location.href = contextPath + '.';
    });

    $("button.add-tpa").on("click", function(e) {
        e.preventDefault();
        var $newTpa = $("#tpa-list div.tpa-panel:first-child").cloneItem($("#tpa-list > div.panel").length, "tpa");
        $("h3.sectionHeader", $newTpa).html("New Train Plan Addendum");
    });

    $("button.add-contact").on("click", function(e) {
        e.preventDefault();
        var $newContact = $("#contact-list div.contact-panel:first-child").cloneItem($("#contact-list > div.panel").length, "contact");
        $("h3.sectionHeader", $newContact).html("New Contact");
    });

    $("#isaDataTable tbody tr").on("click", function(e) {
        e.preventDefault();
        var path = contextPath + '/main/secure/isa/view/' + $(this).attr("id");
        //var path = contextPath + 'view_isa.html#' + $(this).attr("id");
        if($(this).attr("data-rail-status")){
            path = path + '/' + $(this).attr("data-rail-status");
        }
        document.location.href = path;
    });

    rail.base.tableUtil("isaDataTable");
    
    var tblRowCount = $("#isaDataTable tbody tr").length;
    if(tblRowCount !== 1) {
        $("#rowCount").html("Showing " + tblRowCount + " entries.");
    } else {
        $("#rowCount").html("Showing " + tblRowCount + " entry.");
    }

    $(".backToList").on("click", function(e) {
        e.preventDefault();
        var path = contextPath + '/main/secure/isa/list';
        //var path = contextPath + 'list_isa.html';
        if($(this).attr("data-rail-status")){
            path = path + '/' + $(this).attr("data-rail-status");
        }
        document.location.href = path;
    });
    //for edit Isa functionality
    $(".editISA").on("click", function(e) {
        e.preventDefault();
        if($("#isaId").val()) {
            document.location.href = contextPath + '/main/secure/isa/edit/' + $("#isaId").val();
            //document.location.href = contextPath + 'edit_isa.html#' + $("#isaId").val();
        } else {
            document.location.href = contextPath + '/main/secure/isa/edit/';
            //document.location.href = contextPath + 'edit_isa.html';
        }
    });
    //for isa save functioanlity
    $("#saveISA").on("click", function(e) {
        e.preventDefault();
        if($("form", $mainContent).validationEngine('validate')) {
            isDirty = false;
            $('#draftStatus').val('NO');
            return document.forms.isaForm.submit();
        } else {
            return false;
        }
    });
    //for save isa as draft
    $("#saveISAAsDraft").on("click", function(e) {
        e.preventDefault();
        if($("form", $mainContent).validationEngine('validate')) {
            isDirty = false;
            $('#draftStatus').val('YES');
            return document.forms.isaForm.submit();
        } else {
            return false;
        }
    });

    $("#rail-wizard").on({
        tabsselect : function(e, ui) {
            resetCache($mainContent, 'rail-app-container');

            var currTab = $("#rail-wizard").tabs('option', 'selected');

            if(ui.index !== 0 && currTab === 0) {
                return (isValidationEnabled && $("form", $mainContent).validationEngine('validate') );
            } else {
                if(ui.panel.id === "isa-contacts" || ui.panel.id === "isa-tpas" || ui.panel.id === "wizard-review") {
                    updateMarks();
                }
                resetCache($mainContent, 'rail-app-container');
                return (isValidationEnabled && $("form", $mainContent).validationEngine('hideAll') );
            }
        },
        tabsshow : function(e, ui) {
            resetCache($mainContent, 'rail-app-container');

            var currTab = $("#rail-wizard").tabs('option', 'selected');

            if(ui.index !== 0 && currTab === 0) {
                return (isValidationEnabled && $("form", $mainContent).validationEngine('validate') );
            } else {
                if(ui.panel.id === "isa-contacts" || ui.panel.id === "isa-tpas") {
                    updateMarks();
                }
                resetCache($mainContent, 'rail-app-container');
                return (isValidationEnabled && $("form", $mainContent).validationEngine('hideAll') );
            }
        }
    });
    //for cancel functionality
    $("#cancelIsaEdit").on("click", function(e) {
        e.preventDefault();
        //goto home page
        document.location.href = contextPath + '/';
    });

    rail.base.enableMaskingAndHinting();

    // required field styler
    setValidation();
    rail.base.requiredLabel();
});



