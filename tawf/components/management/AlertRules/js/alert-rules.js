function EventTypeController() {
	this.eventTypes = [];

	this.load_data = function(eventTypes) {
		for (var i in eventTypes) {
			this.eventTypes.push(new EventType(eventTypes[i]));
		}
	};

        this.findByID = function(id) {
           for (var i in this.eventTypes) {
                if (this.eventTypes[i].id == id) {
                        return this.eventTypes[i];
                }
            }
            return false;
        }
}

window.eventTypeController = new EventTypeController();

function EventType(conf) {
    var id;
    var name;

    this.id = conf.ActionEventTypeID;
    this.name = conf.Name;


}

function AlertRuleController() {
	this.rules = [];
	
	this.get_rules = function(callback) {
		
		var currentController = this;
		
		$.getJSON(WWW_ROOT + "/ajax.php", {
			action: "get_alert_rules"
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
		var item_array_id = this.findAlertRuleByID(item_id);
		var currentController = this;
		
		this.rules[item_array_id].save(function(item, response) {
			currentController.rules[item_array_id] = item;
			
			if (callback) {
				callback(item, response);
			}
		});
	};
	
	this.remove = function(item_id) {
		var arrID = this.findAlertRuleByID(item_id);
		this.rules[arrID].remove();
		
		// Remove it from the UI and container
		this.rules.splice(arrID, 1);
	};
	
	this.findAlertRuleByID = function(id) {
		for (var i in this.rules) {
			if (this.rules[i].id == id) {
				return i;
			}
		}
		
		return -1;
	}
}

function AlertRule(conf) {
	var id;
	var template_id;
	var user_id;
	var event_type_id;
	var delivery_method;
	var start_date;
	var end_date;
	var data;
	var event_type;
	var is_all_day;
        var division_id;
        var group_id;

	this.getRuleDescription = function(userController) {
		var description = "Send alerts for " + this.event_type + " events";
		
		// Data
		switch (this.event_type_id) {
			case 1:
			case 2:
				if (this.data.length > 0) {
					description += " for destinations named " + this.data;
				} else {
					description += " for all destinations";
				}
				break;
		}
		
		// Recipient
		if (userController.findUserByID(this.user_id) != -1) {
			description += " to " + userController.users[userController.findUserByID(this.user_id)].name;
		} else {
			description += " to an unknown user";
		}
		
		// Timeframe
		if (this.is_all_day != 1) {
			description += " between " + this.start_time + " and " + this.end_time;
		}
		
		// Method of delivery
		description += " via ";
		switch (this.delivery_method) {
			default:
			case 1:
				description += "E-Mail";
				break;
			case 2:
				description += "Mobile Message";
				break;
			case 3:
				description += "Voice Message";
				break;
		}
		
		return description;
	}
	
	if (conf) {
		if (conf.AlertRuleID) {
			this.id = conf.AlertRuleID;
		} else {
			this.id = 0;
		}
		if (conf.AlertTemplateID) {
			this.template_id = conf.AlertTemplateID;
		}
		
		if (conf.CompanyUserID) {
			this.user_id = conf.CompanyUserID;
		}
		
		if (conf.AlertRuleData) {
			this.data = conf.AlertRuleData;
		} else {
			this.data = "";
		}
		
		if (conf.ActionEventTypeID != undefined) {
			this.event_type_id = parseInt(conf.ActionEventTypeID);

                        if (this.event_type_id == 0) {
                            this.event_type = "All";
                        } else {
                            var eventType = eventTypeController.findByID(this.event_type_id);
                            if (eventType)
                                this.event_type = eventType.name;
                        }
		}
		
		if (conf.DeliveryMethodID) {
			this.delivery_method = conf.DeliveryMethodID;
		}
		
		if (conf.IsAllDay != undefined) {
			this.is_all_day = conf.IsAllDay;
		}
		
		if (conf.StartTime) {
			this.start_time = conf.StartTime;
		}
		
		if (conf.EndTime) {
			this.end_time = conf.EndTime;
		}

                if (conf.DivisionID) {
                    this.division_id = conf.DivisionID;
                }

                if (conf.GroupID) {
                    this.group_id = conf.GroupID;
                }

	}
	
	this.save = function(callback) {
		
		var item = this;
		
		// Send the alert rule to the DB
		$.getJSON(WWW_ROOT + "/ajax.php", {
			"action":"save_alert_rule",
			"id":this.id,
			"AlertTemplateID":this.template_id,
			"CompanyUserID":this.user_id,
			"EventTypeID":this.event_type_id,
			"AlertRuleData":this.data,
			"DeliveryMethodID":this.delivery_method,
			"IsAllDay":this.is_all_day,
			"StartTime":this.start_time,
			"EndTime":this.end_time,
                        "DivisionID": this.division_id,
                        "GroupID": this.group_id
			
		}, function(data) {
			if (item.id == 0) {
				item.id = data.id;
			}
			
			callback(item, data.response);
		});
	};

	this.remove = function() {
		$.get(WWW_ROOT + "/ajax.php", {
			"action":"delete_alert_rule",
			"id": this.id
		});
		
	};
}


