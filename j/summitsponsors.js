Array.prototype.hasMember=function(sponsorItem){
var i=this.length;
while(i-->0)if(sponsorItem==this[i])return 1;
return 0
};

function ranSponsor(){
var sponsors=new Array()
sponsors[0]='<a href="http://www.centeris.com" rel="external"><img src="/g/summit/2007/logo_centeris.png" /></a>'
sponsors[1]='<a href="http://www.amd.com/us-en" rel="external"><img src="/g/summit/2007/logo_amd.png" /></a>'
sponsors[2]='<a href="http://www.xensource.com" rel="external"><img src="/g/summit/2007/logo_xensource.png" /></a>'
sponsors[3]='<a href="http://www.ingres.com" rel="external"><img src="/g/summit/2007/logo_ingres.png" /></a>'
sponsors[4]='<a href="http://www.ibm.com/us" rel="external"><img src="/g/summit/2007/logo_ibm.png" /></a>'
sponsors[5]='<a href="http://www.steeleye.com" rel="external"><img src="/g/summit/2007/logo_steeleye.png" /></a>'
sponsors[6]='<a href="http://www.zmanda.com" rel="external"><img src="/g/summit/2007/logo_zmanda.png" /></a>'
sponsors[7]='<a href="http://www.centrify.com" rel="external"><img src="/g/summit/2007/logo_centrify.png" /></a>'
sponsors[8]='<a href="http://www.dlt.com" rel="external"><img src="/g/summit/2007/logo_dlt.png" /></a>'
sponsors[9]='<a href="http://www.platform.com" rel="external"><img src="/g/summit/2007/logo_platform.png" /> </a>'
sponsors[10]='<a href="http://www.enterprisedb.com" rel="external"><img src="/g/summit/2007/logo_enterprisedb.png" /></a>'
sponsors[11]='<a href="http://www.hp.com" rel="external"><img src="/g/summit/2007/logo_hp.png" /></a>'
sponsors[12]='<a href="http://www.blackducksoftware.com" rel="external"><img src="/g/summit/2007/logo_blackduck.png" /></a>'
sponsors[13]='<a href="http://www.zimbra.com" rel="external"><img src="/g/summit/2007/logo_zimbra.png" /></a>'
sponsors[14]='<a href="http://www.dell.com" rel="external"><img src="/g/summit/2007/logo_dell.png" /></a>'
sponsors[15]='<a href="http://www.alfresco.com" rel="external"><img src="/g/summit/2007/logo_alfresco.png" /></a>'
sponsors[16]='<a href="http://www.carahsoft.com" rel="external"><img src="/g/summit/2007/logo_carahsoft.png" /></a>'
sponsors[17]='<a href="http://www.groundworkopensource.com" rel="external"><img src="/g/summit/2007/logo_groundwork.png" /></a>'
sponsors[18]='<a href="http://www.jaspersoft.com" rel="external"><img src="/g/summit/2007/logo_jaspersoft.png" /></a>'
sponsors[19]='<a href="http://www.mysql.com" rel="external"><img src="/g/summit/2007/logo_mysql.png" /></a>'
sponsors[20]='<a href="http://www.scalix.com" rel="external"><img src="/g/summit/2007/logo_scalix.png" /></a>'
sponsors[21]='<a href="http://www.tresys.com" rel="external"><img src="/g/summit/2007/logo_tresys.png" /></a>'
sponsors[22]='<a href="http://www.unisys.com" rel="external"><img src="/g/summit/2007/logo_unisys.png" /></a>'
sponsors[23]='<a href="http://www.zenoss.com" rel="external"><img src="/g/summit/2007/logo_zenoss.png" /></a>'
sponsors[24]='<a href="http://www.symantec.com" rel="external"><img src="/g/summit/2007/logo_symantec.png" /></a>'
sponsors[25]='<a href="http://www.sugarcrm.com" rel="external"><img src="/g/summit/2007/logo_sugarcrm.png" /></a>'

var a=[];
function randOrd(){return (Math.round(Math.random())-0.5); }
sponsors.sort(randOrd);
a = sponsors.splice(0,4);
document.write(a.join('&nbsp;'))
}

ranSponsor()

function externalLinks() {
 if (!document.getElementsByTagName) return;
 var anchors = document.getElementsByTagName("a");
 for (var i=0; i<anchors.length; i++) {
   var anchor = anchors[i];
   if (anchor.getAttribute("href") &&
       anchor.getAttribute("rel") == "external")
     anchor.target = "_blank";
 }
}
window.onload = externalLinks;
