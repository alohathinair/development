<?php
class MappedReports extends TAWComponent {
	public function __construct() {
		parent::__construct("tracking/MappedReports", true);

		$this->add_dependancy("jquery");
		
		//$this->add_js("/js/search.js");
	}
	
	public function load($tawf) {
		
		parent::load($tawf);
	}
	
	public function get_mapped_report() {
		$user = TAWUser::singleton();
		$db = TAWDBI::singleton();
		
		switch ($this->tawf->data["report_type"]) {
			case 1:
			default:
			
				$device_uid = "";
				switch ($this->tawf->data["device_filter_type"]) {
					case 1: // Device
						$device = $db->get_device_by_id($this->tawf->data["device_filter"]);
						$device_uid = $device["UID"];
						break;
					case 2: // Operator
						$device = $db->get_device_by_user_id($this->tawf->data["device_filter"]);
						$device_uid = $device["UID"];						
						break;
				}
				
				$history = $db->get_history($device_uid, $this->tawf->data["start_date"], $this->tawf->data["end_date"]);
				
				echo json_encode(array("history"=>$history, "device_id"=>$device["DeviceID"]));
				
				break;
		}
		
	}
	
	// Fills our tawf data object with divisions, groups, devices, and users for the purpose of filtering search criteria
	public function obtain_mapped_report_request_information() {
		
		$db = TAWDBI::singleton();
		$user = TAWUser::singleton();
		
		$devices = $db->read_company_devices($user->get_company_id());
		$users = $db->read_company_users($user->get_company_id());
		
		$this->tawf->filter_data = array("devices"=>$devices, "users"=>$users);
		$this->tawf->company_data = $db->read_company_data($user->get_company_id());
		
	}
	
}
?>