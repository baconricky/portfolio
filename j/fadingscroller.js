var newsArray=new Array();
var i = 0;

// Developers - Insert news stories here

newsArray[i++]='<strong>Recent News:</strong> 7/13/11: <a href="/apps/redirect.apm/about/news/prarchive/2011/Red-Hat-Recognizes-NTT-Communications-with-Cloud-Leadership-Award?rhpage=/index.html/home_news**">Red Hat Recognizes NTT Communications with Cloud Leadership Award</a>';
newsArray[i++]='<strong>Recent News:</strong> 7/12/11: <a href="/apps/redirect.apm/about/news/prarchive/2011/JBoss-Application-Server-y?rhpage=/index.html/home_news**">Red Hat Empowers Developers to Reach New Heights of Productivity with JBoss Application Server 7</a>';
newsArray[i++]='<strong>Recent News:</strong> 7/12/11: <a href="/apps/redirect.apm/about/news/prarchive/2011/Red-Hat-Recognized-with-HP-AllianceONE-Partner-of-the-Year-Award-for-Cloud-Computing-Leadership?rhpage=/index.html/home_news**">Red Hat Recognized with HP AllianceONE Partner of the Year Award for Cloud Computing Leadership</a>';
newsArray[i++]='<strong>Recent News:</strong> 6/23/11: <a href="/apps/redirect.apm/about/news/prarchive/2011/Red-Hat-Enterprise-MRG-2-0-Now-Available-with-Expanded-Performance-Scalability-and-Cloud-Readiness?rhpage=/index.html/home_news**">Red Hat Enterprise MRG 2.0 Now Available with Expanded Performance, Scalability and Cloud Readiness</a>';
newsArray[i++]='<strong>Recent News:</strong> 6/23/11: <a href="/apps/redirect.apm/about/news/prarchive/2011/Red-Hat-Evolves-Cloud-Offerings-with-Private-Cloud-Architecture-Course?rhpage=/index.html/home_news**">Red Hat Evolves Cloud Offerings with Private Cloud Architecture Course</a>';





// No need to edit below this line

/* 
**********************************************
* Fading Scroller- © Dynamic Drive DHTML code library (www.dynamicdrive.com)
* This notice MUST stay intact for legal use
* Visit Dynamic Drive at http://www.dynamicdrive.com/ for full source code
***********************************************
* with minor adjustments made by R. Byars (www.redhat.com)
**********************************************
*/

var delay = 3500; //set delay between message change (in miliseconds)
var maxsteps=50; // number of steps to take to change from start color to endcolor
var stepdelay=30; // time in miliseconds of a single step
// Note: maxsteps*stepdelay will be total time in miliseconds of fading effect
var startcolor= new Array(255,255,255); // start color (red, green, blue)
var endcolor=new Array(51,51,51); // end color (red, green, blue)

var fwidth='720px'; //set scroller width
var fheight='1em'; //set scroller height

var fadelinks=0;  //should links inside scroller content also fade like text? 0 for no, 1 for yes.

var ie4=document.all&&!document.getElementById;
var DOM2=document.getElementById;
var faderdelay=0;
var index=0;


/*Rafael Raposo edited function*/
//function to change content
function changecontent(){
  if (index>=newsArray.length)
    index=0
  if (DOM2){
    document.getElementById("fscroller").style.color="rgb("+startcolor[0]+", "+startcolor[1]+", "+startcolor[2]+")"
    document.getElementById("fscroller").innerHTML=newsArray[index]
    if (fadelinks)
      linkcolorchange(1);
    colorfade(1, 15);
  }
  else if (ie4)
    document.all.fscroller.innerHTML=newsArray[index];
  index++
}

// colorfade() partially by Marcio Galli for Netscape Communications.
// Modified by Dynamicdrive.com

function linkcolorchange(step){
  var obj=document.getElementById("fscroller").getElementsByTagName("A");
  if (obj.length>0){
    for (i=0;i<obj.length;i++)
      obj[i].style.color=getstepcolor(step);
  }
}

/*Rafael Raposo edited function*/
var fadecounter;
function colorfade(step) {
  if(step<=maxsteps) {	
    document.getElementById("fscroller").style.color=getstepcolor(step);
    if (fadelinks)
      linkcolorchange(step);
    step++;
    fadecounter=setTimeout("colorfade("+step+")",stepdelay);
  }else{
    clearTimeout(fadecounter);
    document.getElementById("fscroller").style.color="rgb("+endcolor[0]+", "+endcolor[1]+", "+endcolor[2]+")";
    setTimeout("changecontent()", delay);
	
  }   
}

/*Rafael Raposo's new function*/
function getstepcolor(step) {
  var diff
  var newcolor=new Array(3);
  for(var i=0;i<3;i++) {
    diff = (startcolor[i]-endcolor[i]);
    if(diff > 0) {
      newcolor[i] = startcolor[i]-(Math.round((diff/maxsteps))*step);
    } else {
      newcolor[i] = startcolor[i]+(Math.round((Math.abs(diff)/maxsteps))*step);
    }
  }
  return ("rgb(" + newcolor[0] + ", " + newcolor[1] + ", " + newcolor[2] + ")");
}

if (ie4||DOM2)
  document.write('<div id="fscroller" style="width:'+fwidth+';height:'+fheight+'"></div>');

if (window.addEventListener)
window.addEventListener("load", changecontent, false)
else if (window.attachEvent)
window.attachEvent("onload", changecontent)
else if (document.getElementById)
window.onload=changecontent
