<?php
require_once("inc.php");

if (!isset($_SESSION["id"])){
	session_start();
	$_SESSION["id"] = session_id();
}

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
		$change = $_POST["change"];
	}
	if (isset($_POST["classes"])){
		$classes = $_POST["classes"];
	}
	//if (isset($_POST["training_set_size"])){
	//	$training_set_size = $_POST["training_set_size"];
	//}
	if (isset($_POST["markov_model_order"])){
		$order = $_POST["markov_model_order"];
	}

	if (!isset($_SESSION["chain"])){
		$chain = new MarkovChain($order,$classes);
		$_SESSION["chain"] = serialize($chain);
	}
	$chain = unserialize($_SESSION["chain"]);
	
	$chain->train_step($change);
	//resave 
	$_SESSION["chain"] = serialize($chain);

	$prediction = $chain->get_most_probable_class();

	// var_dump($_SESSION["id"]);
	// var_dump(spl_object_hash($chain)	);
	//var_dump($chain);
	//var_dump($change);
	// var_dump($class);
	echo $prediction;
	//var_dump($training_set_size)
	//$prefix_sequence = array_slice($sequence,0,$order=1);
	//echo $order;
	//echo sizeof($prefix_sequence);
	//echo $chain->get_most_probable_class($prefix_sequence);

}

function points_prefetch(){
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
	if (isset($_POST["prediction"])){
		$prediction = $_POST["prediction"];
	}

	$points = get_points_by_range_and_interest($xmin,$xmax,$ymin,$ymax,$prediction);
	echo json_encode($points);
}

function suggest(){
	if (isset($_POST["x"])) {
		$x = unserialize($_POST["x"]);
	}
	if (isset($_POST["y"])) {
		$y = unserialize($_POST["y"]);
	}
	if (isset($_POST["k"])) {
		$k = $_POST["k"];
	}
	if (isset($_POST["max_distance"])){
		$max_distance = $_POST["max_distance"];
	}

	$pts = array();
	for ($i = 0; $i < sizeof($x); ++$i) {
		$pts[] = array($x[$i], $y[$i]);
	}

	$centroids = find_centroids($pts, $k,$max_distance);
	echo json_encode($centroids);
}


function kill_session(){
	$_SESSION = array();
	session_destroy();
}






?>
