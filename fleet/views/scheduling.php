<div id="conditional-header">
	<a href="#" id="add_schedule">Add New Scheduled Item</a>
</div>

<div id="wrapper-obody">
<?php $this->render_component_partial("scheduling", "list_schedules"); ?>
</div>

<?php $this->render_component_partial("scheduling", "dialog_edit_schedule"); ?>