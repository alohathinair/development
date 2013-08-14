<div id="content-accordians">
	<div id="accordion">
	    <h3><a href="#">Vehicles</a></h3>
	    <div>
		    <ul id="vehicles-screen">
		    
		    </ul>
	    </div>
	    <h3><a href="#">Drivers</a></h3>
	    <div>
		    <ul id="drivers-screen">
		    
		    </ul>
	    </div>
	    <h3><a href="#">Notifications</a></h3>
	    <div>
	    	<?php $this->render_component_partial("notifications", "global_notifications"); ?>
	    </div>

	</div>
</div>

<div id="map"></div>
<div class="clear"></div>


<div id="vehicle-information-dialog">
		<div id="vehicle-information-tabs" style="height: 350px">
			<ul>
				<li><a href="#vehicle-information-main">Vehicle Information</a></li>
				<li><a href="#vehicle-information-events">Vehicle Events</a></li>
				<li><a href="#vehicle-information-detailed-history" id="vehicle-information-detailed-history-tab">Detailed History</a></li>
			</ul>
			<div id="vehicle-information-main">
				<div style="float: left; width: 300px;">
				Vehicle Name: <span id='vehicle-being-viewed'></span><br/>
				Last Updated At: <span id='vehicle-last-update'></span><br/>
				Last Reported Status: <span id='vehicle-state'></span><br/>
				Current Speed: <span id='vehicle-speed'></span><br/>
				Current Heading: <span id='vehicle-heading'></span><br/>
				</div>
				<div style="float: left;">
					<input type="button" value="Toggle Route History" id="toggle-device-history">
				</div>
				<div class="clear"></div>
			</div>
			
			<div id="vehicle-information-events" style="height: 275px; overflow-y: auto; overflow-x: hidden;">
				<?php $this->render_component_partial("notifications", "user_notifications"); ?>
			</div>
			
			<div id="vehicle-information-detailed-history">
				<div id="route-playback-container" style="text-align: center;">
					<a href="#" id="playback-backward">Play Backwards</a> 
					<a href="#" id="playback-home">Beginning</a> 
					<a href="#" id="playback-stop">Stop</a>
					<a href="#" id="playback-forward">Play Forward</a>
				</div>
				
				<div id="vehicle-information-detailed-history-container" style="height: 250px; overflow-y: auto; overflow-x: hidden; width: 100%;">
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
				<div id="detailed-history-download-area" style="text-align: center;">
					<input type="button" id="download-history-button" value="Download detailed history">
				</div>
			</div>
		</div>
	</div>
<div id="event-details-dialog" title="Event Details">
Event Type: <span id="event-details-type"></span><br>
Event Time: <span id="event-details-time"></span><br>
Driver: <span id="event-details-operator"></span><br>
Vehicle: <span id="event-details-vehicle"></span><br>
Details: <span id="event-details-data"></span>
</div>