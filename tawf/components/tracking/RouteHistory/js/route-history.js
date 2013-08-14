var events;
var mc;
var pointico;
var deviceController;
var validator = false;
var routePlayback;
const Report_EVENT_HISTORY = 1;
const Report_DRIVING_HISTORY = 2;

var viewingDevice = new Object(-1); // For buttons within a device
var event_filters = {
    1:"Landmark Arrival",
    2:"Landmark Departure",
    6:"Landmark Approach",
    3:"Speeding",
    4:"Stopping",
    5:"After-hours Use"
};

var mapped_reports = {
    1:"Events",
    2:"History"
};
var graphed_reports = {
    1:"Engine On Time",
    2:"Engine Idle Time"
};

$(document).ready(function() {
    //$("#drivers").selectOptions(/./);
    //$("#filters").selectOptions(/./);
    mc = new MapController("map", new MapPoint(company_latitude, company_longitude), company_zoom);

    $("#report").ufd({
        minWidth: 120
    });
    //        $("#drivers").toChecklist();
    //        $("#filters").toChecklist();
    $("#driver").ufd();

    $("#display-report").button();
    //$("#drivers").dropdownchecklist({ firstItemChecksAll: true, maxDropHeight: 150 });
    //$("#filters").dropdownchecklist({ firstItemChecksAll: true, maxDropHeight: 150 });

    validator = $("#post-report").validate({
        errorContainer: $("#reports-error"),
        errorLabelContainer: $("#reports-error-list"),
        wrapper: "li",
        rules: {
            "start_date": "required",
            "end_date": "required",
            "filters[]": { 
                required: function(element) {
                    return $("#report").val() == Report_EVENT_HISTORY;
                }
            },
            "drivers[]":  {
                required: function(element) {
                    return $("#report").val() == Report_EVENT_HISTORY;
                }
            }
    },
    messages: {
        "start_date": "Please enter a Start Date.<br/>",
        "end_date": "Please enter an End Date.<br/>",
        "filters[]": "At least one filter must be selected.<br/>",
        "drivers[]": "At least one driver must be selected.<br/>"
    }
    });
        
// Setup dates
$('#start_date,#end_date').datetimepicker({
    ampm: true,
    buttonImage: "/images/calendar.gif",
    buttonImageOnly: true,
    showOn: 'button',
    showAnim:'slideDown',
    ampm: true,
    dateFormat: 'mm-dd-yy'
});
	
//mc.set_center(new MapPoint(company_latitude, company_longitude), company_zoom);
	
    pointico = new MapIcon("http://" + WWW_HOST + "/images/point.png");
    pointico.setSize(24, 24);
    pointico.setAnchor(12, 24);
	
    /*$("#start_date").datepicker({showAnim:'slideDown'});
	$("#end_date").datepicker({showAnim:'slideDown'});
	*/
    deviceController = new DeviceController();
    deviceController.get_devices(function() {});

    /*$("#date-start-filter").datepicker({showAnim:'slideDown'});
	$("#date-end-filter").datepicker({showAnim:'slideDown'});*/

    $("#download-report").click(function() {
        $("#post-report").submit();
    });
	
    $("#display-report").click(function() {

        if (validator && !validator.form())
            return;
		routePlayback.stop();
		
        mc.clear_markers();
        mc.hide_lines();
        var report = parseInt($("#report").val());
		
        switch (parseInt($("#report-type").val())) {
            case 999:
                $("#graphed-results").hide();
                $("#mapped-results").hide();
                $.post("/ajax.php", $("#post-report").serialize(), function(data) {
					
                    $("#listed-results").slideDown('slow');
                }, "json");
				
                break;
            case 1:
                $("#graphed-results").hide();
                $("#download-report").hide();
                $('#report-list').mask("Loading...");
                $.post("/ajax.php", $("#post-report").serialize(), function(data) {

                    $('#report-list').unmask();
                                        
                    switch (report) {
                        case Report_EVENT_HISTORY: // Event Report
                            $("#download-report").show();
                            // Hide playback controls, if they are there
                            $("#route-playback-container").slideUp('slow');
                            //$("#report-list-container").css("height", 500);
                            // Load list data
                            $("#report-list-results").empty();
					
                            if (data.results.length > 0) {
                                var html = "";
                                for (var i in data.results) {
									
                                    var e = new Event(data.results[i]);
                                    html += "<tr event_id='" + data.results[i].ActionEventID + "'><td style='width: 80px;'>" + data.results[i].CompanyUserName + "</td>";
                                    //html += "<td>" + data.results[i].Name + "</td>";
                                    var date = new Date(e.time);
                                    var hour = date.getHours();
                                    var minutes = date.getMinutes();
                                    var seconds = date.getSeconds();
                                    var meridian = "am";
									
									
                                    if (hour > 12) {
                                        hour -= 12;
                                        meridian = "pm";
                                    }
									
                                    if (hour == 0)
                                        hour = 12;
									
                                    if (minutes < 10)
                                        minutes = "0" + minutes;
									
                                    if (seconds < 10)
                                        seconds = "0" + seconds;
									
                                    var dateString = date.toDateString().split(' ')[1] + " " + date.getDate() + " " + hour + ":" + minutes + ":" + seconds + " " + meridian;
									
                                    html += "<td style='width: 120px;'><a href='#' class='view-event-location'>" + dateString + "</a></td>";
                                    html += "<td style='width: 120px;'>" + e.type + "</td>";
                                    html += "<td style='width: 120px;'>" + e.data + "</td></tr>";
									
                                    // Configure our columns
                                    $("#report-list-column-heading1").css("width", 85);
                                    $("#report-list-column-heading1").html("Driver");
                                    $("#report-list-column-heading2").css("width", 130);
                                    $("#report-list-column-heading2").html("Time");
                                    $("#report-list-column-heading3").css("width", 130);
                                    $("#report-list-column-heading3").html("Event");
                                    $("#report-list-column-heading4").html("Data");
									
                                }
                                $("#report-list-results").html(html);
								
                                events = new EventController();
                                events.load_data(data.results);
								
                                // Map the events with markers.
                                mc.clear_markers();
                                map_events(mc, events);
								
                                // Add listeners to our event markers
                                $.each(events.events, function(i, x) {
                                    mc.markers[mc.findMarkerByID("event-" + events.events[i].id)].add_listener("click", function() {
                                        //showEventData(events.events[i]);
                                        var view = $("#report-list-container");
                                        var elem = $("tr[event_id='" + events.events[i].id + "']");
                                        $("tr[event_id!='-1']").css("background-color", "inherit");
                                        elem.css("background-color", "#BBDDBB");
										
                                        var pos = elem.position();
                                        view.scrollTo(elem, 500, {
                                            offset:view.height()*-0.5
                                        });
                                    });
                                });
								
                            } else {
                                $("#report-list-results").html("<tr><td colspan=5 align='center'>No events found within that search criteria</td></tr>");
                            }

                            break;
                        case Report_DRIVING_HISTORY: // History Report
                            $("#route-playback-container").slideDown('slow');
                            //$("#report-list-container").css("height", 460);
                            viewingDevice.valueOf=viewingDevice.toSource=viewingDevice.toString=function(){
                                return data.device_id
                            };
							
                            // Load in history
                            var device = deviceController.devices[deviceController.findDeviceByID(viewingDevice)];
                            device.historyDownloaded = true;
                            device.history = [];
                            device.load_history(data.history);
							
                            // Print it out
				
                            loadDetailedHistoryTable(device);
							
                            if (device.history.length > 0) {
                                // Load the line in
                               
                                map_device_route(device);
							
                                // Set our routePlayback position to beginning
                                routePlayback.home();
                            } else {
                                alert("No history for this search criteria");
                            }
							
	
                            break;
                    }
                }, "json");
                break;
            case 2:
                $("#mapped-results").hide();
				
                var url = "chart.php?url=" + encodeURIComponent("http://fleet.mythinairwireless.com/ajax.php?" + $("#post-report").serialize());
                /*action=get_graphed_report&device_filter_type=" +
				device_filter_type + "&device_filter=" + 
				device_filter + "&report_type=" + $("#report").val() + 
				"&start_date=" + $("#start_date").val() + "&end_date=" + $("#end_date").val());*/
				
                $("#graph-frame").attr("src", url);
                $("#graphed-results").slideDown('slow');
                break;
        }
		
        //$("#report-results").slideDown('slow', function() {  /*mc.map.checkResize(); mc.set_center(new MapPoint(company_latitude, company_longitude), company_zoom);*/ });
        return false;
    });

	
    $(".view-event-location").live("click", function() {
        var event = events.events[events.findEventByID($(this).parent().parent().attr("event_id"))];
//		alert("EID: " + $(this).parent().parent().attr("event_id") + ", Lat: " + event.latitude + ", Lon: " + event.longitude);
        // Set our map location, add the marker and open it
        mc.set_center(new MapPoint(event.latitude, event.longitude), 15);
        var elem = $("tr[event_id='" + event.id + "']");
        $("tr[event_id!='-1']").css("background-color", "inherit");
        elem.css("background-color", "#BBDDBB");
        return false;
    });
	
    $("#report-type").change(function() {
        switch (parseInt($(this).val())) {
            /*			case 1: // Listed Reports
				// Ensure filters are shown
				$("#choose-filters").slideDown('slow');
				
				// Ensure our drivers selection can be more than 1
				$("#driver").hide();
				$("#drivers").show();
				
				
				// Fill Reports List
				$("#report").removeOption(/./);
				$("#report").addOption(listed_reports, false);
				break;*/
				
            case 1: // Mapped Reports
                // Ensure filters are hidden
                //$("#choose-filters").slideUp('slow');
				
                // Fill Reports List
                $("#report").removeOption(/./);
                $("#report").addOption(mapped_reports, false);
				
                // Ensure our drivers selection can be multiple
                $("#drivers").show();
                $("#driver-box").hide();
				
				
                break;
            case 2: // Graphed Reports
                // Fill Reports List
                $("#report").removeOption(/./);
                $("#report").addOption(graphed_reports, false);
				
                // Ensure filters are hidden
                $("#choose-filters").slideUp('slow');
				
                // Ensure our drivers selection can be more than 1
                $("#driver-box").hide();
                $("#drivers").show();
				
				
                break;
        }
    });
	
    $("#report").change(function() {
        
        var r = parseInt($(this).val());

        validator.resetForm();

        switch (parseInt($("#report-type").val())) {
            case 1:
                switch(r) {
                    case 1:
                        // Ensure our drivers selection can be multiple
                        $("#drivers").show();
                        $("#driver-box").hide();
                        $("#select-report-filters-box").show();
                        break;
                    case 2:
                        // Ensure our drivers selection cant be multiple
                        $("#driver-box").show();
                        $("#drivers").hide();
                        $("#select-report-filters-box").hide();
                }
                break;
            case 2:
                break;
        }
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
    $("#report-list-results").empty();
	
    // Load current data
    for (var i in device.history) {
        var html = "<tr point_id='" + device.history[i].id + "'>";
		
        var date = new Date(device.history[i].time);
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var meridian = "am";
		
        if (hour > 12) {
            hour -= 12;
            meridian = "pm";
        }
		
        if (minutes < 10)
            minutes = "0" + minutes;
		
        if (seconds < 10)
            seconds = "0" + seconds;
		
        var dateString = date.toDateString().split(' ')[1] + " " + date.getDate() + " " + hour + ":" + minutes + ":" + seconds + " " + meridian;
		
		
		
        html += "<td style='width: 110px;'>" + dateString + "</td>";
        html += "<td style='width: 260px;'><a href='#' class='show-point-on-map'>";
		
        if (device.history[i].address != null) {
            html += device.history[i].address;
        } else {
            html += device.history[i].latitude + ", " + device.history[i].longitude;
        }
        html += "</a></td>";
        html += "<td style='width: 100px;'>" + degreesToDirection(device.history[i].heading) + " @ " + device.history[i].speed + "mph</td>";
        //html += "<td style='width: 70px;'>" + degreesToDirection(device.history[i].heading) + "</td>";
		
		
        html += "</tr>";
		
        // Configure our columns
        $("#report-list-column-heading1").css("width", 110);
        $("#report-list-column-heading1").html("Time");
        $("#report-list-column-heading2").css("width", 240);
        $("#report-list-column-heading2").html("Location");
        $("#report-list-column-heading3").css("width", 100);
        $("#report-list-column-heading3").html("Heading/Speed");
        $("#report-list-column-heading4").html("");
		
        $("#report-list-results").append(html);
    }
	
}

function map_device_route(device) {
    // First check if our map controller has a line for this device. If so we just need to show/hide it. If not, we need to build the map
    var lineArrID = mc.findLineByID("path-for");

	
	
    mc.add_line(new MapLine("path-for", "routes", device.get_route_history(), "#000000"));
    lineArrID = mc.findLineByID("path-for");
	
	
    mc.map_line("path-for");

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