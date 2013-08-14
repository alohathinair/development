function UserController() {
	this.users = [];
	
	this.get_users = function(callback) {
		
		var currentController = this;
		
		$.getJSON(WWW_ROOT + "/ajax.php", {
			action: "get_company_users"
		}, function(data) {
			currentController.load_data(data.users);
			if (callback) {
				callback();
			}
		});
	};
	
	this.load_data = function(users) {
		for (var i in users) {
			this.users.push(new User(users[i]));
		}
	};
	
	this.findUserByID = function(id) {
		for (var i in this.users) {
			if (this.users[i].id == id) {
				return i;
			}
		}
		
		return -1;
	};
	
	// Creates a user and stores it in our controller
	this.create = function(item, callback) {
		var currentController = this;
		item.save(function(newItem, response) {
			currentController.users.push(newItem);
			if (callback) {
				callback(newItem, response);
			}
		});
	};
	
	// Updates selected user 
	this.update = function(item_id, callback) {
		var item_array_id = this.findUserByID(item_id);
		var currentController = this;
		
		this.users[item_array_id].save(function(item, response) {
			currentController.users[item_array_id] = item;
			
			if (callback) {
				callback(item, response);
			}
		});
	};
	
	// Removes the selected template
	this.remove = function(item_id, callback) {
		var arrID = this.findUserByID(item_id);
		
		// Send the removal signal
		this.users[arrID].remove(callback);
		
		// remove it from our container
		this.users.splice(arrID, 1);
		
		
	};
}

function User(conf) {
	this.id = conf.CompanyUserID;
	this.name = conf.CompanyUserName;
	this.email = conf.CompanyUserEmail;
	this.password = conf.CompanyUserPassword;
	this.phone = conf.CompanyUserPhone;
	this.address = conf.CompanyUserAddress;
	this.mobilePhone = conf.CompanyUserMobilePhone;
	this.group = conf.CompanyGroupID;
	this.manageGroup = conf.CompanyManageGroupID;
        this.manageDivision = conf.CompanyManageDivisionID;
	this.tags = [];
	//this.timezone = conf.CompanyUserTimezone;
	this.timezone = conf.TimezoneID;
	this.groupName = conf.GroupName;
        this.defaultMapExtent = new MapExtent(conf.DefaultMapLatitude, conf.DefaultMapLongitude, conf.DefaultMapZoom);

        this.getDefaultMapExtent = function() {
            return this.defaultMapExtent;
        }
        this.setDefaultMapExtent = function(mapExtent) {
            this.defaultMapExtent = new MapExtent(mapExtent.lat, mapExtent.lng, mapExtent.zoom);
        }

	if (conf.DeviceID) {
		this.device_id = conf.DeviceID;
	} else {
		this.device_id = 0;
	}
	
	if (conf.tags) {
		this.tags = conf.tags;
	}
	
	this.setAccessLevel = function(newLevel) {
		this.accessLevel = parseInt(newLevel);

		switch (this.accessLevel) {
			case 1:
				this.accessLevelText = "Driver";
				break;
			case 2:
				this.accessLevelText = "Dispatcher";
				break;
			case 5:
				this.accessLevelText = "Manager";
				break;
			case 10:
				this.accessLevelText = "Administrator";
				break;
			default:
				this.accessLevelText = "Unknown";
		}
	};
	
	this.getTagstring = function() {
		return this.tags.join(", ");
	};
	
	this.setAccessLevel(conf.CompanyUserAccessLevel);
	
	this.save = function(callback) {
		var user = this;
		
		$.post(WWW_ROOT + "/ajax.php", {
			action: "save_company_user",
			CompanyUserID: this.id,
			CompanyGroupID: this.group,
			CompanyUserAccessLevel: this.accessLevel,
			CompanyUserName: this.name,
			CompanyUserEmail: this.email,
			CompanyUserPassword: this.password,
			CompanyUserAddress: this.address,
			CompanyUserPhone: this.phone,
			CompanyUserMobilePhone: this.mobilePhone,
			CompanyManageGroupID: this.manageGroup,
                        CompanyManageDivisionID: this.manageDivision,
			//CompanyUserTimezone: this.timezone,
			TimezoneID: this.timezone,
                        DefaultMapLatitude: this.defaultMapExtent.lat,
                        DefaultMapLongitude: this.defaultMapExtent.lng,
                        DefaultMapZoom: this.defaultMapExtent.zoom,
			"Tags[]": this.tags,
			device_id: this.device_id
		}, function(data) {
			// if this users ID isn't set, set it
			if (user.id == undefined || user.id == 0) {
				user.id = data.user.CompanyUserID;
			}
			
			// run our callback
			callback(user, data.response);
		}, "json");
	};
	
	this.remove = function(callback) {
		$.post(WWW_ROOT + "/ajax.php", {
			action: "delete_company_user",
			CompanyUserID: this.id
		}, function(data) {
			// run our callback
			if (callback) {
				callback(data.response);
			}
		}, "json");
	};
	
	User.tagsFromTagstring = function(string) {
		var tags = string.split(',');
		
		// Trim each tag
		for (var i in tags) {
			tags[i] = $.trim(tags[i]);
		}

		return tags;
	};
}

