<?php
class AlertRules extends TAWComponent {
	public function __construct() {
		parent::__construct("management/AlertRules", true);

		$this->add_dependancy("jquery");
		$this->add_dependancy("users");
		$this->add_dependancy("alerttemplates");
		
		
		$this->add_js("/js/alert-rules.js");
		$this->add_js("/js/manage-alert-rules.js");
                $this->add_css("/css/alert-rules.css");
		
	}

        public function db_read_event_type_alerts() {
            // Get our needed singletons
            $user = TAWUser::singleton();
            $db = TAWDBI::singleton();

            $eventTypes = $db->sp("gps1", "GetActionEventTypeAlerts", array("CompanyID"=>$user->get_company_id()));
            return $eventTypes;

        }

	public function get_alert_rules_page_data() {
		$user = TAWUser::singleton();
		$db = TAWDBI::singleton();
		
		$users = $db->read_company_users($user->get_company_id());
		$rules = $db->read_company_alert_rules($user->get_company_id());
		$templates = $db->read_alert_templates($user->get_company_id());
                $eventTypes = $this->db_read_event_type_alerts();
                $divisions = $db->read_user_division_group($user->get_id());
		
		echo json_encode(array("users"=>$users, "rules"=>$rules, "templates"=>$templates, "eventTypes" => $eventTypes, "divisions" => $divisions));
	}
	
	public function db_read_company_alert_rules($company_id) {
		$db = TAWDBI::singleton();
		
		$rules = $db->sp("vision2020", "GetCompanyAlertRulesByCompanyID", array(
			"CompanyID"=>$company_id
		));
		

		foreach ($rules as $key=>$rule) {
			$starr = array_values(array_filter(explode(" ", $rules[$key]["StartTime"])));
			$etarr = array_values(array_filter(explode(" ", $rules[$key]["EndTime"])));
			$rules[$key]["StartTime"] = substr($starr[3], 0, 5) . " " . substr($starr[3], -2);
			$rules[$key]["EndTime"] = substr($etarr[3], 0, 5) . " " . substr($etarr[3], -2);
			$rules[$key]["AlertRuleData"] = trim($rule["AlertRuleData"]);
		}
		
		return $rules;
	}
	
	public function save_alert_rule() {
		$user = TAWUser::singleton();
		$db = TAWDBI::singleton();
		
		if ($this->tawf->data["IsAllDay"]) {
			$this->tawf->data["StartTime"] = "12:00 AM";
			$this->tawf->data["EndTime"] = "11:59 PM";
		}
		
		$params = array(
			"CompanyID"=>$user->get_company_id(),
			"AlertTemplateID"=>(int)$this->tawf->data["AlertTemplateID"],
			"CompanyUserID"=>(int)$this->tawf->data["CompanyUserID"],
			"ActionEventTypeID"=>(int)$this->tawf->data["EventTypeID"],
			"DeliveryMethodID"=>(int)$this->tawf->data["DeliveryMethodID"],
			"AlertRuleData"=>$this->tawf->data["AlertRuleData"],
            "DivisionID" => !empty($this->tawf->data["DivisionID"]) ? $this->tawf->data["DivisionID"] : null,
            "GroupId" => !empty($this->tawf->data["GroupID"]) ? $this->tawf->data["GroupID"] : null,
			"IsAllDay"=>$this->tawf->data["IsAllDay"],
			"StartTime"=>"1/1/2000 " . $this->tawf->data["StartTime"],
			"EndTime"=>"1/1/2000 " . $this->tawf->data["EndTime"]
			
		);
	

		if ($this->tawf->data["id"]) {
			$params["AlertRuleID"] = $this->tawf->data["id"];

			$db->sp2("vision2020", "UpdateAlertRule", $params, false);
			echo json_encode(array("id"=>$this->tawf->data["id"]));
		} else {
			$id = $db->sp2("vision2020","InsertAlertRule", $params);
			
			echo json_encode(array("id"=>$id[0]["computed"]));
		}
	}
	
	public function delete_alert_rule() {
		$db = TAWDBI::singleton();
		$db->sp("vision2020", "DeleteAlertRule", array("AlertRuleID"=>$this->tawf->data["id"]));
	}
}
?>