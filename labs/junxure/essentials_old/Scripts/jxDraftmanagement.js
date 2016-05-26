
function ResetDraft(root, url, modelName) {
    $.ajax({
        cache:false,
        url: "/JxCore/CancelChangeDraftModel",
        data: { modelName: modelName },
        success: function (data) {
            Success(root, url);
        },
        error: function (data) {
            Failure();
        }
    });
}

function CommitDraft(root, url, modelName) {
    $.ajax({
        cache: false,
        url: "/JxCore/CommitModelDraft",
        data: { modelName: modelName },
        success: function (data) {
            alert("Update complete!");
            Success(root, url);
        },
        error: function (data) {
            Failure();
        }
    });
}

function Success(root, url) {
    NavigateView(root, url);
}

function Failure() {
    alert("An error occurred while processing your request.");
    window.location.reload();
}


function HandleDraft($this, modelName) {
    var thisStyl = $this.style;
    var currColor = thisStyl.backgroundColor;
    thisStyl.backgroundColor = "#F9F99F";
    $.ajax({
        cache: false,
        url: "/JxCore/UpdateDraft",
        data: { name: $this["id"], value: $this.value, modelname: modelName },
        success: function (data) {
            thisStyl.backgroundColor = currColor;
        },
        error: function (data) {
            thisStyl.backgroundColor = "#FF0000";
        }
    });
}

function HandleChosenField(control, data, modelName) {
    if (control.type == 'select-one') {
        HandleDraft(control, modelName);
    }
    if (control.type == 'select-multiple') {
        control.value = control[data.index].value;
        HandleDraft(control, modelName);
    }
}

function RegisterDraft(containerID, modelName) {
    $(document).ready(function () {
        var parentContainer = $("#" + containerID);

        $(".JxEditorFor", parentContainer).blur(function () {
            var $this = $(this)[0];
            HandleDraft($this, modelName);
        });

        $(".JxTextAreaFor", parentContainer).blur(function () {
            var $this = $(this)[0];
            HandleDraft($this, modelName);
        });

        $(".JxDropDownList", parentContainer).blur(function () {
            var $this = $(this)[0];
            HandleDraft($this, modelName);
        });

        $("input.datefield", parentContainer).each(function () {
            $(this).datepicker({
                yearRange: 'c-110:c',
                showOtherMonths: true,
                selectOtherMonths: true,
                changeMonth: true,
                changeYear: true,
                dateFormat: 'mm/dd/yy',
                onClose: function (dateText, inst) {
                    var $this = $(this)[0];
                    HandleDraft($this, modelName);
                }
            });
        });


        $("#" + containerID + " select.chzn-select").chosen({ disable_search_threshold: 5, width: "inherit" }).change(function (event, data) { HandleChosenField($(this)[0], data, modelName); });
        $("#" + containerID + " select.chzn-select-deselect").chosen({ allow_single_deselect: true });
    });
}