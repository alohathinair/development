<?php

ini_set('display_errors',1);
error_reporting(E_ALL|E_STRICT);

class Dashboard extends TAWComponent {
	public function __construct() {
		parent::__construct("tracking/RouteHistory", true);

		$this->add_dependancy("jquery");
		
		//$this->add_js("/js/routeplayback.js");
	}
	
	public function load($tawf) {
		parent::load($tawf);
	}

        public function get_device_for_user($devices, $userID) {
            foreach ($devices as $device) {
                if (isset($device["UserID"]) && $device["UserID"] == $userID)
                    return $device;
            }
            return null;
        }


	public function get_dashboard_request_information() {
            $db = TAWDBI::singleton();
            $user = TAWUser::singleton();

            $groupID = (isset($this->tawf->data["group"]) && $this->tawf->data["group"] > 0) ? $this->tawf->data ["group"] : NULL;
            $divisionID = (isset($this->tawf->data["division"]) && $this->tawf->data["division"] > 0) ? $this->tawf->data ["division"] : NULL;
            
            $devices = $db->read_user_division_group_devices($user->get_id(), $divisionID, $groupID);
           // $devices = $db->get_devices_by_user($user->get_id(), $groupID);
            //$devices = $db->read_company_devices($user->get_company_id());
            $divisions = $db->read_company_organization($user->get_company_id());
			$date_today = date("m-d-Y",strtotime($user->getUserCurrentDate()));
			
            echo json_encode(array("devices" => $devices, "date_today" => $date_today));

	}

	public function obtain_dashboard_request_information() {
            $db = TAWDBI::singleton();
            $user = TAWUser::singleton();

            //$devices = $db->get_devices_by_user($user->get_id(), NULL);
            $devices = $db->read_user_division_group_devices($user->get_id(), null, null);
            //$devices = $db->read_company_devices($user->get_company_id());
            //$divisions = $db->read_company_organization($user->get_company_id());
            $divisions = $db->read_user_division_group($user->get_id());

            $this->tawf->filter_data = array("devices" => $devices, "divisions" => $divisions);
	}
	
	
	public function get_route_history() {
		switch ($this->tawf->data["report"]) {
			default:
			case 1:
				echo json_encode($this->get_mapped_event_report());
				break;
			case 2:
				echo json_encode($this->get_mapped_history_report());
				break;
		}
	}

        private function get_start_date() {
            $start = DateTime::createFromFormat("m-d-Y h:i a", $this->tawf->data["start_date"])->format("m/d/Y");
            $start .=  " 12:00:00 AM";
            return $start;

        }

        private function get_end_date() {
            $end = DateTime::createFromFormat("m-d-Y h:i a", $this->tawf->data["end_date"])->format("m/d/Y");
            $end .=  " 11:59:59 PM";
            return $end;
        }

	private function get_mapped_event_report() {
		$user = TAWUser::singleton();
		$db = TAWDBI::singleton();

                /*$sql = "SELECT ActionEventTypeID, Name, Description FROM [gps1].[dbo].[ActionEventType]";
                $rows = $db->query($sql);
                print_r($rows);
*/
		// Build up our daterange
        //        $start = $this->get_start_date();
        //        $end = $this->get_end_date();
		$start = date("m/d/Y H:i:s", strtotime($this->tawf->data["start_date"]));
		$end = date("m/d/Y H:i:s", strtotime($this->tawf->data["end_date"]));
		
		// Start our SQL

		$sql = "SELECT DISTINCT ActionEvent.ActionEventID, ActionEvent.EventTimestamp, ActionEvent.ActionEventTypeID, Event.Latitude, Event.Longitude, Event.Heading, ActionEvent.EventData, Device.Name, CompanyUser.CompanyUserName, ActionEventType.Name as ActionEventTypeName, ActionEventType.Description as ActionEventTypeDescription
		FROM [gps1].[dbo].[ActionEvent] 
		INNER JOIN [gps1].[dbo].[Event] ON ActionEvent.EventID = Event.EventID
		INNER JOIN [vision2020].[dbo].[Device] ON ActionEvent.DeviceID = Device.DeviceID
		INNER JOIN [vision2020].[dbo].[CompanyUser] ON ActionEvent.UserID = CompanyUser.CompanyUserID
        INNER JOIN [gps1].[dbo].[ActionEventType] ON ActionEvent.ActionEventTypeID = ActionEventType.ActionEventTypeID
		WHERE ActionEvent.ActionEventTypeID IS NOT NULL AND ActionEvent.CompanyID=" . $user->get_company_id() . " AND EventTimestamp >= '$start' AND EventTimestamp <= '$end'";
		
		if ($this->tawf->data["filters"]) {
			$filters = array();
			
			foreach ($this->tawf->data["filters"] as $f) {
				$filters[] = $f;
			}
			
			$sql .= " AND ActionEvent.ActionEventTypeID IN ('" . implode("','", $this->tawf->data["filters"]) . "')";
		}
		
		if ($this->tawf->data["drivers"]) {
			$sql .= " AND ActionEvent.UserID IN ('" . implode("','", $this->tawf->data["drivers"]) . "')";
		}
//var_dump($this->tawf->data);
//die();
		
		
		$sql .= " ORDER BY EventTimestamp";
		
		$rows = $db->query($sql);
		
		// Timestamp
		foreach ($rows as $row_id=>$row) {
			//$rows[$row_id]["EventTimestamp"] = date($db->get_time_format(), strtotime($row["EventTimestamp"])+(3600*$user->get_time_adjustment()));
			
 			// Before returning events we must adjust their times from database time to user time
			$event_time = strtotime($row["EventTimestamp"])+(3600*$user->get_time_adjustment());
			$rows[$row_id]["EventTimestamp"] = date($db->get_time_format(), $event_time);
			
			// Here we calculate the number of seconds since the last idle/unidle
			// TODO - commented by Julian, this data is not there
                        /*if (in_array($rows[$row_id]["ActionEventTypeID"], array(10,11))) {
				$timeOfLast = strtotime($row["EventNotes"])+(3600*$user->get_time_adjustment());
				$rows[$row_id]["EventExtra"] = $event_time - $timeOfLast;
			}
                        */
		}
		
		header("Content-type: application/json");
		return array("results"=>$rows);
	}
	
	private function get_mapped_history_report() {
		$user = TAWUser::singleton();
		$db = TAWDBI::singleton();
		
		$device = $db->get_device_by_user_id($this->tawf->data["driver"]);
		$device_id = $device["DeviceID"];				
//		$start_date = date("m/d/Y 12:00:00", strtotime($this->tawf->data["start_date"])) . " AM";
//		$end_date = date("m/d/Y 11:59:59", strtotime($this->tawf->data["end_date"])) . " PM";
                $start_date = $this->get_start_date();
                $end_date = $this->get_end_date();

		$history = $db->get_history($device_id, $start_date, $end_date);
		
		return array("history"=>$history, "device_id"=>$device["DeviceID"]);
	}
	
}
/*
if (!function_exists("dates_between")) {
	function dates_between($start_date, $end_date) { 
	
	      
	     $start_date = is_int($start_date) ? $start_date : strtotime($start_date); 
	     $end_date = is_int($end_date) ? $end_date : strtotime($end_date); 
	      
	     $end_date -= (60 * 60 * 24); 
	      
	     $test_date = $start_date; 
	     $day_incrementer = 0; 
	      
	     $dates = array();
	     $dates[] = date("m/d/Y", $test_date);
	     
	     while ( $test_date < $end_date && ++$day_incrementer ) {
		     $test_date = $start_date + ($day_incrementer * 60 * 60 * 24); 
	         $dates[] = date("m/d/Y", $test_date); 
	     }
	     
	
	     
	     return $dates;
	 } 
 }
 
if (!function_exists("events_in_date")) {
	function events_in_date($events, $date) {
		$datedEvents = array();
		
		foreach ($events as $event) {
			if (strpos($event["EventTimestamp"], $date) !== false)
				$datedEvents[] = $event;
		}
		
		return $datedEvents;
	}
}
 **/

?>