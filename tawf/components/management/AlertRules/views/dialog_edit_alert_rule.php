
<div id="alert-rule-dialog" title="New Alert Rule" class="form-dialog">
	<form>
	<fieldset>
		<label>Event Type</label>
		
	<select id="alert-rule-type" class="text">
	</select>
	</fieldset>

        <fieldset>
		<label>Division/Group</label>
		<select id="alert-rule-group"></select>
	</fieldset>

	<fieldset id="alert-rule-data-fieldset" style="display: none;">
		<label id="alert-rule-data-label"></label>
		<select id="alert-rule-data"><option value=''>All Landmarks</option></select>
	</fieldset>
	
	<fieldset>
		<label>Recipient</label>
		<select id="alert-rule-recipient"></select>
	</fieldset>
	
	<fieldset>
		<label>Alert Template</label>
		<select id="alert-rule-template"></select>
	</fieldset>
	
	<fieldset>
		<label>Delivery Method</label>
		<select id="alert-rule-delivery-method"><option value='1'>E-Mail</option><option value='2'>Mobile Text Message</option></select>
	</fieldset>
		
	<fieldset>
		<label>Timeframe</label>
	All Day?: <input type="checkbox" id="alert-rule-dialog-is-all-day" checked>
	<div id="alert-rule-dialog-time" style="visibility: hidden;">
		Between:
		<select id="alert-rule-start-hour">
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
		</select> <select id="alert-rule-start-minute">:
			<option value='00'>00</option>
			<option value='15'>15</option>
			<option value='30'>30</option>
			<option value='45'>45</option>
		</select> <select id="alert-rule-start-meridian"><option value='AM'>am</option><option value='PM'>pm</option></select> and 
		<select id="alert-rule-end-hour">
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
		</select>:<select id="alert-rule-end-minute">
			<option value='00'>00</option>
			<option value='15'>15</option>
			<option value='30'>30</option>
			<option value='45'>45</option>
		</select> <select id="alert-rule-end-meridian"><option value='AM'>am</option><option value='PM'>pm</option></select>
	</div>
        </fieldset>
	</form>
</div>
