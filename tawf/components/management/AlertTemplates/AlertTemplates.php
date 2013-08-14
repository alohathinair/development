<?php
class AlertTemplates extends TAWComponent {
	public function __construct() {
		parent::__construct("management/AlertTemplates", true);

		$this->add_dependancy("jquery");
		
		$this->add_js("/js/alert-templates.js");
	}

	public function get_alert_templates() {
		
		$db = TAWDBI::singleton();
		$user = TAWUser::singleton();
		
		$templates = $db->read_alert_templates($user->get_company_id());
		
		echo json_encode(array("templates"=>$templates));
	}
	
	public function save_alert_template() {
		$user = TAWUser::singleton();
		$db = TAWDBI::singleton();
		
		$params = array(
			"CompanyID"=>$user->get_company_id(),
			"AlertTemplateName"=>$this->tawf->data["AlertTemplateName"],
			"EmailSubject"=>$this->tawf->data["EmailSubject"],
			"EmailMessage"=>$this->tawf->data["EmailMessage"],
			"SMSMessage"=>$this->tawf->data["SMSMessage"],
			"VoiceSubject"=>'',
			"VoiceMessage"=>""
		);
		
		if ($this->tawf->data["AlertTemplateID"]) {
			$params["AlertTemplateID"] = $this->tawf->data["AlertTemplateID"];
			$template = $db->sp("vision2020", "UpdateAlertTemplate", $params);
		} else {
			$template = $db->sp("vision2020", "InsertAlertTemplate", $params);
		}
		
		echo json_encode(array("alertTemplate"=>$template[0], "response"=>array()));
	}
	
	public function delete_alert_template() {
		$db = TAWDBI::singleton();
		
		$db->sp("vision2020", "DeleteAlertTemplate", array("AlertTemplateID"=>$this->tawf->data["AlertTemplateID"]));
		
		echo json_encode(array("response"=>array()));
	}
	
	
	public function db_read_alert_templates($company_id) {
		// Get our needed singletons
		$db = TAWDBI::singleton();
		
		$templates = $db->sp("vision2020", "GetAlertTemplateByCompanyID2", array(
			"CompanyID"=>$company_id
		));
		
		return $templates;
	}
}
?>