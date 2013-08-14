var events;
var deviceController;
var pointico;
$(document).ready(function() {
	
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
		
		var url = "chart.php?url=" + encodeURIComponent("http://fleet.mythinairwireless.com/ajax.php?action=get_graphed_report&device_filter_type=" + device_filter_type + "&device_filter=" + 
		device_filter + "&report_type=" + $("#report-type").val() + "&date=" + $("#date-start-filter").val());
		$("#graph-frame").attr("src", url);
		// show a spinning wheel while downloading the update
      spinning_wheel = true; 
   
      // number of seconds to wait before a download times out
      timeout = 30; 
   
      // number of times to try downloading before displaying an error
      retry = 2; 
      
      // the update mode (see the update function)
      mode = "reset";
   
      //document.getElementById('my_chart').Update_URL( url, spinning_wheel, timeout, retry, mode );
		/*
		$.getJSON(WWW_ROOT + "/ajax.php", {
			"action": "get_graphed_report",
			"device_filter_type": device_filter_type,
			"device_filter": device_filter,
			"report_type": $("#report-type").val(),
			"date": $("#date-start-filter").val()
		}, function(data) {
			//$("#display-results").html("Seconds on: " + data.ontime);
			var barPercent = (data.ontime/86400)*100;
			var minOn = data.ontime/60;
			var html = "<div style='width: 100%; background-color: #F00;'><div style='width: " + barPercent + "%; background-color: #0F0; float: left;'>" + minOn + " minutes</div><div style='clear: both;'></div></div>";

			$("#display-results").html(html);
			
			
		});*/
		
		return false;
	});
	

});
