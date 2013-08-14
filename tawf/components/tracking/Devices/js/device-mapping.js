// This file links devices to MapMarkers and adds them to the MapController via helper functions

function map_device(mapController, device, icon) {
	mapController.add_marker(new MapMarker("device-" + device.id, "devices", new MapPoint(device.latitude, device.longitude), icon, device.name, 1000000));
	mapController.map_marker("device-" + device.id);
}

function unmap_device(mapController, device) {
	mapController.hide_marker("device-" + device.id);
}

