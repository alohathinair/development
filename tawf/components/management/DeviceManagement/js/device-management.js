var dm;
var um;
var pm;
var editingDevice = 0;

$(document).ready(function() {
	dm = new DeviceController();
	um = new UserController();

        $("#division-group").change(function() {
           reload_device_list();
        });

	// Get the list of devices and users
	$.get(WWW_ROOT + "/ajax.php", {
		action: "get_device_management_data"
	}, function(data) {
		dm.load_data(data.devices);
		um.load_data(data.users);
		//load_device_list();
		load_user_list();
                load_vehicle_types(data.vehicleTypes);
                load_groups(data.divisionGroups);
                load_division_tree(data.divisionTree);
	}, "json");


    $('body').on('click', '.select_device', function(){
		editingDevice = $(this).parent().parent().attr("device_id");
				
		var device = dm.devices[dm.findDeviceByID(editingDevice)];
		
		// Fill in the form fields
		$("#device-edit-name").val(device.name);
		$("#device-edit-tags").val(device.getTagstring());
		
		$("#device-edit-user").val(0); // just incase user is gone
                if (device.user_id) {
                    $("#device-edit-user").val(device.user_id);
                }

                $("#device-edit-group").val(0);
                if (device.group_id) {
                    $("#device-edit-group").val(device.group_id);
                }

                $("#device-edit-vehicleTypeID").val(0);
                if (device.vehicleTypeID) {
                    $("#device-edit-vehicleTypeID").val(device.vehicleTypeID);
                }

                $("#device-edit-serial").text(device.serial);
                $("#device-edit-vehicleMake").val(device.vehicleMake);
                $("#device-edit-vehicleModel").val(device.vehicleModel);
                $("#device-edit-vehicleYear").val(device.vehicleYear);
                $("#device-edit-vehiclePlate").val(device.vehiclePlate);
                $("#device-edit-vehicleColor").val(device.vehicleColor);
                $("#device-edit-vehicleVin").val(device.vehicleVin);
                $("#device-edit-grantNumber").val(device.grantNumber);
                $("#device-edit-granteeName").val(device.granteeName);
                $("#device-edit-activityNumber").val(device.activityNumber);
                $("#device-edit-notes").val(device.notes);
                $("#device-edit-enteredOdometer").val(device.enteredOdometer);
                $("#device-edit-enteredOdometerModified").text(device.enteredOdometerModified);
                $("#device-edit-currentOdometer").text(device.currentOdometer);
                $("#device-edit-externalIdentifier").val(device.externalIdentifier);
		
		// Open the dialog
		$("#dialog-edit-device").dialog('open');
		
		return false;
	});
	
	$("#dialog-edit-device").dialog({
		autoOpen: false,
		resizable: false,
		draggable: true,
                width: 600,
		buttons: {
			'Save': function() {
				// Update the device stuff then save it
				var arrID = dm.findDeviceByID(editingDevice);
				
				// Update container user id's and ui
				dm.unset_user_id($("#device-edit-user").val());
				
				$("tr[device_id='" + $("#device-edit-user").val() + "'] .assigned_to").html("Unassigned");
				
				dm.devices[arrID].name = $("#device-edit-name").val();
				//dm.devices[arrID].tags = Device.tagsFromTagstring($("#device-edit-tags").val());
				dm.devices[arrID].group_id = $("#device-edit-group").val();
                                dm.devices[arrID].user_id = $("#device-edit-user").val();
                                dm.devices[arrID].vehicleTypeID  = $("#device-edit-vehicleTypeID").val();
                                dm.devices[arrID].vehicleMake  = $("#device-edit-vehicleMake").val();
                                dm.devices[arrID].vehicleModel  = $("#device-edit-vehicleModel").val();
                                dm.devices[arrID].vehicleYear  = $("#device-edit-vehicleYear").val();
                                dm.devices[arrID].vehiclePlate  = $("#device-edit-vehiclePlate").val();
                                dm.devices[arrID].vehicleColor  = $("#device-edit-vehicleColor").val();
                                dm.devices[arrID].vehicleVin  = $("#device-edit-vehicleVin").val();
                                dm.devices[arrID].grantNumber  = $("#device-edit-grantNumber").val();
                                dm.devices[arrID].granteeName  = $("#device-edit-granteeName").val();
                                dm.devices[arrID].activityNumber  = $("#device-edit-activityNumber").val();
                                dm.devices[arrID].notes  = $("#device-edit-notes").val();
                                dm.devices[arrID].enteredOdometer  = $("#device-edit-enteredOdometer").val();
                                dm.devices[arrID].externalIdentifier  = $("#device-edit-externalIdentifier").val();

				dm.update(editingDevice, function(device, response) {
					reload_device_list();
				});
				
				$(this).dialog('close');
			},
			'Cancel': function() {
				$(this).dialog('close');
			}
		}
	});

    var group_id = $('#division-group').val();

    $("#grid").kendoGrid({

       dataSource: {
           type: "json",
           serverPaging: false,
           serverSorting: false,
           pageSize: 10,
           transport: { read: { url : WWW_ROOT + "/ajax.php?action=get_device_management_data_devices&group="+group_id,
               dataType: "json"}
           },
           update: {
               url:  WWW_ROOT + "/Products/Update",
               dataType: "jsonp"
           },

           parameterMap: function(options, operation) {
               if (operation !== "read" && options.models) {
                   return {models: kendo.stringify(options.models)};
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
                field: "Name",
                title: "Short Name",
                width: 100
            }, {
                field: "VehicleVIN",
                title: "VIN",
                width: 120
            }, {
                field: "Serial",
                title: "Serial #",
                width: 150
            },
            {
                field: "Driver",
                title: "Driver",
                width: 150
            },
            {
                field: "Reported",
                title: "Reported",
                width: 100
            },
            {
                field: "Odometer",
                title: "Odometer",
                width: 150
            },
            {
                command: ["edit"], title: "&nbsp;", width: "175px"
            }
            ],
            editable: "inline"

    });

});



function reload_device_list() {
    var group_id = $('#division-group').val();

    // Get the list of devices and users
    $.get(WWW_ROOT + "/ajax.php", {
            action: "get_device_management_data",
            group: group_id
    }, function(data) {
            dm.load_data(data.devices);
          //  load_device_list();
    }, "json");

}

function load_vehicle_types(vehicleTypes) {
    $("#device-edit-vehicleTypeID").empty();
    $("#device-edit-vehicleTypeID").append("<option value='0'>Unknown</option>");
    for (var i in vehicleTypes) {
        var vehicleType = vehicleTypes[i];
        $("#device-edit-vehicleTypeID").append("<option value='" + vehicleType.VehicleTypeID + "'>" + vehicleType.Type + "</option>");
    }    
}

function load_groups(groups) {
    element = $("#device-edit-group");
    for (var i in groups) {
        var group = groups[i];
        element.append("<option value='" + group.CompanyGroupID + "'>" + group.CompanyGroupName + "</option>");
    }
}

function load_division_tree(tree) {
    element = $("#division-group");
    for (var i in tree) {
        var division = tree[i];
        element.append("<option value='" + division.CompanyDivisionID + "'>" + division.CompanyDivisionName + "</option>");
        for (var j in division.groups) {
            var group = division.groups[j];
            var key = division.CompanyDivisionID + '|' + group.CompanyGroupID;
            element.append("<option value='" + key + "'>&nbsp;&nbsp;&nbsp;" + group.CompanyGroupName + "</option>");
        }
    }
}


function load_device_list() {

   /* $("#device-list").empty();
    console.log('dm.devices '+dm.devices);
    for (var i in dm.devices) {
        $("#device-list").append(device_row_data(dm.devices[i]));
    }*/
  //  $("#grid").data("kendoGrid")
   /* $.get(WWW_ROOT + "/ajax.php", {
        action: "get_device_management_data",
        group: group_id*/



    /*$(function() {
        $("#grid").kendoGrid({
            dataSource: {
                transport: dm.devices,
                schema: {
                    data: "data"
                }
            },
            columns: [
                {
                    field: "Name",
                    title: "Short Name",
                    width: 100
                }, {
                    field: "VehicleVIN",
                    title: "VIN",
                    width: 130
                }, {
                    field: "Serial",
                    title: "Serial #",
                    width: 200
                },
                {
                    field: "Driver",
                    title: "Driver",
                    width: 200
                },
                {
                    field: "Reported",
                    title: "Reported",
                    width: 200
                },
                {
                    field: "Odometer",
                    title: "Odometer",
                    width: 200
                }
            ]
        });
    });*/





}

function load_user_list() {
	for (var i in um.users) {
		$("#device-edit-user").append("<option value='" + um.users[i].id + "'>" + um.users[i].name + "</option>");
	}
}

function device_row_data(device) {
	// Create our row
	var rowdata = "<tr device_id='" + device.id + "'>";
	rowdata += device_column_data(device);
	rowdata += "</tr>";
	
	return rowdata;
}

function device_column_data(device) {
	var user = um.findUserByID(device.user_id);
	var userName = (user != -1) ? um.users[user].name : "Unassigned"; 
	
	/*var rowdata = "<td>" + device.uid + "</td>";*/
        var rowdata = '';
	rowdata += "<td><a href='#' class='select_device'>" + device.name + "</a></td>";
	rowdata += "<td class='assigned_to'>" + (device.vehicleVin ? device.vehicleVin : '') + "</td>";
	rowdata += "<td class='assigned_to'>" +  device.serial + "</td>";
	//rowdata += "<td class='assigned_to'>" + (device.groupName?device.groupName:'') + "</td>";
        rowdata += "<td class='assigned_to'>" + (device.driverName?device.driverName:'') + "</td>";
	rowdata += "<td class='assigned_to'>" + (device.reported?device.reported:'') + "</td>";
        rowdata += "<td class='assigned_to'>" + (device.currentOdometer?device.currentOdometer:'') + "</td>";
	
	return rowdata;
}

