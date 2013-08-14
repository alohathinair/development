var mc;

$(document).ready(function() {
	// load up the map
	mc = new MapController("map", new MapPoint($("#map-latitude").val(), $("#map-longitude").val()), parseInt($("#map-zoom").val()));
	
        $('#save-company-settings, #update-map-settings').button();

	$("#update-map-settings").click(function() {
		$("#map-view-dialog").dialog('open');

		return false;
	});

        $("#business-hours-start, #business-hours-end").timepicker({
            ampm: true,
            timeOnly: true,
            addSliderAccess: true,
            timeFormat: 'hh:mm TT',
            separator: "",
            sliderAccessArgs: {touchonly: false}
        });


	$("#map-view-dialog").dialog({
		autoOpen: false,
		modal: true,
		width: 650,
		resizable: false,
		draggable: true,
		open: function() {
			//mc.map.checkResize();
			mc = new MapController("map", new MapPoint($("#map-latitude").val(), $("#map-longitude").val()), parseInt($("#map-zoom").val()));
			//mc.set_center(new MapPoint($("#map-latitude").val(), $("#map-longitude").val()), parseInt($("#map-zoom").val()));
			
		},
		buttons: {
			'Ok': function() {
				$("#map-latitude").val(mc.map.getCenter().lat());
				$("#map-longitude").val(mc.map.getCenter().lng());
				$("#map-zoom").val(mc.map.getZoom());
				$(this).dialog('close');
			}
		}
	});
	
});