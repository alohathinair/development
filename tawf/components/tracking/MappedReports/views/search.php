<script>
var company_latitude = <?php echo $this->company_data["CompanyDefaultMapLatitude"]; ?>;
var company_longitude = <?php echo $this->company_data["CompanyDefaultMapLongitude"]; ?>;
var company_zoom = <?php echo $this->company_data["CompanyDefaultMapZoom"]; ?>;
</script>

<div id="wrapper-reports">
  <table width="100%" border="0" cellspacing="0" cellpadding="5">
    <tr>
      <td width="25%"><strong>Select Report Type</strong></td>
      <td width="25%"><strong>Select Device / Operator</strong></td>
      <td width="25%"><strong>Select Dates To Display</strong></td>
      <td width="25%" align="center">&nbsp;</td>
    </tr>
 
 
 	<tr>
 	
 		<td>
 			<select id="report-type">
 			
 				<option value="1">Device History</option>
 			
 			</select>
 		</td>
 	
 		<td>
 		
	 		<select id="device-filter">
	        <optgroup label="Vehicles">
	          <?php
	          foreach ($this->filter_data["devices"] as $device) {
	          	echo "<option value='1-" . $device["DeviceID"] . "'>" . $device["Name"] . "</option>";
	          }
	          ?>
	          </optgroup>
	        <optgroup label="Drivers">
	           <?php
	          foreach ($this->filter_data["users"] as $users) {
	          	echo "<option value='2-" . $users["CompanyUserID"] . "'>" . $users["CompanyUserName"] . "</option>";
	          }
	          ?>
	          </optgroup>
	
	      </select>
	 		
 		</td>
 	
 
      <td><input id="date-start-filter" style="width: 80px;" value="<?php echo date("m/d/Y"); ?>"> to <input id="date-end-filter" style="width: 80px;" value="<?php echo date("m/d/Y"); ?>"></td>
      <td align="left"><input name="button" type="submit" class="button" id="run-search" value="Display" /></td>
    </tr>
  </table>
  
  
  <!--<table width="100%" border="0" cellspacing="0" cellpadding="5" id="results-table">
  	<thead>
		<tr>
		  <td width="15%" height="24" bgcolor="#F0F0F0"><strong>Driver</strong></td>
		  <td width="15%" bgcolor="#F0F0F0"><strong>Vehicle</strong></td>
		  <td width="17%" bgcolor="#F0F0F0"><strong>Time</strong></td>
		  <td width="21%" bgcolor="#F0F0F0"><strong>Event</strong></td>
		  <td width="32%" bgcolor="#F0F0F0"><strong>Event Details</strong></td>
	  </tr>
	</thead>
	<tbody id="results-table-body">
	</tbody>
  </table>
</div>-->

<div id="display-results" style="width: 90%;">
	
	<div id="vehicle-information-detailed-history" style="display: none; width: 0px; float: left;">
		<div id="route-playback-container" style="text-align: center; margin-bottom: 20px;">
			<a href="#" id="playback-backward">Play Backwards</a> 
			<a href="#" id="playback-home">Beginning</a> 
			<a href="#" id="playback-stop">Stop</a>
			<a href="#" id="playback-forward">Play Forward</a>
		</div>
		
		<div id="vehicle-information-detailed-history-container" style="height: 450px; overflow-y: auto; overflow-x: hidden; width: 100%; ">
		<table id="detailed-history-table" width="100%">
			<thead>
				<tr>
					<th>Time</th>
					<th>Location</th>
					<th>Speed</th>
					<th>Heading</th>
				</tr>
			</thead>
			<tbody id="detailed-history-information">
			</tbody>
		</table>
		
		</div>
	</div>
	<div id="map" style="height: 450px; width: 600px; float: left; margin-top: 36px;"></div>
	<div style="clear: both;"></div>
</div>