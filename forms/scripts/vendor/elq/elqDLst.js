// Copyright Eloqua Corporation.
//
// Domain Checking Settings
//
// The domain checking functionality explicitly checks the domain of every redirect, which uses the Eloqua system.
// If the domain resides in the safe list, the redirect will happen as expected, but if the domain is not found, the
// user is redirected to a page which informs them that the link could not be verified as safe.
//
// Required:
// To enable this functionality, the variable elqIC must be set to true, and a list of safe domains must be set in the
// variable elqDL (separated by the # symbol).
//
// Optional:
// If you wish to change the page that the user is redirected to upon finding an unsafe domain, you may specify a
// fully qualified URL in the variable elqDURL.  See example below.
//
// Testing:
// To test that everything is working properly, you may use the links below. To ensure a proper test, replace www.mydomain.com
// in the first link with your main domain. The first one should redirect you to your default homepage, and the second one should
// redirect you to the default unsafe page.
//
// http://www.mydomain.com/elqNow/elqRedir.htm?ref=http://www.mydomain.com
// http://www.mydomain.com/elqNow/elqRedir.htm?ref=http://www.unsafedomain.com/somefile.doc
//
//
// This variable enables domain checking, if it is set to true domain checking will be enabled, conversely if it is false
// domain checking will be disabled.
// Example : var elqIC = true;
// Default : var elqIC = false;
var elqIC = true;

// This variable holds the list of safe domains.  Each domain must be separated by the pound (#) symbol and does
// not require a preceding http:// or https://.  Ensure the each safe domain is listed explicitly.  Adding only
// mysite.com does NOT mean that www.mysite.com or secure.mysite.com is included.  Note that wild cards are NOT supported.
// Example:  var elqDL = 'www.mysite.com#mysite.com#secure.mysite.com';
// Default:  var elqDL = '';
var elqDL = '#www.redhat.com#redhat.com#www.europe.redhat.com#europe.redhat.com#www.jboss.org#www.jboss.com#jboss.org#jboss.com#downloads.jboss.org#ae.redhat.com#ar.redhat.com#ar.redhat.com#at.redhat.com#at.redhat.com#au.redhat.com#au.redhat.com#bd.redhat.com#bd.redhat.com#be.redhat.com#be.redhat.com#br.redhat.com#br.redhat.com#ca.redhat.com#ca.redhat.com#ch.redhat.com#ch.redhat.com#cl.redhat.com#cl.redhat.com#cn.redhat.com#cn.redhat.com#co.redhat.com#co.redhat.com#cz.redhat.com#cz.redhat.com#de.redhat.com#de.redhat.com#dk.redhat.com#dk.redhat.com#ec.redhat.com#ec.redhat.com#es.redhat.com#es.redhat.com#fi.redhat.com#fi.redhat.com#fr.redhat.com#fr.redhat.com#gb.redhat.com#gb.redhat.com#hk.redhat.com#hk.redhat.com#id.redhat.com#id.redhat.com#ie.redhat.com#ie.redhat.com#il.redhat.com#il.redhat.com#in.redhat.com#in.redhat.com#it.redhat.com#it.redhat.com#jp.redhat.com#jp.redhat.com#kr.redhat.com#kr.redhat.com#lk.redhat.com#lk.redhat.com#lt.redhat.com#lt.redhat.com#lu.redhat.com#lu.redhat.com#mx.redhat.com#mx.redhat.com#my.redhat.com#my.redhat.com#nl.redhat.com#nl.redhat.com#no.redhat.com#no.redhat.com#nz.redhat.com#nz.redhat.com#pe.redhat.com#pe.redhat.com#ph.redhat.com#ph.redhat.com#pk.redhat.com#pk.redhat.com#pt.redhat.com#pt.redhat.com#py.redhat.com#py.redhat.com#ru.redhat.com#ru.redhat.com#se.redhat.com#se.redhat.com#sg.redhat.com#sg.redhat.com#th.redhat.com#th.redhat.com#tw.redhat.com#tw.redhat.com#us.redhat.com#us.redhat.com#uy.redhat.com#uy.redhat.com#ve.redhat.com#ve.redhat.com#vn.redhat.com#vn.redhat.com#za.redhat.com';


// This variable holds the URL of the page which the user gets redirected if the redirect is found to be unsafe.
// If you wish to change it from the default, be sure to ensure the URL is fully qualified.
// Example: var elqDURL = 'http://www.mysite.com/UnsafeRedirect.htm';
// Default: var elqDURL = 'elqNoRedir.htm';
var elqDURL = 'elqNoRedir.htm';
