<h2>Alert Templates</h2>
<input type="button" id="create-alert-template" value="Create New Alert Template" />
<br>
<ul id="alert-template-list"></ul>

<div id="dialog-edit-alert-template">
	Template Name: <input id="alert-template-name" size="80"><br>
	<br>
	<div id="dialog-edit-alert-template-tabs">
		<ul>
			<li><a href="#alert-template-email">E-Mail</a></li>
			<li><a href="#alert-template-text">Mobile Short Message</a></li>
		</ul>
		<div id="alert-template-email">
			Subject: <br><input id="alert-template-email-subject" size="60"><br>
			Message: <br><textarea id="alert-template-email-message" rows=7 cols=60></textarea>
		</div>
		
		<div id="alert-template-text">
			<textarea id="alert-template-sms" rows=8 cols=60></textarea><br>

		</div>
		
	</div>
</div>

<div id="dialog-view-alert-template">
	Template Name: <span id="view-alert-template-name"></span>
	<br>
	<div id="dialog-view-alert-template-tabs">
		<ul>
			<li><a href="#view-alert-template-email">E-Mail</a></li>
			<li><a href="#view-alert-template-text">Mobile Short Message</a></li>
		</ul>
		<div id="view-alert-template-email">
			Subject: <span id="view-alert-template-email-subject"></span><br>
			Message: <br><div id="view-alert-template-email-message"></div>
		</div>
		
		<div id="view-alert-template-text">
			<div id="view-alert-template-sms"></div>

		</div>
		
	</div>
</div>