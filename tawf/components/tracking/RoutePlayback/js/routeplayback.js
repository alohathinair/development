var rpc;

function RoutePlayback(deviceController, mapController, deviceRef) {
	this.dc = deviceController;
	this.mc = mapController;
	this.position = 0;
	this.deviceID = deviceRef;
	this.playing = false;
	this.timer = null;
	this.playingDirection = 1; // 1 for backwards, 2 for forwards
	
	this.bind_controls = function (back, home, stop, forward) {
		controller = this;
		
		back.click(function() {
			if (controller.device_test() == 1) {
				return false;
			}
			controller.backward();
			return false;
		});
		
		home.click(function() {
			if (controller.device_test() == 1) {
				return false;
			}
			controller.home();
			return false;
		});
		
		stop.click(function() {
			if (controller.device_test() == 1) {
				return false;
			}
			controller.stop();
			return false;
		});
		
		forward.click(function() {
			if (controller.device_test() == 1) {
				return false;
			}
			controller.forward();
			return false;
		});
		
		
	};
	
	this.device_test = function() {
		if (parseInt(this.deviceID.toString()) == -1 || this.dc.devices[this.dc.findDeviceByID(parseInt(this.deviceID.toString()))].historyDownloaded == false) {
			alert("Please download the history first");
			return 1;
		}
		
		return 0;
	};
	
	this.next = function() {
		device = this.dc.devices[this.dc.findDeviceByID(parseInt(this.deviceID.toString()))];		
		if (this.position == 0) {
			if (this.timer != null) {
				clearInterval(this.timer);
			}
			return;
		}
		
		this.position--;

		point = device.history[this.position];
		mp = new MapPoint(point.latitude, point.longitude);
		mc.pan_to(mp);
		this.mark_point(mp);
		this.highlight_point(point.id);
		
	};
	
	this.highlight_point = function(id, dontScroll) {
		var view = $("#vehicle-information-detailed-history-container");
		var elem = $("tr[point_id='" + id + "']");
		$("tr[point_id!='-1']").css("background-color", "inherit");
		elem.css("background-color", "#BBDDBB");
		var pos = elem.position();
		
		// scroll to the point if it's out of view
		//if (!isScrolledIntoView(view, elem)) {
		if (!dontScroll) {
			view.scrollTo(elem, 500, {offset:view.height()*-0.5});
		}

		//}
		
		//alert("t:" + pos.top);
	};
	
	this.mark_point = function(loc) {
		// Add a marker there, or replace it if it already exists.
		mc.add_marker(new MapMarker("individual-point", null, loc, pointico, ""));
		mc.map_marker("individual-point"); // map the marker
	};
	
	this.prev = function() {
		//alert("ID: " + this.deviceID);
		device = this.dc.devices[this.dc.findDeviceByID(parseInt(this.deviceID.toString()))];		
		if (this.position == (device.history.length-1)) {
			if (this.timer != null) {
				clearInterval(this.timer);
			}
			return;
		}
		
		this.position++;

		point = device.history[this.position];
		mp = new MapPoint(point.latitude, point.longitude);
		mc.pan_to(mp);
		this.mark_point(mp);
		this.highlight_point(point.id);
	};
	
	this.forward = function() {
		rpc = this;
		if (this.playing == false && this.timer == null) {
			this.timer = setInterval('playbackForward()', 2000);
			this.playing = true;
			this.playingDirection = 2;
			this.next();
		} else if (this.playing == true && this.playingDirection == 2) {
			this.next();
		} else if (this.playing == true && this.playingDirection == 1) {
			this.stop();
			this.forward();
		}
	};
	
	this.backward = function() {
		rpc = this;
		if (this.playing == false && this.timer == null) {
			this.timer = setInterval('playbackBackward()', 2000);
			this.playing = true;
			this.playingDirection = 1;
			this.prev();
		} else if (this.playing == true && this.playingDirection == 1) {
			this.prev();
		} else if (this.playing == true && this.playingDirection == 2) {
			this.stop();
			this.backward();
		}
	};
	
	this.stop = function() {
		clearTimeout(this.timer);
		this.playing = false;
		this.timer = null;	
	};
	
	this.home = function() {
	
		device = this.dc.devices[this.dc.findDeviceByID(parseInt(this.deviceID.toString()))];
		this.setPosition(device.history.length-1);
		point = new MapPoint(device.history[this.position].latitude, device.history[this.position].longitude);
		mc.pan_to(point);
		this.mark_point(point);
		this.highlight_point(device.history[this.position].id);
		//alert("t: " + $("#vehicle-information-detailed-history-container")[0].scrollHeight);   <--- total scroll height
		//alert("t: " + $("#vehicle-information-detailed-history-container").scrollTop());  <--- distance from scroll top
	};
	
	this.setPosition = function(pos) {
		this.position = pos;
	};
	
	this.setDevice = function(device) {
		this.device = device;
	};
}

function playbackForward() {
	rpc.next();
}

function playbackBackward() {
	rpc.prev();
}

function isScrolledIntoView(container, elem)
{
    var docViewTop = container.scrollTop();
    var docViewBottom = docViewTop + container.height();

    var elemTop = elem.offset().top;
    var elemBottom = elemTop + elem.height();

    return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom));
}