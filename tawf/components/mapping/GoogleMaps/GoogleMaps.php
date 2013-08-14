<?php
class GoogleMaps extends TAWComponent {
	public function __construct() {
		parent::__construct("mapping/GoogleMaps", true);
		$this->add_provides("mapcontroller"); // This is a virtual provision that all mapping systems provide. 
		
		$this->add_dependancy("jquery");
		
		
	}
	
	public function load($tawf) {
		$options = $tawf->get_component_options("googlemaps");
		
		//$this->add_js("http://maps.google.com/maps/api/js?sensor=false");
                $this->add_js("http://maps.googleapis.com/maps/api/js?v=3.5&libraries=places&sensor=false");
                $this->add_js("http://www.google.com/uds/api?file=uds.js&v=1.0&key=".$options["api_key"]);
		$this->add_js("/js/mapping.js");
		$this->add_js("/js/mapping-helpers.js");
		$this->add_js("/js/markerwithlabel_packed.js");
		parent::load($tawf);
	}
	
	public function gtest() {
		echo $this->get_text("zing");
	}
}