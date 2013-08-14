/*
 * This file provides mapping controls for Google Maps. It provides wrapper methods for circles, lines, and markers.
 * Each overlay requires an ID, and can optionally have a GROUP_ID to control entire groups of overlays
 */

function MapController(mapElement, center, zoom, disableExtras) {
    var mapOpts = {
        zoom: zoom,
        center: center.point,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
	
    if (disableExtras) {
        mapOpts.streetViewControl = false;
        mapOpts.mapTypeControl = false;
    }
    this.map = new google.maps.Map(document.getElementById(mapElement), mapOpts);
    this.map_element = mapElement;

    //this.map.setUIToDefault();
	
    this.markers = new Array();
    this.circles = new Array();
    this.lines = new Array();
    this.polygons = new Array();
	
    this.set_center = function(point, zoom) {
        this.map.setCenter(point.point);
        this.map.setZoom(zoom);
    };

    this.set_extent = function(extent) {
        this.set_center(extent.getPoint(), extent.zoom);
    }
    
    this.pan_to = function(point) {
        this.map.panTo(point.point);
    }
	
    // Marker Management Functions
    this.add_marker = function(marker) {
        // Ensure it's a marker
        if (!(marker instanceof MapMarker)) {
            return -1;
        }
		
        // If the marker exists we want to replace, not add
        var existing = this.findMarkerByID(marker.id);
        if (existing != -1) {
            this.hide_marker(existing, true); // Unmap it before replacing it if needed
            this.markers[existing] = marker;
        } else {
            // Add the marker to our markers
            this.markers.push(marker);
        }
    };
	
    this.remove_marker = function(marker_id) {
    };
    
    this.remove_markers = function(group) {
    	if (group) {
    		var newMarkers = new Array();
    	    for (var i in this.markers) {
    	        if (this.markers[i].group == group) { // Ensure it needs to be mapped
    	            this.hide_marker(i, true); // Hide this marker because we're removing it
    	        } else {
    	        	newMarkers.push(this.markers[i]); // This marker is not getting removed so add it to our temp array
    	        }
    	    }
    	    
    	    // Reset our markers to the new list of markers
    	    this.markers = newMarkers;
    	}
    };
	
    this.clear_markers = function() {
        for (var i in this.markers) {
            this.hide_marker(i, true);
        }
		
        this.markers = [];
    };
	
    this.findMarkerByID = function(marker_id) {
        for (var i in this.markers) {
            if (this.markers[i].id == marker_id) {
                return i;
            }
        }
		
        return -1;
    };
	
    // Marker mapping functions
    this.map_marker = function(marker_id, isArrayID) {
        var arrID;
        if (isArrayID == true) {
            arrID = marker_id;
        } else {
            arrID = this.findMarkerByID(marker_id);
        }
		
        if (arrID != -1) {
            //this.map.addOverlay(this.markers[arrID].marker);
            this.markers[arrID].marker.setMap(this.map);
            this.markers[arrID].mapped = true;
        }
    };
	
    this.hide_marker = function(marker_id, isArrayID) {
        var arrID;
        if (isArrayID == true) {
            arrID = marker_id;
        } else {
            arrID = this.findMarkerByID(marker_id);
        }
		
        if (arrID != -1) {
            //this.map.removeOverlay(this.markers[arrID].marker);
            this.markers[arrID].marker.setMap(null);
            this.markers[arrID].mapped = false;
        }
    };
	
    this.map_markers = function(group) {
        if (group) {
            for (var i in this.markers) {
                if (this.markers[i].group == group) { // Ensure it needs to be mapped
                    this.map_marker(i, true);
                }
            }
        } else {
            for (var i in this.markers) {
                this.map_marker(i, true);
            }
        }
    };
	
    this.hide_markers = function(group) {
        if (group) {
            for (var i in this.markers) {
                if (this.markers[i].group == group) { // Ensure it needs to be mapped
                    this.hide_marker(i, true);
                }
            }
        } else {
            for (var i in this.markers) {
                this.hide_marker(i, true);
            }
        }
    };
	
    // Circle Management Functions
    this.add_circle = function(circle) {
        // Ensure it's a circle
        if (!(circle instanceof MapCircle)) {
            return -1;
        }
		
        // Add the circle to our circles
        //this.circles.push(circle);
		
        // If the marker exists we want to replace, not add
        var existing = this.findCircleByID(circle.id);
        if (existing != -1) {
            this.hide_circle(existing, true); // Unmap it before replacing it if needed
            this.circles[existing] = circle;
        } else {
            // Add the marker to our markers
            this.circles.push(circle);
        }
    };
	
    this.remove_circle = function(circle_id) {
    };
	
    this.findCircleByID = function(circle_id) {
        for (var i in this.circles) {
            if (this.circles[i].id == circle_id) {
                return i;
            }
        }
		
        return -1;
    };
	
    // Circle mapping functions
    this.map_circle = function(circle_id, isArrayID) {
        var arrID;
        if (isArrayID == true) {
            arrID = circle_id;
        } else {
            arrID = this.findCircleByID(circle_id);
        }
		
        if (arrID != -1) {
            //this.map.addOverlay(this.circles[arrID].circle);
            this.circles[arrID].circle.setMap(this.map);
            this.circles[arrID].mapped = true;
        }
    };
	
    this.hide_circle = function(circle_id, isArrayID) {
        var arrID;
        if (isArrayID == true) {
            arrID = circle_id;
        } else {
            arrID = this.findCircleByID(circle_id);
        }
		
        if (arrID != -1) {
            //			this.map.removeOverlay(this.circles[arrID].circle);
            this.circles[arrID].circle.setMap(null);
            this.circles[arrID].mapped = false;
        }
    };
	
    this.map_circles = function(group) {
        if (group) {
            for (var i in this.circles) {
                if (this.circles[i].group == group) { // Ensure it needs to be mapped
                    this.map_circle(i, true);
                }
            }
        } else {
            for (var i in this.circles) {
                this.map_circle(i, true);
            }
        }
    };
	
    this.hide_circles = function(group) {
        if (group) {
            for (var i in this.circles) {
                if (this.circles[i].group == group) { // Ensure it needs to be mapped
                    this.hide_circle(i, true);
                }
            }
        } else {
            for (var i in this.circles) {
                this.hide_circle(i, true);
            }
        }
    };
	
	
    // Line Management Functions
    this.add_line = function(line) {
        // Ensure it's a circle
        if (!(line instanceof MapLine)) {
            return -1;
        }
		
		
        var existing = this.findLineByID(line.id);
        if (existing != -1) {
            this.hide_line(existing, true); // Unmap it before replacing it if needed
            this.lines[existing] = line;
        } else {
            // Add the marker to our markers
            this.lines.push(line);
        }
		
    // Add the circle to our circles
		
    };
	
    this.remove_line = function(line_id) {
    };
    
    this.remove_lines = function(group) {
    	if (group) {
    		var newLines = new Array();
    	    for (var i in this.lines) {
    	        if (this.lines[i].group == group) { // Ensure it needs to be mapped
    	            this.hide_line(i, true); // Hide this marker because we're removing it
    	        } else {
    	        	newLines.push(this.lines[i]); // This marker is not getting removed so add it to our temp array
    	        }
    	    }
    	    
    	    // Reset our markers to the new list of markers
    	    this.lines = newLines;
    	}
    };

	
    this.findLineByID = function(line_id) {
        for (var i in this.lines) {
            if (this.lines[i].id == line_id) {
                return i;
            }
        }
		
        return -1;
    };
	
    // Line mapping functions
    this.map_line = function(line_id, isArrayID) {
        var arrID;
        if (isArrayID == true) {
            arrID = line_id;
        } else {
            arrID = this.findLineByID(line_id);
        }
		
        if (arrID != -1) {
            //alert("Displaying line " + this.lines[arrID].id);
            //this.map.addOverlay(this.lines[arrID].line);
            this.lines[arrID].line.setMap(this.map);
            this.lines[arrID].mapped = true;
        }
    };
	
    this.hide_line = function(line_id, isArrayID) {
        var arrID;
        if (isArrayID == true) {
            arrID = line_id;
        } else {
            arrID = this.findLineByID(line_id);
        }
		
        if (arrID != -1) {
            //this.map.removeOverlay(this.lines[arrID].line);
            this.lines[arrID].line.setMap(null);
            this.lines[arrID].mapped = false;
        }
    };
	
    this.toggle_line = function(line_id, isArrayID) {
        var arrID;
        if (isArrayID == true) {
            arrID = line_id;
        } else {
            arrID = this.findLineByID(line_id);
        }
		
        if (arrID != -1) {
            if (this.lines[arrID].mapped == true) {
                this.hide_line(arrID, true);
            } else {
                this.map_line(arrID, true);
            }
        }
    };
	
    this.map_lines = function(group) {
        if (group) {
            for (var i in this.lines) {
                if (this.lines[i].group == group) { // Ensure it needs to be mapped
                    this.map_line(i, true);
                }
            }
        } else {
            for (var i in this.lines) {
                this.map_line(i, true);
            }
        }
    };
	
    this.hide_lines = function(group) {
        if (group) {
            for (var i in this.lines) {
                if (this.lines[i].group == group) { // Ensure it needs to be mapped
                    this.hide_line(i, true);
                }
            }
        } else {
            for (var i in this.lines) {
                this.hide_line(i, true);
            }
        }
    };
	
    // Line Management Functions
    this.add_polygon = function(polygon) {
        // Ensure it's a circle
        if (!(polygon instanceof MapPolygon)) {
            return -1;
        }
		
        // Add the circle to our circles
        //this.polygons.push(polygon);
		
        var existing = this.findPolygonByID(polygon.id);
        if (existing != -1) {
            this.hide_polygon(existing, true); // Unmap it before replacing it if needed
            this.polygons[existing] = polygon;
        } else {
            // Add the marker to our markers
            this.polygons.push(polygon);
        }
    };
	
    this.remove_polygon = function(polygon_id) {
    };
	
    this.findPolygonByID = function(polygon_id) {
        for (var i in this.polygons) {
            if (this.polygons[i].id == polygon_id) {
                return i;
            }
        }
		
        return -1;
    };
	
    // Polygon mapping functions
    this.map_polygon = function(polygon_id, isArrayID) {
        var arrID;
        if (isArrayID == true) {
            arrID = polygon_id;
        } else {
            arrID = this.findPolygonByID(polygon_id);
        }
		
        if (arrID != -1) {
            //this.map.addOverlay(this.polygons[arrID].polygon);
            this.polygons[arrID].polygon.setMap(this.map);
			
            this.polygons[arrID].mapped = true;
        }
    };
	
    this.hide_polygon = function(polygon_id, isArrayID) {
        var arrID;
        if (isArrayID == true) {
            arrID = polygon_id;
        } else {
            arrID = this.findPolygonByID(polygon_id);
        }
		
        if (arrID != -1) {
            //this.map.removeOverlay(this.polygons[arrID].polygon);
            this.polygons[arrID].polygon.setMap(null);
            this.polygons[arrID].mapped = false;
        }
    };
	
    this.toggle_polygon = function(polygon_id, isArrayID) {
        var arrID;
        if (isArrayID == true) {
            arrID = polygon_id;
        } else {
            arrID = this.findLineByID(polygon_id);
        }
		
        if (arrID != -1) {
            if (this.polygons[arrID].mapped == true) {
                this.hide_polygon(arrID, true);
            } else {
                this.map_polygon(arrID, true);
            }
        }
    };
	
    this.map_polygons = function(group) {
        if (group) {
            for (var i in this.polygons) {
                if (this.linespolygons.group == group) { // Ensure it needs to be mapped
                    this.map_polygon(i, true);
                }
            }
        } else {
            for (var i in this.polygons) {
                this.map_polygon(i, true);
            }
        }
    };
	
    this.hide_polygons = function(group) {
        if (group) {
            for (var i in this.polygons) {
                if (this.polygons[i].group == group) { // Ensure it needs to be mapped
                    this.hide_polygon(i, true);
                }
            }
        } else {
            for (var i in this.polygons) {
                this.hide_polygon(i, true);
            }
        }
    };
	
    this.add_listener = function(event, callback) {
        google.maps.event.addListener(this.map, event, callback);
    };

    this.controls_container = false;

    this.get_controls_container = function() {
        if (!this.controls_container) {
            this.controls_container = document.createElement('DIV');
            this.controls_container.index = 1;
            this.controls_container.style.padding = '5px';
            this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(this.controls_container);
        }
        return this.controls_container;
    },

    this.add_fullscreen_control = function(callback) {
      var self = this;

      // Set CSS for the control border
      var controlUI = document.createElement('DIV');
      controlUI.style.backgroundColor = '#f8f8f8';
      controlUI.style.borderStyle = 'solid';
      controlUI.style.borderWidth = '1px';
      controlUI.style.borderColor = '#a9bbdf';;
      controlUI.style.boxShadow = '0 1px 3px rgba(0,0,0,0.5)';
      controlUI.style.cursor = 'pointer';
      controlUI.style.textAlign = 'center';
      controlUI.title = 'Toggle the fullscreen mode';
      this.get_controls_container().appendChild(controlUI);

      // Set CSS for the control interior
      var controlText = document.createElement('DIV');
      controlText.style.fontSize = '12px';
      controlText.style.fontWeight = 'bold';
      controlText.style.color = '#000000';
      controlText.style.paddingLeft = '4px';
      controlText.style.paddingRight = '4px';
      controlText.style.paddingTop = '3px';
      controlText.style.paddingBottom = '2px';
      controlUI.appendChild(controlText);

      controlText.innerHTML = 'Fullscreen';

      // Setup the click event listeners: toggle the full screen
      google.maps.event.addDomListener(controlUI, 'click', function() {
          var mapSel = "#" + self.map_element;

       if($(mapSel).hasClass("full-screen-map")){
            $("#liveview-map").width("auto");
            $(mapSel).removeClass('full-screen-map');
            controlText.innerHTML = 'Fullscreen';
            google.maps.event.trigger(map, 'resize');
            callback(false);
        } else {
            $("#liveview-map").width("100%");
            $(mapSel).addClass('full-screen-map');
            controlText.innerHTML = 'Exit Fullscreen';
            google.maps.event.trigger(map, 'resize');
            callback(true);
        }
      });
    }

}

function MapExtent(lat, lng, zoom) {
    this.lat = lat;
    this.lng = lng;
    this.zoom = zoom;
    this.isEmpty = function() {
        return !this.lat || !this.lng || !this.zoom;
    }
    this.getPoint = function() {
        return new MapPoint(this.lat, this.lng);
    }
}

function MapPoint(lat, lng) {
    if (lng == undefined && lat instanceof google.maps.LatLng) {
        this.point = lat;
        this.lat = this.point.lat();
        this.lng = this.point.lng();
    } else {
        this.point = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
        this.lat = parseFloat(lat);
        this.lng = parseFloat(lng);
    }
}

function MapMarker(id, group, coord, icon, title, zIndex, label, labelBG) {
    this.mapped = false; // If this is currently mapped
    this.id = id;
    this.group = group;
    this.coord = coord;
    this.icon = icon;
    this.title = title;
    var img = false;
    if (this.icon)
        img = this.icon.getIcon();

    this.setIcon = function(icon) {
        // No need to update, no change
        if (icon.image == this.icon.image) return;

        this.icon = icon;
        img = this.icon.getIcon();
        this.marker.setIcon(img);
    };

    if (zIndex == undefined) {
        this.zIndex = 1;
        zIndex = 1;
    } else {
        this.zIndex = zIndex;
    }
    if (!label) {
        this.marker = new google.maps.Marker({
            position: coord.point,
            icon: img,
            title: this.title,
            zIndexProcess: function(marker, b) {
                return GOverlay.getZIndex(marker.getPoint().lat()) + zIndex;
            }
        });
    } else {
        this.marker = new MarkerWithLabel({
            position: coord.point,
            draggable: false,
            icon: img,
            labelContent: label,
            labelInBackground: true,
            labelAnchor: new google.maps.Point(-2, 32),
            labelClass: "labeled-marker", // the CSS class for the label
            labelStyle: {
                opacity: 0.75,
                backgroundColor: labelBG,
                color: "#ffffff"/*,
                minWidth: 150*/
            }
        });
    }
    this.add_listener = function(event, callback) {
        google.maps.event.addListener(this.marker, event, callback);
    };
}

function MapCircle(id, group, centerCoord, radius, color, title) {
    this.mapped = false; // If this is currently mapped
	
    this.id = id;
    this.group = group;
    this.coord = centerCoord;
    this.radius = radius;
    this.color = color;
	
    this.build_circle = function() {
        var populationOptions = {
            strokeColor: this.color,
            strokeOpacity: 0.6,
            strokeWeight: 2,
            fillColor: this.color,
            fillOpacity: 0.3,
            //map: map,
            center: this.coord.point,
            radius: this.radius*0.3048
        };

        this.circle = new google.maps.Circle(populationOptions);
    };
	
    this.setCoord = function(coord) {
        this.coord = coord;
        this.build_circle();
    };
	
    this.setRadius = function(radius) {
        this.radius = radius;
        this.build_circle();
    };
	
    this.setColor = function(color) {
        this.color = color;
        this.build_circle();
    };
	
    this.build_circle(); // Always build the circle on construction
}

function MapLine(id, group, coords, color, strokeWeight) {
	
    this.mapped = false; // If this is currently mapped
    this.id = id;
    this.group = group;
    this.color = color;
    if (strokeWeight == null) {
        strokeWeight = 2;
    }
	
    this.points = [];
	
    for (var i in coords) {
        this.points.push(coords[i].point); // FIXME: This is the problem on line creation atms
    }
	
    this.line = new google.maps.Polyline({
    	path: this.points, 
    	strokeColor: this.color, 
    	strokeWeight: strokeWeight,
    	strokeOpacity: 0.5
    });
	
}

function MapPolygon(id, group, coords, color) {
	
    this.mapped = false; // If this is currently mapped
    this.id = id;
    this.group = group;
    this.color = color;
	
    this.points = new google.maps.MVCArray;
	
    for (var i in coords) {
        //this.points.push(coords[i].point); // FIXME: This is the problem on line creation atms
        this.points.insertAt(this.points.length, coords[i].point)
    }
	
    this.build_polygon = function() {
        if (this.polygon)
            this.polygon.setMap(null);
        
        this.polygon = new google.maps.Polygon({
        	path: this.points, 
        	fillColor: this.color, 
        	strokeColor: this.color, 
        	fillOpacity: 0.2,
        	clickable: false});
    };
	
    this.setColor = function(color) {
        this.color = color;
        this.build_polygon();
    };
	
    this.build_polygon();
}

function MapIcon(image) {
    this.icon = null;
	
    this.image = image;
    this.shadow = null;
    this.size = null;
    this.anchor = new google.maps.Point(0,0);
	
    this.getIcon = function() {
        // Check if we need to build the icon
        if (this.icon == null) {
            this.icon = new google.maps.MarkerImage(this.image,
                this.size,
                new google.maps.Point(0,0),
                this.anchor,
                this.size
                );
			
        /*this.icon.shadow = this.shadow;
			this.icon.title = this.title;
			this.icon.iconSize = this.size;
			this.icon.iconAnchor = this.anchor;*/
        }
		
        return this.icon;
    };
	
    this.setImage = function(image) {
        this.icon = null;
        this.image = image;
    };
	
    this.setShadow = function(image) {
        this.icon = null;
        this.shadow = image;
    };
	
    this.setSize = function(x,y) {
        this.icon = null;
        this.size = new google.maps.Size(x,y);
    };
	
    this.setAnchor = function(x,y) {
        this.icon = null;
        this.anchor = new google.maps.Point(x,y);
    };
}

