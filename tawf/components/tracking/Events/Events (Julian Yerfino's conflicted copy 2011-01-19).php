<?php
class Events extends TAWComponent {
	public function __construct() {
		parent::__construct("tracking/Events", true);

		$this->add_dependancy("jquery");
		
		$this->add_js("/js/events.js");
	}

	public function load($tawf) {
		if ($tawf->is_provided("mapcontroller")) {
			$this->add_js("/js/event-mapping.js");
		}
		
		parent::load($tawf);
	}
	
	public function get_events() {
		// Set default times for this call
		$start_time = time()-86400; // 24 hours ago
		$end_time   = time(); // now
		
		$user = TAWUser::singleton();
		
		if (isset($this->tawf->data["start_date"])) {
			 $start_time = strtotime($this->tawf->data["start_date"])-(3600*$user->get_time_adjustment());
		}
		
		if (isset($this->tawf->data["end_date"])) {
			$end_time = strtotime($this->tawf->data["end_date"])-(3600*$user->get_time_adjustment());
		}
		
		$db = TAWDBI::singleton();
		
		$events = $db->read_events($user->get_company_id(), $start_time, $end_time);
		
		echo json_encode(array("events"=>$events));
	}
	
	public static function event_string($event_type_id) {
		switch ($event_type_id) {
			case 1:
				return "Destination Arrival";
				break;
			case 2:
				return "Destination Departure";
				break;
			case 3:
				return "Speeding";
				break;
			case 4:
				return "Stopped";
				break;
			case 5:
				return "After-hours use";
				break;
			case 7:
				return "Approaching Destination";
				break;
			case 8:
				return "Engine Turned On";
				break;
			case 9:
				return "Engine Turned Off";
				break;
			case 10:
				return "Engine Stopped Idling";
				break;
			case 11:
				return "Engine Started Idling";
				break;
			case 12:
				return "Panic Button Pressed";
				break;
			default:
				return "Unknown";
				break;
		}
	}
	
	public function db_read_company_events($company_id, $start_time, $end_time) {
		// Get our needed singletons
		$user = TAWUser::singleton();
		$db = TAWDBI::singleton();
		
		
		$start_date = date($db->get_time_format(), $start_time);
		$end_date   = date($db->get_time_format(), $end_time);

		$events = $db->sp("gps1", "GetEventsByDateRange", array(
			"CompanyID"=>$company_id, 
			"StartDate"=>$start_date, 
			"EndDate"=>$end_date
		));
		
		
		foreach ($events as $event_id=>$event) {
			// If this user is only a dispatcher then we must limit the results to only the users they have access to.
			if ($user->is_dispatcher() && !in_array($event["UserID"], $user->get_allowed_view_list())) {
				unset($events[$event_id]);
			}
			
			// Before returning events we must adjust their times from database time to user time
			$event_time = strtotime($event["EventTimestamp"])+(3600*$user->get_time_adjustment());
			$events[$event_id]["EventTimestamp"] = date($db->get_time_format(), $event_time);
			
			// Here we calculate the number of seconds since the last idle/unidle
			if (in_array($events[$event_id]["EventTypeID"], array(10,11))) {
				$timeOfLast = strtotime($event["EventNotes"])+(3600*$user->get_time_adjustment());
				$events[$event_id]["EventExtra"] = $event_time - $timeOfLast;
			}
		}
		
		return $events;
	}
	
	public function db_read_user_events($user_id, $start_time, $end_time) {
		// Get our needed singletons
		$user = TAWUser::singleton();
		$db = TAWDBI::singleton();
		
		
		$start_date = date($db->get_time_format(), $start_time);
		$end_date   = date($db->get_time_format(), $end_time);

		$events = $db->sp("gps1", "GetEventsByDateRangeForUserID", array(
			"UserID"=>$user_id, 
			"StartDate"=>$start_date, 
			"EndDate"=>$end_date
		));
		
		
		foreach ($events as $event_id=>$event) {
			// If this user is only a dispatcher then we must limit the results to only the users they have access to.
			if ($user->is_dispatcher() && !in_array($event["UserID"], $user->get_allowed_view_list())) {
				unset($events[$event_id]);
			}
			
			// Before returning events we must adjust their times from database time to user time
			$event_time = strtotime($event["EventTimestamp"])+(3600*$user->get_time_adjustment());
			$events[$event_id]["EventTimestamp"] = date($db->get_time_format(), $event_time);
			
			// Here we calculate the number of seconds since the last idle/unidle
			if (in_array($events[$event_id]["EventTypeID"], array(10,11))) {
				$timeOfLast = strtotime($event["EventNotes"])+(3600*$user->get_time_adjustment());
				$events[$event_id]["EventExtra"] = $event_time - $timeOfLast;
			}
		}
		
		return $events;
	}
}

?>