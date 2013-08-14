var mc;
$(document).ready(function() {
	// Adjust map size based on screen width
	var totalWidthAvailable = $("#container").width();
	
	var neededSpace = $("#content-accordians").width() + 20;
	var mapSpace = totalWidthAvailable - neededSpace;
	$("#map").css("width", mapSpace);

	
//	alert("Width: " + totalWidthAvailable);
});

