
<div id="dialog-edit-user" class="form-dialog" title="Add New User">
	<form>
		<fieldset>
			<label>Name:</label>
			<input id="user-edit-name" class="text">
		</fieldset>
		
		<fieldset>
			<label>E-Mail:</label>
			<input id="user-edit-email" class="text">
		</fieldset>
		
		<fieldset>
			<label>Password:</label>
			<input type="password" id="user-edit-password" class="text">
		</fieldset>
		
		<fieldset>
			<label>Tags <small>(comma separated)</small>:</label>
			<input id="user-edit-tags" class="text">
		</fieldset>
		
		<fieldset>
			<label>Vehicle:</label>
			<select id="user-edit-device" class="text">
				<option value='0'>Not Assigned</option>
			</select>
		</fieldset>
		
		
		<fieldset>
			<label>Access Level:</label>
			<select id="user-edit-access-level" class='text'>
				<option value='1'>Driver</option>
				<option value='2'>Dispatcher</option>
				<option value='5'>Manager</option>
				<!--<option value='8'>Executive</option>-->
				
				<option value='10'>Administrator</option>
			</select>
		</fieldset>
		
		<fieldset id="user-edit-manage-group-fields">
			<label>Manages Division/Group:</label>
			<select id="user-edit-manage-group" class="text">
				<option value='0'>Not Assigned</option>
			</select>
		</fieldset>
		
		<fieldset>
			<label>Group:</label>
			<select id="user-edit-group" class="text">
				<option value='0'>Not Assigned</option>
			</select>
		</fieldset>
		

		
		<fieldset>
			<label>Address:</label>
			<textarea id="user-edit-address" class="text"></textarea>
		</fieldset>

		
		<fieldset>
			<label>Text Alert Phone:</label>
			<input id="user-edit-mobile-phone" class="text">
		</fieldset>
		
		<fieldset>
			<label>Timezone:</label>
			<select id="user-edit-timezone" class='text'></select>
		</fieldset>
	</form>
</div>
<!-- 
<option value='-8'>Pacific</option>
<option value='-7'>Mountain</option>
<option value='-6'>Central</option>
<option value='-5'>Eastern</option>
-->