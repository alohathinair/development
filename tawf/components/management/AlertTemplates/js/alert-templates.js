function AlertTemplateController() {
	this.templates = [];
	
	this.get_alert_templates = function(callback) {
		
		var currentController = this;
		
		$.getJSON(WWW_ROOT + "/ajax.php", {
			action: "get_alert_templates"
		}, function(data) {
			currentController.load_data(data.templates);
			callback();
		});
	};
	
	this.load_data = function(templates) {
		for (var i in templates) {
			this.templates.push(new AlertTemplate(templates[i]));
		}
	};
	
	this.findAlertTemplateByID = function(id) {
		for (var i in this.templates) {
			if (this.templates[i].id == id) {
				return i;
			}
		}
		
		return -1;
	};
	
	// Creates a template and stores it in our controller
	this.create = function(template, callback) {
		var currentController = this;
		template.save(function(newTemplate, response) {
			currentController.templates.push(newTemplate);
			callback(newTemplate, response);
		});
	};
	
	// Updates selected template 
	this.update = function(template_id, callback) {
		var template_array_id = this.findAlertTemplateByID(template_id);
		var currentController = this;
		
		this.templates[template_array_id].save(function(template, response) {
			currentController.templates[template_array_id] = template;
			callback(template, response);
		});
	};
	
	// Removes the selected template
	this.remove = function(template_id, callback) {
		var arrID = this.findAlertTemplateByID(template_id);
		
		// Send the removal signal
		this.templates[arrID].remove(callback);
		
		// remove it from our container
		this.templates.splice(arrID, 1);
		
		
	};
}

function AlertTemplate(conf) {
	this.id = conf.AlertTemplateID;
	this.name = conf.AlertTemplateName;
	this.company_id = conf.CompanyID;
	this.emailSubject = conf.EmailSubject;
	this.emailMessage = conf.EmailMessage;
	this.SMSMessage = conf.SMSMessage;
	this.voiceMessage = conf.VoiceMessage;
	
	this.save = function(callback) {
		var template = this;
		
		$.post(WWW_ROOT + "/ajax.php", {
			action: "save_alert_template",
			AlertTemplateID: this.id,
			AlertTemplateName: this.name,
			EmailSubject: this.emailSubject,
			EmailMessage: this.emailMessage,
			SMSMessage: this.SMSMessage,
			VoiceMessage: this.voiceMessage
		}, function(data) {
			// if this templates ID isn't set, set it
			if (template.id == 0) {
				template.id = data.alertTemplate.AlertTemplateID;
			}
			
			// run our callback
			callback(template, data.response);
		}, "json");
	};
	
	this.remove = function(callback) {
		$.post(WWW_ROOT + "/ajax.php", {
			action: "delete_alert_template",
			AlertTemplateID: this.id
		}, function(data) {
			// run our callback
			callback(data.response);
		}, "json");
	};
}