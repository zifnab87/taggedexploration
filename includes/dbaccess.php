<?php
require_once("db.php");
$db=createmysql();
 //NODE FUNCTIONS 
//RUN

function point_exists($x,$y){ //url exists in database
	global $db;
	$res=$db->query("SELECT * FROM points WHERE `x`='$x' AND `y`='$y';",0);
	if(mysql_num_rows($res)==1){
		$row = mysql_fetch_array($res);
		return $row["id"];
	}
	else {
		return 0;
	}
}

function insert_point($x,$y,$label){ //insert url in database
	global $db;
	$pointid=point_exists($url);
	if (!$urlid){
		$db->query("INSERT INTO `points` (`x`,`y,`,`label`) VALUES ('$x','$y','$label');",0);
		$urlid = mysql_insert_id();

		return $urlid;
	}
	else {
		return $urlid;
	}
	
}
