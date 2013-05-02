<?php

class MarkovChain{
	protected $order;
	protected $classes=array();
	protected $M; //transition matrix
	protected $count_array; //count
	protected $last_sequence; // last sequence of labels to train online

	function __construct($order,$classes){
		$this->order = $order;
		$this->classes = $classes;
		$this->last_sequence = array();
	}

	public function train($sequence_array) { //array
		$this->M = array();
		$this->last_sequence = array();
    	$window = $this->order + 1; // this checks the subsequence_arrays to fill the Transition Matrix
    	for ($i = 0; $i <= sizeof($sequence_array) - $window; ++$i) {
			$subarray = array_slice($sequence_array, $i, $window - 1);
			$this->train_step($sequence_array[$i + $window], $subarray);
    	}
	}

	public function train_step($label) {
		// if we do not have enough training data, just build the last sequence and return
		if (sizeof($this->last_sequence) < $this->order) {
			$this->last_sequence[] = $label;
			return;
		}

		// otherwise train on the last sequence
		$this->train_step_sequence($label, $this->last_sequence);

		// evict the oldest and add the newest label to the last sequence
		array_shift($this->last_sequence);
		$this->last_sequence[] = $label;
	}

	public function train_step_sequence($label, $sequence) {
		$depth = &$this->M;
  		for ($i = 0; $i < $this->order; ++$i) {
   			if (!isset($depth[$subarray[$i]])) {
   				$depth[$subarray[$i]]=array();
   			}
   			$depth = &$depth[$subarray[$i]];
   		}
   		if (!isset($depth[$label])) {
   			$depth[$label] = 1;
   		} 
   		else {
   			$depth[$label] += 1;
		}
	}

	public function get_trans_matrix(){ // this matrix has just counts
		return $this->M;
	}

	public function get_probability($sequence){ 
		//probability of specific sequnce - the last part is current
		// all the others are the past  
		if (sizeof($sequence)!= $this->order+1){
			throw new Exception('Sequence should be one longer than order number of Markov Chain.');
		}
		$depth = &$this->M;
		for ($j=0; $j<$this->order; $j++){
			
			if (!isset($depth[$sequence[$j]])){
				$depth[$sequence[$j]]=array();
			}
			$depth = &$depth[$sequence[$j]];
		}


		$sum=0;
		foreach ($depth as $count){
			$sum += $count;
		}


		$probability = $depth[$sequence[$j]];
		return $probability/$sum;
	}

	public function get_probability_set($sequence) { 
		//return the probabilities of all possible transitions given order number of classes
		if (sizeof($sequence)!= $this->order){
			throw new Exception('Sequence should have order number of elements.');
		}
		$probability_set = array();
		for($i=0; $i<sizeof($this->classes); $i++){
			$new_sequence = array_merge($sequence,array($this->classes[$i]));
			$probability_set[$this->classes[$i]]=$this->get_probability($new_sequence);
		}
		return $probability_set;

	}

	public function get_most_probable_class() {
		$sequence = $this->last_sequence;
		if (sizeof($sequence)!= $this->order){
			return false;
		}
		$probability_set = $this->get_probability_set($sequence);

		$max_prob = -1;
		foreach ($probability_set as $class => $probability){
			if ($probability > $max_prob){
				$max_prob = $probability;
			}
		}

		if ($max_prob==0){
			return false;
		}
		$best_classes = array();
		foreach ($probability_set as $class => $prob) {
			if ($prob == $max_prob) {
				$best_classes[] = $class;
			}
		}
		if (sizeof($best_classes) > 1) {
			return $best_classes;
		}
		return $best_classes[0];
	}
}

?>

