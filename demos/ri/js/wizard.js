/**  
author:Adrian Pomilio
purpose: this program allows for the creation of a wizard based interface.
dependancy: jQuery 1.6.1 library
**/

var wizard = this.wizard || {};

wizard.instance = (function(){
	var i ={
		currentStep: 0,
		init: function(){
				if(i.currentStep === 0){
					$("#wizardSteps li:first-child").addClass('current-step');
				}
				$("#wizardSteps").children().each(function(index){
					var stp = $(this);
					$("#"+stp.attr("id")).live('click',function(){i.directionalStep(index)});
				});
				$(".backBtn").live('click',function(){i.directionalStep(i.currentStep-1)});
				$(".nextBtn").live('click',function(){i.directionalStep(i.currentStep+1)});
				$("#wizardContents").children().hide();
				$("#wizardContents").children("div.wizardStep:first-child").show();		
		},
		directionalStep: function(str){
			i.currentStep = str;
			$("#wizardContents").children().filter(":visible").hide('slow');
			$("#wizardContents").children().eq(i.currentStep).show('slow');
			$("#wizardSteps").children().filter(".current-step").removeClass('current-step');
			$("#wizardSteps").children().eq(i.currentStep).addClass('current-step');
		}
	};
	return i;
})();

