function map_landmark(mapController, landmark) {
	if (landmark.format == 1) {
		mapController.add_circle(new MapCircle("landmark-" + landmark.id, "landmarks", new MapPoint(landmark.latitude, landmark.longitude), landmark.radius, landmark.color));
		mapController.map_circle("landmark-" + landmark.id);
	} else if (landmark.format == 2) {
		mapController.add_polygon(new MapPolygon("landmark-" + landmark.id, "landmarks", landmark.polygon, landmark.color));
		mapController.map_polygon("landmark-" + landmark.id);
	}
	
}

function center_landmark(mapController, landmark) {

        var bounds = landmark.getBounds();

        if (!bounds.isEmpty()) {
            mapController.map.panToBounds(bounds);
            mapController.map.fitBounds(bounds);
        }

        return;

	if (landmark.format == 1) {
		mapController.pan_to(new MapPoint(landmark.latitude, landmark.longitude));
	} else if (landmark.format == 2) {
		var poly = mapController.polygons[mapController.findPolygonByID("landmark-" + landmark.id)];

		var polyBounds = new google.maps.LatLngBounds();
		var i = 0;
		while (i != poly.points.length) {
			polyBounds.extend(poly.points.getAt(i));
			i++;
		}
		
		mapController.pan_to(new MapPoint(polyBounds.getCenter()));
	}
	
}

function unmap_landmark(mapController, landmark) {
	if (landmark.format == 1) {
		mapController.hide_circle("landmark-" + landmark.id);
	} else {
		mapController.hide_polygon("landmark-" + landmark.id);
	}
}

function map_device(mapController, device) {
	// Create icon based on the device
	var icon = new MapIcon("http://" + WWW_HOST + "/images/" + device.markerImage);
	icon.setSize(15, 34);
	icon.setAnchor(7, 35);
        var mapMarker = new MapMarker("device-" + device.id, "devices", new MapPoint(device.latitude, device.longitude), icon, device.vehicleDriver, 1000000,
            "<div class='labeled-marker-name'>" + device.markerLine1 + "</div><div class='labeled-marker-state'>" + device.markerLine2 + "</div>",
            device.getMarkerStatusColor());
        mapMarker.marker.labelVisible = device.showMarkerLabel;
	mapController.add_marker(mapMarker);
        mapController.map_marker("device-" + device.id);
        return mapMarker;
	
}

function unmap_device(mapController, device) {
	mapController.hide_marker("device-" + device.id);
}

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


Number.prototype.toRad = function() {
   return this * Math.PI / 180;
}

Number.prototype.toDeg = function() {
   return this * 180 / Math.PI;
}

google.maps.LatLng.prototype.destinationPoint = function(brng, dist) {
   dist = dist / 6371;
   brng = brng.toRad();

   var lat1 = this.lat().toRad(), lon1 = this.lng().toRad();

   var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) +
                        Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));

   var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) *
                                Math.cos(lat1),
                                Math.cos(dist) - Math.sin(lat1) *
                                Math.sin(lat2));

   if (isNaN(lat2) || isNaN(lon2)) return null;

   return new google.maps.LatLng(lat2.toDeg(), lon2.toDeg());
}