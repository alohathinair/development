<?php
class Notifications extends TAWComponent {
	public function __construct() {
		parent::__construct("tracking/Notifications", true);

		$this->add_dependancy("jquery");
		$this->add_dependancy("mapcontroller");
		
		$this->add_js("/js/notifications.js");
	}
}
?>