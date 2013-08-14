<?php
class jQTip extends TAWComponent {
	public function __construct() {
		parent::__construct("util/jQTip", true);

                $this->add_dependancy("jquery");

		$this->add_js("/js/jquery.qtip.min.js");
		$this->add_css("/css/jquery.qtip.min.css");
	}
	
	public function load($tawf) {
        	parent::load($tawf);
	}

}
?>