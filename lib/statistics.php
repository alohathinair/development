<?php
define("DATE_FORMAT", "m/d/y H:i:s");
define("ENGINE_TURNED_ON", 8);
define("ENGINE_TURNED_OFF", 9);
define("ENGINE_STARTED_IDLING", 11);
define("ENGINE_STOPPED_IDLING", 10);

class Statistics {
	
	/*
	This method calculates the time the engine is on for a single day. The list of events MUST be
	for a single day or the calculation may be off.
	
	It works by looking at the first event, and stating that the alternate state was active until that time.
	
	For example, if the first event in the list is at 3AM and it is an engine on event, it marks 
	12am to 3am as the engine off.
	*/
	static function engine_on_time_for_day($unfilteredEvents) {
		// Filter out events not related to engine time
		$events = array();
		foreach ($unfilteredEvents as $event) {
			if (in_array($event["EventTypeID"], array(8, 9))) {
				$events[] = $event;
			}
		}
		
		//var_dump($events);
		
		// Calculate time spent since first event
		$secondsOn = 0;
		$secondsOff = 0;
		$previousEngineState = ENGINE_TURNED_OFF;
		$firstEvent = $events[0];
		
		$firstEventTimeInt = strtotime($firstEvent["EventTimestamp"]);
		$startTime = date("m/d/Y 00:00:00", $firstEventTimeInt);
		$startTimeInt = strtotime($startTime);
		

		if ($firstEvent["EventTypeID"] == ENGINE_TURNED_ON) {
			$secondsOff += $firstEventTimeInt - $startTimeInt;
			$previousEngineState = ENGINE_TURNED_ON;
		} elseif ($firstEvent["EventTypeID"] == ENGINE_TURNED_OFF) {
			$secondsOn += $firstEventTimeInt - $startTimeInt;
		}
		
		// Calculate each next event
		array_shift($events);
		$previousEventTimeInt = $firstEventTimeInt;
		
		foreach ($events as $event) {
			// Skip duplicates
			if ($previousEngineState == $event["EventTypeID"])
				continue;
				
			
			$eventTimeInt = strtotime($event["EventTimestamp"]);
			if ($event["EventTypeID"] == ENGINE_TURNED_ON) {
				$secondsOff += $eventTimeInt - $previousEventTimeInt;
				$previousEngineState = ENGINE_TURNED_ON;
			} else {
				$secondsOn += $eventTimeInt - $previousEventTimeInt;
				$previousEngineState = ENGINE_TURNED_OFF;
			}
			
			$previousEventTimeInt = $eventTimeInt;
		}
		
		// We now calcualte the remaining time in the day
		$lastEvent = $events[count($events)-1];
		$lastEventTimeInt = strtotime($lastEvent["EventTimestamp"]);
		$lastTime = date("m/d/Y 00:00:00", $lastEventTimeInt+86400);
		$lastTimeInt = strtotime($lastTime);
		
		$lastTimeDiff = $lastTimeInt - $lastEventTimeInt;
		
		if ($lastEvent["EventTypeID"] == ENGINE_TURNED_ON) {
			if (date("m/d/Y", $lastEventTimeInt) != date("m/d/Y")) {
				$secondsOn += $lastTimeDiff;
			} else {
				$curTimeInt = time()-(3600*5); // Adjust for our server time diff
				$secondsOn += ($curTimeInt - $lastEventTimeInt);
			}
		} else {
			$secondsOff += $lastTimeDiff;
		}
		
		return $secondsOn;
	}
	
	static function engine_idle_time_for_day($unfilteredEvents) {
		// Filter out events not related to engine time
		$events = array();
		foreach ($unfilteredEvents as $event) {
			if (in_array($event["EventTypeID"], array(ENGINE_STARTED_IDLING, ENGINE_STOPPED_IDLING))) {
				$events[] = $event;
			}
		}
		
		//var_dump($events);
		
		// Calculate time spent since first event
		$secondsOn = 0;
		$secondsOff = 0;
		$previousEngineState = ENGINE_STOPPED_IDLING;
		$firstEvent = $events[0];
		
		$firstEventTimeInt = strtotime($firstEvent["EventTimestamp"]);
		$startTime = date("m/d/Y 00:00:00", $firstEventTimeInt);
		$startTimeInt = strtotime($startTime);
		

		if ($firstEvent["EventTypeID"] == ENGINE_STARTED_IDLING) {
			$secondsOff += $firstEventTimeInt - $startTimeInt;
			$previousEngineState = ENGINE_STARTED_IDLING;
		} elseif ($firstEvent["EventTypeID"] == ENGINE_STOPPED_IDLING) {
			$secondsOn += $firstEventTimeInt - $startTimeInt;
		}
		
		// Calculate each next event
		array_shift($events);
		$previousEventTimeInt = $firstEventTimeInt;
		
		foreach ($events as $event) {
			// Skip duplicates
			if ($previousEngineState == $event["EventTypeID"])
				continue;
				
			
			$eventTimeInt = strtotime($event["EventTimestamp"]);
			if ($event["EventTypeID"] == ENGINE_STARTED_IDLING) {
				$secondsOff += $eventTimeInt - $previousEventTimeInt;
				$previousEngineState = ENGINE_STARTED_IDLING;
			} else {
				$secondsOn += $eventTimeInt - $previousEventTimeInt;
				$previousEngineState = ENGINE_STOPPED_IDLING;
			}
			
			$previousEventTimeInt = $eventTimeInt;
		}
		
		// We now calcualte the remaining time in the day
		$lastEvent = $events[count($events)-1];
		$lastEventTimeInt = strtotime($lastEvent["EventTimestamp"]);
		$lastTime = date("m/d/Y 00:00:00", $lastEventTimeInt+86400);
		$lastTimeInt = strtotime($lastTime);
		
		$lastTimeDiff = $lastTimeInt - $lastEventTimeInt;
		
		if ($lastEvent["EventTypeID"] == ENGINE_STARTED_IDLING) {
			if (date("m/d/Y", $lastEventTimeInt) != date("m/d/Y")) {
				$secondsOn += $lastTimeDiff;
			} else {
				$curTimeInt = time()-(3600*5); // Adjust for our server time diff
				$secondsOn += ($curTimeInt - $lastEventTimeInt);
			}
		} else {
			$secondsOff += $lastTimeDiff;
		}
		
		return $secondsOn;
	}

}

?>