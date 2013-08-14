// This file links devices to MapMarkers and adds them to the MapController via helper functions

function map_landmark(mapController, landmark) {
	if (landmark.format == 1) {
		mapController.add_circle(new MapCircle("landmark-" + landmark.id, "landmarks", new MapPoint(landmark.latitude, landmark.longitude), landmark.radius*0.000189393939, landmark.color));
		mapController.map_circle("landmark-" + landmark.id);
	} else if (landmark.format == 2) {
		mapController.add_polygon(new MapPolygon("landmark-" + landmark.id, "landmarks", landmark.polygon, landmark.color));
		mapController.map_polygon("landmark-" + landmark.id);
	}
	
}

function center_landmark(mapController, landmark) {
	if (landmark.format == 1) {
		mapController.pan_to(new MapPoint(landmark.latitude, landmark.longitude));
	} else if (landmark.format == 2) {
		var poly = mapController.polygons[mapController.findPolygonByID("landmark-" + landmark.id)];
		mapController.pan_to(new MapPoint(poly.polygon.getBounds().getCenter()));
	}
	
}

function unmap_landmark(mapController, landmark) {
	if (landmark.format == 1) {
		mapController.hide_circle("landmark-" + landmark.id);
	} else {
		mapController.hide_polygon("landmark-" + landmark.id);
	}
}