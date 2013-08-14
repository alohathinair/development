<?php
class Treeview extends TAWComponent {
	public function __construct() {
		parent::__construct("util/Treeview", true);

		$this->add_dependancy("jquery");
		
		//$this->add_js("/js/jquery.treeview.min.js");
		//$this->add_js("/js/jquery.treeview.add.js");
	//	$this->add_js("/js/jquery.min.js");
	//	$this->add_js("/js/kendo.all.min.js");
		//$this->add_css("/css/jquery.treeview.css");
	//	$this->add_css("/css/kendo.common.min.css");
	//	$this->add_css("/css/kendo.default.min.css");
	}
}
?>