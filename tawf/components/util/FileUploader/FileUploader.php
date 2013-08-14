<?php
class FileUploader extends TAWComponent {
	public function __construct() {
		parent::__construct("util/FileUploader", true);

		$this->add_js("/js/fileuploader.js");
		$this->add_css("/css/fileuploader.css");
	}
	
	public function load($tawf) {
        	parent::load($tawf);
	}

}
?>