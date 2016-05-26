<?php /**/ ?><?php

$i = 0;
$limit = 50;

$packing_groups = array("I","II","III","IV");
$primary_shipping_class = array("1.1E","1.2E","1.3E","1.4E","1.5E");

$ProperShippingNames = array("CARTRIDGESFORWEAPONS","CARTRIDGESFORPRINTERS","III","IV");
$Descriptions = array("Projectile", "Explosive", "Filler", "For", "In", "With", "Cannon", "Explosive", "System");

echo '<table id="sortableTable" class="tablesorter" cellpadding="0" cellspacing="1"><thead><tr>';
	echo '<th>HMRC</th>';
	echo '<th>ID</th>';
	echo '<th>Proper Shipping Name</th>';
	echo '<th>Primary Haz Class</th>';
	echo '<th>Packing Group</th>';
	echo '<th>STCC</th>';
	echo '<th>Short Description</th>';
	echo '<th>Long Description</th>';	
echo '</tr></thead><tbody>';
	
while ($i <= $limit) {
	echo '<tr id="row'.$i.'">';
		echo '<td>'.rand(1000000,9999999).'</td>';
		echo '<td>UN'.rand(1000,9999).'</td>';
		echo '<td>CARTRIDGESFORWEAPONS'.rand(100,999).'</td>';
		echo '<td>'.$primary_shipping_class[rand(0,4)].'</td>';
		echo '<td>II</td>';
		echo '<td>'.rand(1000000,9999999).'</td>';
		echo '<td>PROJECT.CANNON'.rand(100,999).'</td>';
		echo '<td>PROJECTILES FOR CANNON, EXPLOSIVE '.rand(100,999).'</td>';	
	echo '</tr>'."\n";
	$i++;
}
echo '</tbody></table>';
?>
