$(window).load(function() {
	//TODO: check pathing issues with nested directories
	$.getScript("http://20.20.154.106:8180/transcend/dms/js/jquery.calculation.min.js", function() {
		$("input[class^='countable']").sum("keyup", "#countableTotal");
		$("input[name^='incomeGross']").sum("keyup", "#annualGrossIncome");
		$("input[name^='incomeAfterTax']").sum("keyup", "#totalIncomeAfterTax");
		$("input[name^='deductions']").sum("keyup", "#totalDeductions");
		//$("input[class*='taxCalc']").sub("change", "#taxes");
		$("input[class*='aniCalc']").sub("change", "#annualNetIncome");
	});
});