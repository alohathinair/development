// Map the events in the specified event controller to the specified map controller
function map_events(mc, ec) {
	for (var i in ec.events) {
		// create the icon
		var icon = new MapIcon(ec.events[i].iconImage);
		icon.setSize(33,33);
		icon.setAnchor(16,16);
		mc.add_marker(new MapMarker("event-" + ec.events[i].id, "events", new MapPoint(ec.events[i].latitude, ec.events[i].longitude), icon));
		mc.map_marker("event-" + ec.events[i].id);
	}
	
	//mc.map_markers("events");
}

function map_panic_events(mc, ec) {
	for (var i in ec.events) {
		if (ec.events[i].type_id != 12)
			continue;
			
		// create the icon
		var icon = new MapIcon(ec.events[i].iconImage);
		icon.setSize(33,33);
		icon.setAnchor(16,16);
		mc.add_marker(new MapMarker("event-" + ec.events[i].id, "events", new MapPoint(ec.events[i].latitude, ec.events[i].longitude), icon));
		mc.map_marker("event-" + ec.events[i].id);
	}
	
	//mc.map_markers("events");
}

// Unmap events in the specified event controller
function unmap_events(ec) {
	
}

function map_event(mc, event) {
	var icon = new MapIcon(event.iconImage);
	icon.setSize(33,33);
	icon.setAnchor(16,16);
	mc.add_marker(new MapMarker("event-" + event.id, "events", new MapPoint(event.latitude, event.longitude), icon));
	mc.map_marker("event-" + event.id);
}