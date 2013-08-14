var events;
var mc;

$(document).ready(function() {
	mc = new MapController("map");
	
	$("#date-start-filter").datepicker({showAnim:'slideDown'});
	$("#date-end-filter").datepicker({showAnim:'slideDown'});
	
	$("#run-search").click(function() {
		var device_filter_type = 0;
		var device_filter = 0;
		if ($("#device-filter").val() != 0) {
			var filter_data = $("#device-filter").val().split('-');
			device_filter_type = filter_data[0];
			device_filter = filter_data[1];
		}
		
		$.getJSON(WWW_ROOT + "/ajax.php", {
			"action": "get_generic_report",
			"device_filter_type": device_filter_type,
			"device_filter": device_filter,
			"events_filter": $("#events-filter").val(),
			"start_date": $("#date-start-filter").val(),
			"end_date": $("#date-end-filter").val()
		}, function(data) {
			$("#results-table-body").empty();
			
			if (data.results.length > 0) {
				var html = "";
				for (var i in data.results) {
					
					var e = new Event(data.results[i]);
					html += "<tr event_id='" + data.results[i].ActionEventID + "'><td>" + data.results[i].CompanyUserName + "</td>";
					html += "<td>" + data.results[i].Name + "</td>";
					html += "<td><a href='#' class='view-event-location'>" + e.time + "</a></td>";
					html += "<td>" + e.type + "</td>";
					html += "<td>" + e.data + "</td></tr>";
					
				}
				$("#results-table-body").html(html);
				
				events = new EventController();
				events.load_data(data.results);
				
			} else {
				$("#results-table-body").html("<tr><td colspan=5 align='center'>No events found within that search criteria</td></tr>");
			}
			$("#results-table").show();
		});
		
		return false;
	});
	
	$("#map-view-dialog").dialog({
		autoOpen: false,
		modal: false,
		resizable: false,
		draggable: true,
		width: 500,
		close: function() {
			mc.clear_markers();
		}
	});
	
	$(".view-event-location").live("click", function() {
		var event = events.events[events.findEventByID($(this).parent().parent().attr("event_id"))];

		// Set our map location, add the marker and open it
		mc.set_center(new MapPoint(event.latitude, event.longitude), 15);
		map_event(mc, event);
		
		$("#map-view-dialog").dialog('open');
		
		return false;
	});
});