var buildingPolygon = false;
var polygonPoints;
var mapPolygon;
var polygonMode = 1;
var landmarkManage;
var mapCircle;

function load_landmark_list(controller, selector) {
	$(selector).empty();
	for (var i in controller.landmarks) {
		var landmark = controller.landmarks[i];
				
		var dataString = "<tr landmark_id='" + landmark.id + "'>";
		dataString += "<td><a href='#' class='edit-landmark'>" + landmark.name + "</a></td>";
		dataString += "<td style='text-align: center;'>" + landmark.userName + "</td>";
		dataString += "<td>" + landmark.location + "</td>";
		//dataString += "<td>" + landmark.tags.join(", ") + "</td>";
		dataString += "</tr>";
		
		$(selector).append(dataString);
	}	
}


function LandmarkManager(controller, editBox, viewBox, mapBox, mapID) {
	this.controller = controller;
	this.editDialog = editBox;
	this.viewDialog = viewBox;
	this.currentLandmark = 0;
        this.editor = false;
	
	this.map_landmarks = function() {
		// Loop through landmarks and map em
		for (var i in this.controller.landmarks) {
			map_landmark(this.map, this.controller.landmarks[i]);
		}
	};

        this.destroy_editor = function() {
            // Remove current listeners
            google.maps.event.clearListeners(landmarkManage.map.map, "click");
            
            if (this.editor) {
                this.editor.cancel();
                this.editor = false;
            }
        };

	var currentManager = this;
	
	// Build the management dialogs
	$(this.editDialog).dialog({
		autoOpen: false,
		draggable: true,
		resizable: false,
		width: 350,
		close: function() {
			// Ensure the landmark map dialog is closed
			$(currentManager.mapDialog).dialog('close');
		}
	});
	
	$(this.viewDialog).dialog({
		autoOpen: false,
		draggable: true,
		resizable: false
	});
	
	$("#landmark-edit-lat").change(function() {
		if ($("#landmark-edit-lat").val().length >= 2 && $("#landmark-edit-lng").val().length >= 2) {
			landmarkManage.map.hide_circle("edit-circle");
			mapCircle.setCoord(new MapPoint($("#landmark-edit-lat").val(), $("#landmark-edit-lng").val()));
			landmarkManage.map.add_circle(mapCircle);
			landmarkManage.map.map_circle("edit-circle");
		}
	});
	
	$("#landmark-edit-lng").change(function() {
		if ($("#landmark-edit-lat").val().length >= 2 && $("#landmark-edit-lng").val().length >= 2) {
			landmarkManage.map.hide_circle("edit-circle");
			mapCircle.setCoord(new MapPoint($("#landmark-edit-lat").val(), $("#landmark-edit-lng").val()));
			landmarkManage.map.add_circle(mapCircle);
			landmarkManage.map.map_circle("edit-circle");
		}
	});
	
	$("#landmark-edit-size").change(function() {
		//alert("Adjusting Size");
		landmarkManage.map.hide_circle("edit-circle");
		switch (parseInt($(this).val())) {
			case 1:
				mapCircle.setRadius(300);
				break;
			case 2:
				mapCircle.setRadius(700);
				break;
			case 3:
				mapCircle.setRadius(2000);
				break;
			case 4:
				break;
		
		}
		landmarkManage.map.add_circle(mapCircle);
		landmarkManage.map.map_circle("edit-circle");
	});
	
	$("#landmark-edit-custom-size").change(function() {
		landmarkManage.map.hide_circle("edit-circle");
		mapCircle.setRadius(parseInt($(this).val()));
		landmarkManage.map.add_circle(mapCircle);
		landmarkManage.map.map_circle("edit-circle");
	});
	
	$("#landmark-edit-color").change(function() {
		if (parseInt($("#landmark-type").val()) == 1) {
			landmarkManage.map.hide_circle("edit-circle");
			mapCircle.setColor($(this).val());
			landmarkManage.map.add_circle(mapCircle);
			landmarkManage.map.map_circle("edit-circle");
		} else {
			//mapPolygon.setFillStyle({color:$(this).val()});
                        if (currentManager.editor)
                            currentManager.editor.mapPolygon.polygon.setOptions({
				fillColor:$(this).val(),
				strokeColor:$(this).val()
                            });
			
			//mapPolygon.setStrokeStyle({color:$(this).val()});
		}
	});
	
	// This method opens the create dialog. It clears or resets the fields back to default within the edit dialog
	// and sets up the buttons. When creating it retrieves the information, creates a new landmark object, saves it and
	// then calls the provided callback after the save is done. The method handles updating the data controller.
	this.openCreateDialog = function(callback) {
                var self = this;
                this.currentLandmark = 0;

		// First clear the fields
		$("#landmark-edit-address").val('');
		$("#landmark-edit-name").val('');
		$("#landmark-edit-user-list").val(0);
		$("#landmark-edit-lat").val('');
		$("#landmark-edit-lng").val('');
		$("#landmark-edit-custom-size").val('');
		$("#landmark-edit-edit-size").val(1);
		$("#landmark-type").val(1); // Default to circle
				
		$("#fields-landmark-type").show();
		$("#landmark-polygon-control").val("Build Polygon");
		
		$("#landmark-edit-color").val('#FF0000');
		mapCircle = new MapCircle("edit-circle", "edit", new MapPoint(0.0, 0.0), 300, "#FF0000");

                /*if (mapPolygon != undefined)
                    mapPolygon.polygon.setMap(null);

                mapPolygon = new MapPolygon("edit-polygon", "edit", [], "#FF0000");
                this.map.add_polygon(mapPolygon);
                this.map.map_polygon("edit-polygon");
                */
		switch_geofence_type();		

		$(this.editDialog).dialog('option', 'title', 'Create New Landmark');
		$(this.editDialog).dialog('open');
		$(this.editDialog).dialog('option', 'buttons', {
			'Create':function() {
			
				// Create a new landmark
				landmark = create_landmark();
				
				if (parseInt($("#landmark-type").val()) == 2) {
					landmark.format = 2;
				} else {
                                        landmark.format = 1;
				}

                                if (self.editor) {
                                    landmark.polygon = self.editor.get_map_points();
                                }
                                
				// Run validation tests
				if (is_landmark_valid(landmark)) {
				
					
					// Save its!
					landmark.save(function(savedLandmark) {
						// currentController is referring to the management object, controller refers tot he landmark object
						currentManager.controller.landmarks.push(savedLandmark);
						callback(savedLandmark);
                                            
                                                if (self.editor) {
                                                    savedLandmark.polygon.push(savedLandmark.polygon[0]);
                                                }

                                                landmarkManage.destroy_editor();

                                                $(self).dialog('close');

                                        });

				

                                }

				/*if (mapPolygon != undefined)
					mapPolygon.polygon.setMap(null);
                                    */
					//landmarkManage.map.map.removeOverlay(mapPolygon);
			},
			'Cancel': function() {
				// Remove the mapped polygon if it exists
				/*if (mapPolygon != undefined)
					mapPolygon.polygon.setMap(null);
				*/
				if (mapCircle != undefined)
					mapCircle.circle.setMap(null);
				
				landmarkManage.destroy_editor();

				// Close this dialog
				$(this).dialog('close');
			}
			
			
		});
	};
	
	this.openEditDialog = function(callback) {
		// First fill in the information to the fields
		var arrID = this.controller.findLandmarkByID(this.currentLandmark);
		var l = this.controller.landmarks[arrID];
                var self = this;
		
		$("#landmark-edit-address").val(l.address);
		$("#landmark-edit-name").val(l.name);
		$("#landmark-edit-user-list").val(l.user_id);
		$("#landmark-edit-lat").val(l.latitude);
		$("#landmark-edit-lng").val(l.longitude);
		$("#landmark-edit-tags").val(l.getTagstring());
		$("#landmark-edit-custom-size").val(0);
		
		$("#landmark-edit-color").val(l.color);
		
		switch (parseInt(l.radius)) {
			case 300:
				$("#landmark-edit-size").val(1);
				$("#landmark-edit-custom-box").hide();
				break;
			case 700:
				$("#landmark-edit-size").val(2);
				$("#landmark-edit-custom-box").hide();
				break;
			case 2000:
				$("#landmark-edit-size").val(3);
				$("#landmark-edit-custom-box").hide();
				break;
			default:
				$("#landmark-edit-size").val(4);
				$("#landmark-edit-custom-size").val(l.radius);
				$("#landmark-edit-custom-box").show();
				break;
		}
		
		// Make sure the proper dialog boxes are there.
		if (l.format == 2) {
			$("#landmark-type").val(2);
		} else {
			$("#landmark-type").val(1);
		}
		
		$("#fields-landmark-type").hide();
		$("#landmark-polygon-control").val("Rebuild Polygon");
		
		// Unmap the landmark item and show the editing one
		unmap_landmark(this.map, l);
		
		if (l.format == 2) {
			var points = new Array();
			polygonPoints = new Array();
			for (var i in l.polygon) {
				points.push(new google.maps.LatLng(l.polygon[i].lat, l.polygon[i].lng));
				var point = new MapPoint(l.polygon[i].lat, l.polygon[i].lng);
				polygonPoints.push(point);
			}
			
/*			mapPolygon = new MapPolygon("edit-polygon", "edit", polygonPoints, l.color);
			this.map.add_polygon(mapPolygon);
			this.map.map_polygon("edit-polygon");
                                */
		} else {
			mapCircle = new MapCircle("edit-circle", "edit", new MapPoint(l.latitude, l.longitude), l.radius, l.color);
			this.map.add_circle(mapCircle);
			this.map.map_circle("edit-circle");
		}
		
                switch_geofence_type();
		
		$(this.editDialog).dialog('option', 'title', 'Edit an Existing Landmark');
		$(this.editDialog).dialog('open');
		$(this.editDialog).dialog('option', 'buttons', {
			'Update':function() {
				// Update our landmark
				var arrID = currentManager.controller.findLandmarkByID(currentManager.currentLandmark);
				var landmark = currentManager.controller.landmarks[arrID];
				landmark.name = $("#landmark-edit-name").val();
				landmark.address = $("#landmark-edit-address").val();
				landmark.user_id = $("#landmark-edit-user-list").val();
				landmark.latitude = $("#landmark-edit-lat").val();
				landmark.longitude = $("#landmark-edit-lng").val();
				landmark.color = $("#landmark-edit-color").val();
				
				var type = 1;
				var radius;
				
				switch (parseInt($("#landmark-edit-size").val())) {
					case 1:
					default:
						radius = 300;
						break;
					case 2:
						radius = 700;
						break;
					case 3:
						radius = 2000;
						break;
					case 4:
						radius = $("#landmark-edit-custom-size").val();
						break;
				}
				
				landmark.type = type;
				landmark.radius = radius;
				landmark.tags = Landmark.tagsFromTagstring($("#landmark-edit-tags").val());
				
				
				landmark.format = parseInt($("#landmark-type").val());
                                if (self.editor)
                                    landmark.polygon = self.editor.get_map_points();
                                else
                                    landmark.polygon = [];

				// Save its!
				landmark.save(function() {
					callback(landmark);
				});

                                landmarkManage.destroy_editor();
                                
                                // Remap original
				map_landmark(landmarkManage.map, landmark);
                                
				// Remove the map polygon
				/*if (mapPolygon != undefined)
					landmarkManage.map.hide_polygon("edit-polygon");
					//landmarkManage.map.map.removeOverlay(mapPolygon);
				*/
				// Remove the circle polygon
				landmarkManage.map.hide_circle("edit-circle");

                                $(this).dialog('close');
				
			},
			'Cancel': function() {
				// Remove the map polygon
				/*if (mapPolygon != undefined)
					mapPolygon.polygon.setMap(null);
				*/
				// Remove the circle polygon
				landmarkManage.map.hide_circle("edit-circle");
				
				// Remap original
				map_landmark(landmarkManage.map, l);

                                landmarkManage.destroy_editor();

				// Close this dialog
				$(this).dialog('close');
				
			},
			'Delete': function() {
				currentManager.controller.remove(currentManager.currentLandmark);
				callback();
                                landmarkManage.destroy_editor();
                                $(this).dialog('close');
			}
			
		});
		
	};
	
	this.closeEditDialog = function() {
		$(this.editDialog).dialog('close');
	};
	
	// This method 
	this.updateLandmarkUsers = function(userController) {
		for (var i in this.controller.landmarks) {
			if (this.controller.landmarks[i].user_id == 0) {
				this.controller.landmarks[i].userName = "Entire Company";
				continue;
			}
			
			var userArrID = userController.findUserByID(this.controller.landmarks[i].user_id);
			
			if (userArrID == -1) {
				this.controller.landmarks[i].userName = "Unknown";
			} else {
				this.controller.landmarks[i].userName = userController.users[userArrID].name;
			}
		}
	};
	
	this.setEditingLandmark = function(landmark_id) {
		this.currentLandmark = landmark_id;
	};
	
	this.createMap = function(mapID, lat, lng, zoom) {
		this.map = new MapController(mapID, new MapPoint(lat, lng), zoom);
		
	};
	
}

function create_landmark() {
	var type = 1;
	var radius;
	
	switch (parseInt($("#landmark-edit-size").val())) {
		case 1:
		default:
			radius = 300;
			break;
		case 2:
			radius = 700;
			break;
		case 3:
			radius = 2000;
			break;
		case 4:
			radius = $("#landmark-edit-custom-size").val();
			break;
	}

	var landmark = new Landmark({
		GeoFenceID: 0,
		GeoFenceTypeID: type,
		GeofenceFormat: $("#landmark-type").val(),
		Address: $("#landmark-edit-address").val(),
		FenceName: $("#landmark-edit-name").val(),
		UserID: $("#landmark-edit-user-list").val(),
		FenceLatitude: $("#landmark-edit-lat").val(),
		FenceLongitude: $("#landmark-edit-lng").val(),
		FenceRadius: radius,
		polygon: [],
		FenceColor:$("#landmark-edit-color").val(),
		tags: Landmark.tagsFromTagstring($("#landmark-edit-tags").val())
	});
	
	return landmark;
}

function is_landmark_valid(landmark) {
	// Test for a name
	if (landmark.name.length == 0) {
		// Alert and return false
		alert("Please enter a name for the landmark");
		
		return false;
	}
	
	// Test coordinates
	if (landmark.format == 1) {
		if (landmark.latitude.length <  2 || landmark.longitude.length < 2) {
			alert("Please enter a valid coordinate for this landmark");
			return false;
		}
	} else if (landmark.format == 2) {
		if (landmark.polygon == undefined || landmark.polygon.length < 3) {
			alert("Please build your polygon");
			return false;
		}
	} else {
		alert("Unknown Format");
	}
	
	return true;
}

// Process reverse geocoding (obtaining an address with lat/lng)
function check_for_address() {
	if ($("#landmark-edit-lat").val().length > 3 && $("#landmark-edit-lng").val().length > 3) {
		reverseGeocode($("#landmark-edit-lat").val(), $("#landmark-edit-lng").val(), function(address) {
			if (address == null) {
				$("#landmark-edit-address").val("Unknown");
			} else {
				$("#landmark-edit-address").val(address);
			}
		});
	}
}

// Process regular geocoding (obtaining coordinates with an address)
function check_for_point() {
	if ($("#landmark-edit-address").val().length > 5) {
		geocode($("#landmark-edit-address").val(), function(lat, lng) {
			if (lat != null) {
				$("#landmark-edit-lat").val(lat);
				$("#landmark-edit-lng").val(lng);
			}
		});
	}
}

function switch_geofence_type() {
	if (parseInt($("#landmark-type").val()) == 2) { // set to polygon. 
		$("#fields-landmark-coords").hide();
		$("#fields-landmark-address").hide();
		$("#fields-landmark-size").hide();
		$("#landmark-edit-custom-box").hide();
		$("#landmark-polygon-controller").show();
	} else { // Set to radial
		$("#fields-landmark-coords").show();
		$("#fields-landmark-address").show();
		$("#fields-landmark-size").show();
		$("#landmark-polygon-controller").hide();
	}
	setup_click_listener();
}
function finished_polygon() {
	buildingPolygon = false;
	polygonMode = 1;
	$("#landmark-polygon-control").val("Rebuild Polygon");
	
	// Pull the marks out
	var count = mapPolygon.points.length;
	var i = 0;
	polygonPoints = new Array();

	while (i != count) {
		var point = new MapPoint(mapPolygon.points.getAt(i));
		polygonPoints.push(point);
		i++;
	}
	

}

function setup_click_listener() {
    
        landmarkManage.destroy_editor();
        var arrID = landmarkManage.controller.findLandmarkByID(landmarkManage.currentLandmark);
        var landmark = landmarkManage.controller.landmarks[arrID];

	// Remove current listeners
	google.maps.event.clearListeners(landmarkManage.map.map, "click");
	
	// Based on type add listener
	var type = parseInt($("#landmark-type").val());

	if (type == 1) {
		// Add circle listener
		google.maps.event.addListener(landmarkManage.map.map, 'click',function(event) {

			var point = new MapPoint(event.latLng);
			$("#landmark-edit-lat").val(point.lat);
			$("#landmark-edit-lng").val(point.lng);
			
			landmarkManage.map.hide_circle("edit-circle");
			
			mapCircle.setCoord(point);
			landmarkManage.map.add_circle(mapCircle);
			landmarkManage.map.map_circle("edit-circle");
		

		});
	} else {
            
            var polygon = [];
            if (landmark) polygon = landmark.polygon;
            var color = $("#landmark-edit-color").val();

            landmarkManage.editor = new PolygonEditor(landmarkManage.map, polygon, color);
            
            /*
             // Add polygon listener
		google.maps.event.addListener(landmarkManage.map.map, 'click',function(event) {
			if (buildingPolygon) {

                                var marker = new google.maps.Marker({
                                  position: event.latLng,
                                  map: landmarkManage.map.map,
                                  draggable: true
                                });
                                markers.push(marker);
                                marker.setTitle("#" + path.length);

                                google.maps.event.addListener(marker, 'click', function() {
                                  marker.setMap(null);
                                  for (var i = 0, I = markers.length; i < I && markers[i] != marker; ++i);
                                    mapPolygon.points.removeAt(i);
                                    //path.removeAt(i);
                                  }
                                );

                                google.maps.event.addListener(marker, 'dragend', function() {
                                  for (var i = 0, I = markers.length; i < I && markers[i] != marker; ++i);
                                    mapPolygon.points.setAt(i, marker.getPosition());
                                  }
                                );

                                landmarkManage.map.hide_polygon("edit-polygon");
				
				mapPolygon.points.insertAt(mapPolygon.points.length, event.latLng);
				mapPolygon.build_polygon();
				//landmarkManage.map.add_polygon(mapPolygon);
				landmarkManage.map.map_polygon("edit-polygon");
				//alert("Updated Polygon. Now has " + mapPolygon.points.length + " points");
			}
		
		});
                

		//google.maps.event.addListener(landmarkManage.map.map, 'rightclick', finished_polygon);
                */
	}
}

function PolygonEditor(mapController, polygonPoints, color) {

    this.map = mapController;
    var points = [];

    for (var i = 0; i < polygonPoints.length-1; ++i)
        points.push(polygonPoints[i]);

    this.mapPolygon = new MapPolygon("edit-polygon", "edit", points, color);
    this.map.add_polygon(this.mapPolygon);
    this.map.map_polygon("edit-polygon");

    this.markers = [];

    var self = this;

    this.cancel = function() {
        google.maps.event.clearListeners(this.map.map, "click");
        for (var i = 0; i < this.markers.length; ++i)
            this.markers[i].setMap(null);
        this.markers = [];
        this.map.hide_polygon("edit-polygon");
    };

    this.get_map_points = function() {
	var points = [];
	for (var i = 0; i < this.mapPolygon.points.length; ++i) {
		var point = new MapPoint(this.mapPolygon.points.getAt(i));
		points.push(point);
	}
        if (points.length > 0)
            points.push(points[0]);

        return points;
    }

    this.add_marker = function(latLng) {

        var self = this;

        var marker = new google.maps.Marker({
            position: latLng,
            map: this.map.map,
            draggable: true
        });

        this.markers.push(marker);
        marker.setTitle("#" + this.markers.length);

        google.maps.event.addListener(marker, 'click', function() {
            marker.setMap(null);
            var removeLast = false;
            for (var i = 0; i < self.markers.length; ++i) {
                if (self.markers[i].title == marker.title) {
           //         if (i == 0) removeLast = true;
                    self.mapPolygon.points.removeAt(i);
                    self.markers.splice(i,1);
                    break;
                }
            }
            /*if (removeLast) {
                self.mapPolygon.points.removeAt(self.mapPolygon.points.length - 1);
                self.mapPolygon.points.insertAt(self.mapPolygon.points.length, self.mapPolygon.points.getAt(0));
            }
                */
        });

        google.maps.event.addListener(marker, 'dragend', function() {
            for (var i = 0; i < self.markers.length; ++i) {
                self.mapPolygon.points.setAt(i, self.markers[i].getPosition());
            }
           // self.mapPolygon.points.setAt(self.mapPolygon.points.length-1, self.markers[0].getPosition());
        //    self.mapPolygon.build_polygon();
        });

    };

    this.build_markers = function() {
        for (var i = 0; i < this.mapPolygon.points.length; ++i) {
            this.add_marker(this.mapPolygon.points.getAt(i));
        }
    };

    google.maps.event.addListener(this.map.map, 'click',function(event) {

        //landmarkManage.map.hide_polygon("edit-polygon");

//        landmarkManage.map.hide_polygon("edit-polygon");
        self.mapPolygon.points.insertAt(self.mapPolygon.points.length, event.latLng);
        self.mapPolygon.build_polygon();
        //landmarkManage.map.add_polygon(mapPolygon);
        landmarkManage.map.map_polygon("edit-polygon");
//        landmarkManage.map.map_polygon("edit-polygon");

        self.add_marker(event.latLng);
    });

    this.build_markers();


}

$(document).ready(function() {
	// If a lat and lng are both set we need to initiate a geocoding request
	$("#landmark-edit-lat").change(check_for_address);
	$("#landmark-edit-lng").change(check_for_address);
	
	// If the address is changed we need to geocode it if possible
	$("#landmark-edit-address").change(check_for_point);
	
	$("#landmark-type").change(switch_geofence_type);
	


	$("#landmark-polygon-control").click(function() {
		switch (polygonMode) {
			case 1:
				buildingPolygon = true;
				polygonMode = 2;
				polygonPoints = new Array();
				$("#landmark-polygon-control").val("Cancel Build");
				$("#landmark-polygon").val('');
				
				if (mapPolygon != undefined)
					mapPolygon.polygon.setMap(null);
				
				/*mapPolygon = new google.maps.Polygon({
			      strokeWeight: 1,
			      fillColor: '##f33f00'
			    });*/
			    mapPolygon = new MapPolygon("edit-polygon", "temp-group", [], "#f33f00");
			    landmarkManage.map.add_polygon(mapPolygon);
			    landmarkManage.map.map_polygon("edit-polygon");
				//new GPolygon([], "#f33f00", 1, 1, "#ff0000", 0.2);
//				mapPolygon.polygon.setMap(landmarkManage.map.map);
				//mapPolygon.enableDrawing();
				
				//google.maps.event.addListener(landmarkManage.map.map, "dblclick", finished_polygon);
				break;
			case 2:
				buildingPolygon = false;
				polygonMode = 1;
				$("#landmark-polygon-control").val("Build Polygon");
				mapPolygon.polygon.setMap(null);
				
				break;
		}

		
	});
});