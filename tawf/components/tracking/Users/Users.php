<?php

class Users extends TAWComponent {
	public function __construct() {
		parent::__construct("tracking/Users", true);

		$this->add_dependancy("jquery");
		
		$this->add_js("/js/users.js");
	}
	

	public function load($tawf) {
		if ($tawf->is_provided("mapcontroller")) {
			//$this->add_js("/js/user-mapping.js");
		}
		
		parent::load($tawf);
	}
	
	public function get_company_users() {
		header('Content-type: application/json');
		$db = TAWDBI::singleton();
		$user = TAWUser::singleton();
		
		$users = $db->read_company_users($user->get_company_id());
		
		echo json_encode(array("users"=>$users));
	}
	
	public function save_company_user() {
		$db = TAWDBI::singleton();
		$user = TAWUser::singleton();
		
		$params = array(
			"CompanyID"=>$user->get_company_id(),
			"CompanyGroupID"=> $db->sanitizeInt($this->tawf->data["CompanyGroupID"]),
			"CompanyUserAccessLevel"=>$db->sanitizeInt($this->tawf->data["CompanyUserAccessLevel"]),
			"CompanyUserEmail"=>$this->tawf->data["CompanyUserEmail"],
			"CompanyUserPassword"=>$this->tawf->data["CompanyUserPassword"],
			"CompanyUserName"=>$this->tawf->data["CompanyUserName"],
			"CompanyUserAddress"=>$this->tawf->data["CompanyUserAddress"],
			"CompanyUserPhone"=>"",
			"CompanyUserMobilePhone"=>$this->tawf->data["CompanyUserMobilePhone"],
			"CompanyManageGroupID"=>$db->sanitizeInt($this->tawf->data["CompanyManageGroupID"]),
                        "CompanyManageDivisionID"=>$db->sanitizeInt($this->tawf->data["CompanyManageDivisionID"]),
			//"CompanyUserTimezone"=>$this->tawf->data["CompanyUserTimezone"]
			"TimezoneID"=>$db->sanitizeInt($this->tawf->data["TimezoneID"])
		);
		
		if ($this->tawf->data["CompanyUserID"]) {
			$params["CompanyUserID"] = $this->tawf->data["CompanyUserID"];
			unset($params["CompanyID"]);
                        
                        $params["DefaultMapLatitude"] = $db->sanitizeFloat($this->tawf->data["DefaultMapLatitude"]);
                        $params["DefaultMapLongitude"] =$db->sanitizeFloat($this->tawf->data["DefaultMapLongitude"]);
                        $params["DefaultMapZoom"] = $db->sanitizeFloat($this->tawf->data["DefaultMapZoom"]);

			$user = $db->sp2("vision2020", "UpdateCompanyUser", $params);
		} else {
			$user = $db->sp2("vision2020", "InsertCompanyUser", $params);
		}

		// Permissions stuff, if applicable
		if (isset($this->tawf->data["division_permissions"]) && count($this->tawf->data["division_permissions"])) {
			if (is_array($this->tawf->data["division_permissions"])) {
				foreach ($this->tawf->data["division_permissions"] as $division) {
					$db->sp("vision2020", "InsertCompanyDivisionPermission", array("CompanyUserID"=>$user[0]["CompanyUserID"], "CompanyDivisionID"=>$division));
				}
			} else {
				$db->sp("vision2020", "InsertCompanyDivisionPermission", array("CompanyUserID"=>$user[0]["CompanyUserID"], "CompanyDivisionID"=>$this->data["division_permissions"]));
			}
		}
		
		if (isset($this->tawf->data["division_permissions"]) && count($this->tawf->data["group_permissions"])) {
			if (is_array($this->tawf->data["group_permissions"])) {
				foreach ($this->tawf->data["group_permissions"] as $group) {
					$db->sp("vision2020", "InsertCompanyGroupPermission", array("CompanyUserID"=>$user[0]["CompanyUserID"], "CompanyGroupID"=>$group));
				}
			} else {
					$db->sp("vision2020", "InsertCompanyGroupPermission", array("CompanyUserID"=>$user[0]["CompanyUserID"], "CompanyGroupID"=>$this->data["group_permissions"]));
			}
		}
		
		// Tags
		if (isset($this->tawf->data["Tags"])) {
			if (is_array($this->tawf->data["Tags"])) {
				$db->sp("vision2020", "DeleteCompanyUserTags", array("CompanyUserID"=>$user[0]["CompanyUserID"]));
				
				foreach ($this->tawf->data["Tags"] as $tag) {
					$db->sp("vision2020", "InsertCompanyUserTag", array("CompanyUserID"=>$user[0]["CompanyUserID"], "Tag"=>$tag));
				}
			}
			
			
		}
		
		// Device user update
		$db->sp("vision2020", "UpdateDeviceUser", array("UserID"=>$user[0]["CompanyUserID"], "DeviceID"=>$this->tawf->data["device_id"]));
		
		//$user[0]["permissions"] = $this->read_company_user_permissions($user[0]["CompanyUserID"]);
		
		echo json_encode(array("user"=>$user[0], "response"=>array()));
	}
	
	public function delete_company_user() {
		$db = TAWDBI::singleton();

		$db->sp("vision2020", "DeleteCompanyUser", array("CompanyUserID"=>$this->tawf->data["CompanyUserID"]));
		
		echo json_encode(array("response"=>array()));
	}
	
	public function db_read_company_users($company_id) {
		$db = TAWDBI::singleton();
		$u = TAWUser::singleton();		
/*		$users = $db->sp("vision2020", "GetCompanyUserByCompanyID", array(
			"CompanyID"=>$company_id
		));
*/
		$users = $db->sp("vision2020", "GetCompanyUserbyUserID", array(
			"UserID"=>$u->get_id()
		));		
		if ($u->is_limited()) {
			foreach ($users as $user_id=>$user) {
				if (!in_array($user["CompanyUserID"], $u->get_allowed_view_list())) {
					unset($users[$user_id]);
					continue;
				}
				
			}
		}
		
		
		if (count($users)) {
		
			// Get the permissions for each		
			$users_arr = array();
			foreach ($users as $user) {
				$users_arr[] = $user["CompanyUserID"];
			}
			
			// fetch them
			$division_permissions = $db->query("SELECT CompanyUserID,CompanyDivisionID FROM [vision2020].[dbo].[CompanyDivisionPermission] WHERE CompanyUserID IN (" . implode(',',$users_arr) . ")");
			$group_permissions = $db->query("SELECT CompanyUserID,CompanyGroupID FROM [vision2020].[dbo].[CompanyGroupPermission] WHERE CompanyUserID IN (" . implode(',',$users_arr) . ")");
			
			// Merge them to the users
			foreach ($users as $uid=>$user) {
				$users[$uid]["permissions"] = array("divisions"=>array(), "groups"=>array());
				
				foreach ($division_permissions as $perm) {
					if ($user["CompanyUserID"] == $perm["CompanyUserID"]) {
						$users[$uid]["permissions"]["divisions"][] = $perm["CompanyDivisionID"];
					}
				}
				
				foreach ($group_permissions as $perm) {
					if ($user["CompanyUserID"] == $perm["CompanyUserID"]) {
						$users[$uid]["permissions"]["groups"][] = $perm["CompanyGroupID"];
					}
				}

                                // TODO _ we should get this data from the GetCompanyUserByCompanyID directly to avoid the extra-query
				$detail = $db->sp("vision2020", "GetCompanyUser", array("CompanyUserID"=>$user["CompanyUserID"]));
                                $detail = $detail[0];
                                $users[$uid]["DefaultMapLatitude"] = $detail["DefaultMapLatitude"];
                                $users[$uid]["DefaultMapLongitude"] = $detail["DefaultMapLongitude"];
                                $users[$uid]["DefaultMapZoom"] = $detail["DefaultMapZoom"];
				
				// Get the user tags
				$tags = $db->sp("vision2020", "GetCompanyUserTags", array("CompanyUserID"=>$user["CompanyUserID"]));
				 
				$users[$uid]["tags"] = array();
				
				foreach ($tags as $tag) {
					$users[$uid]["tags"][] = $tag["Tag"];
				}
			}

		}

		return $users;
	}
	
	public function db_read_company_user_permissions($id) {
		$db = TAWDBI::singleton();
		
		$division_permissions = $db->sp("vision2020", "GetCompanyUserDivisionPermissions", array("CompanyUserID"=>$id));
		$group_permissions = 	$db->sp("vision2020", "GetCompanyUserGroupPermissions", array("CompanyUserID"=>$id));
		
		return array("divisions"=>$division_permissions, "groups"=>$group_permissions);
	}

	public function db_read_user_division_group_drivers($userId, $divisionId, $groupId) {
		$db = TAWDBI::singleton();
		return $db->sp2("vision2020", "GetUserDivisionGroupDriverList", array("UserID" => $userId, "GroupID" => $groupId, "DivisionID" => $divisionId));
	}

	public function get_division_group_drivers() {
		
		header('Content-type: application/json');
		
		$u = TAWUser::singleton();
		$divisionId = !empty($this->tawf->data["divisionId"]) ? $this->tawf->data["divisionId"] : null;
		$groupId = !empty($this->tawf->data["groupId"]) ? $this->tawf->data["groupId"] : null;

		echo json_encode($this->db_read_user_division_group_drivers($u->get_id(), $divisionId, $groupId));
	}

}
?>