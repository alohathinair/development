<?php
class LiveView extends TAWComponent {
	public function __construct() {
		parent::__construct("tracking/LiveView", true);

		$this->add_dependancy("jquery");
		$this->add_dependancy("devices");
		$this->add_dependancy("users");
		$this->add_dependancy("events");
		$this->add_dependancy("landmarks");
                $this->add_dependancy("jqtip");
		
		$this->add_js("/js/liveview.js");
                $this->add_js("/js/tpms.js");
               // $this->add_component_js("jqueryui", "jquery.ui.ufd.min");
//                $this->add_component_css("jquery", "jquery.qtip.min");

        }

	public function get_liveview_data_params() {

		$db = TAWDBI::singleton();
		$user = TAWUser::singleton();

        //$divisions = $db->read_company_organization($user->get_company_id());
        $divisions = $db->read_user_division_group($user->get_id());

        $date_today=date("Y-n-j",strtotime($user->getUserCurrentDate()));
                
        echo json_encode(array("divisions" => $divisions, "overlay_url" => $this->get_overlay_url(), "date_today" => $date_today));

     }

    public function get_overlay_url() {
            $overlay = $this->get_overlay();
            if ($overlay) {
                return $overlay->public_uri();
            }
            return "";
    }

	public function get_overlay() {
            $u = TAWUser::singleton();
            $c_id = $u->get_company_id();
            $auth = new CF_Authentication("thinair1", "08170493ad0c4d545ba602ab9eb3c55f");
            $auth->authenticate();
            $conn = new CF_Connection($auth);
            $overlay_container = $conn->get_container("Overlays");
            try {
                $obj = $overlay_container->get_object("$c_id-overlay");
                return $obj;
            } catch (NoSuchObjectException $e) {
     
            }
            return false;
        }

	public function get_company_liveview_data() {
		
		$db = TAWDBI::singleton();
		$user = TAWUser::singleton();
		
		$devices = $db->read_company_devices_liveview($user->get_company_id());
		$landmarks = $db->read_regular_company_landmarks($user->get_company_id());
		$users = $db->read_company_users($user->get_company_id());
		$company = $db->read_company_data($user->get_company_id());
        $time = $user->getUserCurrentTime();
		$start_time = $time-86400;
		$end_time = $time;

		$_SESSION["liveview_last"] = $end_time;
		$events = array();//$db->read_company_events($user->get_company_id(), $start_time, $end_time);
		
		echo json_encode(array("devices"=>$devices, "landmarks"=>$landmarks, "users"=>$users, "events"=>$events, "company"=>$company, "currentUserId" => $user->get_id()));
	}
	
	public function get_liveview_updates() {
		$db = TAWDBI::singleton();
		$user = TAWUser::singleton();
		$time = $user->getUserCurrentTime();
		$lt = $_SESSION["liveview_last"];
		if(!isset($lt)) {$lt = $time;}
		$devices = $db->read_company_devices_liveview($user->get_company_id());
		$events = $db->read_company_events($user->get_company_id(), $lt, $time);
		$_SESSION["liveview_last"] = $time;
		
		$histories = array();
		
		//foreach ($devices as $device) {
		//	$histories[$device["DeviceID"]] = $db->($device["DeviceID"], date("m/d/Y h:i:s A", $lt), date("m/d/Y h:i:s A"));
		//}
		
		echo json_encode(array("devices"=>$devices, "events"=>$events, "histories"=>$histories, "times"=>array("start"=>date("m/d/Y h:i:s A", $lt), "end"=>date("m/d/Y h:i:s A"))));
	}
	
	public function get_history_for_date() {
		$db = TAWDBI::singleton();
		$user = TAWUser::singleton();
		$date = $this->tawf->data["date"];

		// Create times
		$starttime = strtotime($date . " 00:00:00");
		$endtime = strtotime($date . " 23:59:59");

		// Adjust our call to use their timezone
		//$starttime += (3600*$user->get_time_adjustment());
		//$endtime += (3600*$user->get_time_adjustment());
		
		$history = $db->sp("vision2020", "GetMapViewHistoryCompany", array(
			"CompanyID"=>$user->get_company_id(),
			"UserID" => $user->get_id(),
			//"StartDateTime"=>date("m/d/Y h:i:s A", strtotime($starttime)),
			//"EndDateTime"=>date("m/d/Y h:i:s A", strtotime($endtime))
			"StartDateTime"=>date("m/d/Y h:i:s A", $starttime),
			"EndDateTime"=>date("m/d/Y h:i:s A", $endtime)
		));
		
		// Sanatize history
		//foreach ($history as $hist_id=>$hist) {
			//$history[$hist_id]["LastRecv"] = date($db->get_time_format(), strtotime($hist["LastRecv"])+(3600*$user->get_time_adjustment()));
			//$history[$hist_id]["LastRecv"] = substr($hist["LastRecv"], 0, -2) . " " . substr($hist["LastRecv"], -2);
		//}
		
		echo json_encode(array("history"=>$history));
	}


	public function get_history_trail() {
		$db = TAWDBI::singleton();
		$user = TAWUser::singleton();
		$date = $this->tawf->data["date"];
		$device_id = $this->tawf->data["device_id"];
                $action_event_id = $this->tawf->data["action_event_id"];

		// Create times
		$starttime = strtotime($date . " 00:00:00");
		$endtime = strtotime($date . " 23:59:59");
		
		// Adjust our call to use their timezone
		//$starttime += (3600*$user->get_time_adjustment());
		//$endtime += (3600*$user->get_time_adjustment());

		$history = $db->sp("vision2020", "GetMapViewHistoryTrail", array(
                        "UserID" => $user->get_id(),
                        "ActionEventID" => $action_event_id,
                        "DeviceID" => $device_id,
						"StartDateTime"=>date("m/d/Y h:i:s A", $starttime),
						"EndDateTime"=>date("m/d/Y h:i:s A", $endtime)
		));

		
		echo json_encode(array("history"=>$history));
	}

	public function get_device_events() {
		$db = TAWDBI::singleton();
		$user = TAWUser::singleton();
		$date = $this->tawf->data["date"];
		$device_id = $this->tawf->data["device_id"];
		
		// Create times
		$starttime = strtotime($date . " 00:00:00");
		$endtime = strtotime($date . " 23:59:59");
		
		// Adjust our call to use their timezone
		//$starttime += (3600*$user->get_time_adjustment());
		//$endtime += (3600*$user->get_time_adjustment());
		
		$history = $db->sp("vision2020", "GetMapViewHistoryDevice", array(
			"UserID"=>$user->id,
			"DeviceId"=>$device_id,
			"StartDateTime"=>date("m/d/Y h:i:s A", $starttime),
			"EndDateTime"=>date("m/d/Y h:i:s A", $endtime)
		));
		
		//foreach ($history as $hist_id=>$hist) {
			//$history[$hist_id]["LastRecv"] = date($db->get_time_format(), strtotime($hist["LastRecv"])+(3600*$user->get_time_adjustment()));
			//$history[$hist_id]["LastRecv"] = substr($hist["LastRecv"], 0, -2) . " " . substr($hist["LastRecv"], -2);
		//}
		
		echo json_encode(array("events"=>$history));
		
	}


	public function get_closest_devices() {
		$db = TAWDBI::singleton();
		$user = TAWUser::singleton();

                $devices = $db->sp("vision2020", "GetClosestDevices", array(
                    "CompanyID" => $user->get_company_id(),
                    "Latitude" => $this->tawf->data["Lat"],
                    "Longitude" => $this->tawf->data["Lng"],
                    "Radius" => $this->tawf->data["Radius"]/*,
                    "GroupID" => null,
                    "MaxDevices" => $this->tawf->data["MaxDevices"]*/
		));

                /*	"CompanyID"=>$this->tawf->data["DeviceID"],
			"Lat"=>$this->tawf->data["UserID"],
			"Long"=>$this->tawf->data["Name"],
                        "Radius"*/

		echo json_encode(array("devices"=>$devices));
	}
	
	public function get_device_minidash() {
		$db = TAWDBI::singleton();
		$user = TAWUser::singleton();
		$date = $this->tawf->data["date"];
		$device_id = $this->tawf->data["device_id"];
		
		// Create times
		$starttime = strtotime($date . " 00:00:00");
		$endtime = strtotime($date . " 23:59:59");
		
		// Adjust our call to use their timezone
		//$starttime += (3600*$user->get_time_adjustment());
		//$endtime += (3600*$user->get_time_adjustment());
		
		$minidash = $db->sp("vision2020", "GetMapViewHistoryDash", array(
			"UserID"=>$user->id,
			"DeviceId"=>$device_id,
			"StartDateTime"=>date("m/d/Y h:i:s A", $starttime),
			"EndDateTime"=>date("m/d/Y h:i:s A", $endtime)
		));
		
		echo json_encode(array("minidash"=>$minidash[0]));
	}
	
	public function get_set_date(){
		
	}
}
?>