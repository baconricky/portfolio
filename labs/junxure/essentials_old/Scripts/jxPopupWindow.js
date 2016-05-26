function popup(title, url) {
    popup(title, url, .8, .8);
}

function popup(title, url, winHeight, winWidth) {

    if (!document.getElementById("overlay")) {


        var myWidth = 0, myHeight = 0;
        if (typeof (window.innerWidth) == 'number') {
            //Non-IE
            myWidth = window.innerWidth;
            myHeight = window.innerHeight;
        } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
            //IE 6+ in 'standards compliant mode'
            myWidth = document.documentElement.clientWidth;
            myHeight = document.documentElement.clientHeight;
        } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
            //IE 4 compatible
            myWidth = document.body.clientWidth;
            myHeight = document.body.clientHeight;
        }


        var divElm = document.createElement("div");
        divElm.setAttribute("id", "overlay");
        document.body.appendChild(divElm);
        var divSty = document.getElementById("overlay").style;
        divSty.display = "none";
        divSty.position = "absolute";
        divSty.left = "0px"; divSty.top = "0px"; divSty.width = document.documentElement.scrollWidth + "px"; divSty.height = document.documentElement.scrollHeight + "px";
        divSty.zIndex = 1000;

        // mask panel to "modal" the screen
        var divinner = document.createElement("div");
        divinner.setAttribute("id", "maskPanel");
        divElm.appendChild(divinner);
        var divSty = document.getElementById("maskPanel").style;
        divSty.position = "absolute";
        divSty.left = "0px"; divSty.top = "0px"; divSty.width = document.documentElement.scrollWidth + "px"; divSty.height = document.documentElement.scrollHeight + "px";
        divSty.backgroundColor = "#000"; divSty.filter = "alpha(opacity=25)"; divSty.opacity = ".25";

        var dsh = document.documentElement.scrollHeight;
        var dch = document.documentElement.clientHeight;
        var dsw = document.documentElement.scrollWidth;
        var dcw = document.documentElement.clientWidth;

        var bdh = (dsh > dch) ? dsh : dch;
        var bdw = (dsw > dcw) ? dsw : dcw;

        // Shadow panel
        var divsp = document.createElement("div");
        divsp.setAttribute("id", "shadowPanel");
        divElm.appendChild(divsp);
        var divSty = document.getElementById("shadowPanel").style;
        divSty.position = "absolute";
        divSty.width = dcw * winWidth + "px"; divSty.height = dch * winHeight + 30 + "px"; divSty.left = 5 + (dcw / 2 - (dcw * winWidth / 2)) + "px"; divSty.top = 5 + (dch / 2 - (dch * winHeight / 2)) + "px";
        divSty.backgroundColor = "#000"; divSty.filter = "alpha(opacity=20)"; divSty.opacity = ".20";

        // Window base panel
        var divinner = document.createElement("div");
        divinner.setAttribute("id", "contentPanel");
        divElm.appendChild(divinner);
        var divInnerSty = document.getElementById("contentPanel").style;
        divInnerSty.position = "absolute";
        divInnerSty.width = dcw * winWidth + "px"; divInnerSty.height = dch * winHeight + "px"; divInnerSty.left = dcw / 2 - (dcw * winWidth / 2) + "px"; divInnerSty.top = dch / 2 - (dch * winHeight / 2) + "px";
        divInnerSty.zIndex = 1000;
        divInnerSty.border = "1 solid black"; divSty.padding = "5px";

        // Window container
        var windowfrm = document.createElement("table");
        windowfrm.setAttribute("id", "frameOfWindow");
        divinner.appendChild(windowfrm);
        frmStyl = document.getElementById("frameOfWindow");
        frmStyl.style.width = "100%"; frmStyl.style.height = "100%"; frmStyl.style.left = "0px"; frmStyl.style.top = "0px";
        frmStyl.style.borderStyle = "groove"; frmStyl.style.borderWidth = "medium"; frmStyl.style.borderColor = "#666666";
        frmStyl.cellspacing = 0; frmStyl.border = 0; frmStyl.cellpadding = 0;

        var tblRow = document.createElement("tr");
        tblRow.setAttribute("id", "trFirst");
        windowfrm.appendChild(tblRow);
        var tblRow = document.getElementById("trFirst");
        tblRow.style.height = "22px";

        var tbltd1 = document.createElement("td");
        tbltd1.setAttribute("id", "td1");
        tblRow.appendChild(tbltd1);
        var tbltd1 = document.getElementById("td1");
        tbltd1.style.backgroundColor = "Blue";
        tbltd1.align = "center";
        tbltd1.innerHTML = "<span style='width: 100%; font-size: medium; color: #FFFFFF; text-align: center'>" + title + "</span>";

        var tblRow = document.createElement("tr");
        windowfrm.appendChild(tblRow);
        var tbltd2 = document.createElement("td");
        tbltd2.setAttribute("id", "td2");
        tblRow.appendChild(tbltd2);
        tbltd2 = document.getElementById("td2");
        tbltd2.style.height = "100%"; tbltd2.style.width = "100%"; tbltd2.valign = "top";

        var frmWindow = document.createElement("iframe");
        frmWindow.setAttribute("id", "frmWindow");
        frmWindow.setAttribute("src", url);
        frmWindow.setAttribute("onclose", "javascript:document.getElementById('overlay').style.Visiblity='hidden';");
        tbltd2.appendChild(frmWindow);
        frmStyl = document.getElementById("frmWindow").style;
        frmStyl.backgroundColor = "white";
        frmStyl.width = "100%"; frmStyl.height = "100%"; frmStyl.left = "0px"; frmStyl.top = "0px";

        var winpanel = document.getElementById("overlay").style;
        winpanel.display = winpanel.display == "none" ? "" : "none";
    }
    else {
        var dch = document.documentElement.clientHeight;
        var dcw = document.documentElement.clientWidth;

        var divSty = document.getElementById("shadowPanel").style;
        divSty.width = dcw * winWidth + "px"; divSty.height = dch * winHeight + 30 + "px"; divSty.left = 5 + (dcw / 2 - (dcw * winWidth / 2)) + "px"; divSty.top = 5 + (dch / 2 - (dch * winHeight / 2)) + "px";

        var divInnerSty = document.getElementById("contentPanel").style;
        divInnerSty.width = dcw * winWidth + "px"; divInnerSty.height = dch * winHeight + "px"; divInnerSty.left = dcw / 2 - (dcw * winWidth / 2) + "px"; divInnerSty.top = dch / 2 - (dch * winHeight / 2) + "px";

        window.frames["frmWindow"].location.href = url;
        window.frames["frmWindow"].location.reload(true);
        setTimeout("var winpanel = document.getElementById('overlay').style; winpanel.display = winpanel.display == 'none' ? '' : 'none';", 500);
    }
}

function generateUniqueId() {
    var result, i, j;
    result = '';
    for (j = 0; j < 32; j++) {
        if (j == 8 || j == 12 || j == 16 || j == 20)
            result = result + '-';
        i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
        result = result + i;
    }
    return result
}

function closePopup() {
    var overlayChild = window.parent.document.getElementById('overlay');
    overlayChild.parentNode.removeChild(overlayChild);
}