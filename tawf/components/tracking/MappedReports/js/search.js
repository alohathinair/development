var events;
var mc;
var viewingDevice = new Object(-1); // For buttons within a device
var deviceController;
var pointico;
$(document).ready(function() {
	mc = new MapController("map");
	mc.set_center(new MapPoint(company_latitude, company_longitude), company_zoom);
	
	pointico = new MapIcon("http://" + WWW_HOST + "/images/point.png");
	pointico.setSize(24, 24);
	pointico.setAnchor(12, 24);
	
	$("#date-start-filter").datepicker({showAnim:'slideDown'});
	$("#date-end-filter").datepicker({showAnim:'slideDown'});
	
	deviceController = new DeviceController();
	deviceController.get_devices(function() {});
	
	$("#run-search").click(function() {
		var device_filter_type = 0;
		var device_filter = 0;
		
		if ($("#device-filter").val() != 0) {
			var filter_data = $("#device-filter").val().split('-');
			device_filter_type = filter_data[0];
			device_filter = filter_data[1];
		}
		
		$.getJSON(WWW_ROOT + "/ajax.php", {
			"action": "get_mapped_report",
			"device_filter_type": device_filter_type,
			"device_filter": device_filter,
			"report_type": $("#report-type").val(),
			"start_date": $("#date-start-filter").val(),
			"end_date": $("#date-end-filter").val()
		}, function(data) {
			viewingDevice.valueOf=viewingDevice.toSource=viewingDevice.toString=function(){return data.device_id};
			
			// Load in history
			var device = deviceController.devices[deviceController.findDeviceByID(viewingDevice)];
			device.historyDownloaded = true;
			device.history = [];
			device.load_history(data.history);
			
			// Print it out

			loadDetailedHistoryTable(device);
			
			// Load the line in
			map_device_route(device);
			
			$("#vehicle-information-detailed-history").show();
			$("#vehicle-information-detailed-history").animate({"width": 500}, "slow");
			
			// Set our routePlayback position to beginning
			routePlayback.home();
			
		});
		
		return false;
	});
	
	
	if (typeof(RoutePlayback) == "function" && typeof(RoutePlayback.prototype) == "object") {
		//mc.pan_to(new MapPoint(42.0, -74.0));
		routePlayback = new RoutePlayback(deviceController, mc, viewingDevice);
		routePlayback.bind_controls($("#playback-backward"), $("#playback-home"), $("#playback-stop"), $("#playback-forward"));

	}
	
	$(".show-point-on-map").live("click", function() {
		// Get the point information
		var did = deviceController.findDeviceByID(viewingDevice);
		var hid = deviceController.devices[did].findHistoryByID($(this).parent().parent().attr("point_id"));
		var point = deviceController.devices[did].history[hid];
		
		
		
		// Pan the map to the correct location
		var loc = new MapPoint(point.latitude, point.longitude);
		mc.pan_to(loc);
		
		// Add a marker there, or replace it if it already exists.
		mc.add_marker(new MapMarker("individual-point", null, loc, pointico, ""));
		mc.map_marker("individual-point"); // map the marker
		
		routePlayback.setPosition(hid);
		routePlayback.highlight_point($(this).parent().parent().attr("point_id"), true);
		
		return false;
	});
});

// This function loads the detailed history table for the selected device.
function loadDetailedHistoryTable(device) {
	// Clear current data
	$("#detailed-history-information").empty();
	
	// Load current data
	for (var i in device.history) {
		var html = "<tr point_id='" + device.history[i].id + "'>";
		
		html += "<td>" + device.history[i].time + "</td>";
		html += "<td><a href='#' class='show-point-on-map'>" + device.history[i].latitude + ", " + device.history[i].longitude + "</a></td>";
		html += "<td>" + device.history[i].speed + "mph</td>";
		html += "<td>" + degreesToDirection(device.history[i].heading) + "</td>";
		
		
		html += "</tr>";
		$("#detailed-history-information").append(html);
	}
	
}

function map_device_route(device) {
	// First check if our map controller has a line for this device. If so we just need to show/hide it. If not, we need to build the map
	var lineArrID = mc.findLineByID("path-for-" + device.id);

	
		mc.add_line(new MapLine("path-for-" + device.id, "routes", 
				$.merge(new Array(new MapPoint(device.latitude, device.longitude)), device.get_route_history()), "#000000"));
		lineArrID = mc.findLineByID("path-for-" + device.id);
	
	
	mc.map_line("path-for-" + device.id);

}

function degreesToDirection(wd) {
	var dir = wd;
	
	if ((wd >= 0 && wd <= 11.25) || (wd > 348.75 && wd <= 360)) {
		dir = "N";
	} else if (wd > 11.25 && wd <= 33.75) {
		dir = "N NE";
	} else if (wd > 33.75 && wd <= 56.25) {
		dir = "NE";
	} else if (wd > 56.25 && wd <= 78.75) {
		dir = "E NE";
	} else if (wd > 78.75 && wd <= 101.25) {
		dir = "E";
	} else if (wd > 101.25 && wd <= 123.75) {
		dir = "E SE";
	} else if (wd > 123.75 && wd <= 146.25) {
		dir = "SE";
	} else if (wd > 146.25 && wd <= 168.75) {
		dir = "S SE";
	} else if (wd > 168.75 && wd <= 191.25) {
		dir = "S";
	} else if (wd > 191.25 && wd <= 213.75) {
		dir = "S SW";
	} else if (wd > 213.75 && wd <= 236.25) {
		dir = "SW";
	} else if (wd > 236.25 && wd <= 258.75) {
		dir = "W SW";
	} else if (wd > 258.75 && wd <= 281.25) {
		dir = "W";
	} else if (wd > 281.25 && wd <= 303.75) {
		dir = "W NW";
	} else if (wd > 303.75 && wd <= 326.25) {
		dir = "NW";
	} else if (wd > 326.25 && wd <= 348.75) {
		dir = "N NW";
	}
	
	return dir;
}