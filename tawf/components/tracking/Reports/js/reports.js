var divisions;
var userController;
var deviceController;
var scheduleController;
var organizationController;
var validator = false;
var scheduleValidator = false;
var hasReport = false;

$(function() {
    userController = new UserController();
    scheduleController = new ReportScheduleController();
    deviceController = new DeviceController();
    organizationController = new OrganizationController();

    var maskArea = $('#post-report');

    $("input:submit").button();
    $("#run-report").button();

 
    if ($("#select-report").val() != "0") {
        $("#reports-criteria").show();
        $("#reports-export").show();
    }

    var selectReportEvent = function(event){
        if ($(this).val() != "0") {
            window.location = "/reports.php?report=" + $(this).val();
        }
    };

/*    $("#select-report").change(function() {
        if ($(this).val() != "0") {
            window.location = "/reports.php?report=" + $(this).val();
        }
    });
*/
  // add/remove from http://ejohn.org/blog/flexible-javascript-events/ thanks
    var addEvent = function( obj, type, fn ) {
      if ( obj.attachEvent ) {
        obj['e'+type+fn] = fn;
        obj[type+fn] = function(){obj['e'+type+fn]( window.event );}
        obj.attachEvent( 'on'+type, obj[type+fn] );
      } else
        obj.addEventListener( type, fn, false );
    };

    addEvent($("#select-report")[0], "change", selectReportEvent);
    $("#select-report").bind("change", selectReportEvent);


$("#select-report").ufd({listMaxVisible: 14});

    // Run a call to load our divisions, groups, and drivers into the memory
    $.post("/ajax.php", {
        action:"get_report_request_information"
    }, function(data) {
        // Load in organizational data
        divisions = data.divisions;
        if ($("#all-divisions").length !== 0) {
            $("#divisionGroup,#schedule-group").append("<option value='0' data-groupId=0 data-divisionId=0>All Divisions All Groups</option>");
        }
        for (var i in data.divisions) {
            $("#divisionGroup,#schedule-group").append("<option data-division=true data-groupId=0 data-divisionId=" + data.divisions[i].CompanyDivisionID + " value='" + data.divisions[i].CompanyDivisionID + "'>" +  data.divisions[i].CompanyDivisionName + "</option>");
			
            for (var x in data.divisions[i].groups) {
                $("#divisionGroup,#schedule-group").append("<option data-group=true data-groupId=" +data.divisions[i].groups[x].CompanyGroupID + " data-divisionId=" + data.divisions[i].CompanyDivisionID + " value='" + data.divisions[i].groups[x].CompanyGroupID + "'>&nbsp;&nbsp;" + data.divisions[i].groups[x].CompanyGroupName + "</option>");
            }
        }
	
        // Load in driver data
        userController.load_data(data.users);
        deviceController.load_data(data.devices);
        organizationController.load_data(data.divisions);

        load_users_to_select("0", $("#drivers"));
        load_users_to_select("0", $("#schedule-driver"));
        load_devices_to_select($("#device"), 0, 0, 0);

        // Load schedule data
        scheduleController.load_data(data.schedules);
        load_schedules_list();

         //,#schedule-group,#schedule-driver,#schedule-device
        $("#divisionGroup").ufd();
        $("#drivers").ufd({minWidth: 120, maxWidth: 200});
        $("#device").ufd({minWidth: 120, maxWidth: 200});
    
  		
    }, "json");

    $("#run-report").click(function() {

        if (validator && !validator.form())
            return;

        $("#post-report").attr("target", "report-results-iframe");
        $("#report-output").show();
        maskArea.mask("Loading...");

        $("#report-render").val("html");
        $("#printer-friendly").val(0);
                
        $.ajax({
            type: "POST",
            url: "/ajax.php",
            data: $('#post-report').serialize(),
            success: function(html) {
                hasReport = true;
                maskArea.unmask();
                maskArea = $("#report-output");
                $("#export-pdf,#export-word,#export-excel,#print").attr('disabled', false);
                $("#report-output").html(html);
                
                // Modify the overflow property of the html that SSRS returns so scrollbars doesnt show up
                $("#oReportDiv").css('overflow', 'visible');

                $("#reports-paginate").paginate({
                    count: $("#reports-page-count").val(),
                    start: $("#page-number").val(),
                    display: 10,
                    border: false,
                    text_color: '#888',
                    background_color: '#EEE',
                    text_hover_color: 'black',
                    background_hover_color: '#CFCFCF',
                    onChange: function(pageNumber) {
                        $("#page-number").val(pageNumber);
                        $("#run-report").click();
                    }
                });


            },
            error: function(data) {
                maskArea.unmask();
                alert("There was a problem with the request.");
            }
        });
    });

    $("#export-pdf").click(function() {
        $("#post-report").attr("target", "report-results-iframe");
        $("#report-render").val("pdf");
        $("#post-report").submit();
    });

    $("#export-word").click(function() {
        $("#post-report").attr("target", "report-results-iframe");
        $("#report-render").val("word");
        $("#post-report").submit();
    });

    $("#export-excel").click(function() {
        $("#post-report").attr("target", "report-results-iframe");
        $("#report-render").val("excel");
        $("#post-report").submit();
    });

    $("#print").click(function() {
        $("#post-report").attr("target", "_blank");
        $("#report-render").val("html");
        $("#printer-friendly").val(1);
        $("#post-report").submit();
    });

    var selectDivisionGroupEvent = function() {
        // Grab the group
        var group_id = $(this).val();
        var selected = $(this).find('option:selected');
        var is_group = selected.attr('data-group');
        var is_division = selected.attr('data-division');
        var divisionId = selected.attr('data-divisionId');

        $('#group').val(0);
        $('#division').val(divisionId);
        if (is_group) {
            $('#group').val(group_id);
        }
        
        // Run a call to load our divisions, groups, and drivers into the memory
        $.post("/ajax.php", {
            action:"get_division_group_drivers",
            groupId: is_group ? group_id : 0,
            divisionId: is_division ? divisionId : 0
        }, function(data) {
            load_users_to_select($(this).val(), $("#drivers"));
        });
		load_devices_to_select($("#device"), group_id, is_group, is_division);
    };

    if ($("#divisionGroup").length > 0) {
        addEvent($("#divisionGroup")[0], "change", selectDivisionGroupEvent);
        $("#divisionGroup").bind("change", selectDivisionGroupEvent);
    }

    var selectScheduleGroupEvent = function() {
        var group_id = $(this).val();
        var selected = $(this).find('option:selected');
        var is_group = selected.attr('data-group');
        var is_division = selected.attr('data-division');
        // Reload users based on this selection
        load_devices_to_select($("#schedule-device"), group_id, is_group, is_division);
        load_users_to_select($(this).val(), $("#schedule-driver"));
    };

    if ($("#schedule-group").length > 0) {
        addEvent($("#schedule-group")[0], "change", selectScheduleGroupEvent);
        $("#schedule-group").bind("change", selectScheduleGroupEvent);
    }
    var selectedSchedule = null;

    $("#schedule-dialog").dialog({
            autoOpen: false,
            draggable: false,
            resizable: false,
            width: 700,
            modal: true,
            height: 650,
            open: function() {
                 $(this).dialog('option', 'title', 'Scheduled Report: ' + selectedSchedule.ReportName);

                 $("#schedule-custom-days").attr('checked', true);
                 $("#schedule-recipients").val(selectedSchedule.EmailRecipients);
                 $("#schedule-format").val(selectedSchedule.RenderFormat);
                 $("#schedule-hour").val(selectedSchedule.ScheduleHour);
                 $("#schedule-minute").val(selectedSchedule.ScheduleMinute);
                 $("#schedule-ampm").val(selectedSchedule.ScheduleAMPM);
                 $("#schedule-monday").attr('checked', selectedSchedule.SchedMonday);
                 $("#schedule-tuesday").attr('checked', selectedSchedule.SchedTuesday);
                 $("#schedule-wednesday").attr('checked', selectedSchedule.SchedWednesday);
                 $("#schedule-thursday").attr('checked', selectedSchedule.SchedThursday);
                 $("#schedule-friday").attr('checked', selectedSchedule.SchedFriday);
                 $("#schedule-saturday").attr('checked', selectedSchedule.SchedSaturday);
                 $("#schedule-sunday").attr('checked', selectedSchedule.SchedSunday);
                 $("#schedule-group").val(selectedSchedule.Parameters.GroupID);
                 $("#schedule-driver").val(selectedSchedule.Parameters.DriverID);
                 $("#schedule-device").val(selectedSchedule.Parameters.DeviceID);
                 //$('.ui-dialog-buttonset-left').remove();
                 
            },
            buttons: {
                    'Manage Schedules': function() {
                        var self = this;
                        $(self).dialog('close');
                        $("#schedule-list-dialog").dialog('open');

                    },
                    'Cancel': function() {
                        $(this).dialog('close');
                    },
                    'Ok': function() {
                        var self = this;

                        if (scheduleValidator && !scheduleValidator.form())
                            return;

                        //     open_edit_user_dialog(um.users[um.findUserByID(managingUser)]);
                        selectedSchedule.EmailRecipients = $("#schedule-recipients").val();
                        selectedSchedule.RenderFormat = $("#schedule-format").val();
                        selectedSchedule.ScheduleHour = $("#schedule-hour").val();
                        selectedSchedule.ScheduleMinute = $("#schedule-minute").val();
                        selectedSchedule.ScheduleAMPM = $("#schedule-ampm").val();
                        selectedSchedule.SchedMonday = $("#schedule-monday").is(':checked');
                        selectedSchedule.SchedTuesday = $("#schedule-tuesday").is(':checked');
                        selectedSchedule.SchedWednesday = $("#schedule-wednesday").is(':checked');
                        selectedSchedule.SchedThursday = $("#schedule-thursday").is(':checked');
                        selectedSchedule.SchedFriday = $("#schedule-friday").is(':checked');
                        selectedSchedule.SchedSaturday = $("#schedule-saturday").is(':checked');
                        selectedSchedule.SchedSunday = $("#schedule-sunday").is(':checked');
                        selectedSchedule.Parameters.DriverID = $("#schedule-driver").val();
                        selectedSchedule.Parameters.GroupID = $("#schedule-group").val();
                        selectedSchedule.Parameters.DeviceID = $("#schedule-device").val();

                        $("#schedule-dialog-form").mask("Saving...");

                        selectedSchedule.save(function() {
                            $("#schedule-dialog-form").unmask();
                            $(self).dialog('close');
                            $("#schedule-list-dialog").dialog('open');
                            reload_schedules();
                       });
                    }
            }
    });

    $("#schedule-list-dialog").dialog({
            autoOpen: false,
            draggable: false,
            resizable: false,
            width: 700,
            height: 650,
            modal: true,
            buttons: {
                    'Delete Selected': function() {
                        var self = this;
                        var scheduleIds = [];
                        $('#schedule-list input:checked').each(function() {
                            scheduleIds.push($(this).val());
                        });

                        if (scheduleIds.length === 0) {
                            alert('You must select at least one report schedule to delete.');
                            return false;
                        }

                        if (!confirm('Are you sure you want to delete the selected Report Schedules?'))
                            return false;

                        scheduleController.remove(scheduleIds, function() {
                           reload_schedules();
                        });
                        return false;
                    },
                    'Ok': function() {
                        var self = this;
                        selectedSchedule = new ReportSchedule();
                        selectedSchedule.ReportId = $("#report-id").val();
                        selectedSchedule.ReportName = $("#report-title").val();
                        $("#schedule-dialog").dialog('open');
                        $(self).dialog('close');
                    }
            }
    });

    // Workaround to make the first button of the dialog align left (Delete & Manage Schedules)
    $('.ui-dialog-buttonpane').prepend('<div class="ui-dialog-buttonset ui-dialog-buttonset-left"></div>');
    $("#schedule-dialog").parent().find('.ui-button').first().appendTo($("#schedule-dialog").parent().find(".ui-dialog-buttonset-left"));
    $("#schedule-list-dialog").parent().find('.ui-button').first().appendTo($("#schedule-list-dialog").parent().find(".ui-dialog-buttonset-left"));

    $("#schedule").click(function() {
        selectedSchedule = new ReportSchedule();
        selectedSchedule.ReportName = $("#report-title").val();
        selectedSchedule.ReportId = $("#report-id").val();
	$("#schedule-dialog").dialog('open');
    });

    $("body").on("click",".edit-schedule", function() {
        var schedule_id = $(this).parent().parent().attr("schedule_id");
        selectedSchedule = scheduleController.findScheduleByID(schedule_id);
        if (selectedSchedule) {
            selectedSchedule.ReportId = $("#report-id").val();
            $("#schedule-list-dialog").dialog('close');
            $("#schedule-dialog").dialog('open');
        }
        return false;
    });

    $("#schedule-custom-days").click(function() {
        $(".schedule-day").removeAttr('disabled');
    });

    $("#schedule-every-weekday").click(function() {
        $(".schedule-day").attr('disabled', true);
        $(".schedule-day").attr('checked', true);
        $("#schedule-saturday").attr('checked', false);
        $("#schedule-sunday").attr('checked', false);

    });

    scheduleValidator = $("#schedule-dialog-form").validate({
        errorContainer: $("#schedule-report-error"),
        errorLabelContainer: $("#schedule-report-error-list"),
        wrapper: "li",
        rules: {
            "schedule-recipients": "required",
            "schedule-day[]": {
                required: true,
                minlength: 1
            }
        },
        messages: {
            "schedule-recipients": "Please enter Email Recipients.<br/>",
            "schedule-day[]": "You must select at least one day of the week. <br/>"
        }
    });


});

function load_users_to_select(forGroup, selector) {
    selector.html("");
    selector.append("<option value='0'>All Drivers</option>");
    if (parseInt(forGroup) == 0) {
        for (var i in userController.users) {
            selector.append("<option value='" + userController.users[i].id + "'>" + userController.users[i].name + "</option>");
        }
    } else {
        for (var i in userController.users) {
            if (userController.users[i].group == forGroup) {
                selector.append("<option value='" + userController.users[i].id + "'>" + userController.users[i].name + "</option>");
            }
        }
    }
  	
    selector.ufd("changeOptions");
    
}

function load_devices_to_select(selector, group_id, is_group, is_division) {
    var devices = deviceController.devices;
    selector.empty();
    selector.append("<option value='0'>All Vehicles</option>");
    for (var i in devices) {
        var device = devices[i];
        if (group_id == 0 || (is_group && device.group_id == group_id) || is_division && organizationController.is_group_in_division(group_id, device.group_id)) {
            selector.append("<option value='" + device.id + "'>" + device.name + "</option>");
        }
    }
    selector.ufd("changeOptions");
}



function reload_schedules() {
    $("#schedule-container").mask("Loading...");
    scheduleController.get_schedules(function () {
        load_schedules_list();
        $("#schedule-container").unmask();
    });
}

function load_schedules_list() {
    $("#schedule-list").empty();
    for (var i in scheduleController.schedules) {
        $("#schedule-list").append(schedule_row_data(scheduleController.schedules[i]));
    }
}

function schedule_column_data(schedule) {
    var data = "";
    data += '<td><input type="checkbox" name="schedules[]" value="' + schedule.ScheduleID + '"></td>';
    data += '<td><a href="#" class="edit-schedule">' + schedule.ReportName + '</a></td>';
    data += '<td>' + schedule.LastModified + '</td>';
    data += '<td>' + schedule.NextRunTime + '</td>';
    data += '<td>' + schedule.LastRunTime + '</td>';
    data += '<td>' + schedule.LastStatus + '</td>';

    return data;
}

function schedule_row_data(schedule) {
    // Create our row
    var rowdata = "<tr schedule_id='" + schedule.id + "'>";
    rowdata += schedule_column_data(schedule);
    rowdata += "</tr>";
    return rowdata;
}