<?php
class DeviceManagement extends TAWComponent {
	public function __construct() {
		parent::__construct("management/DeviceManagement", true);

		$this->add_dependancy("jquery");
		$this->add_dependancy("devices");

        $this->add_css("http://cdn.kendostatic.com/2013.1.319/styles/kendo.common.min.css");
        $this->add_css("http://cdn.kendostatic.com/2013.1.319/styles/kendo.default.min.css");

        $this->add_js("http://cdn.kendostatic.com/2013.1.319/js/kendo.all.min.js");

        $this->add_css("/css/device-management.css");
		$this->add_js("/js/device-management.js");

	}
	
	public function get_device_management_data() {
		$db = TAWDBI::singleton();
		$user = TAWUser::singleton();

                $groupId = null;
                $divisionId = null;

                if (isset($this->tawf->data["group"])) {
                    $param = explode("|", $this->tawf->data["group"]);
                    $divisionId = $param[0];
                    if (count($param)>1) {
                        $groupId = $param[1];
                    }
   
                }
                $devices = $db->read_company_devices_setup($user->get_company_id(), $groupId, $divisionId);

                $users = $db->read_company_users($user->get_company_id());
		
                //$users = $db->read_company_users($user->get_company_id());

                $vehicleTypes = $db->sp("vision2020", "GetVehicleTypeList", array());
                $divisionGroups = $db->sp("vision2020", "GetUserDivisionGroupList", array("UserID" => $user->get_id()));
                $divisionTree = array();
                
                foreach ($divisionGroups as $divisionGroup) {
                    $divisionID = $divisionGroup["CompanyDivisionID"];
                    if (empty($divisionTree[$divisionID])) {
                        $divisionTree[$divisionID] = array(
                            "CompanyDivisionID" => $divisionID,
                            "CompanyDivisionName" => $divisionGroup["CompanyDivisionName"],
                            "groups" => array()
                        );
                    }
                    $divisionTree[$divisionID]["groups"][] = $divisionGroup;
                }

                $divisionDrivers = $db->sp("vision2020", "GetUserDriverList", array("UserID" => $user->get_id()));

		/*echo json_encode(
                        array(
                            'devices' => $devices,
                            'users' => $users,
                            'vehicleTypes' => $vehicleTypes,
                            'divisionGroups' => $divisionGroups,
                            'divisionTree' => $divisionTree,
                            'divisionDrivers' => $divisionDrivers)
                );*/
        echo  "{\"data\":" .json_encode(array(
            'devices' => $devices,
            'users' => $users,
            'vehicleTypes' => $vehicleTypes,
            'divisionGroups' => $divisionGroups,
            'divisionTree' => $divisionTree,
            'divisionDrivers' => $divisionDrivers)). "}";
	}

    public function get_device_management_data_devices() {
        $db = TAWDBI::singleton();
        $user = TAWUser::singleton();

        $groupId = null;
        $divisionId = null;

        if (isset($this->tawf->data["group"])) {
            $param = explode("|", $this->tawf->data["group"]);
            $divisionId = $param[0];
            if (count($param)>1) {
                $groupId = $param[1];
            }

        }
        $devices = $db->read_company_devices_setup($user->get_company_id(), $groupId, $divisionId);


        /*echo json_encode(
                        array(
                            'devices' => $devices,
                            'users' => $users,
                            'vehicleTypes' => $vehicleTypes,
                            'divisionGroups' => $divisionGroups,
                            'divisionTree' => $divisionTree,
                            'divisionDrivers' => $divisionDrivers)
                );*/

        header("Content-type: application/json");
        echo  "{\"data\":" .json_encode($devices). "}";
    }

}
?>