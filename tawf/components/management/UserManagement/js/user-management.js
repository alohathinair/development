var um;
var om;
var dm;
var managingUser = 0;
var defaultMapExtent, mapExtent = null;
var mc; //for map view

// Setup buttons
var btnUserCancel = function() {
	$(this).dialog('close');
};

var btnUserDelete = function() {
	// remove the data from the DB and controller
	atl.remove(editingTemplate);
	
	// Remove it from the UI
	$("a.edit-alert-template[template_id='" + editingTemplate + "']").parent().remove();
	
	editingTemplate = 0;
	
	$("#dialog-edit-alert-template").dialog('close');
};

var btnUserCreate = function() {
	// Create our new user
        var manageGroupId = DivisionGroupHelper.getSelectedGroupId($("#user-edit-manage-group"));
        var manageDivisionId = DivisionGroupHelper.getSelectedDivisionId($("#user-edit-manage-group"));
	
	var newUser = new User({
		CompanyUserID: managingUser,
		CompanyUserName: $("#user-edit-name").val(),
		CompanyUserEmail: $("#user-edit-email").val(),
		CompanyUserPassword: $("#user-edit-password").val(),
		CompanyUserAccessLevel: $("#user-edit-access-level").val(),
		CompanyGroupID: $("#user-edit-group").val(),
		CompanyUserAddress: $("#user-edit-address").val(),
		CompanyUserPhone: $("#user-edit-phone").val(),
		CompanyUserMobilePhone: $("#user-edit-mobile-phone").val(),
        CompanyManageGroupID: manageGroupId,
        CompanyManageDivisionID: manageDivisionId,
		Tags: User.tagsFromTagstring($("#user-edit-tags").val()),
		//CompanyUserTimezone: $("#user-edit-timezone").val(),
		TimezoneID: $("#user-edit-timezone").val(),
		DeviceID: $("#user-edit-device").val()
	});
	
	var diag = this;
	
	um.create(newUser, function(user, response) {
		// Update device container
		if (dm.findDeviceByUserID(user.id) != -1) {
			dm.unset_user_id(user.id);
		}
		
		if (user.device_id != 0) {
			dm.devices[dm.findDeviceByID(user.device_id)].user_id = user.id;
		}
		
		// Add it to our UI
		//$("#users-list").append(user_row_data(user));
		
		// Close the dialog
		$(diag).dialog('close');
	});
};

var btnUserEdit = function() {
	// Create our new alert template
	var arrID = um.findUserByID(managingUser);
	
	if (dm.findDeviceByUserID(managingUser) != -1) {
		dm.unset_user_id(managingUser);
	}
	if (parseInt($("#user-edit-device").val()) > 0) {
		dm.devices[dm.findDeviceByID($("#user-edit-device").val())].user_id = managingUser;
	}
	um.users[arrID].name = $("#user-edit-name").val();
	um.users[arrID].email = $("#user-edit-email").val();
	um.users[arrID].password = $("#user-edit-password").val();
	um.users[arrID].setAccessLevel($("#user-edit-access-level").val());
	um.users[arrID].group = $("#user-edit-group").val();
	um.users[arrID].address = $("#user-edit-address").val();
	um.users[arrID].phone = $("#user-edit-phone").val();
	um.users[arrID].mobilePhone = $("#user-edit-mobile-phone").val();
	um.users[arrID].tags = User.tagsFromTagstring($("#user-edit-tags").val());
	um.users[arrID].device_id = $("#user-edit-device").val();
	um.users[arrID].manageGroup =   DivisionGroupHelper.getSelectedGroupId($("#user-edit-manage-group"));
        um.users[arrID].manageDivision = DivisionGroupHelper.getSelectedDivisionId($("#user-edit-manage-group"));
	um.users[arrID].timezone = $("#user-edit-timezone").val();
	
	um.update(managingUser, function() {
		var u = um.users[um.findUserByID(managingUser)];
		// We need to regenerate our row of information since the name may of changed
		$("#users-list tr[user_id='" + u.id + "']").html(user_column_data(u));
		
		// Close the dialog
		$("#dialog-edit-user").dialog('close');
		
		open_view_user_dialog(u);
	});
};

//Setup user management UI
$(document).ready(function() {
	
	// Create our controller
	um = new UserController();
	dm = new DeviceController();
	om = new OrganizationController();
	var tz = new Array();  //controller for timezones
	var map = new Array();
		
	$('#create-user').button(); 
	
	$('body').on('click','.select_map',function() {
		$("#map-view-dialog").dialog('open');
	});
	
	// Obtain all the information needed for this page
	$.getJSON(WWW_ROOT + "/ajax.php", {
		action: "get_user_management"
	}, function(data) {
		// Fill the controllers
		um.load_data(data.users);
		om.load_data(data.organization);
		dm.load_data(data.devices);
		tz = data.timezones; //for timezones  alert(tz.toSource());
		
                defaultMapExtent = new MapExtent(data.company.CompanyDefaultMapLatitude, data.company.CompanyDefaultMapLongitude, data.company.CompanyDefaultMapZoom);

		//alert(map.toSource());
		//alert( map['CompanyDefaultMapLongitude']);
		$(".select_map").button();  //for map
		
		// Fill the list of timezones
		for (var i in tz){
			$('#user-edit-timezone').append("<option value='" + tz[i].TimezoneID + "'>" + tz[i].DisplayValue + "</option>");
		}
		
		// Fill the list of divisions
		for (var i in om.divisions) {
			for (var k in om.divisions[i].groups) {
				$("#user-edit-group").append("<option value='" + om.divisions[i].groups[k].id + "'>" + om.divisions[i].name + ": " + om.divisions[i].groups[k].name + "</option>");
			}
		}

                DivisionGroupHelper.loadSelect($("#user-edit-manage-group"), om.divisions);

		// load users html
		//load_user_list(um, "#users-list");
		
		// load devices into the select box
		for (var i in dm.devices) {
			$("#user-edit-device").append("<option value='" + dm.devices[i].id + "'>" + dm.devices[i].name + " (" + dm.devices[i].uid + ")</option>");
		}	
		
	});

    $("#users-list").kendoGrid({

        dataSource: {
            type: "json",
            serverPaging: false,
            serverSorting: false,
            pageSize: 10,
            transport: {
                read: {
                    url : WWW_ROOT + "/ajax.php?action=get_user_management_user",
                    dataType: "json"
                }
            },
            schema: { data: "data", total: "data.length" }
        },
        scrollable: true,
        sortable: true,
        selectable: "row",
        filterable: true,
        pageable: {
            refresh: true,
            pageSizes: true
        },
        columns: [
            {
                field: "CompanyUserName",
                title: "Name",
                width: 100
            }, {
                field: "CompanyUserEmail",
                title: "E-Mail Address",
                width: 130
            }, {
                field: "CompanyUserAccessLevel",
                title: "Access Level",
                width: 200
            },
            {
                field: "CompanyManageGroupID",
                title: "Division/Group",
                width: 200
            }
        ]
    });

	
	// Create the dialog to edit alert templates
	$("#dialog-edit-user").dialog({
		autoOpen: false,
		draggable: false,
		resizable: false
	});
	
	// Create the dialog to view alert templates
	$("#dialog-view-user").dialog({
		autoOpen: false,
		draggable: false,
		resizable: false,
		buttons: {
			'Close': function() {
				managingUser = 0;
				$(this).dialog('close');
			},
			'Edit': function() {
				open_edit_user_dialog(um.users[um.findUserByID(managingUser)]);
			},
			'Delete': function() {
				open_delete_user_dialog();
			}
		}
	});
	
	$("#dialog-delete-user").dialog({
		autoOpen: false,
		draggable: false,
		resizable: false,
		buttons: {
			'Yes': function() {
				// Remove the user from the ui
				$("#users-list tr[user_id='" + um.users[um.findUserByID(managingUser)].id + "']").remove();
		
				// Delete the user from our data container
				um.remove(managingUser);
				
				// Close the two dialogs
				$("#dialog-delete-user").dialog('close');
				$("#dialog-view-user").dialog('close');
				
				managingUser = 0;
				         
			},
			'No': function() {
				// Just close this box
				$(this).dialog('close');
			}
		}
	});
	
	// When they need to create a new template we need to open the 'edit' dialog, but rename it and clear it for creation purposes
	$("#create-user").click(function() {
		// Rename the dialog
		$("#dialog-edit-user").dialog('option', 'title', 'Create a New User');
		
				
		open_edit_user_dialog();
		
		return false;
	});

    $('body').on('click','.select_user',function() {
		// Open the dialog to view the user
		var user_id = $(this).parent().parent().attr("user_id");
		managingUser = user_id;
		
		open_view_user_dialog(um.users[um.findUserByID(managingUser)]);
		//getting map
		/*$.getJSON(WWW_ROOT + "/ajax.php", {
			action: "get_user_management"
		}, function(data) {
			map = data.map;
                        display_map_view(map[managingUser]);
			//display_map_view(map[managingUser]);
		});
		*/
		return false;
	});
	
	$("#user-edit-access-level").change(function() {
		var accessLevel = parseInt($(this).val());

		if (accessLevel == 5 || accessLevel == 10) {
			$("#user-edit-manage-group-fields").show();
		} else {
			$("#user-edit-manage-group-fields").hide();
		}
	
		return false;
	});


	$("#map-view-dialog").dialog({
		autoOpen: false,
		modal: true,
		width: 650,
		resizable: false,
		draggable: true,
		open: function() {
			//mc.map.checkResize();

                        // new MapPoint(contents['CompanyDefaultMapLatitude'], contents['CompanyDefaultMapLongitude']), contents['CompanyDefaultMapZoom']
                        $("#map").show();
			mc = new MapController("map", mapExtent.getPoint(), mapExtent.zoom);
			//mc.set_center(new MapPoint($("#map-latitude").val(), $("#map-longitude").val()), parseInt($("#map-zoom").val()));

		},
		buttons: {
			'Ok': function() {
                            mapExtent.lat = mc.map.getCenter().lat();
                            mapExtent.lng = mc.map.getCenter().lng();
                            mapExtent.zoom = mc.map.getZoom();

                            var arrID = um.findUserByID(managingUser);
                            um.users[arrID].setDefaultMapExtent(mapExtent);
                           // var arrID = um.findUserByID(managingUser);
                            um.update(managingUser);
                            /*
				$("#map-latitude").val(mc.map.getCenter().lat());
				$("#map-longitude").val(mc.map.getCenter().lng());
				$("#map-zoom").val(mc.map.getZoom());*/
                                $("#map").hide();
				$(this).dialog('close');
			}
		}
	});
	
	
	
});

//Display Map View for user
function display_map_view(contents){

	//end of map view
}

function load_user_list(controller, selector) {
	// Clear our selector
	$(selector).empty();
	
	
	for (var i in controller.users) {
		
		
		// Add it to the table
		$(selector).append(user_row_data(controller.users[i]));
	}
}

function user_row_data(user) {
	// Create our row
	var rowdata = "<tr user_id='" + user.id + "'>";
	rowdata += user_column_data(user);
	rowdata += "</tr>";
	
	return rowdata;
}

function user_column_data(user) {
	if (user.accessLevel == 5 || user.accessLevel == 10) {
		var division = om.getDivisionByID(user.manageDivision);
		var divisionName = (division != null) ? division.name+"/" : "Not Assigned"+"/";
	} else {
		var divisionName = "";
	}
    
	var group = om.getGroupByID(user.group);	
	var groupName = (group != null) ? group.name : "Not Assigned";

    var rowdata = "<td><a href='#' class='select_user'>" + user.name + "</a></td>";
	rowdata += "<td>" + user.email + "</td>";
	rowdata += "<td>" + user.accessLevelText + "</td>";
	rowdata += "<td>" + divisionName + groupName + "</td>";

	return rowdata;
}

function open_view_user_dialog(user) {
	var group = om.getGroupByID(user.group);
	var groupName = (group != null) ? group.name : "Not Assigned";
	mapExtent = user.getDefaultMapExtent();
        if (mapExtent.isEmpty()) {
            mapExtent = new MapExtent(defaultMapExtent.lat, defaultMapExtent.lng, defaultMapExtent.zoom);
        }
        var manageDivisionGroupName = "Not Managing a Division/Group";
        if (user.manageGroup) {
            var manageGroup = om.getGroupByID(user.manageGroup);
            if (manageGroup) {
                manageDivisionGroupName = manageGroup.name;
            }
        } else if (user.manageDivision) {
            var manageDivision = om.getDivisionByID(user.manageDivision);
            if (manageDivision) {
                manageDivisionGroupName = manageDivision.name;
            }
        }
	
	// Update view fields
	$("#view-user-name").html(user.name);
	$("#view-user-email").html(user.email);
	$("#view-user-tags").html(user.getTagstring());
	$("#test").html(user);
	
	var deviceArrID = dm.findDeviceByUserID(user.id);
	var dname = "Not Assigned";
	
	if (deviceArrID != -1) {
		dname = dm.devices[deviceArrID].name + " (" + dm.devices[deviceArrID].uid + ")";
	}
	
	$("#view-user-device").html(dname);
	$("#view-user-password").html(user.password);
	$("#view-user-access-level").html(user.accessLevelText);
	$("#view-user-group").html(groupName);
	$("#view-user-manage-group").html(manageDivisionGroupName);
	$("#view-user-address").html(user.address);
	$("#view-user-phone").html(user.phone);
	$("#view-user-mobile-phone").html(user.mobilePhone);
	
	if (user.accessLevel == 5 || user.accessLevel == 10) {
		$("#view-user-managing-group").show();
	} else {
		$("#view-user-managing-group").hide();
	}
	
	// Set dialog title and open it
	$("#dialog-view-user").dialog('option', 'title', 'Viewing User: ' + user.name);
	$("#dialog-view-user").dialog('open');
}

function open_edit_user_dialog(user) {
	if (user == undefined) {
		$("#user-edit-name").val('');
		$("#user-edit-email").val('');
		$("#user-edit-tags").val('');
		$("#user-edit-device").val(0);
		$("#user-edit-password").val('');
		$("#user-edit-access-level").val(1);
		$("#user-edit-group").val(0);
		$("#user-edit-address").val('');
		$("#user-edit-phone").val('');
		$("#user-edit-mobile-phone").val('');
		$("#user-edit-manage-group-fields").hide();
		$("#user-edit-timezone").val('-6');
		// Setup the dialogs buttons and title
		$("#dialog-edit-user").dialog('option', 'title', 'Create a New User');
		$("#dialog-edit-user").dialog('option', 'buttons', {
			'Create':btnUserCreate,
			'Cancel':btnUserCancel
		});
	} else {
		$("#user-edit-name").val(user.name);
		$("#user-edit-email").val(user.email);
		$("#user-edit-tags").val(user.getTagstring());
		
		var deviceArrID = dm.findDeviceByUserID(user.id);
		var did = 0;
		
		if (deviceArrID != -1) {
			did = dm.devices[deviceArrID].id;
		}
		
		$("#user-edit-device").val(did);
		$("#user-edit-password").val(user.password);
		$("#user-edit-access-level").val(user.accessLevel);
		$("#user-edit-group").val(user.group);
		$("#user-edit-address").val(user.address);
		$("#user-edit-phone").val(user.phone);
		$("#user-edit-mobile-phone").val(user.mobilePhone);
		$("#user-edit-timezone").val(user.timezone);
		if (user.accessLevel == 5 || user.accessLevel == 10) {
			$("#user-edit-manage-group-fields").show();
		} else {
			$("#user-edit-manage-group-fields").hide();
		}

		$("#user-edit-manage-group").val(0);
                DivisionGroupHelper.selectDivisionGroup($("#user-edit-manage-group"), user.manageDivision, user.manageGroup);
		
		// Setup the dialogs buttons and title
		$("#dialog-edit-user").dialog('option', 'title', 'Edit an Existing User');
		$("#dialog-edit-user").dialog('option', 'buttons', {
			'Save':btnUserEdit,
			'Cancel':btnUserCancel
		});
	}
	
	$("#dialog-edit-user").dialog('open');
}

function open_delete_user_dialog() {
	$("#dialog-delete-user").dialog('open');
}
