<?php
class Geocoder extends TAWComponent {
	public function __construct() {
		parent::__construct("util/Geocoder", true);
		
		$this->add_js("/js/geocoder.js");
	}
}
?>
