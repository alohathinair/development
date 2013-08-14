var mc;
$(document).ready(function() {
	mc = new MapController("map");
	mc.set_center(new MapPoint(42.0, -75.0), 7);
	
	var icon = new MapIcon("http://fleet.mythinairwireless.com/images/markers/stopped.png");
	icon.setSize(33,33);
	icon.setAnchor(17,17);
	
	mc.add_marker(new MapMarker("boob", null, new MapPoint(42.0, -75.0), icon));
	mc.add_circle(new MapCircle("tits", null, new MapPoint(42.0, -75.0), 100, "#00FF00"));
	
	var points = [];
	points.push(new MapPoint(43.0, -76.0));
	points.push(new MapPoint(43.0, -74.0));
	points.push(new MapPoint(41.0, -74.0));
	points.push(new MapPoint(41.0, -76.0));
	points.push(new MapPoint(43.0, -76.0));
	
	mc.add_line(new MapLine("jugs", null, points, "#FF0000"));
	              
	
	mc.map_markers();
	mc.map_circles();
	mc.map_lines();
	
	
	// Obtain recent events
	var eventController = new EventController();
	eventController.get_events(function() {
		load_notifications("#notifications");
	});
	
	// Bind 
	bind_notifications_dialog("#notifications-dialog", "#view-notifications");
});

