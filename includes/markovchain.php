<?php
class MarkovChain{
	protected $order;
	protected $classes=array();
	protected $M=array(); //transition matrix
	protected $count_array; //count

	function __construct($order,$classes){
		$this->order = $order;
		$this->classes = $classes;
	}

    public function train($sequence_array) { //array
    	$window = $this->order +1; // this checks the subsequence_arrays to fill the Transition Matrix
    	for ($i=0; $i<=sizeof($sequence_array)-$window; $i=$i+1){
    		$subarray = array_slice($sequence_array,$i,$window);
    		$depth = &$this->M;
    		for ($j=0; $j<$this->order; $j++){
    			
    			if (!isset($depth[$subarray[$j]])){
    				$depth[$subarray[$j]]=array();
    			}
    			$depth = &$depth[$subarray[$j]];
    		}
    		if (!isset($depth[$subarray[$j]])){
    			$depth[$subarray[$j]] = 1;
    		} 
    		else {
    			$depth[$subarray[$j]] += 1;
    		}
    		
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

	public function get_most_probable_class($sequence) {
		if (sizeof($sequence)!= $this->order){
			throw new Exception('Sequence should have order number of elements.');
		}
		$probability_set = $this->get_probability_set($sequence);

		$max_class = null;
		$max_prob = 0;
		foreach ($probability_set as $class => $probability){
			if ($probability > $max_prob){
				$max_prob = $probability;
				$max_class = $class;
			}
		}

		if ($max_prob==0){
			return false;
		}
		else {
			return $max_class;
		}
	}
}