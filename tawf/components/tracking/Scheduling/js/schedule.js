function ScheduleController() {
	this.schedules = [];
	
	this.get_schedules = function(callback) {
		
		var currentController = this;
		
		$.getJSON(WWW_ROOT + "/ajax.php", {
			action: "get_schedule"
		}, function(data) {
			currentController.load_data(data.events)
			callback();
		});
	};
	
	this.load_data = function(rules) {
		for (var i in rules) {
			this.rules.push(new AlertRule(rules[i]));
		}
	};
	
	// Creates a user and stores it in our controller
	this.create = function(item, callback) {
		var currentController = this;
		item.save(function(newItem, response) {
			currentController.rules.push(newItem);
			if (callback) {
				callback(newItem, response);
			}
		});
	};
	
	// Updates selected user 
	this.update = function(item_id, callback) {
		var item_array_id = this.findScheduleByID(item_id);
		var currentController = this;
		
		this.rules[item_array_id].save(function(item, response) {
			currentController.schedules[item_array_id] = item;
			
			if (callback) {
				callback(item, response);
			}
		});
	};
	
	this.remove = function(item_id) {
		var arrID = this.findScheduleByID(item_id);
		this.schedules[arrID].remove();
		
		// Remove it from the UI and container
		this.schedules.splice(arrID, 1);
	};
	
	this.findScheduleByID = function(id) {
		for (var i in this.schedules) {
			if (this.schedules[i].id == id) {
				return i;
			}
		}
		
		return -1;
	}
}

function Schedule(conf) {
	var id;
	
	
	if (conf) {
		
		
	}
	
	this.save = function(callback) {
		
		var item = this;
		
		// Send the alert rule to the DB
		$.getJSON(WWW_ROOT + "/ajax.php", {
			"action":"save_schedule",
			"id":this.id,
		
		}, function(data) {
			if (item.id == 0) {
				item.id = data.id;
			}
			
			callback(item, data.response);
		});
	};

	this.remove = function() {
		$.get(WWW_ROOT + "/ajax.php", {
			"action":"delete_schedule",
			"id": this.id
		});
		
	};
}


