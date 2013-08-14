<div id="dialog-view-user" class="view-dialog" title="View User">
	<form>
		<fieldset>
			<label>Name:</label>
			<div id="view-user-name"></div>
		</fieldset>
		
		<fieldset>
			<label>E-Mail:</label>
			<div id="view-user-email"></div>
		</fieldset>
		
		<fieldset>
			<label>Tags:</label>
			<div id="view-user-tags"></div>
		</fieldset>
		
		<fieldset>
			<label>Vehicle:</label>
			<div id="view-user-device"></div>
		</fieldset>
		
		<fieldset>
			<label>Access Level:</label>
			<div id="view-user-access-level"></div>
		</fieldset>
		
		<fieldset>
			<label>Group:</label>
			<div id="view-user-group"></div>
		</fieldset>
		
		<fieldset id="view-user-managing-group">
			<label>Managing Division/Group:</label>
			<div id="view-user-manage-group"></div>
		</fieldset>
		
		<fieldset>
			<label>Address:</label>
			<div id="view-user-address"></div>
		</fieldset>
		

		<fieldset>
			<label>Text Alert Phone:</label>
			<div id="view-user-mobile-phone"></div>
		</fieldset>
		
		<!--  <input type="hidden" name="map-latitude" id="map-latitude" value="<?php echo $this->data["CompanyInfo"]["CompanyDefaultMapLatitude"]; ?>">
		<input type="hidden" name="map-longitude" id="map-longitude" value="<?php echo $this->data["CompanyInfo"]["CompanyDefaultMapLongitude"]; ?>">
		<input type="hidden" name="map-zoom" id="map-zoom" value="<?php echo $this->data["CompanyInfo"]["CompanyDefaultMapZoom"]; ?>"> -->
		
		<a href="javascript:void(0);" class="select_map">Default Map View</a>
	</form>

	<div id="map-view-dialog" title="Change Default Map View">
	    <div id="map" style="display:none; height: 450px; width: 600px;">
	    </div>
	</div>

</div>

