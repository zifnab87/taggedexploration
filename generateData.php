<?php

require_once("inc.php");


var_dump(insertLabels(300,300,90,4,10,0.7,0.70));

function insertLabels($xrange, $yrange, $num_seeds, $num_labels, $min_seed_distance, $empty_prob, $same_prob) {
	$grid = array(array());
	$seeds = array();
	//hack 
	// place seed points
	$min_seed_distance2 = $min_seed_distance * $min_seed_distance;
	for ($i = 0; $i < $num_seeds; ++$i) {
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
		$label = rand(1, $num_labels);
		$grid[$y][$x] = $label;

		insert_point($x, $y, $label);
	}

	// fill in the rest of the points
	for ($y = 0; $y < $yrange; ++$y) {
		for ($x = 0; $x < $xrange; ++$x) {
			// do not touch it if it is a seed point
			if ($grid[$y][$x] > 0) {
				continue;
			}

			// maybe this point will not have a label
			if (rand() / getrandmax() < $empty_prob) {
				$grid[$y][$x] = 0;
				continue;
			}

			// find the closest seed point
			$min_distance = $xrange * $yrange;
			foreach ($seeds as $point) {
				$distance = pow($x - $point[0], 2) + pow($y - $point[1], 2);
				if ($distance < $min_distance) {
					$min_distance = $distance;
					$likely_label = $grid[$point[1]][$point[0]];
				}
			}

			// choose the label of the point
			if (rand() / getrandmax() < $same_prob) {
				$label = $likely_label;
			}
			else {
				$label = rand(1, $num_labels - 1);
				if ($label >= $likely_label) {
					++$label;
				}
			}
			$grid[$y][$x] = $label;


			insert_point($x, $y, $label);
		}
	}

	return $grid;
}

?>

