<?php
class RoutePlayback extends TAWComponent {
	public function __construct() {
		parent::__construct("tracking/RoutePlayback", true);

		$this->add_dependancy("jquery");
		
		$this->add_js("/js/routeplayback.js");
	}
	
	public function load($tawf) {

		
		parent::load($tawf);
	}
	
	}
?>