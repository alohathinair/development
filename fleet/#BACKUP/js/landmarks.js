var landmarkController;
var landmarkManage;
var userController;
var mapDefaultLat;
var mapDeafultLong;

$(document).ready(function() {
	landmarkController = new LandmarkController();
	landmarkManage = new LandmarkManager(landmarkController, "#edit-landmark-dialog", "#view-landmark-dialog", "#landmark-map-dialog", "landmark-map");
	userController = new UserController();
	
	// Download our landmarks
	landmarkController.get_landmark_management_data(userController, function(data) {
		mapDefaultLat = data.company.CompanyDefaultMapLatitude;
		mapDefaultLong = data.company.CompanyDefaultMapLongitude;
		landmarkManage.createMap("landmark-map", mapDefaultLat, mapDefaultLong);
		landmarkManage.addLandmarkPointListener();
		
		// Adjust map size based on screen width
		var totalWidthAvailable = $("#container").width();
		
		var neededSpace = $("#landmark-table-container").width() + 20;
		var mapSpace = totalWidthAvailable - neededSpace;
		$("#landmark-map").css("width", mapSpace);
		landmarkManage.map.map.checkResize();
		landmarkManage.map.set_center(new MapPoint(mapDefaultLat, mapDefaultLong));
		
		// Properly assign all of our landmark users
		landmarkManage.updateLandmarkUsers(userController);
		
		// Load landmarks
		load_landmark_list(landmarkController, "#landmark_list");
		
		// Populate our user select list in the edit dialog
		for (var i in userController.users) {
			$("#landmark-edit-user-list").append("<option value='" + userController.users[i].id + "'>" + userController.users[i].name + "</option>");
		}
		
		landmarkManage.map_landmarks();
		
		
		
	});
	
	$("#add_landmark").click(function() {
		landmarkManage.openCreateDialog(function() {
			landmarkManage.closeEditDialog();
			landmarkManage.updateLandmarkUsers(userController);
			load_landmark_list(landmarkController, "#landmark_list");
			landmarkManage.map_landmarks();
		});
		return false;
	});
	
	$(".edit-landmark").live("click", function() {
		//alert("mm " + $(this).parent().parent().attr("landmark_id"));
		// Need to tell the manager which landmark to load
		landmarkManage.setEditingLandmark($(this).parent().parent().attr("landmark_id")); 
		landmarkManage.openEditDialog(function() {
			landmarkManage.closeEditDialog();
			landmarkManage.updateLandmarkUsers(userController);
			load_landmark_list(landmarkController, "#landmark_list");
			landmarkManage.map_landmarks();
			
			
		});
		
		// Focus on the landmark
		var lid = $(this).parent().parent().attr("landmark_id");
		center_landmark(landmarkManage.map, landmarkController.landmarks[landmarkController.findLandmarkByID(lid)]);
		
		return false;
	});
	
	$("#landmark-edit-size").change(function() {
		if ($(this).val() == 4) {
			$("#landmark-edit-custom-box").show();
		} else {
			$("#landmark-edit-custom-box").hide();
		}
	});
});