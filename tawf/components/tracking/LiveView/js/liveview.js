var eventController;
var deviceController;
var userController;
var landmarkController;
var organizationController;
var viewingDevice = new Object(-1); // For buttons within a device
var companyData;
var mapIcon;
var updateLimiter = 0;
var routePlayback;
var mc;
var deviceStarterActionTimer;
var displayGeofences = false;
var trafficOptions = {
    incidents:true
};
var currentUserId;
var trafficInfo;
var displayTraffic = false;
var displayStreetView = false;
var trafficLayer;
var streetView = false;
var kmlLayer = false;
var infowindow;
var eventwindow;
var trailwindow;
var historyHoverRoute;
var downloadedHistory;
var overlayURL = "";
var trailIdx = 0;
// For event street views
var streetViewEvent = -1;
var streetViewEventDevice = 0;
var hoveredPathColor = "#4777ff";

var massBounds;
var currentScreen = 1; // 1 for live, 2 for history
var mapSearch = false;
var mapRoute = false;
var needsAdjust = true;

function adjustElements() {
    //$("#history-table").height($("#tab-history").height());
    
   /* var height = $("#liveview-panel-content-row").height() - $("#history-date").height() - $("#company-logo").height() - 250;
    $("#history-vehicles-list").height(height);
    $("#history-action-events-list").height(height);

    height = $("#liveview-panel-content-row").height() - $("#company-logo").height() - 115;
    $("#vehicles-screen").height(height);
 */
}

$(document).ready(function() {

    $(window).resize(function() {
        adjustElements();
    });


    // If we have no company logo we adjust the top of the tabs
    if ($("#company-logo").length == 0) {
        $("#tabs").css('top', '130px');
    }

    $("#tab-live-button").click(function() {
    	currentScreen = 1;
    	$("#liveview-controls").height(140);
        $("#tabs").css('bottom', 170);
        
        $(this).addClass("liveview-btn-selected");
        $("#tab-history-button").removeClass("liveview-btn-selected");
        $("#tab-live").show();
        $("#tab-history").hide();
        $("#liveview-overlay-controls").show();
        
        adjustElements();

        mc.map_markers("devices");
        mc.hide_markers("device-events");
        mc.hide_markers("history-trail");
        mc.hide_markers("history-path");
        mc.hide_line("hovered-path");
        mc.hide_lines("device-paths");
    });

    $("#tab-history-button").click(function() {
        $("#liveview-controls").height(100);
        $("#tabs").css('bottom', 110);

    	currentScreen = 2;
        $(this).addClass("liveview-btn-selected");
        $("#tab-live-button").removeClass("liveview-btn-selected");
        $("#tab-live").hide();
        $("#tab-history").show();
        $("#liveview-overlay-controls").hide();
        adjustSidebarSize(0);

        mc.map_markers("device-events");
        mc.map_markers("history-trail");
        mc.map_markers("history-path");
        mc.hide_markers("devices");
        if (!downloadedHistory) {
            var currentTime = new Date()
            var month = currentTime.getMonth() + 1
            var day = currentTime.getDate()
            var year = currentTime.getFullYear()
            download_history(year + "-" + month + "-" + day);

        } else {
            if (parseInt($("#history-vehicles-select").val()) != 0)
                mc.map_line("hovered-path");
            else
                mc.map_lines("device-paths");
        }

        adjustElements();
        
    });

    $("#toggle-street-view").click(function() {
        if (!displayStreetView) {
			//alert("vd: " + viewingDevice.valueOf() + ", s: " + screen);
            if (viewingDevice.valueOf() !== -1 && currentScreen == 1) {
                displayStreetView = true;
                $(this).addClass("liveview-btn-selected");
                adjustMapSize(0);
                $("#street-view").show();
                	
                var device = deviceController.devices[deviceController.findDeviceByID(viewingDevice.valueOf())];
                	
                if (!streetView) {
                    panoramaOptions = {
                        position: new google.maps.LatLng(device.latitude, device.longitude),
                        pov: {
                            heading: device.heading,
                            pitch: 10,
                            zoom: 0
                        }
                    };
                		
                    streetView = new google.maps.StreetViewPanorama(document.getElementById("street-view"), panoramaOptions);
                		
                } else {
                    streetView.setPosition(new google.maps.LatLng(device.latitude, device.longitude));
                    streetView.setPov({
                        heading: device.heading,
                        pitch: 10,
                        zoom: 0
                    });
                }
					
                mc.map.setStreetView(streetView);
            } else if (streetViewEvent != -1 && currentScreen == 2) {
            	displayStreetView = true;
        	    $(this).addClass("liveview-btn-selected");
    	        adjustMapSize(0);
	            $("#street-view").show();
            	var device = deviceController.devices[deviceController.findDeviceByID(streetViewEventDevice)];
            	var event = device.events[streetViewEvent];
            	
            	if (!streetView) {
            	    panoramaOptions = {
            	        position: new google.maps.LatLng(event.latitude, event.longitude),
            	        pov: {
            	            heading: event.heading,
            	            pitch: 10,
            	            zoom: 0
            	        }
            	    };
            			
            	    streetView = new google.maps.StreetViewPanorama(document.getElementById("street-view"), panoramaOptions);
            			
            	} else {
            	    streetView.setPosition(new google.maps.LatLng(event.latitude, event.longitude));
            	    streetView.setPov({
            	        heading: event.heading,
            	        pitch: 10,
            	        zoom: 0
            	    });
            	}
            }
                
        } else {
            $("#street-view").hide();
            displayStreetView = false;
            //mc.map.setStreetView(null);
            adjustMapSize(0);
            //mc.map.checkResize();
                
            $(this).removeClass("liveview-btn-selected");
        }
    });

    $("#toggle-kml").click(function() {

        if (overlayURL == "") {
            alert('No KML/KMZ Overlay file selected in Administration -> Settings');
            return;
        }

        if (kmlLayer) {
            $(this).removeClass("liveview-btn-selected");
            kmlLayer.setMap(null);
            kmlLayer = null;
        } else {
            kmlLayer = new google.maps.KmlLayer(overlayURL);
            kmlLayer.setMap(mc.map);
            $(this).addClass("liveview-btn-selected");
        }
    });


    $("#history-date").datepicker({
    	onSelect: function(dateText, inst) {
    		download_history(dateText);
    		$("#history-vehicles-select").val(0);
    		$("#history-vehicles-list").show();
    		$("#history-action-events-list").hide();
    	}
    });

    // Run a call to load our divisions
    $.post("/ajax.php", {
        action:"get_liveview_data_params"
    }, function(data) {
        organizationController.load_data(data.divisions);

        overlayURL = data.overlay_url;

        if ($("#all-divisions").length !== 0) {
            $("#groups,#groups-history").append("<option value='0'>All Divisions All Groups</option>");
        }
        for (var i in data.divisions) {
            $("#groups,#groups-history").append("<option data-division=true value='" + data.divisions[i].CompanyDivisionID + "'>" +  data.divisions[i].CompanyDivisionName + "</option>");

            for (var x in data.divisions[i].groups) {
                $("#groups,#groups-history").append("<option data-group=true value='" + data.divisions[i].groups[x].CompanyGroupID + "'>&nbsp;&nbsp;" + data.divisions[i].groups[x].CompanyGroupName + "</option>");
            }
        }

    // $("#groups").ufd();


    }, "json");

    // create our map
	
    //trafficInfo = new GTrafficOverlay(trafficOptions);
    trafficLayer = new google.maps.TrafficLayer();
	
    /*
     * The Live View needs the following controllers to handle it's information
     */
    //eventController = new EventController();
    deviceController = new DeviceController();
    userController = new UserController();
    landmarkController = new LandmarkController();
    eventController = new EventController();
    organizationController = new OrganizationController();

	
    // Get our live view data
    get_company_liveview_data(function() {
        var userIdx = userController.findUserByID(currentUserId);
        var mapExtent = null;
        if (userIdx >= 0) {
            mapExtent = userController.users[userIdx].getDefaultMapExtent();
        }
        if (!mapExtent || mapExtent.isEmpty()) {
            mapExtent = new MapExtent(companyData.CompanyDefaultMapLatitude, companyData.CompanyDefaultMapLongitude, companyData.CompanyDefaultMapZoom);
        }
        mc = new MapController("map", mapExtent.getPoint(), mapExtent.zoom, true);
        infowindow = new google.maps.InfoWindow({
            content: $("#vehicle-information-container")[0]
        });
        
        eventwindow = new google.maps.InfoWindow({
            content: $("#event-information-container")[0]
        });

        trailwindow = new google.maps.InfoWindow({
            content: $("#trail-information-container")[0]
        });

        mapSearch = new MapSearch(mc);
        mapRoute = new MapRoute(mc);

        // Add a listener to our map to reshow all devices if only one is showing
        			
        // Create an icon for displaying specific points
        pointico = new MapIcon("http://" + WWW_HOST + "/images/point.png");
        pointico.setSize(24, 24);
        pointico.setAnchor(12, 24);
        // Center the map
        $('#map').css('width', 'auto');
        $('#map').css('height', '90%');

        //mc.map.checkResize();
        //mc.set_center(new MapPoint(companyData.CompanyDefaultMapLatitude, companyData.CompanyDefaultMapLongitude), companyData.CompanyDefaultMapZoom);
        //mc.map.checkResize();
        //mc.set_center(new MapPoint(companyData.CompanyDefaultMapLatitude, companyData.CompanyDefaultMapLongitude), companyData.CompanyDefaultMapZoom);

        // Map it
        map_liveview_data(mc);
		
        // Create our menus; vehicles first
        var driver_list = new Object();
		
        for (var i in deviceController.devices) {
            var d = deviceController.devices[i];
			
            $("#vehicles-screen").append("<li device_id='" + d.id + "'><div class='vehicle-status-indicator-box' device_id='" + d.id + "'> </div><a href='#' class='vehicle-list-item' device_id='" + d.id + "'>" + d.vehicleDriver + "</a><div class='clear'></div></li>");
            $("#history-vehicles-select").append("<option value='" + d.id + "'>" + d.vehicleDriver + "</option>");
            $("#history-vehicles-list").append("<li device_id='" + d.id + "'><a href='#' class='vehicle-history-item' device_id='" + d.id + "'>" + d.vehicleDriver + "</a></li>");
			
            
        }
		
        update_indicator_colors();

        mc.add_fullscreen_control(
            function (is_full_screen) {
                $("#search-result").toggleClass("search-result-full-screen", is_full_screen);
                $("#search-query").toggleClass("search-query-full-screen", is_full_screen);
                $("#route-query").toggleClass("route-query-full-screen", is_full_screen);
                if (is_full_screen) {
                    $("#liveview-panel").css("display", "none");
                } else {
                    $("#liveview-panel").css("display", "block");
                }
            }
        );

        // Add our events to the screen
        map_panic_events(mc, eventController);
        //load_notifications(eventController, userController, "#notifications");
        //bind_notifications_dialog(mc, "#notifications-dialog", ".review_notification");
		
		
        // Add listeners to our event markers
        $.each(eventController.events, function(i, x) {
            var m_id = mc.findMarkerByID("event-" + eventController.events[i].id);
            if (m_id != -1) {
                mc.markers[m_id].add_listener("click", function() {
                    showEventData(eventController.events[i]);
                });
            }
        });

        if (needsAdjust) {
            adjustElements();
        }
        
    });
	
	
	
  	
    $(".liveview-menu-button a").click(function() {
        var box = $(this).next();
        var disp = box.css("display");
        $(".liveview-menu-box").hide();
		
        if (disp == "none") {
            box.show();
        }
		
        return false;
    });

    $("body").on("click",".show-point-on-map", function() {
	
   // $(".show-point-on-map").live("click", function() {
        // Get the point information
        var did = deviceController.findDeviceByID(viewingDevice);
        var hid = deviceController.devices[did].findHistoryByID($(this).parent().parent().attr("point_id"));
        var point = deviceController.devices[did].history[hid];
	
        // Pan the map to the correct location
        var loc = new MapPoint(point.latitude, point.longitude);
        mc.pan_to(loc);
		
        // Add a marker there, or replace it if it already exists.
        mc.add_marker(new MapMarker("individual-point", null, loc, pointico, ""));
        mc.map_marker("individual-point"); // map the marker
		
        return false;
    });

    $("body").on("click",".user-list-item", function() {
        // Find the device on the map based on the UserID
        var arrID = deviceController.findDeviceByID($(this).attr("device_id"));
        //resetMapView();
        mc.pan_to(new MapPoint(deviceController.devices[arrID].latitude, deviceController.devices[arrID].longitude));
        $(".liveview-menu-box").hide();
		
        showVehicleData(deviceController.devices[arrID]);
		
        return false;
    });

    $("body").on("click",".vehicle-list-item", function() {
        // Find the device on the map based on the UserID
        var deviceID = $(this).attr("device_id");
        var device = deviceController.devices[deviceController.findDeviceByID(deviceID)];

        //resetMapView();
        mc.pan_to(new MapPoint(device.latitude, device.longitude));
        $(".liveview-menu-box").hide();

        //map_devices();

        showVehicleData(device);
		
        return false;
    });
	
	

	
    // handle this in different spot now... bind_notifications_pan_to_event(mc, eventController);

	
    // Buttons!
    $("#toggle-device-history").click(function() {
        var device_id = viewingDevice;
        var deviceArrID = deviceController.findDeviceByID(device_id);
		
        // check if we need to download the history
        if (deviceController.devices[deviceArrID].historyDownloaded == false) {
            deviceController.devices[deviceArrID].download_history(function() {
                toggle_device_history(device_id);
            });
        } else {
            // We don't, just show it
            toggle_device_history(device_id);
        }
    });
	
    $("#ping-device").click(function() {
        var device_id = viewingDevice;
        var deviceArrID = deviceController.findDeviceByID(device_id);
        $.post("/ajax.php", {
            "action":"taw_api_call",
            "call":"master_ping",
            "device_uid":deviceController.devices[deviceArrID].uid
        }, function(data) {
            if (data.success)
                alert("Ping Request Sent Successfully");
            else
                alert("Ping Request Failed");
        }, "json");
    });
  
    $("#tpms-show").click(function() {
        var device_id = viewingDevice;
        var deviceArrID = deviceController.findDeviceByID(device_id);
        var device = deviceController.devices[deviceArrID];
        device.get_tpms_now(function() {
            if (device.tpms.length == 0) {
                alert('No TPMS data');
                return;
            }
            var product_type = device.tpms[0].ProductType;
            var tpms_product = get_tpms_conf(product_type);
            build_tpms(tpms_product, $("#tpms-container"));
            $(device.tpms).each(function() {
                var self = this;
                var id = "#tpms-tire-"+ this.TabName.replace(/ /g,'') + '-' + this.TirePosition;
                var tabLink = $('#tpms-tab-link-'+ this.TabName.replace(/ /g,''));
                if (this.TabStatusIcon == 'normal.png') {
                    tabLink.addClass('tpms-tab-normal');
                } else if (this.TabStatusIcon == 'alert.png') {
                    tabLink.addClass('tpms-tab-alert');
                }

                $(id).addClass("tpms-tire-with-data");
                $(id).css("background-color", this.StatusColor);
                $(id).attr("data-tire-position", this.TirePosition);

                $(id).qtip({
                    content: {
                       text: 'Pressure: ' + self.Pressure + '<br>'+
                              'Temperature: ' + self.Temperature + '<br>'+
                              'Status: ' + self.AlertStatus + '<br>' +
                              'Last Updated: ' + self.LastUpdated + '<br>'
                       ,
                       title: {
                          text: 'Tire #' + self.TirePosition
                       }
                    },
                    style: {
                        classes: 'ui-tooltip-shadow ui-tooltip-light'
                    }
                 });

            });
            $("#tpms-dialog").dialog({
                title: product_type+' Tire Pressure/Temperature for ' + device.vehicleDriver,
                width: tpms_product.width,
                height: tpms_product.height
            });

            $("#tpms-dialog").dialog("open");

        });

        	// Build the management dialogs
	$("#tpms-dialog").dialog({
		autoOpen: false,
		draggable: true,
		resizable: false,
		close: function() {
			//this.dialog('close');
		}
	});

    });


    $("#ddm-show").click(function() {
        var device_id = viewingDevice;
        var deviceArrID = deviceController.findDeviceByID(device_id);
        var device = deviceController.devices[deviceArrID];

        $.post("/ajax.php", {
            action:"generate_report",
            report: "ddm_status",
            device: device.id
        }, function(data) {
            $("#ddm-container").html(data);
            $("#oReportDiv").css('overflow', 'visible');
            $("#ddm-dialog").dialog({
                title: "DDM Detail for '" + device.vehicleDriver + "'",
                width: 850,
                height: 430
            });

            $("#ddm-dialog").dialog("open");
        });
    });

    $("#ddm-dialog").dialog({
        autoOpen: false,
        draggable: true,
        resizable: false,
        close: function() {
            //this.dialog('close');
        }
    });

    mapIcon = new MapIcon("http://tawf.mythinairwireless.com/components/tracking/LiveView/images/truck.png");
    mapIcon.setSize(28,28);
    mapIcon.setAnchor(14,14);

    var startPathIcon = new MapIcon("http://labs.google.com/ridefinder/images/mm_20_green.png");
    startPathIcon.setSize(12, 20);
    startPathIcon.setAnchor(7, 10);

    var endPathIcon = new MapIcon("http://labs.google.com/ridefinder/images/mm_20_red.png");
    endPathIcon.setSize(12, 20);
    endPathIcon.setAnchor(7, 10);

    if (typeof(RoutePlayback) == "function" && typeof(RoutePlayback.prototype) == "object") {
        //mc.pan_to(new MapPoint(42.0, -74.0));
        routePlayback = new RoutePlayback(deviceController, mc, viewingDevice);
        routePlayback.bind_controls($("#playback-backward"), $("#playback-home"), $("#playback-stop"), $("#playback-forward"));
    }
	
    $("#device-starter-control").click(function() {
        // Step 1: Send the command
        var device = deviceController.devices[deviceController.findDeviceByID(viewingDevice)];
        var commandID;
		
		
        if (device.starterEnabled == 0) {
            commandID = 2;
            $("#device-starter-message").html("Processing Enable");
        } else if (device.starterEnabled == 1) {
            commandID = 1;
            $("#device-starter-message").html("Processing Disable");
        }
		
		
        $.getJSON(WWW_ROOT + "/ajax.php", {
            action: "send_sms",
            device_id: device.id,
            command: commandID
        }, function(data) {
            if (data.status == "success") {
				
            } else {
                alert("Unable to complete command due to error: " + data.status);
                $("#device-starter-control").show();
                $("#device-starter-message").hide();
            }

        });
		
        // Step 2: Update the button area to reflect the message is sent
        $("#device-starter-control").hide();
        $("#device-starter-message").show();
		
        // Step 3: Create a timer to check the status of the message
        deviceStarterActionTimer = setInterval("get_device_starter_status(" + device.id + ")", 2000);
    });
	
	
    $("#toggle-geofences").click(function() {
        if (displayGeofences) {
            unmap_geofences();
            displayGeofences = false;
            $(this).removeClass("liveview-btn-selected");
        } else {
            map_geofences();
            displayGeofences = true;
            $(this).addClass("liveview-btn-selected");
        }
		
		
        return false;
    });
	
    $("#toggle-traffic").click(function() {
        if (displayTraffic) {
            trafficLayer.setMap(null);
            //$(this).val('Display Traffic');
            $(this).removeClass("liveview-btn-selected");
        } else {
            trafficLayer.setMap(mc.map);
            //$(this).val('Hide Traffic');
            $(this).addClass("liveview-btn-selected");
        }
		
        displayTraffic = !displayTraffic;
    });

    $("#toggle-route").click(function() {
        $("#route-query").toggle();
        var visible = $("#route-query").is(":visible");
        $("#toggle-route").toggleClass("liveview-btn-selected", visible);      
        if (visible)
            mapRoute.enable();
        else
            mapRoute.disable();
    });

    $("#toggle-search").click(function() {
        $("#search-query").toggle();
        $("#search-text").focus();
        var visible = $("#search-query").is(":visible");
        $("#toggle-search").toggleClass("liveview-btn-selected", visible);
        if (!visible || !mapSearch.results || mapSearch.results.length == 0) {
            $("#search-result").hide();
            //$("#toggle-search-details").hide();
        } else {
            $("#search-result").show();
            //$("#toggle-search-details").show();
        }

        mapSearch.toggleMarkers(visible);
    });

    //$("#route-button, #search-button, #search-reset-button, #route-reset-button, #route-add-button").button();

    $("#search-query-form").submit(function() {
        $("#search-button").click();
        return false;
    });

    $("#search-button").click(function() {
        var query = $("#search-text").val();

        $("#search-result-title").html("Results for '" + query + "':");
        $("#search-result-data").html("<img src='/images/ajax-loader.gif' alt='Loading...'/>");
        $("#search-result").show();

        mapSearch.search(query);
        return false;
    });
    
    $("#route-button").click(function() {
        mapRoute.route(true);
    });

    $("#route-reset-button").click(function() {
        mapRoute.reset();
        $("#search-result").hide();
    });

    $("#search-reset-button").click(function() {
        mapSearch.reset();
        $("#search-text").val("");
        $("#search-result").hide();
    });

    $("#route-add-button").click(function() {
        mapRoute.addMarkerByAddress($("#route-address").val());
    })

    $("#map-mode-road, #map-mode-hybrid, #map-mode-terrain").click(function() {
        // This one handles coloring
        $("#map-mode-road, #map-mode-hybrid, #map-mode-terrain").removeClass("liveview-btn-selected");
        $(this).addClass("liveview-btn-selected");
		
        return false;
    });
	
    $("#map-mode-road").click(function() {
        mc.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
        return false;
    });
	
    $("#map-mode-hybrid").click(function() {
        mc.map.setMapTypeId(google.maps.MapTypeId.HYBRID);
        return false;
    });
	
    $("#map-mode-terrain").click(function() {
        mc.map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
        return false;
    });
	
    $("#groups").change(function() {
        // Grab the group
        var group_id = $(this).val();
        var selected = $(this).find('option:selected');
        var is_group = selected.attr('data-group');
        var is_division = selected.attr('data-division');

        viewingDevice = new Object(-1); // For buttons within a device

        if (group_id == 0) { // Here we show all groups
            $("#vehicles-screen li").show();
            
            // Map all devices
            map_devices();
        } else { // Here we only show vehicles within this group
            // We're going to hide all the devices first
            $("#vehicles-screen li").hide();
			
            // Unmap all devices
            unmap_devices();
            // And here we show all the ones belonging to a specific group
            var devices = deviceController.devices;
            for (var i in devices) {
                var device = devices[i];
	
                if ((is_group && device.group_id == group_id) || is_division && organizationController.is_group_in_division(group_id, device.group_id)) {
                    $("#vehicles-screen li[device_id='" + device.id + "']").show();
                    remap_device(mc, device);
                }

            }
        }
    });

    $("#groups-history").change(function() {
        // Grab the group
        var group_id = $(this).val();
        var selected = $(this).find('option:selected');
        var is_group = selected.attr('data-group');
        var is_division = selected.attr('data-division');
        var devices = deviceController.devices;
        $("#history-vehicles-select").empty();
        $("#history-vehicles-list").empty();
        for (var i in devices) {
            var device = devices[i];
            if (group_id == 0 || (is_group && device.group_id == group_id) || is_division && organizationController.is_group_in_division(group_id, device.group_id)) {
                $("#history-vehicles-select").append("<option value='" + device.id + "'>" + device.vehicleDriver + "</option>");
                $("#history-vehicles-list").append("<li device_id='" + device.id + "'><a href='#' class='vehicle-history-item' device_id='" +device.id + "'>" + device.vehicleDriver + "</a></li>");
            }
        }
    });

    $("body").on("mouseover mouseout",".vehicle-history-item", function(event) {
	    var device = deviceController.devices[deviceController.findDeviceByID($(this).attr("device_id"))];
            if (event.type == "mouseover") {
	    	//var device = deviceController.devices[$(this).attr("device_id")];
    		//var route = device.get
    		//toggle_device_history($(this).attr("device_id"));
	    	
			//mc.hide_lines("device-paths");

                var route = device.get_route_history();
                if (route.length > 1) {
                    var startPathMarker = new MapMarker("history-path-start" , "history-path", route[0], startPathIcon, '', 10000, false);
                    var endPathMarker = new MapMarker("history-path-end" , "history-path", route[route.length-1], endPathIcon, '', 10000, false);
                    mc.add_marker(startPathMarker);
                    mc.add_marker(endPathMarker);
                    mc.map_markers("history-path");
                    mc.add_line(new MapLine("hovered-path", "primary-path", route, hoveredPathColor, 4));
                    mc.map_line("hovered-path");
                }
            } else {
                    if (parseInt($("#history-vehicles-select").val()) != device.id) {
	    		mc.hide_line("hovered-path");
                        mc.remove_markers('history-path');
                    }
	    	//mc.map_lines("device-paths");
	    }
    });
    
    $("body").on("mouseenter mouseleave", "div.liveview-data-history", function(event) {
    	if (event.type == "mouseenter") {
    		mc.hide_lines("device-paths");
    	} else {
    		// Only reshow if they didn't click on a device
    		if (parseInt($("#history-vehicles-select").val()) == 0)
	    		mc.map_lines("device-paths");
    	}
    });

    $("body").on("click", ".vehicle-history-item",function() {
    	// Mark the select box for this device
    	var device_id = $(this).attr("device_id");
    	$("#history-vehicles-select").val(device_id);
    	
    	// Now display our action events for this vehicle
    	download_device_events(device_id);
    	
    	var device = deviceController.devices[deviceController.findDeviceByID(device_id)];
    	
    	mc.remove_markers('history-path');
        mc.hide_lines("device-paths");
	mc.add_line(new MapLine("hovered-path", "routes", device.get_route_history(), "#000000"));
    	mc.map_line("hovered-path");
    	
    	return false;
    });
    
    $("#history-vehicles-select").change(function() {
    	var device_id = parseInt($(this).val());

    	if (device_id == 0) {
    		mc.hide_markers("device-events");
    		mc.map_lines("device-paths");
	    	$("#history-vehicles-list").show();
    		$("#history-action-events-list").hide();
                mc.remove_markers("history-trail");
    		$("#minidash").hide();
            adjustSidebarSize();
    		if (!massBounds.isEmpty()) {
    			mc.map.panToBounds(massBounds);
    			mc.map.fitBounds(massBounds);
    		}
    	} else {
    		download_device_events(device_id);
    		var device = deviceController.devices[deviceController.findDeviceByID(device_id)];
			mc.hide_lines("device-paths");
    		mc.add_line(new MapLine("hovered-path", "routes", device.get_route_history(), "#000000"));
	    	mc.map_line("hovered-path");
    	}
    });

    function add_history_trail(historyTrail) {
        var icon = new MapIcon("http://" + WWW_HOST + "/images/" + historyTrail.MarkerTrailImage);
        icon.setSize(12, 12);
        icon.setAnchor(7, 7);

        var historyTrailMarker = new MapMarker("history-trail-"+trailIdx , "history-trail",
                new MapPoint(historyTrail.Latitude, historyTrail.Longitude), icon, '', 10000, false);

        mc.add_marker(historyTrailMarker);

        trailIdx++;
       
        historyTrailMarker.add_listener("click", function() {
            update_trail_info(historyTrail);
            trailwindow.open(mc.map, historyTrailMarker.marker);

            if (streetView) {
                point = new google.maps.LatLng(historyTrail.Latitude, historyTrail.Longitude);
                pov = {
                    heading: historyTrail.Heading,
                    zoom:0,
                    pitch: 0
                };

                streetView.setPosition(point);
                streetView.setPov(pov);
            }
         });

    }

    $("body").on("click",".history-action-event-item", function() {
    	var device = deviceController.devices[deviceController.findDeviceByID(parseInt($("#history-vehicles-select").val()))];
    	var event_row = $(this).attr("event_row");
    	
    	var event = device.events[$(this).attr("event_row")];

        event.get_history_trail(function() {

            mc.remove_markers("history-trail");
            var bounds = new google.maps.LatLngBounds();

            $.each(event.historyTrail, function() {
                add_history_trail(this);
                bounds.extend(new google.maps.LatLng(parseFloat(this.Latitude), parseFloat(this.Longitude)));
            });
            
            mc.map_markers("history-trail");
            if (!bounds.isEmpty()) {
                mc.map.panToBounds(bounds);
                mc.map.fitBounds(bounds);
            }
            
            // Move the map to this marker
            mc.pan_to(new MapPoint(event.latitude, event.longitude));
            eventwindow.open(mc.map, mc.markers[mc.findMarkerByID("device-event-" + event_row)].marker);

        }, get_history_date_string());

    	    	
    	// Show the info bubble for the marker
    	update_event_info(event_row);
    	
    	if (streetView) {
    	    point = new google.maps.LatLng(event.latitude, event.longitude);
    	    //  pov = {yaw:device.heading};
    	    pov = {
    	        heading: event.heading,
    	        zoom:0,
    	        pitch: 0
    	    };
    	    
    	    streetView.setPosition(point);
    	    streetView.setPov(pov);
    	}
    	
    	return false;
    });

    
});

function get_history_date_string() {
    var d = $("#history-date").datepicker('getDate');
    var month = d.getMonth() + 1
    var day = d.getDate()
    var year = d.getFullYear()

    var datestring = year + "-" + month + "-" + day;
    return datestring;
}

function download_device_events(device_id) {	
  	streetViewEvent = -1;
	// Hide our vehicle list and show our eent list
	$("#history-vehicles-list").hide();
	$("#history-action-events-list").show();
	
	var datestring = get_history_date_string();
	
	
	download_minidash(device_id, datestring);
	
	$.getJSON(WWW_ROOT + "/ajax.php", {
	    action:"get_device_events",
	    date: datestring,
	    device_id: device_id
	}, function(data) {
		var events = data.events;
		var device = deviceController.devices[deviceController.findDeviceByID(device_id)];
		device.events = []; // Reset events
		
		
		
		// Clear all markers related to device events
		mc.remove_markers("device-events");
                mc.remove_markers("history-trail");
		mc.hide_lines("device-paths");
		$("#history-action-events-list").empty();
		
		var bounds = new google.maps.LatLngBounds();
		
		// Setup bounds for the line
		for (var i in device.history) {
			bounds.extend(new google.maps.LatLng(parseFloat(device.history[i].latitude), parseFloat(device.history[i].longitude)));
		}
		
		for (var i in events) {
			var event = events[i];
			var newEvent = {
                                id: event.ActionEventID,
                                device_id: device.id,
				description: event.LeftPanelText,
				vehicleDriver: event.VehicleDriver,
				vehicleStatus: event.VehicleStatus,
				time: event.Time,
				duration: event.Duration,
				markerImage: event.MarkerImage,
				markerLine1: event.MarkerLine1,
				markerLine2: event.MarkerLine2,
				latitude: event.Latitude,
				longitude: event.Longitude,
				heading: event.Heading,
                                markerLabelStatusColor: event.MarkerLabelBackgroundColor,
                                markerStatusInfoColor: event.VehicleStatusInfoColor,
                                historyTrail: []
			};
			

                        newEvent.get_history_trail = function(callback, date) {
                                var self = this;

                                $.getJSON(WWW_ROOT + "/ajax.php", {
                                        action: "get_history_trail",
                                        date: date,
                                        action_event_id: self.id,
                                        device_id: self.device_id
                                }, function(data) {
                                        self.historyTrail = data.history;
                                        callback();
                                });
                        };

			
			device.events.push(newEvent);
			var event_row = (device.events.length-1);
			
			// Populate sidebar
			$("#history-action-events-list").append("<li><a href='#' event_row='" + (device.events.length-1) + "' class='history-action-event-item'>" + event.LeftPanelText + "</a></li>");
			
			// Add markers for events
			var icon = new MapIcon("http://" + WWW_HOST + "/images/" + newEvent.markerImage);
			icon.setSize(15, 34);
			icon.setAnchor(7, 35);
			
			// TODO: update code to use coloring provided by database
			mc.add_marker(new MapMarker("device-event-" + event_row, "device-events", 
				new MapPoint(newEvent.latitude, newEvent.longitude), icon, "", 10000, 
				"<div class='labeled-marker-name'>" + newEvent.markerLine1 + "</div><div class='labeled-marker-state'>" + newEvent.markerLine2 + "</div>",
				event.MarkerLabelBackgroundColor));

			
		}
		
		mc.map_markers("device-events");
		
		// Append a listener to open the info bubble
		$.each(device.events, function(i, event) {
		    mc.markers[mc.findMarkerByID("device-event-" + i)].add_listener("click", function() {
		    	update_event_info(i);
		        eventwindow.open(mc.map, mc.markers[mc.findMarkerByID("device-event-" + i)].marker);
		        
		        if (streetView) {
		            point = new google.maps.LatLng(event.latitude, event.longitude);
		            //  pov = {yaw:device.heading};
		            pov = {
		                heading: event.heading,
		                zoom:0,
		                pitch: 0
		            };
		            
		            streetView.setPosition(point);
		            streetView.setPov(pov);
		        }
		    });
		});

		if (!bounds.isEmpty()) {
			mc.map.panToBounds(bounds);
			mc.map.fitBounds(bounds);
		}

	});
}

function download_minidash(device_id, datestring) {
	$("#minidash").hide(); // Hide before call
	
	$.getJSON(WWW_ROOT + "/ajax.php", {
	    action:"get_device_minidash",
	    date: datestring,
	    device_id: device_id
	}, function(data) {
		var md = data.minidash;
		$("#minidash-active").html(md.Active);
		$("#minidash-distance").html(md.Distance);
		$("#minidash-engine").html(md.EngineHours);
		$("#minidash-idle").html(md.Idling);
		$("#minidash-speeding").html(md.Speeding);
		
		$("#minidash").show();
        adjustSidebarSize();

	});
}

function update_event_info(event_row) {
	var device = deviceController.devices[deviceController.findDeviceByID(parseInt($("#history-vehicles-select").val()))];
	var event = device.events[event_row];
	streetViewEvent = event_row;
	streetViewEventDevice = device.id;
	
	$("#event-vehicle-driver").html(event.vehicleDriver);
	$("#event-vehicle-status").html(event.vehicleStatus);
	$("#event-time").html(event.time);
	$("#event-duration").html(event.duration ? event.duration : "N/A");
	$("#event-vehicle-status-wrapper").css('background-color', event.markerLabelStatusColor);

	reverseGeocode(event.latitude, event.longitude, function(address) {
	        $("#event-address").html(address);
	    });

	//$("#event-address").html(figurethisout);
}

function update_trail_info(trail) {

	$("#trail-vehicle-driver").html(trail.VehicleDriver);
        $("#trail-time").html(trail.Time);
        $("#trail-heading").html(trail.HeadingSpeed);

	reverseGeocode(trail.Latitude, trail.Longitude, function(address) {
            $("#trail-address").html(address);
	});
}

function download_history(date) {
   	streetViewEvent = -1;
	$("#minidash").hide(); // Hide before call
    adjustSidebarSize();
	mc.remove_markers("device-events");
        mc.remove_markers("history-trail");
	
	$.getJSON(WWW_ROOT + "/ajax.php", {
	    action:"get_history_for_date",
	    date: date
	}, function(data) {
		downloadedHistory = true;
		// First clear all device history
		var devices = deviceController.devices;
		
		for (var i in devices) {
			var device = devices[i];
			device.clear_history();
		}
		
		// Use this to track boundries
		massBounds = new google.maps.LatLngBounds();
		
		// Now load each bit of history into the right device
		var history = data.history;
		for (var i in history) {
			var hd = history[i];
			var device = devices[deviceController.findDeviceByID(hd.DeviceID)];
			
			device.history.push({
				latitude: hd.Latitude,
				longitude: hd.Longitude,
				time: hd.LastRecv
			});
			
			massBounds.extend(new google.maps.LatLng(parseFloat(hd.Latitude), parseFloat(hd.Longitude)));
		}
		
		// Loop through the devices and add their lines; remove all current lines though first
		mc.remove_lines("device-paths");
		
		for (var i in devices) {
			var device = devices[i];
			
			mc.add_line(new MapLine("history-device-" + device.id, "device-paths", device.get_route_history(), "#000000"));
			mc.map_line("history-device-" + device.id);
		}
		
		// Make the map fit all
		if (!massBounds.isEmpty()) {
			mc.map.panToBounds(massBounds);
			mc.map.fitBounds(massBounds);
		}
	});
}


function toggle_device_history(device_id) {
    // First check if our map controller has a line for this device. If so we just need to show/hide it. If not, we need to build the map
    var lineArrID = mc.findLineByID("path-for-" + device_id);
    var deviceArrID = deviceController.findDeviceByID(device_id);
	
    mc.add_line(new MapLine("path-for-" + device_id, "routes",
        $.merge(new Array(new MapPoint(deviceController.devices[deviceArrID].latitude, deviceController.devices[deviceArrID].longitude)), deviceController.devices[deviceArrID].get_route_history()), "#000000"));
    lineArrID = mc.findLineByID("path-for-" + device_id);
	
	
    mc.toggle_line("path-for-" + device_id);
	
    if (deviceController.devices[deviceArrID].route_shown == true) {
        deviceController.devices[deviceArrID].route_shown = false;
    } else {
        deviceController.devices[deviceArrID].route_shown = true;
    }
}

function remap_device_history(device_id) {
    var deviceArrID = deviceController.findDeviceByID(device_id);
	
    if (deviceArrID != -1 && deviceController.devices[deviceArrID].route_shown == true) {
        mc.add_line(new MapLine("path-for-" + device_id, "routes",
            $.merge(new Array(new MapPoint(deviceController.devices[deviceArrID].latitude, deviceController.devices[deviceArrID].longitude)), deviceController.devices[deviceArrID].get_route_history()), "#000000"));
        mc.map_line("path-for-" + device_id);
    }
}

function get_company_liveview_data(callback) {
    $.getJSON(WWW_ROOT + "/ajax.php", {
        action:"get_company_liveview_data"
    }, function(data) {
        // Load the obtained data
        //eventController.load_data(data.events);
        deviceController.load_data(data.devices);
        userController.load_data(data.users);
        landmarkController.load_data(data.landmarks);
        eventController.load_data(data.events);
        companyData = data.company;
        currentUserId = data.currentUserId;
		
        // Handle post-fetch callback
        callback();
    });
}

function map_liveview_data(mapController) {
    // Create our icon for the devices
	
	
    // Loop through the devices and map em
    for (var i in deviceController.devices) {
        remap_device(mapController, deviceController.devices[i]);
    }
	
	
	
}

function map_geofences() {
    // Loop through landmarks and map em
    for (var i in landmarkController.landmarks) {
        map_landmark(mc, landmarkController.landmarks[i]);
    }
}

function unmap_geofences() {
    for (var i in landmarkController.landmarks) {
        unmap_landmark(mc, landmarkController.landmarks[i]);
    }
}

function remap_device(mc, device) {
    var mapMarker = map_device(mc, device);
    mapMarker.add_listener("click", function() {
        showVehicleData(device);
    });
}

function map_devices() {
    // Loop through landmarks and map em
    for (var i in deviceController.devices) {
        remap_device(mc, deviceController.devices[i]);
    }
}

function unmap_devices() {
    for (var i in deviceController.devices) {
        unmap_device(mc, deviceController.devices[i]);
    }
}

function get_liveview_update() {
    if (updateLimiter != 960) {
        $.getJSON(WWW_ROOT + "/ajax.php", {
            action: "get_liveview_updates"
        }, function(data) {
            deviceController.reload_data(data.devices);
            eventController.load_data(data.events);
			
            var d_id = deviceController.findDeviceByID(viewingDevice);
			
            
			
            // Remap and bind devices
            /*for (var i in deviceController.devices) {
				map_device(mc, deviceController.devices[i], mapIcon);
			}*/
			
            $.each(deviceController.devices, function(i, x) {
				
                //mc.markers[mc.findMarkerByID("device-" + deviceController.devices[i].id)].add_listener("click", function() {
                //	showVehicleData(deviceController.devices[i]);
                //});
                var device = deviceController.devices[i];
                var mapMarker = mc.markers[mc.findMarkerByID("device-" + deviceController.devices[i].id)];
                var marker = mapMarker.marker;
                
                marker.labelVisible = device.showMarkerLabel;
                marker.setPosition(new google.maps.LatLng(device.latitude, device.longitude));
                marker.labelContent = "<div class='labeled-marker-name'>" + device.markerLine1 + "</div><div class='labeled-marker-state'>" + device.markerLine2 + "</div>";
                marker.labelStyle.backgroundColor = device.getMarkerStatusColor();
                var icon = new MapIcon("http://" + WWW_HOST + "/images/" + device.markerImage);
                icon.setSize(15, 34);
                icon.setAnchor(7, 35);
                mapMarker.setIcon(icon);
                if (marker.map)
                    marker.label.draw();
                /*mc.markers[mc.findMarkerByID("device-" + deviceController.devices[i].id)].add_listener("click", function() {
                	showVehicleData(deviceController.devices[i]);
                });*/
            });
            
            update_indicator_colors();

            if (d_id != -1) {
                update_vehicle_information(deviceController.devices[d_id]);
            //showVehicleData(deviceController.devices[d_id]);
            }
			
            // Add new events to map
            for (var i in data.events) {
                var e_id = eventController.findEventByID(data.events[i].ActionEventID);
                if (eventController.events[e_id].type_id == 12) {
                    map_event(mc, eventController.events[e_id]);
				
                    // Listener to show data
                    mc.markers[mc.findMarkerByID("event-" + eventController.events[e_id].id)].add_listener("click", function() {
                        showEventData(eventController.events[e_id]);
                    });
                }
            }
			
			
            // Prepend history to each device and update the routes mapping
            $.each(data.histories, function(i, x) {
                var device_id = deviceController.findDeviceByID(i);
				
                if (device_id != -1) {
                    deviceController.devices[device_id].prepend_history(x);
                    remap_device_history(device_id);
                }
            });
            
            //mc.map.resize();

        });
		
        updateLimiter++;
		
        if (updateLimiter == 960) {
            alert("Live View halted due to timeout. Refresh page to continue");
        }
    }
}

function showVehicleData(device) {
    viewingDevice.valueOf=viewingDevice.toSource=viewingDevice.toString=function(){
        return device.id
        }

    infowindow.open(mc.map, mc.markers[mc.findMarkerByID("device-" + device.id)].marker);
    update_vehicle_information(device);
    // Add a bubble to the map with the html of the vehicle-information-container
    //var device_id = deviceController.findDeviceByID(device.id)

	
    //$("#last-report").removeClass();
    $("#last-report").css('background-color', device.getMarkerStatusColor());
    
	
    if (streetView) {
        point = new google.maps.LatLng(device.latitude,device.longitude);
        //  pov = {yaw:device.heading};
        pov = {
            heading: device.heading,
            zoom:0,
            pitch: 0
        };
	    
        streetView.setPosition(point);
        streetView.setPov(pov);
    }
	
	
	
    if (device.ping_now_supported && device.phone != null  && device.device_state != 2)
		$("#ping-device").show();
	else
		$("#ping-device").hide();

    if (device.has_tpms)
        $("#tpms-show").show();
    else
        $("#tpms-show").hide();

    if (device.has_ddm)
        $("#ddm-show").show();
    else
        $("#ddm-show").hide();    

    for (var i in eventController.events) {
        var e = eventController.events[i];
		
        if (e.device_id == device.id) {
            mc.map_marker("event-" + e.id);
        }
    }
}

/*function showVehicleData(device) {
	
	// Fill in the info
	//viewingDevice = device.id;
	viewingDevice.valueOf=viewingDevice.toSource=viewingDevice.toString=function(){return device.id}
	
	update_vehicle_information(device);

        if (streetView) {
            point = new google.maps.LatLng(device.latitude,device.longitude);
          //  pov = {yaw:device.heading};
            pov = {heading: device.heading, zoom:0, pitch: 0};
            
            streetView.setPosition(point);
            streetView.setPov(pov);
        }
	
	// Test if we should display the Ping Now button
	if (device.ping_now_supported && device.phone != null && (device.phone.length == 10 || device.phone.length == 11) && device.wireless_carrier == 2)
		$("#ping-device").show();
	else
		$("#ping-device").hide();
	
	
	
	// Load events
	load_user_notifications(eventController, "#user_notification_list", device.user_id)
	
	// Ensure the vehicle box is shown
	$("#vehicle-information-tabs").show();
	$("#vehicle-information-tabs").tabs('select', 0);
	
	// Hide all vehicle data (events / devices)
	mc.hide_markers();
	
	$("#vehicle-information-dialog").dialog('open');
	
	// And now just show this ones data
	mc.map_marker("device-" + device.id);
	
	for (var i in eventController.events) {
		var e = eventController.events[i];
		
		if (e.device_id == device.id) {
			mc.map_marker("event-" + e.id);
		}
	}
}*/

function update_vehicle_information(device) {
    $("#vehicle-being-viewed").html(device.vehicleDriver);
    $("#vehicle-speed").html(device.speed);
    $("#vehicle-state").html(device.status);
    $("#vehicle-last-update").html(device.time);
    $("#vehicle-last-ping").html(device.last_ping);
    $("#vehicle-heading-wrapper").html(device.headingSpeed);
    $("#vehicle-geographical-location").html(device.latitude + ", " + device.longitude);
	
    // Normally this would check if the device has starter control support or not, but for now, we're just doing a single device
    // check for testing purposes
	
    if (device.uid == "359231030664864" || device.uid == "359231030011652" || device.uid == "359231030661829" || device.uid == "3592310300668949") {
        $("#manage-starter").show();
        update_starter_controls(device);
    } else {
        $("#manage-starter").hide();
    }
	

    $("#vehicle-address").html("Obtaining...");
    reverseGeocode(device.latitude, device.longitude, function(address) {
    	device.address = address;
    	
    	var text = device.landmark;
		
        if (text)
            text += " - ";
        else
        	text = "";

        text += device.address;

        $("#vehicle-address").html(text);
    });
    
   
}

function update_indicator_colors() {
    // Loop through each device and update it's indicator color
    var devices = deviceController.devices;
	
    for (var i in devices) {
        var device = devices[i];
        $(".vehicle-status-indicator-box[device_id='" + device.id + "']").css("background", device.getStatusColor());
    }
}

function update_starter_controls(device) {
    // Clear timer for starter tests
    clearInterval(deviceStarterActionTimer);
	
    if (device.starterEnabled == 0) {
        $("#device-starter-control").val('Enable Starter');
        $("#device-starter-message").hide();
        $("#device-starter-control").show();
    } else if (device.starterEnabled == 1) {
        $("#device-starter-control").val("Disable Starter");
        $("#device-starter-message").hide();
        $("#device-starter-control").show();
    } else if (device.starterEnabled > 1) { // Starter pending an operation
        $("#device-starter-control").hide();
		
        if (device.starterEnabled == 2)
            $("#device-starter-message").html("Processing Disable Starter");
        else if (device.starterEnabled == 3)
            $("#device-starter-message").html("Processing Enable Starter");
		
        $("#device-starter-message").show();
		
        // Start getting updates for the starter status

        deviceStarterActionTimer = setInterval("get_device_starter_status(" + device.id + ")", 2000);
    }

}

function showEventData(event) {
    // Fill in the data
    $("#event-details-type").html(event.type);
    $("#event-details-time").html(event.time);
    $("#event-details-operator").html(userController.users[userController.findUserByID(event.user_id)].name);
    $("#event-details-vehicle").html(deviceController.devices[deviceController.findDeviceByID(event.device_id)].name);
    $("#event-details-data").html(event.data);
	
    // Open the dialog for it
    $("#event-details-dialog").dialog('open');
}

// This function loads the detailed history table for the selected device.
function loadDetailedHistoryTable(arrID) {
    // Clear current data
    $("#detailed-history-information").empty();
	
    // Load current data
    for (var i in deviceController.devices[arrID].history) {
        var html = "<tr point_id='" + deviceController.devices[arrID].history[i].id + "'>";
		
        html += "<td>" + deviceController.devices[arrID].history[i].time + "</td>";
        html += "<td><a href='#' class='show-point-on-map'>";
		
        // + deviceController.devices[arrID].history[i].latitude + ", " + deviceController.devices[arrID].history[i].longitude +
        if (deviceController.devices[arrID].history[i].address != null) {
            html += deviceController.devices[arrID].history[i].address;
        } else {
            html += deviceController.devices[arrID].history[i].latitude + ", " + deviceController.devices[arrID].history[i].longitude;
        }
		 
        html += "</a></td>";
        html += "<td>" + deviceController.devices[arrID].history[i].speed + "mph</td>";
        html += "<td>" + degreesToDirection(deviceController.devices[arrID].history[i].heading) + "</td>";
		
		
        html += "</tr>";
        $("#detailed-history-information").append(html);
    }
	
	
    // Swap whats viewed
    $("#vehicle-information-detailed-history-container").show();
    $("#detailed-history-download-area").hide();
}

function get_device_starter_status(device_id) {
    $.getJSON(WWW_ROOT + "/ajax.php", {
        action: "get_device_starter_status",
        device_id: device_id
    }, function(data) {
        if (data.starter_enabled < 2) {
            var device = deviceController.devices[deviceController.findDeviceByID(device_id)];
            device.starterEnabled = data.starter_enabled;
            device.starterEnabled = data.starter_enabled;
            update_starter_controls(device);
        }
    });
}

function degreesToDirection(wd) {
    var dir = wd;
	
    if ((wd >= 0 && wd <= 11.25) || (wd > 348.75 && wd <= 360)) {
        dir = "N";
    } else if (wd > 11.25 && wd <= 33.75) {
        dir = "N NE";
    } else if (wd > 33.75 && wd <= 56.25) {
        dir = "NE";
    } else if (wd > 56.25 && wd <= 78.75) {
        dir = "E NE";
    } else if (wd > 78.75 && wd <= 101.25) {
        dir = "E";
    } else if (wd > 101.25 && wd <= 123.75) {
        dir = "E SE";
    } else if (wd > 123.75 && wd <= 146.25) {
        dir = "SE";
    } else if (wd > 146.25 && wd <= 168.75) {
        dir = "S SE";
    } else if (wd > 168.75 && wd <= 191.25) {
        dir = "S";
    } else if (wd > 191.25 && wd <= 213.75) {
        dir = "S SW";
    } else if (wd > 213.75 && wd <= 236.25) {
        dir = "SW";
    } else if (wd > 236.25 && wd <= 258.75) {
        dir = "W SW";
    } else if (wd > 258.75 && wd <= 281.25) {
        dir = "W";
    } else if (wd > 281.25 && wd <= 303.75) {
        dir = "W NW";
    } else if (wd > 303.75 && wd <= 326.25) {
        dir = "NW";
    } else if (wd > 326.25 && wd <= 348.75) {
        dir = "N NW";
    }
	
    return dir;
}

function MapSearch(mapController) {
    var self = this;

    self.mc = mapController;

    self.infoWindow =  new google.maps.InfoWindow({
        content: $("#search-information-container")[0]
    });

    self.results = [];
    self.localSearch = new GlocalSearch();
    self.localSearch.setSearchCompleteCallback(null, function() {
        //$("#toggle-search-details").show();
        
        self.reset();

        if (!self.localSearch.results || self.localSearch.results.length == 0) {
            $("#search-result-data").html("No results found");
            return;
        }

        $("#search-result-data").html("");
        
        // Close the infowindow
        self.infoWindow.close();

        self.results = [];
        for (var i = 0; i < self.localSearch.results.length; i++) {
            var icon = "http://maps.google.com/mapfiles/marker" + String.fromCharCode(i + 65) + ".png";
            self.results.push(new SearchResult(self.localSearch.results[i], this.mc.map, self.infoWindow, icon));
        }

        // Little hack to get rid of the link provided by google maps
        $(".gs-title").removeAttr("href").css("cursor","pointer");

        var attribution = self.localSearch.getAttribution();
        if (attribution) {
            $("#search-result-data").append(attribution);
        }

        // Move the map to the first result
        var first = self.localSearch.results[0];
        self.mc.map.setCenter(new google.maps.LatLng(parseFloat(first.lat), parseFloat(first.lng)));
    });

}

MapSearch.prototype.unselectMarkers = function() {
    for (var i = 0; i < this.results.length; i++) {
        this.results[i].unselect();
    }
}

MapSearch.prototype.reset = function() {
    this.toggleMarkers(false);
    this.results = [];
}


MapSearch.prototype.search = function(text) {
    this.localSearch.setCenterPoint(mc.map.getCenter());
    this.localSearch.execute(text);
}

MapSearch.prototype.toggleMarkers = function(visible) {
    for (var i = 0; i < this.results.length; i++) {
        this.results[i].marker().setMap(visible ? this.mc.map : null);
    }
}

/*
function getClosestDevices(latLng) {
    var distances = [];
    var closest = -1;
    for(i = 0; i < deviceController.devices.length; i++ ) {
        var device = deviceController.devices[i]
        var deviceLatLng = new google.maps.LatLng(device.latitude, device.longitude);
        var d = parseFloat(latLng.distanceFrom(deviceLatLng));
        distances[i] = d;
        if (closest == -1 || d < distances[closest] ) {
            closest = i;
        }
    }
    return deviceController.devices[closest];
}
*/

function addClosestDevice(latLng, device) {
    var deviceLatLng = new google.maps.LatLng(device.CurrentLatitude, device.CurrentLongitude);

    mapRoute.calculateRoute(deviceLatLng, latLng, function(response) {
        if (response) {
            
            var container = document.createElement('div');
            container.className = "search-result-item";
            var title = document.createElement('a');
            title.className = 'gs-title';
            title.setAttribute('href', '#');
            $(title).html(device.VehicleDriver);
            var data = document.createElement('div');
            var address = "";
            if (response.routes && response.routes[0].legs) {
                var legs = response.routes[0].legs;
                address = legs[0].start_address;
            }

            var html = "";
            html += "<div>" + address + "</div>";
            html += "<div>ETA: " + response.totalDurationFormatted + "</div>";
           // html += "<div>Distance: " + device.Distance.toFixed(2) + " miles</div>";
            var drivingDistance = response.totalDistance * 0.000621371192; // convert meters to miles
            html += "<div>Driving Distance: " + drivingDistance.toFixed(2) + " miles</div>";
            
            $(data).html(html);

            var showRoute = document.createElement('a');
            showRoute.setAttribute('href', '#');
            $(showRoute).html('Show Route');

            $(container).append(title);
            $(container).append(data);
            $(container).append(showRoute);

            $("#search-result-data").append(container);
            var deviceID = device.DeviceID;

            $(title).click(function() {
                var deviceIdx = deviceController.findDeviceByID(deviceID);
                if (deviceIdx < 0) return;
                var device = deviceController.devices[deviceIdx];
                if (device) {
                    mc.map.setCenter(new google.maps.LatLng(parseFloat(device.latitude), parseFloat(device.longitude)));
                    showVehicleData(device);
                }
            });

            $(showRoute).click(function() {
                mapRoute.reset();
                mapRoute.origin = deviceLatLng;
                mapRoute.destination = latLng;
                mapRoute.route(false);
            })
        }

    });
}

function getClosestDevices(latLng, name) {

    $("#search-result-title").html("Vehicles closest to '" + name + "'");
    $("#search-result-data").html("<img src='/images/ajax-loader.gif' alt='Loading...'/>");

    $.get(WWW_ROOT + "/ajax.php", {
            action: "get_closest_devices",
            Lat: latLng.lat(),
            Lng: latLng.lng(),
            Radius: 5000,
            MaxDevices: 20
    }, function(data) {

        $("#search-result-data").html("");
        var devices = data.devices;
        if (devices.length == 0) {
            $("#search-result-data").html("No vehicle found near the selected area.");
            return;
        }

        for (var i = 0; i < devices.length; ++i) {
            var device = devices[i];
            addClosestDevice(latLng, device);
        }

    }, "json");
}

function SearchResult(result, map, infoWindow, icon) {
    var self = this;
    self.map = map;
    self.infoWindow = infoWindow;
    self.result_ = result;
    self.icon = icon;
    self.resultNode_ = self.node();
    self.marker_ = self.marker();
    google.maps.event.addDomListener(self.resultNode_, 'mouseover', function() {
        // Highlight the marker and result icon when the result is
        // mouseovered.  Do not remove any other highlighting at this time.
        self.highlight(true);
    });
    google.maps.event.addDomListener(self.resultNode_, 'mouseout', function() {
        // Remove highlighting unless this marker is selected (the info
        // window is open).
        if (!self.selected_) self.highlight(false);
    });
    google.maps.event.addDomListener(self.resultNode_, 'click', function() {
        self.select();
    });
    $("#search-result-data").append(self.resultNode_);
}

SearchResult.prototype.node = function() {
    if (this.resultNode_) return this.resultNode_;
    return this.html();
};

// Returns the GMap marker for this result, creating it with the given
// icon if it has not already been created.
SearchResult.prototype.marker = function() {
    var self = this;
    if (self.marker_) return self.marker_;
    var marker = self.marker_ = new google.maps.Marker({
        position: new google.maps.LatLng(parseFloat(self.result_.lat), parseFloat(self.result_.lng)),
        icon: self.icon,
        map: this.map
    });
    google.maps.event.addListener(marker, "click", function() {
        self.select();
    });
    return marker;
};

// Unselect any selected markers and then highlight this result and
// display the info window on it.
SearchResult.prototype.select = function() {
    mapSearch.unselectMarkers();
    this.selected_ = true;
    this.highlight(true);
    this.map.setCenter(new google.maps.LatLng(parseFloat(this.result_.lat), parseFloat(this.result_.lng)));
    this.infoWindow.setContent(this.html(true));
    this.infoWindow.open(this.map, this.marker());
};

SearchResult.prototype.isSelected = function() {
    return this.selected_;
};

// Remove any highlighting on this result.
SearchResult.prototype.unselect = function() {
    this.selected_ = false;
    this.highlight(false);
};

// Returns the HTML we display for a result before it has been "saved"
SearchResult.prototype.html = function() {
    var self = this;
    var container = document.createElement("div");
    var closest = document.createElement("a");
    closest.setAttribute('href', '#');

    $(closest).html('Find Closest Vehicles');
    $(closest).click(function() {
        if (currentScreen == 2) {
            alert('Find Closes Vehicles is not allowed on History, only on Live.')
            return false;
        }
        getClosestDevices(self.marker().getPosition(), self.result_.title);
        return false;
    });

    container.className = "search-result-item";
    $(container).css('background-image', 'url(' + this.icon + ')');
    container.appendChild(self.result_.html.cloneNode(true));
    container.appendChild(closest);

    return container;
};

SearchResult.prototype.highlight = function(highlight) {
    $(this.node()).toggleClass("highlight", highlight);
};

/***/

function MapRoute(mapController) {
    this.mc = mapController;
    this.waypoints = [];
    this.origin = null;
    this.destination = null;
    this.clickListener = false;
    this.ownedMarkers = [];
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: false});
    this.directionsDisplay.setPanel(null); // document.getElementById("search-result-data")
    this.geocoder = new google.maps.Geocoder();
};

MapRoute.prototype.enable = function() {
    var self = this;
    this.clickListener = google.maps.event.addListener(this.mc.map, 'click', function(event) {
        self.addWayPoint(event.latLng);
    });
};

MapRoute.prototype.addWayPoint = function(latLng) {

    var self = this;

    if (self.origin == null) {
        self.origin = latLng;
        self.addMarker(self.origin);
    } else if (self.destination == null) {
        self.destination = latLng;
        self.addMarker(self.destination);
    } else {
        if (self.waypoints.length < 9) {
            self.waypoints.push({
                location: self.destination,
                stopover: true
            });
            self.destination = latLng;
            self.addMarker(self.destination);
        } else {
            alert("Maximum number of waypoints reached");
        }
    }
};

MapRoute.prototype.disable = function() {
    if (this.clickListener)
        google.maps.event.removeListener(this.clickListener);
};

MapRoute.prototype.getRoutePointsCount = function() {
    var result = -1;
    if (this.origin) result++;
    if (this.destination) result++;
    result += this.waypoints.length;
    return result;
};

MapRoute.prototype.addMarker = function(latLng) {
    var marker = new google.maps.Marker({
        position: latLng,
        map: this.mc.map,
        draggable: false,
        icon: "http://maps.google.com/mapfiles/marker" + String.fromCharCode(this.getRoutePointsCount() + 65) + ".png"
    });

    this.ownedMarkers.push(marker);
};

MapRoute.prototype.addMarkerByAddress = function(address) {

    var self = this;

    this.geocoder.geocode({'address': address, 'latLng': self.mc.map.getCenter()},
        function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                self.mc.map.setCenter(results[0].geometry.location);
                self.addWayPoint(results[0].geometry.location);
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        }
    );
};

MapRoute.prototype.toggleMarkers = function(visible) {
    for (var i = 0; i < this.ownedMarkers.length; ++i) {
        this.ownedMarkers[i].setMap(visible?this.mc.map:null);
    }
};

MapRoute.prototype.reset = function() {

    this.toggleMarkers(false);
    this.ownedMarkers = [];
    this.waypoints = [];
    this.origin = null;
    this.destination = null;
    this.directionsDisplay.setMap(null);
};

// Calculate the route between the origin and destination
MapRoute.prototype.calculateRoute = function(origin, destination, callback) {

    var request = {
        origin: origin,
        destination: destination,
        waypoints: [],
        travelMode: google.maps.DirectionsTravelMode.DRIVING,
        optimizeWaypoints: $("#route-optimize").is(':checked'),
        avoidHighways: $("#route-highways").is(':checked'),
        avoidTolls: $("#route-tolls").is(':checked')
    };

    this.directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            var legs = response.routes[0].legs;
            var totalDistance = 0;
            var totalDuration = 0;
            for(var i = 0; i < legs.length; ++i) {
                totalDistance += legs[i].distance.value;
                totalDuration += legs[i].duration.value;
            }
            response.totalDistance = totalDistance;
            response.totalDuration = totalDuration;
            var time = secondsToTime(totalDuration);
            response.totalDurationFormatted = "";
            if (time.h > 0)
                response.totalDurationFormatted = "" + time.h + " hours ";

            response.totalDurationFormatted += "" + time.m + " minutes ";

            callback(response);
        } else {
            callback(null);
        }
    });
};

MapRoute.prototype.route = function(showResults) {

    var self = this;

    if (this.origin == null) {
        alert('You must select an origin.')
        return;
    }

    if (this.destination == null) {
        alert('You must select a destination.')
        return;
    }

    var request = {
        origin: this.origin,
        destination: this.destination,
        waypoints: this.waypoints,
        travelMode: google.maps.DirectionsTravelMode.DRIVING,
        optimizeWaypoints: $("#route-optimize").is(':checked'),
        avoidHighways: $("#route-highways").is(':checked'),
        avoidTolls: $("#route-tolls").is(':checked')
    };

    this.directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            self.directionsDisplay.setMap(self.mc.map);
            self.toggleMarkers(false);
            self.directionsDisplay.setDirections(response);
            var legs = response.routes[0].legs;
            var totalDistance = 0;
            var totalDuration = 0;
            for(var i = 0; i < legs.length; ++i) {
                totalDistance += legs[i].distance.value;
                totalDuration += legs[i].duration.value;
            }

            var routeText = "";
            var iconIndex = 0;

            if (showResults) {
                $.each(legs, function() {
                    var iconStart = "http://maps.google.com/mapfiles/marker_green" + String.fromCharCode(iconIndex + 65) + ".png";
                    var iconEnd = "http://maps.google.com/mapfiles/marker_green" + String.fromCharCode(iconIndex + 65 + 1) + ".png";

                    routeText += '<div class="route-result">';
                    routeText += '<div class="route-result-markers">';
                    routeText += '<img class="route-result-icon-start" src="' + iconStart + '">';
                    routeText += '<img class="route-result-icon-end" src="' + iconEnd + '">';

                    routeText += '</div>';
                    routeText += '<div class="route-result-text">';
                    routeText += '<div>' + this.start_address + '</div>';
                    routeText += '<div>' + this.end_address + '</div>';
                    routeText += '<div>ETA: ' + this.duration.text + '</div>';
                    routeText += '<div>Driving Distance: ' + this.distance.text + '</div>';
                    routeText += '</div>';
                    routeText += '</div>';
                    iconIndex++;
                });

                $("#search-result-title").html("Route Detail:");
                $("#search-result-data").html(routeText);
                $("#search-result").show();
            }
            
        } else {
            if(status == "NOT_FOUND") {
                alert('Your address was not found. Please try again');
            } else {
                alert('There was an error processing the directions. Please try again.');
            }
        }
    });
};


function rad(x) {return x*Math.PI/180;}

google.maps.LatLng.prototype.distanceFrom = function(p2) {
    var R = 6378137; // earth's mean radius in meters (this was a parameter in V2)
    var rad = function(x) {return x*Math.PI/180;}
    var dLat = rad(p2.lat() - this.lat());
    var dLong = rad(p2.lng() - this.lng());

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(this.lat())) * Math.cos(rad(p2.lat())) * Math.sin(dLong/2) * Math.sin(dLong/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;

    return d.toFixed(3);
};

function secondsToTime(secs)
{
    var hours = Math.floor(secs / (60 * 60));

    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    var obj = {
        "h": hours,
        "m": minutes,
        "s": seconds
    };
    return obj;
};

setInterval("get_liveview_update()", 15000);

