<?php
require_once("includes/db.php");


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
	$pointid=point_exists($x,$y);
	if (!$urlid){
		$db->query("INSERT INTO `points` (`x`,`y`,`label`) VALUES ('$x','$y','$label');",0);
		$urlid = mysql_insert_id();

		return $urlid;
	}
	else {
		return $urlid;
	}
	
}

function get_point_by_position($x,$y){
	global $db;
	$res=$db->query("SELECT * FROM points WHERE `x`='$x' AND `y`='$y';",0);
	$row=mysql_fetch_array($res);
	$point=null;
	$point["id"] = $row["id"];
	$point["label"] = $row["label"];
	$point["x"] = $row["x"];
	$point["y"] = $row["y"];
	return $point;
}

function get_points_by_range($xmin,$xmax,$ymin,$ymax){
	global $db;
	$res=$db->query("SELECT * FROM points WHERE `x`>=$xmin AND `x`<=$xmax AND `y`>=$ymin AND `y`<=$ymax;",0);
	$row=mysql_fetch_array($res);
	$points = array();
	while($row=mysql_fetch_array($res)){
		$point["id"] = $row["id"];
		$point["label"] = $row["label"];
		$point["x"] = $row["x"];
		$point["y"] = $row["y"];
		$points[$row["y"]][$row["x"]]=$point;
	}
	return $points;
}
function get_points_by_range_and_interest($xmin,$xmax,$ymin,$ymax,$tag_of_interest){
	global $db;
	$res=$db->query("SELECT * FROM points WHERE `x`>=$xmin AND `x`<=$xmax AND `y`>=$ymin AND `y`<=$ymax AND `label`='$tag_of_interest'",0);
	$row=mysql_fetch_array($res);
	$points = array();
	while($row=mysql_fetch_array($res)){
		$point["id"] = $row["id"];
		$point["label"] = $row["label"];
		$point["x"] = $row["x"];
		$point["y"] = $row["y"];
		$points[]=$point;
		
	}
	return $points;
}


function get_points_by_label($label){
	global $db;
	$res=$db->query("SELECT * FROM points WHERE `label`='$label'",0);
	$points = array();
	while($row=mysql_fetch_array($res)){
		$point["id"] = $row["id"];
		$point["label"] = $row["label"];
		$point["x"] = $row["x"];
		$point["y"] = $row["y"];
		$points[]=$point;
	}
	return $points;
}
