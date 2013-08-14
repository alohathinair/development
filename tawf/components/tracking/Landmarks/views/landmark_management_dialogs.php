<div id="edit-landmark-dialog" class="form-dialog">
		
		<fieldset id="fields-landmark-type">
			<label>Landmark Type:</label><br />
			<select id="landmark-type">
				<option value='1'>Radial</option>
				<option value='2'>Polygonal</option>
			</select>
		</fieldset>
		
    	<fieldset>
			<label>Landmark Name:</label>
			<input class="text" id="landmark-edit-name">
		</fieldset>
		
		<!--<fieldset>
			<label>Landmark Tags <small>(comma separated)</small>:</label>-->
			<input type="hidden" class="text" id="landmark-edit-tags">
		<!--</fieldset>-->

		<fieldset id="fields-landmark-coords">
			<label>Landmark Coordinates <small>(Latitude, Longitude)</small>:</label>
			<input id="landmark-edit-lat" size="8">, <input id="landmark-edit-lng" size="8">
		</fieldset>
		
		<fieldset id="fields-landmark-address">
			<label>Landmark Address:</label>
			<input class="text" id="landmark-edit-address">
		</fieldset>
		
		<fieldset id="fields-landmark-size">
			<label>Landmark Size:</label>
			<select class="text" id="landmark-edit-size">
				<option value='1'>Small</option>
				<option value='2'>Medium</option>
				<option value='3'>Large</option>
				<option value='4'>Custom</option>
			</select>
		</fieldset>
		
		<fieldset id="landmark-edit-custom-box" style="display: none;">
			<label>Custom Size:</label>
			<input class="text" id="landmark-edit-custom-size"> meters
		</fieldset>
		
                <input type="hidden" id="landmark-polygon" />
		
		<fieldset>
			<label>Landmark Color:</label>
			<select class="text" id="landmark-edit-color">
				<option value='#FF0000'>Red</option>
				<option value='#00FF00'>Green</option>
				<option value='#0000FF'>Blue</option>
			</select>
		</fieldset>
		
		<fieldset>
			<label>Driver:</label>
			<select class="text" id="landmark-edit-user-list">
				<option value='0'>Entire Company</option>
				
			</select>
		</fieldset>
</div>

<div id="view-landmark-dialog"></div>

<!--<div id="landmark-map-dialog">
	<div id="landmark-map"></div>
</div>-->