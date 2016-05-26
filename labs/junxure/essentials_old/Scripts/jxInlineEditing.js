//   jxInlineEditing version 2.0
//   11/01/2011 Chris Jarvis
//
//   History
//   Ver     Date         By              Change
//   X-01    03/08/2012   Page Horton     Added drafting rtns
/// <reference path="../jquery-1.7.1.js" />

function NavigateView(target, url) {
    $('#' + target).html('<center><img alt="Updating...Please wait" src="../../Content/Images/ajax-loader.gif" /></center>');

    $('#' + target ).load(url, {cache:false}, function (response, status, xhr) {
        if (status == "error") {
            alert("Error loading pView, Error " + response);
        }
    });
}

// Begin X-01
function HandleDraft($this,modelName) {
    var thisStyl = $this.style;
    var currColor = thisStyl.backgroundColor;
    thisStyl.backgroundColor = "#F9F99F";
    $.ajax({
        cache: false,
        url: "/Templates/UpdateDraft",
        data: { name: $this["id"], value: $this.value, modelname: modelName },
        success: function (data) {
            thisStyl.backgroundColor = currColor;
        },
        error: function (data) {
            thisStyl.backgroundColor = "#FF0000";
        }
    });
}
// End X-01

function EscapeJxId(jxId) {
    return '#' + jxId.replace(/(:|\.)/g, '\\$1');
}

function SubmitForm(target) {
    $('#' + target + " > form").live("submit", function (event) {
        event.preventDefault();
        var form = $(this);

        $.ajax({
            cache: false,
            url: form.attr('action'),
            type: "POST",
            data: form.serialize(),
            success: function (data) {
                if (data.Success) {
                    $("#resultSpan").html("Saved Successfully");
                }
                else if (data.ConcurrencyError) {
                    if (data.IsPopup) {
                        popup('Concurrency Form', '/Concurrency/ResolveConcurrencyPopup?TableName=RevenueModel', .8, .8);
                    }
                    else {
                        $("#editDiv").html(data.partialHtml);
                    }
                }
            },
            error: function (jqXhr, textStatus, errorThrown) {
                alert("Error '" + jqXhr.status + "' (textStatus: '" + textStatus + "', errorThrown: '" + errorThrown + "')");
            }
        });
    });

}

function MarkDirty(control) {
    control.setAttribute("isDirty", "true");
}

function MarkClean(control) {
    control.setAttribute("isDirty", "false");
}

 