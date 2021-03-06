var CircleOverlay;

$(document).ready(function() {
	// This file adds a new circle overlay to GMaps2
	// it is really a many-pointed polygon, but look smooth enough to be a circle.
	CircleOverlay = function(latLng, radius, strokeColor, strokeWidth, strokeOpacity, fillColor, fillOpacity) {
		this.latLng = latLng;
		this.radius = radius;
		this.strokeColor = strokeColor;
		this.strokeWidth = strokeWidth;
		this.strokeOpacity = strokeOpacity;
		this.fillColor = fillColor;
		this.fillOpacity = fillOpacity;
	}
	
	// Implements GOverlay interface
	CircleOverlay.prototype = new google.maps.Overlay;
	
	CircleOverlay.prototype.initialize = function(map) {
		this.map = map;
	}
	
	CircleOverlay.prototype.clear = function() {
		if(this.polygon != null && this.map != null) {
			this.map.removeOverlay(this.polygon);
		}
	}
	
	// Calculate all the points and draw them
	CircleOverlay.prototype.redraw = function(force) {
		var d2r = Math.PI / 180;
		circleLatLngs = new Array();
		var circleLat = this.radius * 0.014483;  // Convert statute miles into degrees latitude
		var circleLng = circleLat / Math.cos(this.latLng.lat() * d2r);
		var numPoints = 40;
		
		// 2PI = 360 degrees, +1 so that the end points meet
		for (var i = 0; i < numPoints + 1; i++) { 
			var theta = Math.PI * (i / (numPoints / 2)); 
			var vertexLat = this.latLng.lat() + (circleLat * Math.sin(theta)); 
			var vertexLng = this.latLng.lng() + (circleLng * Math.cos(theta));
			var vertextLatLng = new google.maps.LatLng(vertexLat, vertexLng);
			circleLatLngs.push(vertextLatLng); 
		}
		
		this.clear();
		this.polygon = new google.maps.Polygon(circleLatLngs, this.strokeColor, this.strokeWidth, this.strokeOpacity, this.fillColor, this.fillOpacity, {clickable: false});
		
		
		
		
		this.map.addOverlay(this.polygon);
		
	}
	
	CircleOverlay.prototype.remove = function() {
		this.clear();
	}
	
	CircleOverlay.prototype.containsLatLng = function(latLng) {
		// Polygon Point in poly 
		if(this.polygon.containsLatLng) {
			return this.polygon.containsLatLng(latLng);
		}
	}
	
	CircleOverlay.prototype.setRadius = function(radius) {
		this.radius = radius;
	}
	
	CircleOverlay.prototype.setLatLng = function(latLng) {
		this.latLng = latLng;
	}
});	
