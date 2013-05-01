<?php
require_once("includes/markovchain.php");
$chain = new MarkovChain(2,array(1,2,3,4,5,6,7,8));
$chain->train(array(6,1,2,1,2,2,1,2,7));
$M=$chain->get_trans_matrix();
var_dump(array(1,2,1));
echo "eee";
var_dump($chain->get_probability_set(array(1,2)));

$arr = array(1,2,2);
$pointer = &$arr;
$pointer = array_unique($pointer);
debug($chain->M);
$probability = $chain->generate(1,"b");
var_dump( $probability);

echo $chain->get_most_probable_class(array(1,2));
echo $chain->get_most_probable_class(array(2,1));
function debug($var){
	echo "<pre>";
	var_dump($var);
	echo "</pre>";
}

?>
