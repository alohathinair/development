var DivisionGroupHelper = {};

DivisionGroupHelper.getSelectedDivisionId = function(element) {
    if (!element.val()) return 0;
    var selected = element.find('option:selected');
    var is_group = selected.attr('data-group');

    if (is_group) {
        return selected.attr('data-divisionId');
    } else {
        return element.val();
    }
};

DivisionGroupHelper.getSelectedGroupId = function(element) {
    if (!element.val()) return 0;
    var selected = element.find('option:selected');
    var is_group = selected.attr('data-group');

    if (is_group) {
        return element.val();
    }
    return 0;
};

DivisionGroupHelper.selectDivisionGroup = function(element, divisionId, groupId) {
    element.find('option').each(function (index, option) {
        if (groupId) {
            if ($(option).attr('data-group') && groupId == $(option).val()) {
                $(option).attr('selected', true);
                return;
            }
       } else if (divisionId) {
           if ($(option).attr('data-division') && divisionId == $(option).val()) {
                $(option).attr('selected', true);
                return;
            }
       }
    });
};

DivisionGroupHelper.loadSelect = function(element, divisions) {

    for (var i in divisions) {
        element.append("<option data-division=true value='" + divisions[i].id + "'>" +  divisions[i].name + "</option>");

        for (var x in divisions[i].groups) {
            element.append("<option data-group=true data-divisionId=" + divisions[i].id + " value='" + divisions[i].groups[x].id + "'>&nbsp;&nbsp;" + divisions[i].groups[x].name + "</option>");
        }
    }

};
