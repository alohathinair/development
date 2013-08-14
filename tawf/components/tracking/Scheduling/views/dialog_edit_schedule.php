
<div id="schedule-dialog" title="New Scheduled Job" class="form-dialog">
	<form>
	
	<fieldset>
		<label>Driver</label>
		<select id="schedule-operator"></select>
	</fieldset>
	
	<fieldset>
		<label>Time of Arrival</label>
		<input id="schedule-date" />
		
		<select id="schedule-start-hour">
			<option value='12'>12</option>
			<?php 
			for ($i = 1; $i != 12; $i++) {
				$k = $i;
				if ($k < 10) {
					$k = "0" . $k;
				}
				echo "<option value='$k'>$i</option>\n";
			}
			?>
		</select> <select id="schedule-start-minute">:
			<option value='00'>00</option>
			<option value='15'>15</option>
			<option value='30'>30</option>
			<option value='45'>45</option>
		</select> <select id="schedule-start-meridian"><option value='AM'>am</option><option value='PM'>pm</option></select> 
	</fieldset>
	
	Contact Someone on Approach: <input type="checkbox" id="schedule-contact">
	
	<div id="schedule-contact-data" style="display: none;">
		<fieldset>
			<label>Recipient</label>
			<input id="schedule-alert-recipient">
		</fieldset>
		
		<fieldset>
			<label>Alert Template</label>
			<select id="schedule-alert-template"></select>
		</fieldset>
		
		<fieldset>
			<label>Delivery Method</label>
			<select id="schedule-alert-delivery-method"><option value='1'>E-Mail</option><option value='2'>Mobile Text Message</option><option value='3'>Voice Message</option></select>
		</fieldset>
	</div>
	</form>
</div>
