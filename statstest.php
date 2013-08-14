<?php
require_once("lib/statistics.php");
require_once("TAWDBI.php");

$db = TAWDBI::singleton();
$db->connect("72.3.253.228", "webuser", "MENINBLACK", false);

$events = $db->sp("gps1", "GetEventsByDateRangeForUserID", array(
			"UserID"=>196, 
			"StartDate"=>"07/24/2010 12:00:00 AM", 
			"EndDate"=>"07/25/2010 12:00:00 AM"
		));

foreach ($events as $event_id=>$event) {
	
	// Before returning events we must adjust their times from database time to user time
	$event_time = strtotime($event["EventTimestamp"]);
	$events[$event_id]["EventTimestamp"] = date($db->get_time_format(), $event_time);
	

}

$on = Statistics::engine_on_time_for_day(array_reverse($events));
echo "On for $on seconds, or " . $on/60 . " minutes";
?>