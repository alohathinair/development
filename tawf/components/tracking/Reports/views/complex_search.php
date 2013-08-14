<script>
var company_latitude = <?php echo $this->company_data["CompanyDefaultMapLatitude"]; ?>;
var company_longitude = <?php echo $this->company_data["CompanyDefaultMapLongitude"]; ?>;
var company_zoom = <?php echo $this->company_data["CompanyDefaultMapZoom"]; ?>;
</script>

<!--<form action="/ajax.php" method="POST" id="post-report">
<input type="hidden" name="action" value="get_report" />
<div id="wrapper-reports">
	<div>
		Step 1: Choose a Report Type <br />
		<select name="report-type" id="report-type">
			<option value="1">List</option>
			<option value="2">Mapped</option>
			<option value="3">Graphed</option>
		</select>
	</div>
	
	<div>
		Step 2: Choose a Report <br />
		<select name="report" id="report">
			<option value='1'>Events</option>
		</select>
	</div>
	
	<div>
		Step 3: Choose Driver(s) <br />
		<select name="drivers[]" id="drivers" size="10" multiple="multiple">
			 <?php
          foreach ($this->filter_data["users"] as $users) {
          	echo "<option value='" . $users["CompanyUserID"] . "'>" . $users["CompanyUserName"] . "</option>";
          }
          ?>
		</select>
		
		<select name="driver" id="driver" style="display: none;">
			 <?php
          foreach ($this->filter_data["users"] as $users) {
          	echo "<option value='" . $users["CompanyUserID"] . "'>" . $users["CompanyUserName"] . "</option>";
          }
          ?>
		</select>
	</div>

	<div>
		Step 4: Select the Date Range <br />
		<input id="start_date" name="start_date" style="width: 80px;" value="<?php echo date("m/d/Y"); ?>"> <span style="font-size: 12px;">to</span> <input id="end_date" name="end_date" style="width: 80px;" value="<?php echo date("m/d/Y"); ?>">
	</div>

	<div id="choose-filters">
		Step 5: Choose Filter(s) <br /> 
		
		<select id="filters" name="filters[]" size="6" multiple="multiple">
            <option value='1'>Landmark Arrival</option>
            <option value='2'>Landmark Departure</option>
            <option value='7'>Landmark Approach</option>
            <option value='3'>Speeding</option>
            <option value='4'>Stopping</option>
            <option value='5'>After-hours Use</option>
       		<option value='8'>Engine Turned On</option>
       		<option value='9'>Engine Turned Off</option>
       		<option value='10'>Engine Stopped Idling</option>
       		<option value='11'>Engine Started Idling</option>
      </select>
	</div>
		
	<input type="submit" value="Generate Report" class="generate" id="display-report" />
</div>
</form>

<div id="listed-results" style="display: none;">
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

<div id="mapped-results" style="display: none;">
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

<div id="graphed-results" style="display: none;">
	<iframe id="graph-frame" width="950" height="650" style="border: none;"></iframe>
</div>

<div id="map-view-dialog" title="View Event on Map">
	<div id="event-map" style="height: 450px; width: 450px; margin: auto;">
	</div>
</div>-->

<form action="/download-report.php" method="POST" id="post-report">
<input type="hidden" name="action" value="get_report" />

<div id="configure-report-container">
	<div id="select-report-type-box">
		<span class="header-text">Report Type</span><br />
		<select name="report-type" id="report-type">
			<option value="1">Mapped</option>
			<!--<option value="2">Graphed</option>-->
		</select>
	</div>
	<div id="select-report-box">
		<span class="header-text">Report</span><br />
		<select name="report" id="report">
			<option value='1'>Events</option>
			<option value='2'>History</option>
		</select>
	</div>
	<div id="select-report-drivers-box">
		<span class="header-text">Driver(s)</span><br />
		<select name="drivers[]" id="drivers" size="6" multiple="multiple">
			 <?php
          foreach ($this->filter_data["users"] as $users) {
          	echo "<option value='" . $users["CompanyUserID"] . "'>" . $users["CompanyUserName"] . "</option>";
          }
          ?>
		</select>
		
		<select name="driver" id="driver" style="display: none;">
			 <?php
          foreach ($this->filter_data["users"] as $users) {
          	echo "<option value='" . $users["CompanyUserID"] . "'>" . $users["CompanyUserName"] . "</option>";
          }
          ?>
		</select>
	</div>
	<div id="select-report-dates-box">
		<span class="header-text">Date Range</span><br />
		<input id="start_date" name="start_date" style="width: 80px;" value="<?php echo date("m/d/Y", time()-(3600*6)); ?>"><br />
		<span class="header-text">To</span><br />
		<input id="end_date" name="end_date" style="width: 80px;" value="<?php echo date("m/d/Y", time()-(3600*6)); ?>">
		
	</div>
	<div id="select-report-filters-box">
		<span class="header-text">Filters</span><br />
		<select id="filters" name="filters[]" size="6" multiple="multiple"><br />
            <option value='1'>Landmark Arrival</option>
            <option value='2'>Landmark Departure</option>
            <option value='7'>Landmark Approach</option>
            <option value='3'>Speeding</option>
            <option value='4'>Stopping</option>
            <option value='5'>After-hours Use</option>
       		<option value='8'>Engine Turned On</option>
       		<option value='9'>Engine Turned Off</option>
       		<option value='10'>Engine Stopped Idling</option>
       		<option value='11'>Engine Started Idling</option>
       		<option value='12'>Panic Button Pressed</option>
      </select>
	</div>
	<div id="generate-report-box">
		
		<input type="image" src="/images/btn-generate-report.png" id="display-report" />
	</div>
</div>
</form>
<div style="clear: both;"></div>

<div id="report-results">
	<div id="report-list">
		<div id="report-table-header">
		
		</div>
	
		<div id="route-playback-container" style="text-align: center; margin-bottom: 20px;">
			<a href="#" id="playback-backward">Play Backwards</a> 
			<a href="#" id="playback-home">Beginning</a> 
			<a href="#" id="playback-stop">Stop</a>
			<a href="#" id="playback-forward">Play Forward</a>
		</div>
		<div id="report-list-column-headings">
			<img src="/images/bar-thin-left.png" style="float: left;" />
			<div id="report-list-column-heading1" style="width: 85px">Driver</div>
			<div id="report-list-column-heading2" style="width: 130px">Time</div>
			<div id="report-list-column-heading3" style="width: 130px">Event</div>
			<div id="report-list-column-heading4">Data</div>
			
			
			<img style="float: right;" src="/images/bar-thin-right.png" />
			<div style="clear:both;"></div>
		</div>
		<div id="report-list-container">
			
			<table id="report-list-results">
				
			</table>
			&nbsp;
		</div>
	</div>
	
	<div id="report-graphic-results">
		<div id="mapped-results">
			<div id="map"></div>
		</div>
		<div id="graphed-results" style="display: none;"></div>
	</div>
	
	<div style="clear: both;"></div>
	
	<div id="report-table-footer">
		<input type="button" id="download-report" value="Download Report" style="display: none;" />
	</div>
	
	
</div>





