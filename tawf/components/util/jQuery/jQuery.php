<?php
class jQuery extends TAWComponent {
	public function __construct() {
		parent::__construct("util/jQuery", true);
	}
	
	public function load($tawf) {
		$options = $tawf->get_component_options("jquery");
		
		$version = "current";

		// Check if we have options
		if (count($options)) {
			// This components only option is the version of jquery being loaded
			if (isset($options["version"])) {
				$version = $options["version"];
			}
		}
		
		//$this->add_js("/js/jquery-$version.min.js");
        $this->add_js("http://code.jquery.com/jquery-1.9.1.js");
		$this->add_js("/js/jquery.dateFormat-1.0.js");
		parent::load($tawf);
	}

}
?>