
/*

Omniture Release Notes for s_code.js 

The s_code.js javascript file is a central component of the Omniture site
tracking system.  Two versions of this file are maintained in the repository,
one for the development and QA releases and the other for production. This is 
necessary for the following reasons:

1) The architecture of the Omniture reporting system provides separate development 
and production servers that have unique names.  The s_code.js file contains the 
javascript variable s_account which designates the server to which the code will 
be reporting.  This variable points to the Omniture development server for development 
and QA and it points to the Omniture production server for LIVE.  

2) Setting this variable programmatically is problematic and would require adding logic
to a file that is maintained by Omniture.  To avoid intoducing logic into this file
two versions of the file are maintained in the repository, one for development and QA
and the other for production.  Should a new release of this file come from Omniture
two versions of this file (dev/QA, production) must be committed to the repository and
tagged appropriately.

*/