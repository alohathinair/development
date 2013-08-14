<?php

class UserManagement extends TAWComponent {
	public function __construct() {
		parent::__construct("management/UserManagement", true);

		$this->add_dependancy("jquery");
		$this->add_dependancy("users");

        $this->add_css("http://cdn.kendostatic.com/2013.1.319/styles/kendo.common.min.css");
        $this->add_css("http://cdn.kendostatic.com/2013.1.319/styles/kendo.blueopal.min.css");

        $this->add_js("http://cdn.kendostatic.com/2013.1.319/js/kendo.all.min.js");

		$this->add_js("/js/user-management.js");
	}

		
	public function get_user_management() {
		$db = TAWDBI::singleton();
		$user = TAWUser::singleton();
		
		$org = $db->read_company_organization($user->get_company_id());
		$users = $db->read_company_users($user->get_company_id());
		$devices = $db->read_company_devices($user->get_company_id());
		
		$timezones = $db->sp("vision2020", "GetUserTimeZoneList");
		
		$default = $db->get_user_map_view($user->get_company_id()); //Company ID		
		foreach($users as $inc=>$key){
			
			$array_key= $key['CompanyUserID']; //CompanyUserID  echo $key['CompanyUserID']

			$temp= @$db->get_user_map_view($array_key);
			$map[$array_key] = (!empty($temp))? $temp : $default;			 
		}
                $company = $db->read_company_data($user->get_company_id());

		echo json_encode(
            array(
                "organization"=>$org,
                "users"=>$users,
                "devices"=>$devices,
                "timezones"=>$timezones,
                "map"=>$map,
                "company" => $company));


       /* echo  "{\"data\":" .json_encode(array(
                "organization"=>$org,
                "users"=>$users,
                "devices"=>$devices,
                "timezones"=>$timezones,
                "map"=>$map,
                "company" => $company)). "}";*/
	}




    // new function

    public function get_user_management_user() {

        $db = TAWDBI::singleton();
        $user = TAWUser::singleton();


        $users = $db->read_company_users($user->get_company_id());

        $default = $db->get_user_map_view($user->get_company_id()); //Company ID
        foreach($users as $inc=>$key){

            $array_key= $key['CompanyUserID']; //CompanyUserID  echo $key['CompanyUserID']

            $temp= @$db->get_user_map_view($array_key);
            $map[$array_key] = (!empty($temp))? $temp : $default;
        }

        header("Content-type: application/json");
        echo  "{\"data\":" .json_encode($users). "}";
    }


	//for Map View
	public function db_get_user_map_view($company_id){
		$db = TAWDBI::singleton();
		
		$info = $db->sp("vision2020", "GetCompany", array(
				"CompanyID"=>$company_id
		));
		
		return $info[0];
	}
	
}
?>