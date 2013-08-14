var geocoder;

$(document).ready(function() {
	geocoder = new google.maps.Geocoder();
});

function geocode(address, callback) {
	 
	geocoder.geocode({address: address}, function(results, status) {
		
                if (status != google.maps.GeocoderStatus.OK) {
                    console.log(status);
                }

		if (status == google.maps.GeocoderStatus.OK && results && results[0]) {
			var point = results[0].geometry.location;
			callback(point.lat(), point.lng());
		} else {
			callback(null, null);
		}
	});
}

function reverseGeocode(lat, lng, callback) {
	geocoder.geocode({location: new google.maps.LatLng(lat, lng)}, function(results, status) {
		if (status != google.maps.GeocoderStatus.OK) {
			callback("");
		} else {
			
			callback(results[0].formatted_address);
		}
	});
}

function parseReverseGeocode(response) {
	place = response.Placemark[0].AddressDetails.Country.AdministrativeArea;
	
	var street = "";
	var state;
	
	if (place.SubAdministrativeArea) {
		if (place.SubAdministrativeArea.Locality) {
			if (place.SubAdministrativeArea.Locality.Thoroughfare) {
				street = place.SubAdministrativeArea.Locality.Thoroughfare.ThoroughfareName + ", ";
			}
			state = place.SubAdministrativeArea.Locality.LocalityName;
		} else {
			if (place.SubAdministrativeArea.Thoroughfare) {
				street = place.SubAdministrativeArea.Thoroughfare.ThoroughfareName + ", ";
			}
			state = place.SubAdministrativeArea.LocalityName;
		}
		
	} else {
		if (place.Locality.Thoroughfare) {
			street = place.Locality.Thoroughfare.ThoroughfareName + ", ";
		} else {
			var addresses = place.Locality.AddressLine;
			
			for (var k in addresses) {
				street += addresses[k] + " ";
			}
			
			street = $.trim(street);
			
		}
		state = place.Locality.LocalityName;
		
	}
	
	return street + state + ", " + place.AdministrativeAreaName;
}	