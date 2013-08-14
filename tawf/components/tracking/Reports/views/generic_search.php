<div id="wrapper-reports">
  <table width="100%" border="0" cellspacing="0" cellpadding="5">
    <tr>
      <td width="21%"><strong>Select What To Display</strong></td>
      <td width="25%"><strong>Select Event Types To Display</strong></td>
      <td width="43%"><strong>Select Dates To Display</strong></td>
      <td width="11%" align="center">&nbsp;</td>
    </tr>
    <tr>
      <td><select id="device-filter" style="width: 200px;">
      	<option value='0'>---- Show Everything ----</option>
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
        <optgroup label="Divisions">
          <?php
          foreach ($this->filter_data["divisions"] as $division) {
          	echo "<option value='3-" . $division["CompanyDivisionID"] . "'>" . $division["CompanyDivisionName"] . "</option>";
          }
          ?>
          </optgroup>
        <optgroup label="Groups">
          <?php
          foreach ($this->filter_data["divisions"] as $division) {
          	foreach ($division["groups"] as $group) {
	          	echo "<option value='4-" . $group["CompanygroupID"] . "'>" . $division["CompanyDivisionName"] . ": " . $group["CompanyGroupName"] . "</option>";
	         }
          }
          ?>
          </optgroup>
      </select></td>
      <td>
      
      <select id="events-filter">
      <option selected="selected" value='0'>---- Show All Event Types ----</option>

        <optgroup label="Destinations">
            <option value='10001'>---- Show All Landmark Data ----</option>
            <option value='1'>Landmark Arrival</option>
            <option value='2'>Landmark Departure</option>
            <option value='3'>Landmark Approach</option>
       </optgroup>
       
        <optgroup label="Travel Data">
            <option value='10002'>---- Show All Travel Data ----</option>
            <option value='3'>Speeding</option>
            <option value='4'>Stopping</option>
            <option value='5'>After-hours Use</option>
       </optgroup>
       
       <optgroup label="Engine Data">
       		<option value='10003'>---- Show All Engine Data ----</option>
       		<option value='8'>Engine Turned On</option>
       		<option value='9'>Engine Turned Off</option>
       		<option value='10'>Engine Stopped Idling</option>
       		<option value='11'>Engine Started Idling</option>
       </optgroup>
              
       
      </select></td>
      <td><input id="date-start-filter" style="width: 80px;" value="<?php echo date("m/d/Y"); ?>"> to <input id="date-end-filter" style="width: 80px;" value="<?php echo date("m/d/Y"); ?>"></td>
      <td align="right"><input name="button" type="submit" class="button" id="run-search" value="Display" /></td>
    </tr>
  </table>
  <hr />
  <table width="100%" border="0" cellspacing="0" cellpadding="5" id="results-table">
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
</div>

<div id="map-view-dialog" title="View Event on Map">
	<div id="map" style="height: 450px; width: 450px; margin: auto;">
	</div>
</div>