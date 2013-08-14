//var ec;

function EventController() {
	this.events = [];
	
	this.get_events = function(callback, start, end) {
		if (start == undefined) {
			start = "";
		}
		
		if (end == undefined) {
			end = "";
		}
		
		var currentController = this;
		
		$.getJSON(WWW_ROOT + "/ajax.php", {
			action: "get_events",
			start_date: start,
			end_date: end
		}, function(data) {
			currentController.load_data(data.events)
			callback();
		});
	};
	
	this.load_data = function(events) {
		for (var i in events) {
			var event = new Event(events[i]);
			if (event.type_id != undefined) {
				this.events.push(event);
			}
		}
	};

	this.findEventByID = function(id) {
		for (var i in this.events) {
			if (this.events[i].id == id) {
				return i;
			}
		}
		
		return -1;
	};
}

function Event(conf) {
	var id;
	var time;
	var user_id;
	var data;
	var type;
	var type_id;
	var device_id;
	var course;
	var notes;
	var extra;

	this.getHeadingText = function() {
		if (this.course >= 22.50 && this.course < 67.50) {
			return "ne";
		} else if (this.course >= 67.50 && this.course < 112.50) {
			return "e";
		} else if (this.course >= 112.50 && this.course < 157.50) {
			return "se";
		} else if (this.course >= 157.50 && this.course < 202.50) {
			return "s";
		} else if (this.course >= 202.50 && this.course < 247.50) {
			return "sw";
		} else if (this.course >= 247.50 && this.course < 292.50) {
			return "w";
		} else if (this.course >= 292.50 && this.course < 337.50) {
			return "nw";
		} else {
			return "n";
		}
	};
	
	if (conf) {
		if (conf.ActionEventID) {
			this.id = conf.ActionEventID;
		}
		
		if (conf.UserID) {
			this.user_id = conf.UserID;
		}
		
		if (conf.DeviceID) {
			this.device_id = conf.DeviceID;
		}
		
		if (conf.EventTimestamp) {
			this.time = conf.EventTimestamp;
		}
		
		if (conf.EventData) {
			this.data = conf.EventData;
		}
		
		if (conf.Heading) {
			this.course = conf.Heading;
		} else {
			this.course = 0;
		}
		
		if (conf.Latitude) {
			this.latitude = conf.Latitude;
		}
		
		if (conf.Longitude) {
			this.longitude = conf.Longitude;
		}
		
		if (conf.EventNotes) {
			this.notes = conf.EventNotes;
		}
		
		if (conf.EventExtra) {
			this.extra = conf.EventExtra;
		}
		
		if (conf.ActionEventTypeID) {
			this.type_id = conf.ActionEventTypeID;
			
			
			switch (this.type_id) {
				case 1:
					this.type = "Destination Arrival";
					this.iconImage = "http://" + TAWF_HOST + "/components/tracking/Events/images/markers/geofence-enter-" + this.getHeadingText() + ".png";
					break;
				case 2:
					this.type = "Destination Departure";
					this.iconImage = "http://" + TAWF_HOST + "/components/tracking/Events/images/markers/geofence-exit-" + this.getHeadingText() + ".png";
					break;
				case 3:
					this.type = "Speeding";
					this.data = "Traveling at " + this.data;
					this.iconImage = "http://" + TAWF_HOST + "/components/tracking/Events/images/markers/speeding.png";
					break;
				case 4:
					this.type = "Stopped";
					this.data = "Vehicle stopped moving";
					this.iconImage = "http://" + TAWF_HOST + "/components/tracking/Events/images/markers/stopped.png";
					break;
				case 5:
					this.type = "After-hours use";
					this.data = "Operator was driving after business hours";
					this.iconImage = "http://" + TAWF_HOST + "/components/tracking/Events/images/markers/afterhours.png";
					break;
				case 6:
					this.type = "Approaching Destination";
					this.data = "Nearing " + this.data;
					this.iconImage = "http://" + TAWF_HOST + "/components/tracking/Events/images/markers/geofence-approach-" + this.getHeadingText() + ".png";
					break;
				case 7:
					this.type = "Engine Turned On";
					this.iconImage = "http://" + TAWF_HOST + "/components/tracking/Events/images/markers/engine_starting.png";
					break;
				case 8:
					this.type = "Engine Turned Off";
					this.iconImage = "http://" + TAWF_HOST + "/components/tracking/Events/images/markers/engine_stopping.png";
					break;
				case 9:
					this.type = "Idle Start";
					break;
				case 10:
					this.type = "Idle Stop";
                                     //   this.data = "Engine was idle for " + this.extra + " seconds";
					this.iconImage = "http://" + TAWF_HOST + "/components/tracking/Events/images/markers/engine_idling-stopping.png";

/*					var unidledAt = new Date(this.notes);
					var idledAt = new Date(this.time);
					
					var unidleFor = idledAt.getTime() - unidledAt.getTime();
					
					this.data = "Engine was not idle for " + idledAt + " seconds";*/
					
					//this.data = "Engine was not idle for " + this.extra + " seconds";
					
					this.iconImage = "http://" + TAWF_HOST + "/components/tracking/Events/images/markers/engine_starting2idle.png";
					break;
				case 11:
					this.type = "Panic Button Pressed";
					this.iconImage = "http://" + TAWF_HOST + "/components/tracking/Events/images/markers/panic.png";
					break;
                                case 12:
					this.type = "Device Not Reporting";
					this.iconImage = null;
					break;
				default:
					this.data = "Unknown";
					this.iconImage = null;
					break;
			}
			/*
                        this.type = conf.ActionEventTypeName;
                        this.data = conf.ActionEventTypeDescription;
                        */
			if (this.data == undefined) {
				this.data = "";
			}
			
		
		}
		
		
		
	}

}
