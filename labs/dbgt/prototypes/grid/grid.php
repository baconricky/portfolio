<?php
	//limit	25
	//start	25

	$total = 500;
	$rows = htmlspecialchars($_POST["limit"]) ? htmlspecialchars($_POST["limit"]) : htmlspecialchars($_GET["limit"]);
	$start = htmlspecialchars($_POST["start"]) ? htmlspecialchars($_POST["start"]) : htmlspecialchars($_GET["start"]);

	if (!$start) $start = 0;
	if (!$rows) $rows = 20;
	
	$rowNum = $start;
	
	$statuses = array("Pending","Approved","Declined");

	$paymentType = array("Acceptgiro","Domestic","International","Salary","SEPA","Direct Debit");
	$ccy = "EUR";
	
	$givenName = array("Oliver","Jack","Harry","Charlie","Alfie","Olivia","Sophie","Lily","Emily","Ruby");
	$surname = array("Smith","Jones","Taylor","Brown","Williams","Wilson","Johnson ","Davis","Robinson","Wright");
	$bizGroup = array("and Sons", "Partners", "Group");
	$bizName = array("Abrasive Blast Services","Accounting","Heavy Industries");
	
echo "{\n";
//echo "\t\"limit\":\"".$rows."\",\n";
//echo "\t\"start\":\"".$start."\",\n";
echo "\t\"total\":\"".$total."\",\n";
echo "\t\"data\":[";
do {
	echo "\t{\n";
	echo "\t\t\"id\":\"".$rowNum."\",\n";
	
	$num = rand(0,6);
	$pmtType = $paymentType[$num];
	echo "\t\t\"pmt-type\":\"".$pmtType."\",\n";
	
	echo "\t\t\"pmt-entry\":\"".rand(0,1)."\",\n";
	
	echo "\t\t\"amt\":\"".rand(1000, 100000).".00\",\n";
	
	echo "\t\t\"ccy\":\"".$ccy."\",\n";

	echo "\t\t\"ord-acct-num\":\"".rand(1, 10000000)."\",\n";
	
	$num = rand(0,9);
	$name1 = $givenName[$num];
	$num = rand(0,2);
	$name2 = $bizGroup[$num];
	$num = rand(0,2);
	$name3 = $bizName[$num];
	echo "\t\t\"ord-acct-name\":\"".$name1." ".$name2." ".$name3."\",\n";
	
	echo "\t\t\"cp-acct-num\":\"".rand(1, 10000000)."\",\n";
	$num = rand(0,9);
	$name1 = $givenName[$num];
	$num = rand(0,2);
	$name2 = $bizGroup[$num];
	$num = rand(0,2);
	$name3 = $bizName[$num];
	echo "\t\t\"cp-acct-name\":\"".$name1." ".$name2." ".$name3."\",\n";

	$num = rand(0,2);
	$status = $statuses[$num];
	echo "\t\t\"status\":\"".$status."\",\n";

	echo "\t\t\"exec_date\":\"0".rand(1, 10)."/0".rand(1, 10)."/20".rand(10,11)."\",\n";
	echo "\t\t\"schedule_date\":\"0".rand(1, 10)."/0".rand(1, 10)."/20".rand(10,11)."\",\n";

	$num = rand(0,2);
	$name2 = $bizGroup[$num];
	$num = rand(0,2);
	$name3 = $bizName[$num];
	echo "\t\t\"company\":\"".$name1." ".$name2." ".$name3."\",\n";

	$num = rand(0,9);
	$name1 = $givenName[$num];
	$num = rand(0,9);
	$name2 = $surname[$num];
	echo "\t\t\"input_id\":\"".$name1." ".$name2.""."\",\n";
	
	$num = rand(0,9);
	$name1 = $givenName[$num];
	$num = rand(0,9);
	$name2 = $surname[$num];
	echo "\t\t\"verifier\":\"".$name1." ".$name2.""."\",\n";
	
	echo "\t\t\"comments\":\"".rand(0,4).""."\"\n";
	
	if ($rowNum < $rows) {
		echo "\t},\n";
	} else {
		echo "\t}]\n";
	}
	$rowNum++;
} while ($rowNum <= ($rows));	
echo "}";

echo "---------------------------------------------------------------------------------------------------------------\n";
$columns = "{\n";
$columns .= "\tname: 'pmt-type'\n";
$columns .= "},{\n";
$columns .=  "\tname: 'pmt-entry'\n";
$columns .= "},{\n";
$columns .=  "\tname: 'amount'\n";
$columns .= "},{\n";
$columns .=  "\tname: 'ccy'\n";
$columns .= "},{\n";
$columns .=  "\tname: 'ord-acct-num'\n";
$columns .= "},{\n";
$columns .=  "\tname: 'ord-acct-name'\n";
$columns .= "},{\n";
$columns .=  "\tname: 'cp-acct-num'\n";
$columns .= "},{\n";
$columns .=  "\tname: 'cp-acct-name'\n";
$columns .= "},{\n";
$columns .=  "\tname: 'status'\n";
$columns .= "},{\n";
$columns .=  "\tname: 'exec_date'\n";
$columns .= "},{\n";
$columns .=  "\tname: 'schedule_date'\n";
$columns .= "},{\n";
$columns .=  "\tname: 'company'\n";
$columns .= "},{\n";
$columns .=  "\tname: 'schedule_date'\n";
$columns .= "},{\n";
$columns .=  "\tname: 'input_id'\n";
$columns .= "},{\n";
$columns .=  "\tname: 'verifier'\n";
$columns .= "},{\n";
$columns .=  "\tname: 'comments'\n";
$columns .= "}";
	
//echo "Columns:\n".$columns;

//echo "\n\n";
	$rowNum = $start;

echo "Data:\n";
$row = "[\n";
do {
$row .= '[';	

$num = rand(0,5);
$pmtType = $paymentType[$num];
$row .= '"'.$pmtType.'", ';

$row .= '"'.rand(0,1).'", ';
$row .= '"'.rand(1000, 100000).'", ';
$row .= '"'.$ccy.'", ';

	$num = rand(0,9);
	$name1 = $givenName[$num];
	$num = rand(0,2);
	$name2 = $bizGroup[$num];
	$num = rand(0,2);
	$name3 = $bizName[$num];
$row .= '"'.rand(1, 10000000)."<br>".$name1." ".$name2." ".$name3.'", ';
	
	$num = rand(0,9);
	$name1 = $givenName[$num];
	$num = rand(0,2);
	$name2 = $bizGroup[$num];
	$num = rand(0,2);
	$name3 = $bizName[$num];
$row .= '"'.rand(1, 10000000)."<br>".$name1." ".$name2." ".$name3.'", ';

	$num = rand(0,2);
	$status = $statuses[$num];
$row .= '"'.$status.'", ';

$row .= '"0'.rand(1, 10)."/0".rand(1, 10)."/20".rand(10,11).'", ';
$row .= '"0'.rand(1, 10)."/0".rand(1, 10)."/20".rand(10,11).'", ';

	$num = rand(0,2);
	$name2 = $bizGroup[$num];
	$num = rand(0,2);
	$name3 = $bizName[$num];
$row .= '"'.$name1." ".$name2." ".$name3.'", ';

	$num = rand(0,9);
	$name1 = $givenName[$num];
	$num = rand(0,9);
	$name2 = $surname[$num];
$row .= '"'.$name1." ".$name2."<br>";
	
	$num = rand(0,9);
	$name1 = $givenName[$num];
	$num = rand(0,9);
	$name2 = $surname[$num];
$row .= $name1." ".$name2.'", ';

$row .= '"'.rand(0,4).'"';
	
	if ($rowNum < $rows) {
		$row .= "],\n";
	} else {
		$row .= "]\n]\n";
	}
	$rowNum++;
echo $row;
} while ($rowNum <= ($rows));	
?>