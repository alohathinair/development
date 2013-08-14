var managingRule = 0;
var rc;
var um;
var tm;
var lc;
$(document).ready(function() {
	rc = new AlertRuleController();
	um = new UserController();
	tm = new AlertTemplateController();
	lc = new LandmarkController();
        oc = new OrganizationController();
	
	lc.get_general_landmarks(function() {
		for (var i in lc.landmarks) {
			var landmark = lc.landmarks[i];
			$("#alert-rule-data").append("<option value='" + landmark.name + "'>" + landmark.name + "</option>");
		}
	});
	
	var btnAlertRuleSave = function() {
		
		if (managingRule == 0) {
			rc.create(new AlertRule({
				AlertRuleID: 0,
				AlertTemplateID: parseInt($("#alert-rule-template").val()),
				CompanyUserID: parseInt($("#alert-rule-recipient").val()),
				AlertRuleData: $("#alert-rule-data").val(),
				ActionEventTypeID: parseInt($("#alert-rule-type").val()),
				DeliveryMethodID: parseInt($("#alert-rule-delivery-method").val()),
				IsAllDay: ($("#alert-rule-dialog-is-all-day").attr("checked")) ? 1 : 0,
				StartTime: $("#alert-rule-start-hour").val() + ":" + $("#alert-rule-start-minute").val() + " " + $("#alert-rule-start-meridian").val(),
				EndTime: $("#alert-rule-end-hour").val() + ":" + $("#alert-rule-end-minute").val() + " " + $("#alert-rule-end-meridian").val(),
				DivisionId: DivisionGroupHelper.getSelectedDivisionId($("#alert-rule-group")),
                GroupId: DivisionGroupHelper.getSelectedGroupId($("#alert-rule-group"))
			}), function(rule) {
				
				$("#alert-rules-list").append("<li><a href='#' class='edit-alert-rule' rule_id='" + rule.id + "'>" + rule.getRuleDescription(um) + "</a></li>");
			});
		} else {
			var arrID = rc.findAlertRuleByID(managingRule);
			rc.rules[arrID].template_id = parseInt($("#alert-rule-template").val());
			rc.rules[arrID].user_id = parseInt($("#alert-rule-recipient").val());
			rc.rules[arrID].data = $.trim($("#alert-rule-data").val());
			rc.rules[arrID].event_type_id = parseInt($("#alert-rule-type").val());
			rc.rules[arrID].delivery_method = parseInt($("#alert-rule-delivery-method").val());
			rc.rules[arrID].is_all_day = ($("#alert-rule-dialog-is-all-day").attr("checked")) ? 1 : 0;
			rc.rules[arrID].start_time = $("#alert-rule-start-hour").val() + ":" + $("#alert-rule-start-minute").val() + " " + $("#alert-rule-start-meridian").val();
			rc.rules[arrID].end_time = $("#alert-rule-end-hour").val() + ":" + $("#alert-rule-end-minute").val() + " " + $("#alert-rule-end-meridian").val();
			rc.rules[arrID].division_id = DivisionGroupHelper.getSelectedDivisionId($("#alert-rule-group"));
                        rc.rules[arrID].group_id = DivisionGroupHelper.getSelectedGroupId($("#alert-rule-group"));

			rc.update(managingRule, function(rule) {
				$("#alert-rules-list > li > a[rule_id='" + rule.id + "']").html(rule.getRuleDescription(um));
			});
		}

		$("#alert-rule-dialog").dialog('close');
	};
	
	var btnAlertRuleDelete = function() {
		rc.remove(managingRule);
		
		// Update UI
		$("#alert-rules-list > li > a[rule_id='" + managingRule + "']").parent().remove();
		
		managingRule = 0;
		
		// Hide the dialog
		$("#alert-rule-dialog").dialog('close');
	};
	
	var btnAlertRuleCancel = function() {
		$("#alert-rule-dialog").dialog('close');
	};
        
	$("#new-alert-rule").button({
            icons: {
                primary: "new-alert-rule-icon"
            }});

	$("#new-alert-rule").click(function() {
		// Configure Options
		$("#alert-rule-dialog").dialog('option', 'title', 'New Alert Rule');
		$("#alert-rule-dialog").dialog('option', 'buttons', {
			'Save': btnAlertRuleSave,
			'Cancel': btnAlertRuleCancel
		});
		
		// Reset values
		$("#alert-rule-type").val(0);
		$("#alert-rule-data").val('');
		$("#alert-rule-recipient").val(0);
		$("#alert-rule-template").val(0);
		$("#alert-rule-delivery-method").val(1);
		$("#alert-rule-dialog-is-all-day").attr("checked", "checked");
		$("#alert-rule-dialog-time").css("visibility", "hidden");
		
		$("#alert-rule-start-hour").val(12);
		$("#alert-rule-end-hour").val(12);
		$("#alert-rule-start-minute").val('00');
		$("#alert-rule-end-minute").val('00');
		$("#alert-rule-start-meridian").val('am');
		$("#alert-rule-end-meridian").val('am');
                $("#alert-rule-end-group").val(0);
		
		$("#alert-rule-dialog").dialog('open');
		return false;
	});
	
	$("#alert-rule-dialog").dialog({
		autoOpen: false,
		draggable: true,
		resizable: false,
		width: 600,
		close: function() {
			managingRule = 0;
		}
		
	});
	
	$("body").on("click",".edit-alert-rule", function() {
		managingRule = $(this).attr("rule_id");
		
		var arrID = rc.findAlertRuleByID(managingRule);
		// Configure Options
		$("#alert-rule-dialog").dialog('option', 'title', 'Edit Alert Rule');
		$("#alert-rule-dialog").dialog('option', 'buttons', {
			'Save': btnAlertRuleSave,
			'Delete': btnAlertRuleDelete,
			'Cancel': btnAlertRuleCancel
		});
		
		// Set values
		$("#alert-rule-type").val(rc.rules[arrID].event_type_id);
		$("#alert-rule-data").val(rc.rules[arrID].data);
		$("#alert-rule-recipient").val(rc.rules[arrID].user_id);
		$("#alert-rule-template").val(rc.rules[arrID].template_id);
		$("#alert-rule-delivery-method").val(rc.rules[arrID].delivery_method);
		
		switch (rc.rules[arrID].event_type_id) {
			case 1:
			case 2:
				$("#alert-rule-data-fieldset").show();
				$("#alert-rule-data-label").html("Destination Name (Blank for all destinations)");
				break;
			default:
				$("#alert-rule-data-fieldset").hide();
				break;
		}
		
		if (rc.rules[arrID].is_all_day == 0) {
			$("#alert-rule-dialog-is-all-day").attr("checked", false);
			$("#alert-rule-dialog-time").css("visibility", "visible");	
		} else {
			$("#alert-rule-dialog-is-all-day").attr("checked", "checked");
			$("#alert-rule-dialog-time").css("visibility", "hidden");
		}
		
		$("#alert-rule-start-hour").val(rc.rules[arrID].start_time.substr(0,2));
		$("#alert-rule-end-hour").val(rc.rules[arrID].end_time.substr(0,2));
		$("#alert-rule-start-minute").val(rc.rules[arrID].start_time.substr(3,2));
		$("#alert-rule-end-minute").val(rc.rules[arrID].end_time.substr(3,2));
		$("#alert-rule-start-meridian").val(rc.rules[arrID].start_time.substr(6,2));
		$("#alert-rule-end-meridian").val(rc.rules[arrID].end_time.substr(6,2));

                DivisionGroupHelper.selectDivisionGroup($("#alert-rule-group"), rc.rules[arrID].division_id, rc.rules[arrID].group_id);
		
		$("#alert-rule-dialog").dialog('open');
		return false;
	});
	
	$("#alert-rule-dialog-is-all-day").click(function() {
		if ($(this).attr("checked") == true) {
			$("#alert-rule-dialog-time").css("visibility", "hidden");
		} else {
			$("#alert-rule-dialog-time").css("visibility", "visible");
		}
	});
	
	$("#alert-rule-type").change(function() {
		// We need to check if we should show the extra-info box
		switch (parseInt($(this).val())) {
			case 1:
			case 2:
				$("#alert-rule-data-fieldset").show();
				$("#alert-rule-data-label").html("Destination Name (Blank for all destinations)");
				break;
			default:
				$("#alert-rule-data-fieldset").hide();
				break;
		}
	});
	
	$.getJSON(WWW_ROOT + "/ajax.php", {
		"action":"get_alert_rules_page_data"
	}, function(data) {

                eventTypeController.load_data(data.eventTypes);
                $("#alert-rule-type").empty();
                $("#alert-rule-type").append("<option value='0'>Any Event</option>");
                for (var i in eventTypeController.eventTypes) {
			// Add to interface
			$("#alert-rule-type").append("<option value='" +  eventTypeController.eventTypes[i].id + "'>" +  eventTypeController.eventTypes[i].name + "</option>");
		}
            
		um.load_data(data.users);
                oc.load_data(data.divisions);
		
		for (var i in um.users) {
			
			// Populate the select box in the dialog
			$("#alert-rule-recipient").append("<option value='" + um.users[i].id + "'>" + um.users[i].name + "</option>");
		}
		
		rc.load_data(data.rules);
		
		for (var i in rc.rules) {

			// Add to interface
			$("#alert-rules-list").append("<li><a href='#' class='edit-alert-rule' rule_id='" + rc.rules[i].id + "'>" + rc.rules[i].getRuleDescription(um) + "</a></li>");
		}
		
		tm.load_data(data.templates);
		
		for (var i in tm.templates) {
			// Add to interface
			$("#alert-rule-template").append("<option value='" + tm.templates[i].id + "'>" + tm.templates[i].name + "</option>");
		}

   				if ($("#all-divisions").length !== 0) {
                	$("#alert-rule-group").append("<option value='0'>All Divisions All Groups</option>");
                }
                DivisionGroupHelper.loadSelect($("#alert-rule-group"), oc.divisions);

		
	});
	
});