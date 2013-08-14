var mc;
$(document).ready(function() {
	// Adjust map size based on screen width
	var totalWidthAvailable = $("#container").width();
	
	var neededSpace = $("#report-list").width() + 40;
	var mapSpace = totalWidthAvailable - neededSpace;
	$("#map").css("width", mapSpace);
	$("#report-graphic-results").css("width", mapSpace);
	mc.map.checkResize();
	mc.set_center(new MapPoint(company_latitude, company_longitude));
});

