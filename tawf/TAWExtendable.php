<?php
abstract class TAWExtendable { 
	protected $extend = array(); // Used to hold the extended methods provided by components
	
	protected function __construct() {
		$this->extend = array();
	}
	
	public function __call($method, $args) {
		if (array_key_exists($method, $this->extend)) {
			// $this->extend[$method] = array($this, 'function');
			return call_user_func_array($this->extend[$method], $args);
		} else {
			throw new Exception("Method '$method' does not exist");
		}
	}
	
	public function register_extension($extension, $alias) {
		$this->extend[$alias] = $extension;
	}
}
?>