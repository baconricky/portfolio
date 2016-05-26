/**  
author:Nicholas Harris
purpose: this file is specific to the Hazmat application.
dependancy: jQuery 1.6.1 library
**/

jQuery.fn.submitJsonRequest = function(jsonUrl, jsonParameters) { //logData(jsonUrl, jsonParameters);
    $.ajaxSetup({
        async: true
    });
    $.getJSON(jsonUrl, jsonParameters,
    function(data) {
        console.log("data:");
        console.log(data);
        return false;
    });
}