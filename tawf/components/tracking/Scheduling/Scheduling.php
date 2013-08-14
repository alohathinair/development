<?php
class Scheduling extends TAWComponent {
	public function __construct() {
		parent::__construct("tracking/Scheduling", true);

		$this->add_dependancy("jquery");
		
		//$this->add_js("/js/landmarks.js");
	}
	
	public function load($tawf) {
		
		parent::load($tawf);
	}
	
	public function db_read_schedule($company_id) {
		$db = TAWDBI::singleton();
		
		$jobs = $db->sp("vision2020", "GetCompanySchedule", array(
			"CompanyID"=>$company_id
		));
		
		
		
		return $jobs;
	}
	
	public function save_schedule() {
		$user = TAWUser::singleton();
		$db = TAWDBI::singleton();
		
		$params = array(
			
		);
	

		if ($this->tawf->data["id"]) {
			$params["AlertRuleID"] = $this->tawf->data["id"];

			$db->sp("vision2020", "UpdateCompanySchedule", $params, false);
			echo json_encode(array("id"=>$this->tawf->data["id"]));
		} else {
			$id = $db->sp("vision2020","InsertCompanySchedule", $params);
			
			echo json_encode(array("id"=>$id[0]["computed"]));
		}
	}
	
	public function delete_schedule() {
		$db = TAWDBI::singleton();
		$db->sp("vision2020", "DeleteAlertRule", array("AlertRuleID"=>$this->tawf->data["id"]));
	}
}
?>