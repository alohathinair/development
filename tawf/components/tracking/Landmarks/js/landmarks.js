function LandmarkController() {
	this.landmarks = [];
	
	this.get_landmarks = function(callback) {
				
		var currentController = this;
		
		$.getJSON(WWW_ROOT + "/ajax.php", {
			action: "get_landmarks"
		}, function(data) {
			currentController.load_data(data.landmarks);
			callback();
		});
	};
	
	this.get_general_landmarks = function(callback) {
		
		var currentController = this;
		
		$.getJSON(WWW_ROOT + "/ajax.php", {
			action: "get_general_landmarks"
		}, function(data) {
			currentController.load_data(data.landmarks);
			callback();
		});
	};
	
	this.get_landmark_management_data = function(userController, callback) {
		
		var currentController = this;
		
		$.getJSON(WWW_ROOT + "/ajax.php", {
			action: "get_landmark_management_data"
		}, function(data) {
			currentController.load_data(data.landmarks);
			userController.load_data(data.users);
			callback(data);
		});
	};
	
	
	this.load_data = function(landmarks) {
		for (var i in landmarks) {
			this.landmarks.push(new Landmark(landmarks[i]));
		}
	};
	
	this.findLandmarkByID = function(id) {
		for (var i in this.landmarks) {
			if (this.landmarks[i].id == id) {
				return i;
			}
		}
		
		return -1;
	};
	
	// Deletes a landmark and removes it from the controller
	this.remove = function(id) {
		var arrID = this.findLandmarkByID(id);
		
		this.landmarks[arrID].remove();
		
		this.landmarks.splice(arrID, 1);
	};

        this.remove_all = function() {
            this.landmarks = [];
        }
}

function Landmark(conf) {
	
	this.name = "Unnamed"; // Default to unnamed
	
	this.save = function(callback) { // Saves the landmark and returns the ID
		// Regular info
		var saveData = {
			action: "save_landmark",
			id: this.id,
			type: this.type,
			name: this.name,
			format: this.format,
			user_id: this.user_id,
			latitude: this.latitude,
			longitude: this.longitude,
			address: this.address,
			radius: this.radius,
			color: this.color,
			polygon: this.getPolygonString(),
			"Tags[]": this.tags
			
		};
		
		if (this.type == 2) {
			saveData.destinationID = this.destinationID;
			saveData.arrivalDate = this.arrivalDate;
			saveData.contactName = this.contactName;
			saveData.contactAlertRadius = this.contactAlertRadius;
			saveData.contactAlertTemplate = this.contactAlertTemplate;
			saveData.contactAlertMethod = this.contactAlertMethod;
			saveData.contactAlertTo = this.contactAlertTo;
		}
		
		var me = this;
		
		$.getJSON(WWW_ROOT + "/ajax.php", saveData, function(data) {
			me.id = data.landmark.GeoFenceID;
			me.build_location();
			callback(me);
		});
		
	};
	
	this.remove = function() {
		$.get(WWW_ROOT + "/ajax.php", {
			action: "delete_landmark",
			id: this.id
		});
	};
	
	this.format = 1; // Default to radial fence format
	
	this.id = conf.GeoFenceID;
	this.fenceType = conf.GeoFenceFenceType;
	this.type = conf.GeoFenceTypeID;
	this.address = conf.Address;
	
	if (conf.FenceName && $.trim(conf.FenceName).length > 0) {
		this.name = conf.FenceName;
		
	}
	
	this.user_id = conf.UserID;
	this.userName = conf.UserName;
	this.device_uid = conf.DeviceID;
	this.radius = conf.FenceRadius;
	this.color = conf.FenceColor;
	this.latitude = conf.FenceLatitude;
	this.longitude = conf.FenceLongitude;
	this.polygon = new Array();
	
	// This.polygon should always be an array.
	if (conf.polygon != undefined && conf.polygon.length > 0) {
		this.polygon = new Array();
		for (var i in conf.polygon) {
			this.polygon.push(new MapPoint(conf.polygon[i]["latitude"], conf.polygon[i]["longitude"]));
		}

		this.format = 2;
	} else if (this.latitude == 0 && this.longitude == 0) {
		this.polygon = new Array();
		this.format = 2;
	}
	
	
	this.build_location = function() {
		if (this.format == 1) {
			if (this.address == null || this.address.length < 5) {
				this.location = this.latitude + ", " + this.longitude;
			} else {
				this.location = this.address;
			}
		} else if (this.format == 2) {
			this.location = "Polygonal";
		}
	};
	
	// We need to build the initial location up
	
	this.build_location();
	
	if (conf.tags) {
		this.tags = conf.tags;
	} else {
		this.tags = [];
	}
	
	if (this.device_uid != null && this.userName == null) {
		this.userName = "Unknown";
	}
	
	
	if (this.user_id == 0) {
		this.userName = "Entire Company";
	}
	
	/*if (this.fenceType == 1) { // radial
		this.landmark = new MapCircle("landmark-" + this.id, "landmarks", new MapPoint(conf.FenceLatitude, conf.FenceLongitude), conf.FenceRadius, "#00FF00")
	} else { // polygonal; not implemented
		// conf.points // points for the polygon
	}*/
	
	// Handle extra destination data
	if (this.type == 2) {
		this.destinationID = conf.DestinationAlertID;
		this.arrivalDate = conf.ArrivalDate;
		this.contactName = conf.ContactName;
		this.contactAlertRadius = conf.ContactAlertRadius;
		this.contactAlertTemplate = conf.ContactAlertTemplate;
		this.contactAlertMethod = conf.ContactAlertMethod;
		this.contactAlertTo = conf.ContactAlertTo;
	}
	
	this.getTagstring = function() {
		return this.tags.join(", ");
	};
	
	this.getPolygonString = function() {
		var polygonString = "(";
		var polyPointString = new Array();
		for (var i in this.polygon) {
			polyPointString.push(this.polygon[i].lng + " " + this.polygon[i].lat);
		}
		
		if (this.polygon && this.polygon[0])
			polyPointString.push(this.polygon[0].lng + " " + this.polygon[0].lat)
		
		polygonString += polyPointString.join(',');
		polygonString += ")";
		
		return polygonString;
	};

        this.getBounds = function() {
            var bounds = new google.maps.LatLngBounds();
            if (this.format == 2) {
                for (i = 0; i < this.polygon.length; i++)
                    bounds.extend(new google.maps.LatLng(this.polygon[i].lat, this.polygon[i].lng));
            } else {
                var center = new google.maps.LatLng(this.latitude, this.longitude);
                var radiusInKm = this.radius / 1000 * 1.5;  // give a little bit of room
                bounds.extend(center.destinationPoint(90, radiusInKm));
                bounds.extend(center.destinationPoint(-90, radiusInKm));
                bounds.extend(center.destinationPoint(180, radiusInKm));
                bounds.extend(center.destinationPoint(-180, radiusInKm));
            }

            return bounds;
        }
	
}

Landmark.tagsFromTagstring = function(string) {
	var tags = string.split(',');
	
	// Trim each tag
	for (var i in tags) {
		tags[i] = $.trim(tags[i]);
	}
	
	return tags;
};

function Destination(conf) {
	
}

