<?php
require_once("inc.php");

if (isset($_POST["q"])){
	$request=$_POST["q"];
	$request();
}
function points_fetch(){
	if (isset($_POST["xmin"])){
		$xmin = $_POST["xmin"];
	}
	if (isset($_POST["xmax"])){
		$xmax = $_POST["xmax"];
	}
	if (isset($_POST["ymin"])){
		$ymin = $_POST["ymin"];
	}
	if (isset($_POST["ymax"])){
		$ymax = $_POST["ymax"];
	}

	$points = get_points_by_range($xmin,$xmax,$ymin,$ymax);
	echo json_encode($points);
}


function prob_fetch(){
	if (isset($_POST["sequence"])){
		$sequence = $_POST["sequence"];
	}
}
?>