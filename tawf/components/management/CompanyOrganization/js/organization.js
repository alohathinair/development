function OrganizationController() {
	this.divisions = [];
	
	this.get_organization = function(callback) {
        console.log(' in get org ');
		var currentController = this;

       /* dataSource: {
            type: "data",
                transport:{
                read:  WWW_ROOT + "/ajax.php?action=get_device_management_data_new&group="+group_id,
                    dataType: "json"
            },
            schema: {
                data: "data"
            },
            pageSize: 30
        },*/

/*
        homogeneous = new kendo.data.HierarchicalDataSource({
            transport:{
                    read:  WWW_ROOT + "/ajax.php?action=get_company_organization",
                    dataType: "json"
            },
            schema: {
                model: {
                    id: "CompanyDivisionID",
                    hasChildren: "HasGroups"
                }
            }
        });

        $("#treeview").kendoTreeView({
            dataSource: homogeneous,
            dataTextField: "CompanyDivisionName"
        });*/

        var inline = new kendo.data.HierarchicalDataSource({
            data: [
                { categoryName: "Storage", subCategories: [
                    { subCategoryName: "Wall Shelving" },
                    { subCategoryName: "Floor Shelving" },
                    { subCategoryName: "Kids Storage" }
                ] },
                { categoryName: "Lights", subCategories: [
                    { subCategoryName: "Ceiling" },
                    { subCategoryName: "Table" },
                    { subCategoryName: "Floor" }
                ] }
            ],
            schema: {
                model: {
                    children: "subCategories"
                }
            }
        });

        jQuery("#treeview1").kendoTreeView({
            dataSource: inline,
            dataTextField: [ "categoryName", "subCategoryName" ]
        });

		
		/*$.getJSON(WWW_ROOT + "/ajax.php", {
			action: "get_company_organization"
		}, function(data) {
			currentController.load_data(data.organization);
			callback();
		});*/






	};
	
	this.load_data = function(divisions) {
        console.log(' Divisions === '+divisions.toSource());
		for (var i in divisions) {
			this.divisions.push(new Division(divisions[i]));
		}
       // console.log(' this.divisions Divisions === '+this.divisions.toSource());
	};
	
	this.findDivisionByID = function(id) {
		for (var i in this.divisions) {
			if (this.divisions[i].id == id) {
				return i;
			}
		}
		
		return -1;
	};

	this.getDivisionByID = function(id) {
            var index = this.findDivisionByID(id);
            return this.divisions[index];
	};

	this.getGroupByID = function(id) {
		for (var i in this.divisions) {
			for (var k in this.divisions[i].groups) {
				if (id == this.divisions[i].groups[k].id) {
					return this.divisions[i].groups[k];
				}
			}
		}
		
		return null;
	};
	
	// Returns an object with the division and group array ids
	this.findGroupByID = function(id) {
		for (var i in this.divisions) {
			for (var k in this.divisions[i].groups) {
				if (id == this.divisions[i].groups[k].id) {
					return {division: i, group: k};
				}
			}
		}
		
		return null;
	};
	
	this.add_division = function(callback) {
		var newDiv = new Division({
			CompanyDivisionID: 0,
			CompanyDivisionName: "New Division"
		});
		
		var currentController = this;
		
		newDiv.save(function(response) {
			currentController.divisions.push(newDiv);
			if (callback) {
				callback(newDiv, response);
			}
		});
	};

       this.is_group_in_division = function(division_id, group_id) {
            var divisionIndex = this.findDivisionByID(division_id);
            var division = this.divisions[divisionIndex];
            for (var i in division.groups) {
                if (division.groups[i].id == group_id) {
                    return true;
                }
            }
            return false;
        };

	this.update_division = function(division_id, callback) {
		var d = this.divisions[this.findDivisionByID(division_id)];
		
		d.save(callback);
	};
	
	this.delete_division = function(division_id) {
		var arrID = this.findDivisionByID(division_id);
		
		$.get(WWW_ROOT + "/ajax.php", {
			"action":"delete_division",
			"division_id":this.divisions[arrID].id
		});
		
		this.divisions.splice(arrID, 1);
	};
	
	this.add_group = function(division_id, callback) {
		var arrID = this.findDivisionByID(division_id);
		
		var groupArrID = this.divisions[arrID].add_group(new Group({
			CompanyGroupID: 0,
			CompanyDivisionID: division_id,
			CompanyGroupName: "New Group"
		}));
		
		var currentController = this;
		
		this.divisions[arrID].groups[groupArrID].save(callback);
		
		/*
		
		$.getJSON(WWW_ROOT + "/ajax.php", {
			"action":"add_group",
			"division_id": division_id,
			"group_name":this.divisions[arrID].groups[groupArrID].name
		}, function(data) {
			currentController.divisions[arrID].groups[groupArrID].id = data.group.id; 
			callback(currentController.divisions[arrID].groups[groupArrID]);
		});*/
		
	};
	
	this.update_group = function(group_id, callback) {
		var locs = this.findGroupByID(group_id);
		
		this.divisions[locs.division].groups[locs.group].save(callback);
		
	};
	
	this.delete_group = function(group_id) {
		// Get rid of the group
		var locs = this.findGroupByID(group_id);
		this.divisions[locs.division].groups.splice(locs.group, 1);
		
		$.get(WWW_ROOT + "/ajax.php", {
			"action":"delete_group",
			"group_id":group_id
		});

	};
}

function Division(conf) {
	this.id = conf.CompanyDivisionID;
	this.name = conf.CompanyDivisionName;
	
	this.groups = [];
	
	for (var i in conf.groups) {
		this.groups.push(new Group(conf.groups[i]));
	}
	
	this.findGroupByID = function(id) {
		for (var i in this.groups) {
			if (this.groups[i].id == id) {
				return i;
			}
		}
		
		return -1;
	};
	
	this.add_group = function(group) {
		this.groups.push(group);
		
		return this.groups.length-1;
	};
	
	this.save = function(callback) {
		var item = this;
		
		$.post(WWW_ROOT + "/ajax.php", {
			"action":"save_division",
			"id":this.id,
			"division_name": this.name
		}, function(data) {
			// if this users ID isn't set, set it
			if (item.id == undefined || item.id == 0) {
				item.id = data.division.CompanyDivisionID;
			}
			
			// run our callback
			callback(item, data.response);
		}, "json");
	};
}

function Group(conf) {
	this.id = conf.CompanyGroupID;
	this.division_id = conf.CompanyDivisionID;
	this.name = conf.CompanyGroupName;
	
	this.save = function(callback) {
		var item = this;
		
		$.post(WWW_ROOT + "/ajax.php", {
			"action":"save_group",
			"division_id":this.division_id,
			"id":this.id,
			"group_name": this.name
		}, function(data) {
			// if this users ID isn't set, set it
			if (item.id == undefined || item.id == 0) {
				item.id = data.group.CompanyGroupID;
			}
			
			// run our callback
			if (callback)
				callback(item, data.response);
		}, "json");
	};
}