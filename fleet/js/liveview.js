var mc;
var ensureSizeTimer;
$(document).ready(function() {
	// Adjust map size based on screen width
	adjustMapSize(0);
	adjustSidebarSize(0);
	
	$(window).resize(function() {

		 adjustMapSize(0);
		 adjustSidebarSize(0);
		
	});
	
	ensureSizeTimer = setInterval("ensureMapSize()", 200);
});

function ensureMapSize() {
var totalHeightAvailable = $(window).height();
	neededSpace = $("#navbar").height();
	mapSpace = totalHeightAvailable - neededSpace;
	
	if ($("#map").css("height") != mapSpace) {
		adjustMapSize(0);
	} else {
		clearInterval(ensureSizeTimer);
	}
}

function adjustSidebarSize(minus) {
	var totalHeightAvailable = $(window).height();
	var neededSpace = $("#navbar").height();
	var accordianSpace = totalHeightAvailable - neededSpace;
	
	$("#liveview-panel").css("height", accordianSpace);
	var dashHeight = $('#minidash-wrapper').height();
	$('.liveview-data-history').height($('#tab-history').height() - dashHeight - $('#history-date').height() - $('#groups-history').height()-$('#history-vehicles-select').height());
}

function adjustMapSize(plus) {
	var totalWidthAvailable = $("#container").width()-1;
	var totalHeightAvailable = $(window).height();
	//alert("Height: " + totalHeightAvailable);
	// Calculate width
	var neededSpace = $("#liveview-panel").width();
	var mapSpace = totalWidthAvailable - neededSpace;
	$("#map").css("width", mapSpace);
	//$("#street-view").css("width", mapSpace);
	
	
	// Calculate height
	neededSpace = $("#navbar").height();
	mapSpace = totalHeightAvailable - neededSpace;
	
	if (!displayStreetView) {
		$("#map").css("height", mapSpace);
	} else {
		$("#map").css("height", mapSpace/2);
		$("#street-view").css("height", mapSpace/2);
		
	}
}