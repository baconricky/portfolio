/*-------------------------------------*\
    RailInc 2012 Wizard JS
\*-------------------------------------*/
/*

Prerequisites: 
* jQuery and jQuery UI - found in jquery.min.js
* Standard railinc js library - standard.js

Contents:
0. INITIALIZE VARIABLES - variables to store the variables most used in the applications
1. JAVASCRIPT FUNCTIONS - pure JS functions, usually utilities
2. WIZARD - Object that contains the base functionality of our applications
*/
/*-------------------------------------*\
    0. INITIALIZE VARIABLES
\*-------------------------------------*/
var wizard = this.wizard || {};
var $wizardContent = $('#rail-wizard');
var $wizardNav = $(".ui-tabs-nav", $wizardContent); // cache wizard nav
/*-------------------------------------*\
    1. JAVASCRIPT FUNCTIONS
\*-------------------------------------*/

var buildReview = function () {
        resetCache($wizardContent, 'rail-wizard');

        var $steps = $('div.wizard-step:not("#wizard-review")', $wizardContent);
        var $review = $('#review-content').empty();

        $steps.each(function (idx, step) {
            // ws == wizard-step
            var $wizardContents = $(this).clone();

            $wizardContents.removeAttr("id").removeClass("panel wizard-step ui-tabs-hide ui-tabs-panel ui-widget-content ui-corner-bottom").addClass('panel');

            $("[id]", $wizardContents).removeAttr("id");

            $("label", $wizardContents).each(function () {
                $(this).removeAttr("for");
            });

            $(".ui-buttonset", $wizardContents).each(

            function () {
                $(this).addClass("review-buttonset").removeClass("ui-buttonset");
                $("span.ui-button-text", $(this)).each(function () {
                    var $this = $(this);
                    var $label = $this.parent();
                    var $container = $label.parent();
                    var $div = $("<div />").addClass("review-buttonset");
                    var $button = $("<div />").addClass("review-button");

                    $button.html("<p>" + $this.html() + "</p>");

                    if ($label.hasClass("ui-state-active")) {
                        $button.addClass("review-button-active");
                    }

                    $container.replaceWith($button);
                });
            });

            $("em, input[type=hidden], input[type=button], button, img, .controlBar, .buttons", $wizardContents).remove();

            $("input[type=checkbox],input[type=radio]", $wizardContents).each(function () {
                var $label = $('p label[for="' + $(this).attr("id") + '"]');
                if ($(this).is(':checked')) {
                	$label.addClass("on");
                    $(this).replaceWith($label);
                } else {
                    $(this).replaceWith($label);
                }
            });

            $('select :selected', $wizardContents).each(function () {
                var t = $(this).text();
                $(this).parent().after(t);
                $(this).parent().remove();
            });

            $(":input[type=text], textarea", $wizardContents).each(function () {
                var value = " ";
                if ($(this).val()) {
                    value = $(this).val();
                } else if ($(this).text()) {
                    value = $(this).text();
                }

                $(this).after(value);
                $(this).remove();
            });

            $review.append($wizardContents);
        });
    };

/*-------------------------------------*\
    3. WIZARD
\*-------------------------------------*/
wizard.instance = (function () {
    "use strict";
    var i = { // functions
        init: function (form_id) {
            var $form = $("#" + form_id);
            var $tabs = $wizardContent.tabs();

            $(".ui-tabs-panel").each(

            function (i) {
                var totalSize = $(".ui-tabs-panel").size() - 1;
                var $tabCtlBar = $("<div/>").addClass("buttons");
                var prev = i - 1;
                var next = i + 1;

                $tabCtlBar.append('<div class="leftSide"><button class="prev-tab mover" rel="' + prev + '">&#171; Prev</button></div>').append('<div class="rightSide"><button class="next-tab mover" rel="' + next + '">Next &#187;</button></div>');

                if (i === 0) { // first tab
                    $(".prev-tab", $tabCtlBar).hide();
                }
                if (i === totalSize) { // last tab
                    $(".next-tab", $tabCtlBar).hide();
                }
                $(this).append($tabCtlBar);
                $(this).append($("<div/>").addClass("clear"));
            });

            $('.next-tab, .prev-tab').on("click", function (e) {
                $tabs.tabs("select", parseInt($(this).attr("rel"), 10));
                e.preventDefault();
            });

            $("#rail-wizard-loading").hide();
            $wizardContent.show();
        },
        enableReview: function () {
            $wizardContent.on('tabsshow', function (event, ui) {
                if (ui.panel.id === "wizard-review") {
                    buildReview();
                }
            });
        }
    };

    return i;
})();