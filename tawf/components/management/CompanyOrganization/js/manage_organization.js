var om;

// Load divisions
$(document).ready(function() {
	om = new OrganizationController();
	
	om.get_organization(function() {
		var html = "";
        console.log(' in manage ');
		for (var i in om.divisions) {
			var division = om.divisions[i]
			
			
			var groupHTML = "";
			if (division.groups.length > 0) {
				for (var k in division.groups) {
					groupHTML += getGroupRow(division.groups[k], false);
				}
			}
			
			html += getDivisionRow(division, false, groupHTML);
			
			html += "</li>";
		}
		
		$("#division-list").html(html);

		$("#division-list").treeview({collapsed: true});
	});
	
    $("#add-new-division").button();

	// Division CRUD functions
	$("#add-new-division").click(function() {
		om.add_division(function(division) {
			var branch = $(getDivisionRow(division, true, "")).appendTo("#division-list");
			$("#division-list").treeview({add: branch});
		});
		
		return false;
	});
	
	$("a.edit-division").live("click", function() {
		// Hide the text and show the input box
		var division_id = $(this).attr("division_id");
		
		$("li[division_id='" + division_id + "'] span.division-list-text").hide();
		$("li[division_id='" + division_id + "'] span.division-list-input").show();

		return false;
	});
	
	$("a.rename-division").live("click", function() {
		var division_id = $(this).parent().parent().parent().attr("division_id");

		var arrID = om.findDivisionByID(division_id);
		var division_name = $(this).prev().val();
		
		// Adjust UI Components
		$(this).parent().hide();
		$("li[division_id='" + division_id + "'] span.division-list-text").html(division_name);
		$("li[division_id='" + division_id + "'] span.division-list-text").show();

		// Update JS containers
		om.divisions[arrID].name = division_name;

		// Save on the Database
		om.update_division(division_id);
		

		
		return false;
	});
	
	$("a.delete-division").live("click", function() {
		var division_id = $(this).attr("division_id");

		// Hide UI components
		$("li[division_id='" + division_id + "']").hide();

		// Delete from JS container & DB
		om.delete_division(division_id);

		return false;
	});
	
	// Group CRUD functions
	$(".new-group").live("click", function() {
		var division_id = $(this).attr("division_id");
		
		om.add_group(division_id, function(group) {
			var branch = $(getGroupRow(group, true)).appendTo("#division-list-" + division_id);
			$("#division-list").treeview({add: branch});
		});
		
		return false;
	});
	
	$("a.edit-group").live("click", function() {
		// Hide the text and show the input box
		var group_id = $(this).attr("group_id");
		
		$("li[group_id='" + group_id + "'] span.group-list-text").hide();
		$("li[group_id='" + group_id + "'] span.group-list-input").show();

		return false;
	});
	
	$("a.rename-group").live("click", function() {
		var group_id = $(this).parent().parent().parent().attr("group_id");

		var arrIDs = om.findGroupByID(group_id);
		
		var group_name = $(this).prev().val();
		// Adjust UI Components
		$(this).parent().hide();
		$("li[group_id='" + group_id + "'] span.group-list-text").html(group_name);
		$("li[group_id='" + group_id + "'] span.group-list-text").show();

		// Update JS containers
		om.divisions[arrIDs.division].groups[arrIDs.group].name = group_name;

		// Save on the Database
		om.update_group(group_id);
		
		
		
		return false;
	});
	
	$("a.delete-group").live("click", function() {
		var group_id = $(this).attr("group_id");
		
		// Hide UI components
		$("li[group_id='" + group_id + "']").hide();
		// Delete from JS container and DB
		om.delete_group(group_id);
		
		
		// Delete from DB
		return false;
	});
	
	$("#delete-division").click(function() {
		// Make sure there are more
		if (divisions.length < 2) {
			$("#error-dialog").html("Cannot delete this division because you must have at least one");
			$("#error-dialog").dialog('open');
			return;
		}
		
		var arrID = om.findDivisionByID($("#division-list").val());
		
		if (divisions[arrID].groups.length > 0) {
			$("#error-dialog").html("Cannot delete this division because you have groups assigned to it. Please remove all the groups first.");
			$("#error-dialog").dialog('open');
			return;
		}
		
		
		// We should add customization about where to move operators out of this division
		
		// Remove from UI and javascript objects
		
		destinations.splice(arrID, 1);
		$("#division-list option[value='" + $("#division-list").val() + "']").empty();
		
		// Delete from database
	});
});

function getDivisionRow(division, showInput, groupHTML) {


	var html = "<li division_id='" + division.id + "' class='closed'><div style='float: left;'>";
	
	if (showInput == false) {
		html += "<span class='division-list-text'>" + division.name + "</span><span class='division-list-input hidden'><input value=\"" + division.name + "\"> <a href='#' class='rename-division'>Save</a></span>";
	} else {
		html += "<span class='division-list-text hidden'>" + division.name + "</span><span class='division-list-input'><input value=\"" + division.name + "\"> <a href='#' class='rename-division'>Save</a></span>";
	}
	html += "</div><div style='margin-left: 500px'><a href='#' division_id='" + division.id + "' class='new-group'><img src='http://" + TAWF_HOST + "/components/management/CompanyOrganization/images/ico-group.png'></a> <a href='#' division_id='" + division.id + "' class='edit-division'><img src='http://" + TAWF_HOST + "/components/management/CompanyOrganization/images/ico-edit.png'></a> <a href='#' division_id='" + division.id + "' class='delete-division'><img src='http://" + TAWF_HOST + "/components/management/CompanyOrganization/images/ico-delete.png'></a></div><ul id='division-list-" + division.id + "'>" + groupHTML + "</ul></li>";
	
	return html;
}

function getGroupRow(group, showInput) {

	var html = "<li group_id='" + group.id + "' class='closed'><div style='float: left;'>";
	
	if (showInput == false) {
		html += "<span class='group-list-text'>" + group.name + "</span><span class='group-list-input hidden'><input value=\"" + group.name + "\"> <a href='#' class='rename-group'>Save</a></span>";
	} else {
		html += "<span class='group-list-text hidden'>" + group.name + "</span><span class='group-list-input'><input value=\"" + group.name + "\"> <a href='#' class='rename-group'>Save</a></span>";
	}
	html += "</div><div style='margin-left: 500px'><a href='#' group_id='" + group.id + "' class='edit-group'><img src='http://" + TAWF_HOST + "/components/management/CompanyOrganization/images/ico-edit.png'></a> <a href='#' group_id='" + group.id + "' class='delete-group'><img src='http://" + TAWF_HOST + "/components/management/CompanyOrganization/images/ico-delete.png'></a></div></li>";
	
	return html;
}