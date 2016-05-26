<?php
	//limit	25
	//start	25

	$total = 500;
	$rows = htmlspecialchars($_POST["limit"]) ? htmlspecialchars($_POST["limit"]) : htmlspecialchars($_GET["limit"]);
	$start = htmlspecialchars($_POST["start"]) ? htmlspecialchars($_POST["start"]) : htmlspecialchars($_GET["start"]);

	if (!$start) $start = 0;
	if (!$rows) $rows = 10;
	
	$row = $start;
	
	$status = array("Received By Bank","Waiting for Auth","Waiting for 2nd Auth","Waiting","Incomplete");

	$transactionType = array("Acceptgiro","dompay","Intpay","Salary","Sepa","Direct Debit");
	$ccy = "eur";
	
	$givenName = array("Oliver","Jack","Harry","Charlie","Alfie","Olivia","Sophie","Lily","Emily","Ruby"]);
	$surname = array("Smith","Jones","Taylor","Brown","Williams","Wilson","Johnson ","Davis","Robinson","Wright");
	
echo "{\n";
//echo "\t\"limit\":\"".$rows."\",\n";
//echo "\t\"start\":\"".$start."\",\n";
echo "\t\"total\":\"".$total."\",\n";
echo "\t\"data\":[";
do {
	echo "\t{\n";
	echo "\t\t\"id\":\"".$row."\",\n";
	echo "\t\t\"status\":\"".$status."\",\n";
	$num = rand(1,10);
	$name1 = $givenName[$num];
	$num = rand(1,10);
	$name2 = $surname[$num];
	echo "\t\t\"created_by\":\"".$name1." ".$name2." ".rand(1, 100)."\",\n";
	$num = rand(1,6);
	$tnxType = $transactionType[$num];
	echo "\t\t\"tnx_type\":\"".$tnxType."\",\n";
	echo "\t\t\"amt\":\"".rand(1000, 100000).".00\",\n";
	//d/m/Y
	echo "\t\t\"exec_date\":\"0".rand(1, 10)."/0".rand(1, 10)."/20".rand(10,11)."\",\n";
	echo "\t\t\"1st_sign\":\"hkuser".rand(1, 100)."\",\n";
	echo "\t\t\"2nd_sign\":\"spauth".rand(1, 100)."\",\n";
	echo "\t\t\"urgent\":\"".rand(0,1)."\",\n";
	
	$num = rand(1,4);
	$name3 = $cp_name1[$num];
	$num = rand(1,4);
	$name4 = $cp_name2[$num];
	$num = rand(1,4);
	$name5 = $cp_name1[$num];
	$num = rand(1,4);
	$name6 = $cp_name2[$num];
	
	echo "\t\t\"detail1\":\"".$name1." ".$name2." ".rand(10000, 100000000)."\",\n";
	echo "\t\t\"detail2\":\"".$name3." ".$name4." ".rand(10000, 100000000)."\",\n";
	echo "\t\t\"detail3\":\"".$name5." ".$name6." ".rand(10000, 100000000)."\",\n";
	
	echo "\t\t\"ccy\":\"".$ccy."\"\n";
	if ($row < $rows) {
		echo "\t},\n";
	} else {
		echo "\t}]\n";
	}
	$row++;
} while ($row <= ($rows));	
echo "}";
?>