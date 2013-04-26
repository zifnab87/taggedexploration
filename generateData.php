<?php

function generateLabels($xrange, $yrange, $num_seeds, $num_labels, $min_seed_distance) {
	$grid = array(array());
	$seeds = array();

	// place seed points
	$min_seed_distance2 = $min_seed_distance * $min_seed_distance;
	for ($i = 0; $i < $num_seeds; ++i) {
		do {
			$x = rand(0, $xrange - 1);
			$y = rand(0, $yrange - 1);

			// check that the new seed is not near any other seeds
			$isolated = True;
			foreach ($seeds as $point) {
				if (pow($x - $point[0], 2) + pow($y - $point[1], 2) < $min_seed_distance2) {
					$isolated = False;
					break;
				}
			}
		} while (!$isolated);
		$seeds[] = array($x, $y);
	}

	// fill in the rest of the points
	for ($y = 0; $y < $yrange; ++y) {
		for ($x = 0; $x < $xrange; ++x) {
			
		}
	}
	return $grid;
}

?>

