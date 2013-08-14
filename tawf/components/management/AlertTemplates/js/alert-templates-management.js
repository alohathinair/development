var atl;
var editingTemplate = 0; // Used to identify which template is being edited after it is selected

// Since we have one dialog for creating and editing we need to create buttons for the individual dialogs
var btnCancel = function() {
	$("#dialog-edit-alert-template").dialog('close');
};

var btnDelete = function() {
	// remove the data from the DB and controller
	atl.remove(editingTemplate);
	
	// Remove it from the UI
	$("a.edit-alert-template[template_id='" + editingTemplate + "']").parent().remove();
	
	editingTemplate = 0;
	
	$("#dialog-edit-alert-template").dialog('close');
};

var btnCreate = function() {
	// Create our new alert template
	var newTemplate = new AlertTemplate({
		AlertTemplateID:0,
		AlertTemplateName:$("#alert-template-name").val(),
		EmailSubject:$("#alert-template-email-subject").val(),
		EmailMessage:$("#alert-template-email-message").val(),
		SMSMessage:$("#alert-template-sms").val(),
		VoiceMessage:$("#alert-template-voice-message").val()
	});
	
	atl.create(newTemplate, function(template, response) {
		// Add it to our UI
		add_alert_template_to_list(template);
		//alert(template.id);
		// Close the dialog
		$("#dialog-edit-alert-template").dialog('close');
	});
};

var btnEdit = function() {
	// Create our new alert template
	var arrID = atl.findAlertTemplateByID(editingTemplate);
	
	atl.templates[arrID].name = $("#alert-template-name").val();
	atl.templates[arrID].emailSubject = $("#alert-template-email-subject").val();
	atl.templates[arrID].emailMessage = $("#alert-template-email-message").val();
	atl.templates[arrID].SMSMessage = $("#alert-template-sms").val();
	atl.templates[arrID].voiceMessage = $("#alert-template-voice-message").val();
	
	atl.update(editingTemplate, function() {
		// We need to regenerate our row of information since the name may of changed
		$("a.edit-alert-template[template_id='" + editingTemplate + "']").parent().html(create_alert_template_list_row(atl.templates[atl.findAlertTemplateByID(editingTemplate)]));
		
		// Our template is now saved in the system; mark that we are no longer editing a template
		editingTemplate = 0;
		
		// Close the dialog
		$("#dialog-edit-alert-template").dialog('close');
	});
};

// Setup alert template UI
$(document).ready(function() {
	// Create our controller
	atl = new AlertTemplateController();
	
	// Obtain our alert list
	atl.get_alert_templates(function() {
		for (var i in atl.templates) {
			add_alert_template_to_list(atl.templates[i]);
		}
	});
	
	// Create the dialog to edit alert templates
	$("#dialog-edit-alert-template").dialog({
		autoOpen: false,
		modal: true,
		draggable: false,
		resizable: false,
		width: 750
	});
	
	// Create the dialog to view alert templates
	$("#dialog-view-alert-template").dialog({
		autoOpen: false,
		modal: true,
		draggable: false,
		resizable: false,
		width: 750
	});

        $("#create-alert-template").button();
        
	// When they need to create a new template we need to open the 'edit' dialog, but rename it and clear it for creation purposes
	$("#create-alert-template").click(function() {
		// Rename the dialog
		$("#dialog-edit-alert-template").dialog('option', 'title', 'Create a New Alert Template');
		
		// Setup the dialogs buttons
		$("#dialog-edit-alert-template").dialog('option', 'buttons', {
			'Create':btnCreate,
			'Cancel':btnCancel
		});
				
		// Empty the dialog fields incase anything was in it previously
		$("#alert-template-name").val('');
		
		$("#alert-template-email-subject").val('');
		$("#alert-template-email-message").val('');
		
		$("#alert-template-sms").val('');
		
		$("#alert-template-voice-message").val('');
		
		// Show our dialog
		$("#dialog-edit-alert-template").dialog('open');
	});
	
	// Tabulate our alert templates info
	$("#dialog-edit-alert-template-tabs").tabs();
	$("#dialog-view-alert-template-tabs").tabs();
	
	// When they need to view / edit template information we open up a dialog to display it
	$("body").on("click", ".edit-alert-template", function(){
		// Here we open the dialog to edit an alert template. We know which template it is by reading the array_id attribute
		editingTemplate = $(this).attr("template_id");
		
		var template = atl.templates[atl.findAlertTemplateByID(editingTemplate)]; 
		
		// Rename the dialog
		$("#dialog-edit-alert-template").dialog('option', 'title', 'Editing Alert Template: ' + template.name);
		
		// Setup the dialogs buttons
		$("#dialog-edit-alert-template").dialog('option', 'buttons', {
			'Update':btnEdit,
			'Cancel':btnCancel,
			'Delete':btnDelete
		});
		
		// Now fill in our data
		$("#alert-template-name").val(template.name);
		
		$("#alert-template-email-subject").val(template.emailSubject);
		$("#alert-template-email-message").val(template.emailMessage);
		
		$("#alert-template-sms").val(template.SMSMessage);
		
		$("#alert-template-voice-message").val(template.voiceMessage);
		
		// Show our dialog
		$("#dialog-edit-alert-template").dialog('open');
		
		return false;
	});
	
	$("body").on("click", ".view-alert-template", function(){
		// Here we open the dialog to edit an alert template. We know which template it is by reading the array_id attribute

		var template = atl.templates[atl.findAlertTemplateByID($(this).attr("template_id"))]; 
		
		// Rename the dialog
		$("#dialog-view-alert-template").dialog('option', 'title', 'View Alert Template: ' + template.name);
		
		// Setup the dialogs buttons
		$("#dialog-edit-alert-template").dialog('option', 'buttons', {
			'Update':btnEdit,
			'Cancel':btnCancel,
			'Delete':btnDelete
		});
		
		// Now fill in our data
		$("#view-alert-template-name").html(template.name);
		
		$("#view-alert-template-email-subject").html(template.emailSubject);
		$("#view-alert-template-email-message").html(template.emailMessage);
		
		$("#view-alert-template-sms").html(template.SMSMessage);
		
		$("#view-alert-template-voice-message").html(template.voiceMessage);
		
		// Show our dialog
		$("#dialog-view-alert-template").dialog('open');
		
		return false;
	});
});

// Helper methods for managing the UI
function add_alert_template_to_list(template) {
	$("#alert-template-list").append(create_alert_template_list_row(template));
}

function create_alert_template_list_row(template) {
	// Determine if this is a system template or not
	var klass = "edit-alert-template";
	
	if (template.company_id == 0) {
		klass = "view-alert-template";
	}
	
	// Create our row
	var rowdata = "<li><a href='#' class='" + klass + "' template_id='" + template.id + "'>";
	rowdata += template.name;
	rowdata += "</a></li>";
	
	return rowdata;
}