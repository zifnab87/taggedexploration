<?php
require_once("inc.php");
session_start();
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


function predict(){
	if (isset($_POST["change"])){ // the label that just changed
		$order = $_POST["change"];
	}
	if (isset($_POST["classes"])){
		$classes = $_POST["classes"];
	}
	//if (isset($_POST["training_set_size"])){
	//	$training_set_size = $_POST["training_set_size"];
	//}
	if (!isset($_POST["markov_model_order"])){
		$order = $_POST["markov_model_order"];
	}

	if (!isset($_SESSION["chain"])){
		$chain = new MarkovChain($order,$classes);
		$_SESSION["chain"] = serialize($chain);
	}
	$chain = unserialize($_SESSION["chain"]);
	
	$chain->train_step($change);
	$prediction = $chain->get_most_probable_class();
	var_dump($chain);
	var_dump($chainge);
	var_dump($class);
	var_dump($prediction);
	//var_dump($training_set_size)
	//$prefix_sequence = array_slice($sequence,0,$order=1);
	//echo $order;
	//echo sizeof($prefix_sequence);
	//echo $chain->get_most_probable_class($prefix_sequence);

}



?>