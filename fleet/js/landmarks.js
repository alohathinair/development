var landmarkController;
var landmarkManage;
var userController;
var mapDefaultLat;
var mapDeafultLong;

$(document).ready(function() {
	
        landmarkController = new LandmarkController();
	landmarkManage = new LandmarkManager(landmarkController, "#edit-landmark-dialog", "#view-landmark-dialog", "#landmark-map-dialog", "landmark-map");
	userController = new UserController();
	
        $("#add_landmark").button({
            icons: {
                primary: "add-new-landmark-icon"
            }});

        $("#import-landmark,#import-landmark-ok,#import-landmark-cancel").button();

        $("#import-landmark-cancel").click(function() {
            $("#import-landmarks-controls").hide();
            $("#landmarks-controls").show();
            return false;
        });

        $("#import-landmark").click(function() {
            $("#landmarks-controls").hide();
            $("#import-landmarks-controls").show();
            return false;
        });

        $("#import-alert-close").click(function() {
            $("#import-alert").hide("slow");
        })

	// Download our landmarks
	landmarkController.get_landmark_management_data(userController, function(data) {
		mapDefaultLat = data.company.CompanyDefaultMapLatitude;
		mapDefaultLong = data.company.CompanyDefaultMapLongitude;
		mapDefaultZoom = data.company.CompanyDefaultMapZoom;
		landmarkManage.createMap("landmark-map", mapDefaultLat, mapDefaultLong, mapDefaultZoom);
		//landmarkManage.addLandmarkPointListener();
		
		resize_containers(0);
		
		landmarkManage.map.set_center(new MapPoint(mapDefaultLat, mapDefaultLong), mapDefaultZoom);
		
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

                resize_containers(0);
                
		return false;
	});
	
	$("body").on("click",".edit-landmark", function() {
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
		
                resize_containers(0);

		return false;
	});
	
	$("#landmark-edit-size").change(function() {
		if ($(this).val() == 4) {
			$("#landmark-edit-custom-box").show();
		} else {
			$("#landmark-edit-custom-box").hide();
		}
	});
	
	$(window).resize(function() {
		resize_containers(00);
	});
});


function reload_landmarks() {
    // Download our landmarks
    landmarkController.remove_all();
    landmarkController.get_landmark_management_data(userController, function(data) {
        // Properly assign all of our landmark users
        landmarkManage.updateLandmarkUsers(userController);
        // Load landmarks
        load_landmark_list(landmarkController, "#landmark_list");
        landmarkManage.map_landmarks();

    });
}

function resize_containers(minus) {
	// Adjust map size based on screen width
	var totalWidthAvailable = $("#container").width()-2;
	var totalHeightAvailable = $(window).height();
	var neededSpace = $("#landmark-table-container").width();
	var mapSpace = totalWidthAvailable - neededSpace;
	
	$("#landmark-map").css("width", mapSpace-10);
	
	// Now adjust height
	// Calculate height
	neededSpace = $("#navbar").height();
	mapSpace = totalHeightAvailable - neededSpace - 50;
	
	$("#landmark-map").css("height", mapSpace);
	$("#landmark-table-container").css("height", mapSpace);
}

