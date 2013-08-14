<?php
define("RACO_SMS", 1);
define("RACO_SMS_ID", 328);
define("RACO_SMS_KEY", "E754AE729F82B7B8E634BD473D3E2773");
define("RACO_SMS_URL", "http://t-mobile.racowireless.com/smsricochet1.0/Send.asmx/SendSMS");
define("SMS_COMMAND_STARTER_KILL", 1);
define("SMS_COMMAND_STARTER_ENABLE", 2);

class Devices extends TAWComponent {
	public function __construct() {
		parent::__construct("tracking/Devices", true);

		$this->add_dependancy("jquery");
		
		$this->add_js("/js/devices.js");
	}
	
	public function load($tawf) {
		
		parent::load($tawf);
	}
	
	public function get_company_devices() {
		
		$db = TAWDBI::singleton();
		$user = TAWUser::singleton();
		$devices = $db->read_company_devices($user->get_company_id());
		
		echo json_encode(array("devices"=>$devices));
	}
	
	public function get_address_from_latlon() {
		$db = TAWDBI::singleton();
		$user = TAWUser::singleton();
		
		$address = $db->get_address($this->tawf->data["Latitude"], $this->tawf->data["Longitude"]);
		
		echo json_encode(array("address"=>$address[0]["computed"]));
	}
	
	// This method updates a devices metadata
	public function save_device() {
		$db = TAWDBI::singleton();

                $user = TAWUser::singleton();

                $data = array(
			"DeviceID"=>$this->tawf->data["DeviceID"],
			"UserID"=>$user->get_id(),/*$this->tawf->data["UserID"]*/
			"Name"=>$this->tawf->data["Name"],
                        "AssignedUserID"=> empty($this->tawf->data["UserID"]) ? null : $this->tawf->data["UserID"],
                        "AssignedGroupID"=> empty($this->tawf->data["GroupID"]) ? null : $this->tawf->data["GroupID"],
                        "ExternalIdentifier" => $this->tawf->data["ExternalIdentifier"],
                        "VehicleTypeID" =>  !empty($this->tawf->data["VehicleTypeID"]) ? $this->tawf->data["VehicleTypeID"]: null,
                        "VehicleMake" =>  $this->tawf->data["VehicleMake"],
                        "VehicleModel" =>  $this->tawf->data["VehicleModel"],
                        "VehicleYear" =>  $this->tawf->data["VehicleYear"],
                        "VehiclePlate" =>  $this->tawf->data["VehiclePlate"],
                        "VehicleColor" =>  $this->tawf->data["VehicleColor"],
                        "VehicleVIN" =>  $this->tawf->data["VehicleVIN"],
                        "GrantNumber" =>  $this->tawf->data["GrantNumber"],
                        "GranteeName" =>  $this->tawf->data["GranteeName"],
                        "ActivityNumber" =>  $this->tawf->data["ActivityNumber"],
                        "Notes" =>  $this->tawf->data["Notes"]
                );

                if (isset($this->tawf->data["EnteredOdometer"])) {
                    $data["EnteredOdometer"] = $this->tawf->data["EnteredOdometer"];
                }
 
		// Save the device
		$device = $db->sp2("vision2020", "UpdateDeviceSetup", $data);
		
		// Clear and save the new set of tags
		if (isset($this->tawf->data["Tags"])) {
			if (is_array($this->tawf->data["Tags"])) {
				$db->sp("vision2020", "DeleteDeviceTags", array("DeviceID"=>$this->tawf->data["DeviceID"]));
				
				foreach ($this->tawf->data["Tags"] as $tag) {
					$db->sp("vision2020", "InsertDeviceTag", array("DeviceID"=>$this->tawf->data["DeviceID"], "Tag"=>$tag));
				}
			}
			
			
		}


		echo json_encode(array("device"=>$device[0]));
	}
	
	public function get_recent_history() {
		$db = TAWDBI::singleton();
		$user = TAWUser::singleton();
		
		$start = date("m/d/Y h:i:s A", time()-86400);
		$end = date("m/d/Y h:i:s A", time());

		$history = $db->sp("gps1", "getDeviceHistory", array(
				"DeviceID"=>$this->tawf->data["DeviceID"],
				"FromDateTime"=>$start,
				"ToDateTime"=>$end,
				"Top"=>100000,
				"OrderBy"=>"DESC"
		));
		
		// Sanatize history
		foreach ($history as $hist_id=>$hist) {
			$history[$hist_id]["LastRecv"] = date($db->get_time_format(), strtotime($hist["LastRecv"])+(3600*$user->get_time_adjustment()));
			$history[$hist_id]["LastRecv"] = substr($hist["LastRecv"], 0, -2) . " " . substr($hist["LastRecv"], -2);
		}
		
		echo json_encode(array("history"=>$history));
	}
	
	public function send_sms() {
		//$carrier = RACO_SMS; // Always this, for now
		$db = TAWDBI::singleton();
		$user = TAWUser::singleton();
		
		// Need to convert into the phone number
		$to_device_id = $this->tawf->data["device_id"];
		$command = $this->tawf->data["command"];
		
		
		$postfields = array();
		$postfields["partnerId"] = RACO_SMS_ID;
		$postfields["webServiceKey"] = RACO_SMS_KEY;
		
		$result = $db->query("SELECT StarterEnabled,Phone FROM vision2020.dbo.Device WHERE DeviceID='$to_device_id'");
		$phone = $result[0]["Phone"];
		
		if (is_null($phone)) {
			echo json_encode(array("status"=>"invalid_configuration"));
		} else if (in_array($result[0]["StarterEnabled"], array(2,3))) {
			echo json_encode(array("status"=>"pending_operation"));
		} else {		
			$postfields["to"] = $phone;
			
			switch ($command) {
				case SMS_COMMAND_STARTER_KILL:
					$postfields["message"] = urlencode("AT+GTOUT=gv100,0,0,0,,,,,,,,,,,,,,,,,0001$"); #Seriel of 0001 is kill; 0002 is on
					break;
				case SMS_COMMAND_STARTER_ENABLE:
					$postfields["message"] = urlencode("AT+GTOUT=gv100,1,0,0,,,,,,,,,,,,,,,,,0002$"); #Seriel of 0001 is kill; 0002 is on
					break;
					
			}
			
			foreach($postfields as $key=>$value) { $fields_string .= $key.'='.$value.'&'; } 

			rtrim($fields_string,'&');
			
			$ch = curl_init(RACO_SMS_URL);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($ch, CURLOPT_POST, true);
			curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);
			
			//echo curl_exec($ch);
			$xml = simplexml_load_string(curl_exec($ch));
			
			if ($xml->ServiceResult == "ACCEPTED") {
				
				switch ($command) {
					case SMS_COMMAND_STARTER_KILL:
						// Update the Device StarterEnabled field to be 2 (Pending Turn Off)    ; 3 = pending turn on
						$db->query("UPDATE vision2020.dbo.Device SET StarterEnabled='2' WHERE DeviceID='$to_device_id'");
						break;
					case SMS_COMMAND_STARTER_ENABLE:
						// Update the Device StarterEnabled field to be 3 (Pending Turn On)    ; 3 = pending turn on
						$db->query("UPDATE vision2020.dbo.Device SET StarterEnabled='3' WHERE DeviceID='$to_device_id'");
						break;
				}
				
				echo json_encode(array("status"=>"success"));
			} else {
				echo json_encode(array("status"=>"send_failed (" . $xml->ServiceResult . ")"));
			}
		}
		
	}
	
	function get_device_starter_status() {
		$db = TAWDBI::singleton();
		
		$device_id = $this->tawf->data["device_id"];
		
		$device = $db->get_device_by_id($device_id);
		
		echo json_encode(array("starter_enabled"=>$device["StarterEnabled"]));
	}


        public function get_tpms_now() {
                $db = TAWDBI::singleton();
                $user = TAWUser::singleton();

                $tpms = $db->sp("vision2020", "GetTPMSNow", array(
			"UserID"=>$user->get_id(),
			"DeviceID"=>$this->tawf->data["DeviceID"],
		));

                echo json_encode(array("tpms" => $tpms));
        }


	public function db_get_history($device_id, $start, $end) {
		$db = TAWDBI::singleton();
		$user = TAWUser::singleton();


		$history = $db->sp("gps1","GetDeviceHistory", array(
				"DeviceID"=>$device_id,
				"FromDateTime"=>$start,
				"ToDateTime"=>$end,
				"Top"=>100000,
				"OrderBy"=>"DESC"
		));
		
		// Sanatize history
		foreach ($history as $hist_id=>$hist) {
			$history[$hist_id]["LastRecv"] = date($db->get_time_format(), strtotime($hist["LastRecv"])+(3600*$user->get_time_adjustment()));
			//$history[$hist_id]["LastRecv"] = substr($hist["LastRecv"], 0, -2) . " " . substr($hist["LastRecv"], -2);
			

		}
		
		return $history;
	}
	

	public function db_read_company_devices($company_id) {
		// Get our needed singletons
		$user = TAWUser::singleton();
		$db = TAWDBI::singleton();
		
		$devices = $db->sp("vision2020", "GetDeviceByCompanyID", array(
			"CompanyID"=>$company_id
		));
		
		foreach ($devices as $device_id=>$device) {
			// If this user is only a dispatcher then we must limit the results to only the users they have access to.
			if ($user->is_limited() && !in_array($device["UserID"], $user->get_allowed_view_list())) {
				unset($devices[$device_id]);
				continue;
			}
			
			// Nab tags
			$devices[$device_id]["tags"] = array();
			
			$tags = $db->sp("vision2020", "GetDeviceTags", array("DeviceID"=>$devices[$device_id]["DeviceID"]));
			
			foreach ($tags as $tag) {
				$devices[$device_id]["tags"][] = $tag["Tag"];
			}
			
			// Before returning events we must adjust their times from database time to user time
			$devices[$device_id]["LastRecv"] = date($db->get_time_format(), strtotime($device["LastRecv"])+(3600*$user->get_time_adjustment()));
			$devices[$device_id]["LastPingedAt"] = date($db->get_time_format(), strtotime($device["LastPinged"])+(3600*$user->get_time_adjustment()));
		}
		
		return $devices;
	}

	public function db_read_user_division_group_devices($user_id, $division_id=null, $group_id=null) {
		// Get our needed singletons
		$user = TAWUser::singleton();
		$db = TAWDBI::singleton();
		
		$devices = $db->sp2("vision2020", "GetUserDivisionGroupVehicleList", array(
			"UserID"=>$user_id,
			"DivisionID"=>$division_id,
			"GroupID"=>$group_id
		));
		
		foreach ($devices as $device_id=>$device) {

			// Nab tags
			$devices[$device_id]["tags"] = array();


                        $infoResults = $db->sp("vision2020", "GetDeviceSetup", array("UserID" => $user->get_id(), "DeviceID"=>$devices[$device_id]["DeviceID"]));
                        $info = $infoResults[0];
                        $devices[$device_id]['Name'] = $devices[$device_id]['Vehicle'];
                        $devices[$device_id]['UserID'] = $info['UserID'];
                        $devices[$device_id]['GroupID'] = $info['GroupID'];
                        //$devices[$device_id]['Serial'] = "#####".substr($info['Serial'], -10);  // Mask the first 5 digits
                        $devices[$device_id]['Serial'] = $info['Serial'];
                        $devices[$device_id]['VehicleTypeID'] = $info['VehicleTypeID'];
                        $devices[$device_id]['VehicleMake'] = $info['VehicleMake'];
                        $devices[$device_id]['VehicleModel'] = $info['VehicleModel'];
                        $devices[$device_id]['VehicleYear'] = $info['VehicleYear'];
                        $devices[$device_id]['VehicleColor'] = $info['VehicleColor'];
                        $devices[$device_id]['VehicleVIN'] = $info['VehicleVIN'];
                        $devices[$device_id]['VehiclePlate'] = $info['VehiclePlate'];
                        $devices[$device_id]['GrantNumber'] = $info['GrantNumber'];
                        $devices[$device_id]['GranteeName'] = $info['GranteeName'];
                        $devices[$device_id]['ActivityNumber'] = $info['ActivityNumber'];
                        $devices[$device_id]['Notes'] = $info['Notes'];
                        $devices[$device_id]['EnteredOdometer'] = $info['EnteredOdometer'];
                        $devices[$device_id]['EnteredOdometerModified'] = $info['EnteredOdometerModified'];
                        if ($info['EnteredOdometerModified']) {
                            $devices[$device_id]["EnteredOdometerModified"] = date($db->get_time_format(), strtotime($info["EnteredOdometerModified"]));
                        }
                        //$devices[$device_id]['CurrentOdometer'] = number_format($info['CurrentOdometer']);
                        $devices[$device_id]['CurrentOdometer'] = $info['CurrentOdometer'];

                        // Get some more info
                        $info = $this->db_get_device_by_id($info['DeviceID']);
                        $devices[$device_id]["ExternalIdentifier"] = $info["ExternalIdentifier"];

			
		}

		return $devices;
	}

        public function db_read_company_devices_setup($company_id, $group_id, $division_id) {
		// Get our needed singletons
		$user = TAWUser::singleton();
		$db = TAWDBI::singleton();

                $params = array(
			"UserID" => $user->get_id(),
                        "DivisionID" => empty($division_id) ? null : $division_id,
                        "GroupID" => empty($group_id) ? null : $group_id
                );
               // print_r($params);
                //die();
                $devices = $db->sp2("vision2020", "GetVehicleEquipmentList", $params);
            /*
                $devices = $db->sp("vision2020", "GetDeviceByCompanyID", array(
			"CompanyID"=>$company_id
		));
		*/

		foreach ($devices as $device_id=>$device) {

			// Nab tags
			$devices[$device_id]["tags"] = array();


                        $infoResults = $db->sp("vision2020", "GetDeviceSetup", array("UserID" => $user->get_id(), "DeviceID"=>$devices[$device_id]["DeviceID"]));
                        $info = $infoResults[0];
                        
                        $devices[$device_id]['UserID'] = $info['UserID'];
                        $devices[$device_id]['GroupID'] = $info['GroupID'];
                        //$devices[$device_id]['Serial'] = "#####".substr($info['Serial'], -10);  // Mask the first 5 digits
                        $devices[$device_id]['Serial'] = $info['Serial'];
                        $devices[$device_id]['VehicleTypeID'] = $info['VehicleTypeID'];
                        $devices[$device_id]['VehicleMake'] = $info['VehicleMake'];
                        $devices[$device_id]['VehicleModel'] = $info['VehicleModel'];
                        $devices[$device_id]['VehicleYear'] = $info['VehicleYear'];
                        $devices[$device_id]['VehicleColor'] = $info['VehicleColor'];
                        $devices[$device_id]['VehicleVIN'] = $info['VehicleVIN'];
                        $devices[$device_id]['VehiclePlate'] = $info['VehiclePlate'];
                        $devices[$device_id]['GrantNumber'] = $info['GrantNumber'];
                        $devices[$device_id]['GranteeName'] = $info['GranteeName'];
                        $devices[$device_id]['ActivityNumber'] = $info['ActivityNumber'];
                        $devices[$device_id]['Notes'] = $info['Notes'];
                        $devices[$device_id]['EnteredOdometer'] = $info['EnteredOdometer'];
                        $devices[$device_id]['EnteredOdometerModified'] = $info['EnteredOdometerModified'];
                        if ($info['EnteredOdometerModified']) {
                            $devices[$device_id]["EnteredOdometerModified"] = date($db->get_time_format(), strtotime($info["EnteredOdometerModified"]));
                        }
                        //$devices[$device_id]['CurrentOdometer'] = number_format($info['CurrentOdometer']);
                        $devices[$device_id]['CurrentOdometer'] = $info['CurrentOdometer'];

                        // Get some more info
                        $info = $this->db_get_device_by_id($info['DeviceID']);
                        $devices[$device_id]["ExternalIdentifier"] = $info["ExternalIdentifier"];

			
		}

		return $devices;
	}

        public function db_read_company_devices_liveview($company_id) {
		// Get our needed singletons
		$user = TAWUser::singleton();
		$db = TAWDBI::singleton();

		/*$devices = $db->sp("vision2020", "GetMapViewLiveUser", array(
			"UserID"=>$user->get_id()
		));*/
         $devices = $db->sp2("vision2020", "GetMapViewLiveUserDivisionGroup", array(
			"UserID"=>$user->get_id(),
                  "DivisionID" => null,
                     "GroupID" => null
		));

/*		foreach ($devices as $device_id=>$device) {
			// If this user is only a dispatcher then we must limit the results to only the users they have access to.
			if ($user->is_limited() && !in_array($device["UserID"], $user->get_allowed_view_list())) {
				unset($devices[$device_id]);
				continue;
			}

			// Nab tags
			$devices[$device_id]["tags"] = array();

			$tags = $db->sp("vision2020", "GetDeviceTags", array("DeviceID"=>$devices[$device_id]["DeviceID"]));

			foreach ($tags as $tag) {
				$devices[$device_id]["tags"][] = $tag["Tag"];
			}

			// Before returning events we must adjust their times from database time to user time
			//$devices[$device_id]["LastRecv"] = date($db->get_time_format(), strtotime($device["LastRecv"]));
			//$devices[$device_id]["LastPingedAt"] = date($db->get_time_format(), strtotime($device["LastPinged"]));
		}
*/
		return $devices;
	}

	/*public function db_read_company_devices_liveview($company_id) {
		// Get our needed singletons
		$user = TAWUser::singleton();
		$db = TAWDBI::singleton();
		
		$devices = $db->sp("vision2020", "GetMapViewLiveCompany", array(
			"CompanyID"=>$company_id
		));
		
		foreach ($devices as $device_id=>$device) {
			// If this user is only a dispatcher then we must limit the results to only the users they have access to.
			if ($user->is_limited() && !in_array($device["UserID"], $user->get_allowed_view_list())) {
				unset($devices[$device_id]);
				continue;
			}
			
			// Nab tags
			$devices[$device_id]["tags"] = array();
			
			$tags = $db->sp("vision2020", "GetDeviceTags", array("DeviceID"=>$devices[$device_id]["DeviceID"]));
			
			foreach ($tags as $tag) {
				$devices[$device_id]["tags"][] = $tag["Tag"];
			}
			
			// Before returning events we must adjust their times from database time to user time
			$devices[$device_id]["LastRecv"] = date($db->get_time_format(), strtotime($device["LastRecv"])+(3600*$user->get_time_adjustment()));
			$devices[$device_id]["LastPingedAt"] = date($db->get_time_format(), strtotime($device["LastPinged"])+(3600*$user->get_time_adjustment()));
		}
		
		return $devices;
	}
	*/
	
	public function db_get_device_by_user_id($user_id) {
		$db = TAWDBI::singleton();
		$devices = $db->query("SELECT * FROM [vision2020].[dbo].[Device] WHERE UserID='" . $user_id . "'");
		
		if (!count($devices))
			return null;
		
		return $devices[0];
	}
	
	public function db_get_device_by_id($id) {
		$db = TAWDBI::singleton();
		$devices = $db->query("SELECT * FROM [vision2020].[dbo].[Device] WHERE DeviceID='" . $id . "'");
		
		if (!count($devices))
			return null;
		
		return $devices[0];
	}
	
	public function db_get_address($latitude, $longitude) {
		$db = TAWDBI::singleton();
		$address = $db->sp("vision2020", "spRevGeocode", array("Lat"=>$latitude,"Lon"=>$longitude));
		
		return $address;
	}

	public function db_get_devices_by_user($user_id, $group_id) {
		$db = TAWDBI::singleton();

                $params = array("UserID"=>$user_id);

                if ($group_id)
                    $params["GroupID"] = $group_id;

		$devices = $db->sp("vision2020", "GetDevicesByUser", $params);
		return $devices;
	}

}
?>