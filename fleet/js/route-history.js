var mc;
$(document).ready(function() {
	// Adjust map size based on screen width
	resize_containers(0);
	
	$(window).resize(function() {
		resize_containers(75);
	});
	
	//mc.map.checkResize();
	//mc.set_center(new MapPoint(company_latitude, company_longitude));
});

function resize_containers(minus) {
	// Adjust map size based on screen width
	var totalWidthAvailable = $("#container").width();
	var totalHeightAvailable = $(window).height();
	var neededSpace = $("#report-list").width() + 40;
	var mapSpace = totalWidthAvailable - neededSpace;
	
	$("#map").css("width", mapSpace);
	$("#report-graphic-results").css("width", mapSpace);
	// Now adjust height
	
	neededSpace = $("#top-area").height() + 38 + 190 - minus;
	mapSpace = totalHeightAvailable - neededSpace;
	$("#map").css("height", mapSpace);
	$("#report-list-container").css("height", mapSpace - 70);
}