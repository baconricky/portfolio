var defaultFileMask = ['pdf','jpg','png','jpeg','gif','doc','xls'];

var useAjax = true,
	pageDisplayLimit = 10,
    cachedJson = new Object(),
	cachedSearchResults = false,
	imgPath = "http://adev.nctracks.com:8180/transcend/dms/images",
	imgAjaxLoading = '<img src="'+imgPath+'/ajax-loader/ajax-loader.gif" alt="loading..." />',
	sortByIcon = '<img class="sortIcon" alt="Sorted by this column" src="'+imgPath+'/icons/legend_arrow.gif" />';
	

$(document).ready( function() {
	ajaxUploadActionURL = window.ajaxUploadActionURL ? window.ajaxUploadActionURL : "#";
	dataColsArray = window.dataColsArray ? window.dataColsArray : new Array();
	fileMask = window.fileMask ? window.fileMask : defaultFileMask;
		var allowedFileMask = fileMask.join('|'), //machine readable list
			allowedFileMaskMsg = fileMask.join(', '); //human readable list

	$('#searchResultsTable').parent('fieldset').hide();	
							
	$('form.ajaxSearch').bind("submit", function(e) { 
		e.preventDefault(); 
	});

	$('form.ajaxSubmit').bind("submit", function(e) { 
		e.preventDefault(); 
	});

	$("table#searchResultsTable th").click(function(e) {
		if(e.button == 0) {
	        reSort($(e.target).attr("id"));
		}
	});
    
    cachedSearchResults = window.cachedSearchResults ? window.cachedSearchResults : false;
	if (cachedSearchResults) {
		var searchResultsTable = "searchResultsTable";
		$('#'+searchResultsTable).closest('fieldset').show();	
		var columnNames = "#" + searchResultsTable + " thead th";
		$(columnNames).each(function() {
			var $this = $(this);
			dataColsArray.push( $this.attr("id") );
			$("#"+$this.attr("id")).show();
		});
		processAjaxSearchData(searchResultsTable, cachedSearchResults);
	} else {
		//hide search results data table(s) until search is run
		$('#'+searchResultsTable).parent('fieldset').hide();	
	}	
	
	//only load file upload script if needed
	if ($('#fileUploadBtn').html()) {
		$.getScript("http://sandbox.nctracks.com/mockups/js/ajaxupload.js");

		var button = $('#fileUploadBtn'), interval;
		var uploadMultiple = button.hasClass("uploadMultiple");
		
		new AjaxUpload(button,{
			//action: 'upload-test.php', // I disabled uploads in this example for security reasons
			action: ajaxUploadActionURL, 
			name: 'fileUpload',
			autoSubmit: true,
			//responseType: 'json',
			onChange : function(file, ext){
				button.html(imgAjaxLoading);
			},
			onSubmit : function(file, ext){
				if (ext && new RegExp('^(' + allowedFileMask + ')$').test(ext)){
					// change button text, when user selects file			
					//button.text('Uploading');
					button.html(imgAjaxLoading);
					
					// If you want to allow uploading only 1 file at time,
					// you can disable upload button
					this.disable();
					
					// Uploding -> Uploading. -> Uploading...
					interval = window.setInterval(function(){
						button.html('Uploading' + imgAjaxLoading);				
					}, 200);
				} else {
					// extension is not allowed
					alert('Sorry! You may only upload files with the following extensions:\n'+allowedFileMaskMsg);
					window.clearInterval(interval);
					button.text('Choose File');
					this.enable();
					// cancel upload
					return false;				
				}
			},
			onComplete: function(file, response){
				logData("ajax upload response:",response);
								
				var imgUploadedFileType = imgPath;
				
				// reset upload button
				window.clearInterval(interval);

				if (uploadMultiple) {
					button.text('Choose File');
					this.enable();
				} else {
					button.remove();
				}
				
				
				switch (getExtension(file)) {
					case "xls":
						imgUploadedFileType += "/icons/page_white_excel.png";
						break;
					case "doc":
						imgUploadedFileType += "/icons/page_white_word.png";
						break;
					case "pdf":
						imgUploadedFileType += "/icons/page_white_acrobat.png";
						break;
					case "txt":
						imgUploadedFileType += "/icons/page_white_text.png";
						break;
					default:
						imgUploadedFileType += "/icons/page_white_picture.png";
						break;
				}
					
				var fileListing  = '<img alt="src:'+imgUploadedFileType+'" src="'+imgUploadedFileType+'"> ';
					fileListing += file;
					//fileListing += '&nbsp;&nbsp;<img alt="Remove" src="'+imgPath+'/icons/delete.png">';
	
				// add file to the list
				$('<li></li>').appendTo('#fileUpload .files').html(fileListing);						
			},

		});
	}
});

function getExtension(file) {
	return (/[.]/.exec(file)) ? /[^.]+$/.exec(file.toLowerCase()) : '';
}			

function submitAjaxData(action, formAction, updatableObj) {
	logData("submitAjaxData",updatableObj);
	var updatableObjType = updatableObj[0].nodeName;
	switch (updatableObjType) {
		case "TR":
			updatableObjType = "Row";
			break;
		case "FIELDSET":
			updatableObjType = "Box";
			break;
		default:
			updatableObjType = "Form";
			break;
	}
	
	/*******************************************
	** Current submit action options:
	** 1. Add - adding new item, need to add functionality to reload table data
	** 2. Update - update existing data
	** 3. Delete - delete row
	*******************************************/
	var ajaxActionPrefixValue = "";
	var ajaxActionVO = "";
	var jsonUrl = "";
	
	var updateableListWrapperObj = updatableObj[0].parentNode;
	jsonUrl = formAction + "." + action + updateableListWrapperObj.id + ".action";
	
	var jsonParameters = new Object();
	
	//go through each input in the hidden div to get additional 
	// for information
	if ($("#hiddenFormInfo"))
	{
		$("#hiddenFormInfo").find(":input").each( function() {
			var inputID       = $(this).attr("id"); 
			var propertyValue = $(this).val();
			if (inputID != "ajaxActionPrefix")
			{
				eval("jsonParameters."+inputID+"='"+propertyValue+"'");
			}
		});
	}
	
	var updatableObjIndex = $(updatableObj).attr("id").split("-"); 
	if (updatableObjIndex[1]) {
		jsonParameters.voIndex = updatableObjIndex[1];
	}
	
	//go through each input in the row passed along
	//and pull all of the name/ids out to 
	$(updatableObj).find(":input").each( function() {
		var tmpId = $(this).attr("id").split("-");
		var inputID = tmpId[0];
		var inputIndex = tmpId[1];
		var propertyValue = $(this).val();
		
		if (inputID)
			eval("jsonParameters."+inputID+"='"+propertyValue+"'");
	});
	
	action = action.substring(0,1).toUpperCase() + action.substring(1,action.length);
	eval("doAjax"+updatableObjType+action+"(jsonUrl, jsonParameters)");
}

function submitAjaxAction(jsonUrl, jsonParameters) 
{
	//logData(jsonUrl, jsonParameters);
	$.ajaxSetup ({ async: true });
	
	$.getJSON(  
		jsonUrl,  
		jsonParameters,
		function(data) { 
			/*********************************************************
			** Message display
			*********************************************************/
			//display any error messages
			if ($(data.fieldErrors).length > 0 || $(data.actionErrors).length > 0) {
				var errorMsg = '<div id="jsonError" class="error"><ul>';
	
				//errors related to a specific field
				if ($(data.fieldErrors)) {
					$(data.fieldErrors).each( function() {
						for (error in this)
							errorMsg += '<li><a href="#' + error+ '">'+ this[error] + '</a></li>';
					});
				}
				
				//errors related to the action (generally server side)
				if ($(data.actionErrors)) {
					$(data.actionErrors).each( function() {
						errorMsg += '<li>'+ this + '</li>';
					});
				}
				
				errorMsg += "</ul></div>";
				
				//write the error message after the form legend
				$("div#jsonError").replaceWith(errorMsg);
			} else {
				$("div#jsonError").remove();
			}
	
			//display any action messages
			if ($(data.actionMessages).length > 0) {
				$("div#jsonInfo").remove();
				var actionMsg = '<div id="jsonInfo" class="info"><ul>';
	
				$(data.actionMessages).each( function() {
						actionMsg += '<li>'+ this + '</li>';
				});
				
				actionMsg += "</ul></div>";
				
				//write the info message after the form legend
				$("div#jsonInfo").replaceWith(actionMsg);
			} else {
				$("div#jsonInfo").remove();
			}
			
			if ($(data.successUrl)) {
				console.log($(data.successUrl));
			}
			
			return false;
		});
}


//BEGIN Ajax Row Funcitons 

function doAjaxRowAdd(url, parameters) {
	submitAjaxAction(url, parameters);
}

function doAjaxRowUpdate(url, parameters) {
	submitAjaxAction(url, parameters);
}

function doAjaxRowDelete(url, parameters) {
	submitAjaxAction(url, parameters);
}

//END Ajax Row Funcitons 


//BEGIN Ajax Box Funcitons 

function doAjaxBoxAdd(url, parameters) {
	submitAjaxAction(url, parameters);
}

function doAjaxBoxUpdate(url, parameters) {
	submitAjaxAction(url, parameters);
}

function doAjaxBoxDelete(url, parameters) {
	submitAjaxAction(url, parameters);
}

//END Ajax Box Funcitons 

function doAjaxSave(url, parameters) {
	submitAjaxAction(url, parameters);
}

function doAjaxFORMSave(url, parameters) {
	submitAjaxAction(url, parameters);
}

function doAjaxSearch(target, jsonUrl, jsonParameters) {
	cachedJson.parameters = jsonParameters;
	cachedJson.target = target;
	cachedJson.jsonUrl = jsonUrl;
	
	$.ajax({
		url: jsonUrl,
		dataType: 'json',
		data: jsonParameters,
		success: function(data){
			processAjaxSearchData(target, data, jsonParameters);
		},
		error : function(e){
		   console.log("doAjaxSearch error:\n" + $.dump(e) );
		},
		beforeSend: function(data){
			$("#resultCount-"+target).html("Searching...");
			$("#" + target + " tbody").replaceWith('<tbody><tr><td colspan="'+dataColsArray.length+'" align="center">'+imgAjaxLoading+'</td></tr></tbody>');
		}
	});
}

function reSort(sortBy) {
	var jsonParameters = cachedJson['parameters'];
	jsonParameters.SortBy = sortBy;
	
	var target         = cachedJson.target;
	var jsonUrl        = cachedJson.jsonUrl;
	
	doAjaxSearch(target, jsonUrl, jsonParameters);
}

function processAjaxUploadResult(json) {
	console.log(json.returnCd);
	console.log(json.successUrl);
}

function processAjaxSearchData(target, data, jsonParameters) {
	/*******************************************
	** Available action options:
	** 1. Add - adding new item, need to add functionality to reload table data
	** 2. Update - update existing data
	** 3. Delete - delete row
	** 
	** Available type options:
	** 1. row - adding new item, need to add functionality to reload table data
	** 2. box - update existing data
	*******************************************/
	//BEGIN process messages
	//END process messages
	
	//clear icon from all columns
	$("table#searchResultsTable th img.sortIcon").remove();
	/*********************************************************
	//process th tags and set up sorting and add links
	*********************************************************/
	for (col in dataColsArray) {
		var $columnName = dataColsArray[col];
		if ( $columnName == data.sortBy) {
			
			$("th#"+$columnName).addClass("sortBy");
			$("th#"+$columnName).append(sortByIcon);
		}
	}
	
	
	//BEGIN process data
	var output = "";
	/*********************************************************
	** Message display
	*********************************************************/
	//display any error messages
	var numRows = 0;
	
	if (data.returnCd) {
		var errorMsg = '<div id="jsonError" class="error"><ul>';

		//errors related to a specific field
		if ($(data.fieldErrors)) {
			$(data.fieldErrors).each( function() {
				for (error in this)
					errorMsg += '<li><a href="#' + error+ '">'+ this[error] + '</a></li>';
			});
		}
		
		//errors related to the action (generally server side)
		if ($(data.actionErrors)) {
			$(data.actionErrors).each( function() {
				errorMsg += '<li>'+ this + '</li>';
			});
		}
		
		errorMsg += "</ul></div>";
		
		//write the error message after the form legend
		$("div#jsonError").remove();
		$("#formLegend").after(errorMsg);
	} else {
		$("div#jsonError").remove();
	}

	//display any action messages
	if ($(data.actionMessages).length > 0) {
		$("div#jsonInfo").remove();
		var actionMsg = '<div id="jsonInfo" class="info"><ul>';

		$(data.actionMessages).each( function() {
				actionMsg += '<li>'+ this + '</li>';
		});
		
		actionMsg += "</ul></div>";
		
		//write the info message after the form legend
		$("div#jsonInfo").remove();
		$("#formLegend").after(actionMsg);
	} else {
		$("div#jsonInfo").remove();
	}

	/*********************************************************
	** Results storage and display
	*********************************************************/

	output = "";
	if (data.result) 
	{

		numRows = $(data.result).length;
		if (numRows == 0) {
			output = "<tbody>";
			output += '<tr><td colspan="'+dataColsArray.length+'" align="center">No results returned.</td></tr>';
			output += '</tbody>';
			
			$("div#jsonInfo").remove();
			var actionMsg = '<div id="jsonInfo" class="info"><ul>';
				actionMsg += '<li>Sorry, no results were found. Please change your search criteria and try again.</li>';
	  			actionMsg += "</ul></div>";
			
			//write the info message after the form legend
			$("div#jsonInfo").remove();
			$("#formLegend").after(actionMsg);
		} else {
			output = "<tbody>";
			$(data.result).each( function() {

					output += '<tr>';

					for (col in dataColsArray) {
						//need to add code to support targeting linked column
						var column = eval("this."+dataColsArray[col]);

						if (column.href) {
							output += '<td><a href="'+column.href+'">'+column.display+'</td>';
						} else if (column.display) {
							output += '<td>'+column.display+'</td>';
						} else {
							output += '<td>'+column+'</td>';
						}
					}
					output += '</tr>';
				}
			);
			output += '</tbody>';
		}
	}
	
	if (!numRows) numRows = 0;
	
	if ($("#" + target + " tbody").html()) {
		$("#" + target + " tbody").remove();
	}
	
	$("#" + target + " thead").after(output);
	
	var displayCount = (numRows < pageDisplayLimit ? numRows : pageDisplayLimit);
	$("#resultCount-"+target).html(numRows + " results (displaying 1 of "+numRows+")");

	//re-do zebra striping
	$("#" + target + " tr:even").addClass("even");
	$("#" + target + " tr:odd").addClass("odd");
	//END process data
}

function logData(label, data) {
	$.getScript("http://sandbox.nctracks.com/mockpus/js/jquery.dump.js");
	$("#tileBtm").after('<hr><div id="debug" class="info"><h1>DEBUG INFO:</h1><h2>' + label + '</h2><br><pre>' + $.dump(data) +  '</pre></div>');
}

