function DeviceController() {
	this.devices = [];
	
	this.get_devices = function(callback) {
				
		var currentController = this;
		
		$.getJSON(WWW_ROOT + "/ajax.php", {
			action: "get_company_devices"
		}, function(data) {
			currentController.load_data(data.devices);
			callback();
		});
	};
	
	this.load_data = function(devices) {
                this.devices = [];
		for (var i in devices) {
			this.devices.push(new Device(devices[i]));
		}
	};
	

	this.reload_data = function(devices) {
		for (var i in devices) {
			//this.devices.push(new Device(devices[i]));
			
			device_id = this.findDeviceByID(devices[i].DeviceID);
			if (device_id != -1) {
				this.devices[device_id].latitude = devices[i].Latitude;
				this.devices[device_id].longitude = devices[i].Longitude;
				this.devices[device_id].heading = devices[i].Heading;
				this.devices[device_id].time = devices[i].LastRecv;
				this.devices[device_id].speed = devices[i].Speed;
                                this.devices[device_id].showMarkerLabel = devices[i].ShowMarkerLabel;
                                this.devices[device_id].landmark = devices[i].Landmark;
                                this.devices[device_id].statusColor = devices[i].VehicleStatusInfoColor;
                                this.devices[device_id].markerStatusColor = devices[i].LabelBackgroundColor;
                                this.devices[device_id].setStatus(devices[i].Status);
                                this.devices[device_id].headingSpeed = devices[i].HeadingSpeed;
                                this.devices[device_id].markerImage = devices[i].MarkerImage;
                                this.devices[device_id].markerLine1 = devices[i].MarkerLabelLine1;
                                this.devices[device_id].markerLine2 = devices[i].MarkerLabelLine2;

			} 
		}
	};
	
	
	this.findDeviceByID = function(id) {
		for (var i in this.devices) {
			if (this.devices[i].id == id) {
				return i;
			}
		}
		
		return -1;
	};
	
	this.findDeviceByUserID = function(id) {
		for (var i in this.devices) {
			if (this.devices[i].user_id == id) {
				return i;
			}
		}
		
		return -1;
	};
	
	this.update = function(item_id, callback) {
		var item_array_id = this.findDeviceByID(item_id);
		var currentController = this;
		
		this.devices[item_array_id].save(function(item, response) {
			if (callback) {
				callback(item, response);
			}
		});
	};
	
	// This method sets devices with a user ID of user_id to 0. This should be called directly before assigning this user_id to
	// a new device, and directly after that assignment a save should be done for the device. The database stored procedure will update
	// the database to mirror this function on the database side
	this.unset_user_id = function(user_id) {
		for (var i in this.devices) {
			if (this.devices[i].user_id == user_id) {
				this.devices[i].user_id = 0;
			}
		}
	};
}

function Device(conf) {
	this.id = conf.DeviceID;
	this.uid = conf.UID;
	this.name = conf.Name;
	
	// Variables used by new SP
	this.vehicleDriver = conf.VehicleDriver;
	this.headingSpeed = conf.HeadingSpeed;
	this.markerImage = conf.MarkerImage;
	this.markerLine1 = conf.MarkerLabelLine1;
	this.markerLine2 = conf.MarkerLabelLine2;
	this.showMarkerLabel = conf.ShowMarkerLabel;
        this.landmark = conf.Landmark;
        this.statusColor = conf.VehicleStatusInfoColor;
        this.markerStatusColor = conf.LabelBackgroundColor;
        this.has_tpms = conf.HasTPMS;
        this.has_ddm = conf.HasDDM;
        this.latitude = conf.Latitude;
	this.longitude = conf.Longitude;
	this.group_id = conf.GroupID; // Could find from user, but for speed use it here
	//this.group_id = conf.GroupID; // Could find from user, but for speed use it here

	this.user_id = conf.UserID;
	this.time = conf.LastRecv;
	
	this.speed = conf.Speed;
	
	this.phone = conf.Phone;
	this.device_type = conf.DeviceTypeID;
	this.wireless_carrier = conf.WirelessCarrierID;
	this.device_state = conf.DeviceState;
	this.ping_now_supported = conf.PingNowSupported;
	
	this.heading = conf.Heading;
	this.historyDownloaded = false;
	this.route_shown = false;
	this.tags = [];
	this.starterEnabled = conf.StarterEnabled;
	this.status = "Unknown";
	this.status_code = "U";
	this.history = [];
	this.events = [];
        this.tpms = [];

        this.groupName = conf.GroupName ? conf.GroupName : null;
        this.driverName = conf.Driver;
        this.serial = conf.Serial;
        this.vehicleTypeID = conf.VehicleTypeID;
        this.vehicleMake = conf.VehicleMake;
        this.vehicleModel = conf.VehicleModel;
        this.vehicleYear = conf.VehicleYear;
        this.vehiclePlate = conf.VehiclePlate;
        this.vehicleColor = conf.VehicleColor;
        this.vehicleVin = conf.VehicleVIN;
        this.grantNumber = conf.GrantNumber;
        this.granteeName = conf.GranteeName;
        this.activityNumber = conf.ActivityNumber;
        this.notes = conf.Notes;
        this.enteredOdometer = conf.EnteredOdometer;
        this.enteredOdometerModified = conf.EnteredOdometerModified;
        this.currentOdometer = conf.CurrentOdometer;
        this.reported = conf.Reported;
	this.externalIdentifier = conf.ExternalIdentifier;
        
	if (conf.LastPinged == "01/01/1970 12:00:00 AM") {
		this.last_ping = "Unknown";
	} else {
		this.last_ping = conf.LastPinged;		
	}
	
	if (conf.tags) {
		this.tags = conf.tags;
	}
	
	if (conf.history && MapPoint != undefined) {
		for (var i in conf.history) {
			this.history.push(new MapPoint(conf.history[i].Latitude, conf.history[i].Longitude));
		}
	}

        this.setStatus = function(status) {
       		if (status == "O") {
			this.status = "Engine On";
		} else if (status == "X") {
			this.status = "Engine Off";
		} else if (status == "I") {
			this.status = "Idling";
		} else if (status == "D") {
			this.status = "Driving";
		} else if (status == "M") {
			this.status = "Moving";
		} else if (status == "S") {
			this.status = "Stopped";
		}

                this.status_code = status;
        };
        
	if (conf.Status) {
            this.setStatus(conf.Status);
	}

	this.download_history = function(callback) {
		var currentDevice = this;
		
		this.historyDownloaded = true;
		
		$.get(WWW_ROOT + "/ajax.php", {
			action: "get_recent_history",
			DeviceID: this.id
		}, function(data) {
			for (var i in data.history) {
				currentDevice.history.push({
					id: data.history[i].EventID,
					latitude: data.history[i].Latitude,
					longitude: data.history[i].Longitude,
					time: data.history[i].LastRecv,
					speed: data.history[i].Speed,
					heading: data.history[i].Heading,
					address: data.history[i].Address
				});
			}
			
			callback();
		}, "json");
	};
	
	this.clear_history = function() {
		this.history = [];
	};
	
	this.get_address = function(callback) {
		var currentDevice = this;
		
		$.get(WWW_ROOT + "/ajax.php", {
			action: "get_address_from_latlon",
			Latitude: this.latitude,
			Longitude: this.longitude
		}, function(data) {
			currentDevice.address = data.address;
			
			callback();
		}, "json");
	};
	
	this.prepend_history = function(added) {
		for (var i in added) {
			this.history.unshift({
				id: added[i].EventID,
				latitude: added[i].Latitude,
				longitude: added[i].Longitude,
				time: added[i].LastRecv,
				speed: added[i].Speed,
				heading: added[i].Heading,
				address: added[i].Address
				
			});
		}		
		
	};
	
	this.load_history = function(history) {
		for (var i in history) {
			this.history.push({
				id: history[i].EventID,
				latitude: history[i].Latitude,
				longitude: history[i].Longitude,
				time: history[i].LastRecv,
				speed: history[i].Speed,
				heading: history[i].Heading,
				address: history[i].Address
			});
		}		
	};
	
	this.get_route_history = function() {
		var route = [];
		
		for (var i in this.history) {
			route.push(new MapPoint(this.history[i].latitude, this.history[i].longitude));
		}
		
		return route;
	};

        this.get_tpms_now = function(callback) {
        	var currentDevice = this;

		$.get(WWW_ROOT + "/ajax.php", {
			action: "get_tpms_now",
			DeviceID: this.id
		}, function(data) {
			currentDevice.tpms = data.tpms;
			callback();
		}, "json");
        };

        this.get_tpms_detail = function(tirePosition) {
                for (var i = 0; i < this.tpms.length; ++i) {
                    if (this.tpms[i].TirePosition == tirePosition)
                        return this.tpms[i];
                }
                return false;
        };

	this.save = function(callback) {
		var device = this;
		
		$.post(WWW_ROOT + "/ajax.php", {
			action: "save_device",
			DeviceID: this.id,
			Name: this.name,
			UserID: this.user_id,
                        GroupID: this.group_id ,
                        Serial: this.serial ,
                        VehicleTypeID: this.vehicleTypeID ,
                        VehicleMake: this.vehicleMake ,
                        VehiclePlate: this.vehiclePlate ,
                        VehicleModel: this.vehicleModel ,
                        VehicleYear: this.vehicleYear ,
                        VehicleColor: this.vehicleColor ,
                        VehicleVIN: this.vehicleVin ,
                        GrantNumber: this.grantNumber ,
                        GranteeName: this.granteeName ,
                        ActivityNumber: this.activityNumber ,
                        ExternalIdentifier: this.externalIdentifier,
                        Notes: this.notes ,
                        EnteredOdometer: this.enteredOdometer ,
                        EnteredOdometerModified: this.enteredOdometerModified ,
                        CurrentOdometer: this.currentOdometer,
			"Tags[]": this.tags
		}, function(data) {
			// run our callback
			callback(device, data.response);
		}, "json");
	};
	
	this.getTagstring = function() {
		return this.tags.join(", ");
	};
	
	Device.tagsFromTagstring = function(string) {
		var tags = string.split(',');
		
		// Trim each tag
		for (var i in tags) {
			tags[i] = $.trim(tags[i]);
		}

		return tags;
	};
	
	this.findHistoryByID = function(id) {
		for (var i in this.history) {
			if (this.history[i].id == id) {
				return i;
			}
		}
		
		return -1;
	};
	
        this.getMarkerStatusColor = function() {
            return this.markerStatusColor;
        };

	this.getStatusColor = function() {
            return this.statusColor;
            /*
		if (this.status_code == "M" || this.status_code == "D" || this.status_code == "O") {   // Driving, Moving, EngineOn
                        return "rgb(35,145,35)";
		} else if (this.status_code == "S" || this.status_code == "X") {    // Stopped, Engine Off
			return "#a00";
		} else if (this.status_code == "I") { // Idling
                        return "rgb(255,165,0)";
		}
                
		// Default to a grey
		return "#888";
                */
	};
}