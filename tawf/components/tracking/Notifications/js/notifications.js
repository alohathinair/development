var openNotificationDialog = null;


/*
 * This method loads in notifications to the global notification list
 * It loads the following notification data: Type, Time, User, and Details  
 */
function load_notifications(controller, userController, selector) {
	$(selector).empty();
	for (var i in controller.events) {
		var event = controller.events[i];
		var user = "Unknown";
		var user_id = userController.findUserByID(event.user_id);
		
		if (user_id != -1) {
			user = userController.users[user_id].name;
		}
		
		var dataString = "<tr notification_id='" + event.id + "' style='margin-bottom: 5px;'>";
		dataString += "<td width='40%'>" + event.type + "</td>";
		dataString += "<td width='45%'>" + user + "</td>";
		dataString += "<td width='15%'><a href='#' class='review_notification'>Review</a></td>";
		dataString += "</tr>";
		
		$(selector).append(dataString);
	}
}

/*
 * This method loads in notifications for a specific user. 
 * It will have all the data as above, but without the user, since we know what user it is for each notification.
 */
function load_user_notifications(ec, selector, user_id) {
	$(selector).empty();
	for (var i in ec.events) {
		var event = ec.events[i];
		
		if (event.user_id != user_id) {
			continue;
		}
		
		var dataString = "<tr notification_id='" + event.id + "'>";
		dataString += "<td>" + event.type + "</td>";
		dataString += "<td><a href='#' class='review_notification'>" + event.time + "</a></td>";
		dataString += "<td>" + event.data + "</td>";
		dataString += "</tr>";
		
		$(selector).append(dataString);
	}	
}


// Notification live listeners

// When a time is clicked we move the map to center on that event
function bind_notifications_pan_to_event(mapController, eventController) {
	$(".review_notification").live("click", function() {
		// Get the notification ID from two parents up
		var notification_id = $(this).parent().parent().attr("notification_id");
		var notification = eventController.events[eventController.findEventByID(notification_id)];
		
		// Move the map to the notifications location
		mapController.pan_to(new MapPoint(notification.latitude, notification.longitude));
		
		return false;
	});
}

// Dialog binding functions
function bind_notifications_dialog(mapController, dialog, opener) {
	$(dialog).dialog({
		autoOpen: false,
		draggable: true,
		resizable: false,
		width: 750,
		open: function() {
			$(dialog).bind("mouseenter", mapController.disable_map);
			$(dialog).bind("mouseleave", mapController.enable_map);
		},
		close: function() {
			$(dialog).unbind("mouseenter", mapController.disable_map);
			$(dialog).unbind("mouseleave", mapController.enable_map);
		}});
	
	$(opener).click(function() {
		$(dialog).dialog('open');
		return false;
	});
}

function bind_user_notifications_dialog(dialog, opener) {
	$(dialog).dialog({});
	
	$(opener).click(function() {
		$(dialog).dialog('open');
		return false;
	});
}