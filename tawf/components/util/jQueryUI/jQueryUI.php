<?php
class jQueryUI extends TAWComponent {
	public function __construct() {
		parent::__construct("util/jQueryUI", true);
	}
	
	public function load($tawf) {
		$options = $tawf->get_component_options("jqueryui");
		
		$version = "1.8.4"; 
		
		// Check if we have options
		/*if (count($options)) {
			// This components only option is the version of jquery being loaded
			if (isset($options["version"])) {
				$version = $options["version"];
			}
			
			// Load the theme
			if (isset($options["theme"])) {
				$this->add_css("/css/" . $options["theme"] . "/jquery-ui-$version.css");
			}
		} else {
			// Default theme
			$this->add_css("/css/smoothness/jquery-ui-$version.css");
        }*/
        $this->add_css("http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css");
		
		// Require the JS
	//	$this->add_js("/js/jquery-ui-$version.min.js");
        $this->add_js("http://code.jquery.com/ui/1.10.3/jquery-ui.js");

		
		
		
		parent::load($tawf);
	}
}
?>