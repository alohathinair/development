<?php
class CompanyOrganization extends TAWComponent {
	public function __construct() {
		parent::__construct("management/CompanyOrganization", true);


        $this->add_css("http://cdn.kendostatic.com/2013.1.319/styles/kendo.common.min.css");
        $this->add_css("http://cdn.kendostatic.com/2013.1.319/styles/kendo.default.min.css");

        $this->add_js("http://cdn.kendostatic.com/2013.1.319/js/kendo.all.min.js");

		$this->add_js("/js/organization.js");
        $this->add_js("/js/divisiongroup_helper.js");
	}
	
	public function get_company_organization() {
		$db = TAWDBI::singleton();
		$user = TAWUser::singleton();
		
		//$org = $db->read_company_organization($user->get_company_id());
        $org = array(
            array
            (
                'CompanyDivisionID' => '611',
                'CompanyDivisionName' => 'Division |',
                'groups' => array(
                    'CompanyGroupID' => '1173',
                    'CompanyDivisionID' => '611',
                    'CompanyGroupName' => 'Truck'
                ),
                'HasGroups' => true
            ),
            array
            (
                'CompanyDivisionID' => '613',
                'CompanyDivisionName' => 'Bus',
                'groups' => array(
                    'CompanyGroupID' => '1174',
                    'CompanyDivisionID' => '613',
                    'CompanyGroupName' => 'Bus 1'
                ),
                'HasGroups' => true
            )
        );


		//echo json_encode(array("organization"=>$org));
        $str = '[{"CompanyDivisionID":2,"CompanyDivisionName":"Andrew Fuller","HasGroups":true,"ReportsTo":null}]';
        echo $str;
	}
	
	
	
	public function save_division() {
		$db = TAWDBI::singleton();
		$user = TAWUser::singleton();
		
		$params = array("CompanyDivisionName"=>$this->tawf->data["division_name"]);
		
		if ($this->tawf->data["id"]) {
			$params["CompanyDivisionID"] = $this->tawf->data["id"];
			$division = $db->sp("vision2020", "UpdateCompanyDivision", $params);
		} else {
			$params["CompanyID"] = $user->get_company_id();
			$division = $db->sp("vision2020", "InsertCompanyDivision", $params);
		}
		
		echo json_encode(array("division"=>$division[0]));
	}
	
	public function delete_division() {
		$db = TAWDBI::singleton();
		$db->sp("vision2020", "DeleteCompanyDivision", array("CompanyDivisionID"=>$this->tawf->data["division_id"]));
	}
	
	public function save_group() {
		$db = TAWDBI::singleton();
		
		$params = array("CompanyDivisionID"=>$this->tawf->data["division_id"], "CompanyGroupName"=>$this->tawf->data["group_name"]);
		
		if ($this->tawf->data["id"]) {
			$params["CompanyGroupID"] = $this->tawf->data["id"];
			unset($params["CompanyDivisionID"]);
			$group = $db->sp("vision2020", "UpdateCompanyGroup", $params);
		} else {
			$group = $db->sp("vision2020", "InsertCompanyGroup", $params);
		}
		
		echo json_encode(array("group"=>$group[0]));
	}
	
	public function delete_group() {
		$db = TAWDBI::singleton();
		$db->sp("vision2020", "DeleteCompanyGroup", array("CompanyGroupID"=>$this->tawf->data["group_id"]));
	}

        public function db_read_user_division_group($user_id) {
       		$db = TAWDBI::singleton();
                $divisionGroups = $db->sp("vision2020", "GetUserDivisionGroupList", array("UserID"=>$user_id));
                $divisions = array();
                foreach ($divisionGroups as $divisionGroup) {
                    $divisionId = $divisionGroup['CompanyDivisionID'];
                    if (isset($divisions[$divisionId])) {
                        $division = $divisions[$divisionId];
                    } else {
                        $division = array(
                            "CompanyDivisionID" => $divisionId,
                            "CompanyDivisionName" => $divisionGroup['CompanyDivisionName'],
                            "groups" => array()
                        );
                        $divisions[$divisionId] = $division;
                    }
                    $divisions[$divisionId]['groups'][] = array(
                        "CompanyGroupID" => $divisionGroup['CompanyGroupID'],
                        "CompanyGroupName" => $divisionGroup['CompanyGroupName'],
                        "CompanyDivisionID" => $divisionId
                    );

                }

                $divisionsOut = array();
                foreach ($divisions as $division) {
                    $divisionsOut[] = $division;
                }
                return $divisionsOut;
        }

	public function db_read_company_organization($company_id) {
		$db = TAWDBI::singleton();
		
		// FIXME: ENSURE THIS IS UPDATED TO ONLY GET CERTAIN DIVISIONS
		
		$divisions = $db->sp("vision2020", "GetCompanyDivisions", array("CompanyID"=>$company_id));
		
		// Get the groups
		$groups = $db->sp("vision2020", "GetCompanyGroups", array("CompanyID"=>$company_id));
		
		// Assign the groups to the divisions
		foreach ($divisions as $d_id=>$division) {
			$divisions[$d_id]["groups"] = array();
			
			foreach ($groups as $group) {
				if ($group["CompanyDivisionID"] == $division["CompanyDivisionID"]) {
					$divisions[$d_id]["groups"][] = $group;
				}
			}
		}
		
		return $divisions;
	}
}
?>