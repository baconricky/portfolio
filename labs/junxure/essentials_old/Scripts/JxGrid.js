function SaveGridState(gridID, gridSaveID) {
    var gridInfo = $("#" + gridID).data("tGrid");
    debugger;
    $.ajax({
        url: '/Grid/Grid/SaveGridState',
        type: "POST",
        data: { gridID: gridSaveID, colWidths: GetColWidths(gridID), sort: gridInfo.orderBy, groupBy: gridInfo.groupBy, filters: gridInfo.filterBy, pageSize: gridInfo.pageSize },
        success: function (data) {
            //alert(data);
            $("#" + gridID + "_SaveTemplateResult").html(data);
            $("#" + gridID + "_SaveTemplateResult").css("display", "block");
            $("#" + gridID + "_SaveTemplateResult").delay(3000).fadeOut(2000);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("error: " + thrownError);
        }
    });
}

function GetColWidths(gridID) {
    var gridInfo = $("#" + gridID).data("tGrid");
    var cols = $(".t-header");

    var i = 0;
    var retVal = "";
    for (i = 0; i < cols.length; i++) {
        if (cols[i].scope == "col") {
            var links = $(cols[i]).children(".t-link");
            var colHeader = links[0].innerText;

            if (colHeader.indexOf("(") > -1)
                colHeader = colHeader.substring(0, colHeader.indexOf("("));
            var gridCol = gridInfo.columnFromTitle(colHeader);
            if (gridCol != null) {
                retVal += gridCol.member + ":" + $(cols[i]).width() + ";";
            }
        }
    }

    return retVal;
}