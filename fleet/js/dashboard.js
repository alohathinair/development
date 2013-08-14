
$(document).ready(function() {

    var dateFormat = 'mm-dd-yy';
    $('#daterange').daterangepicker({
        dateFormat: dateFormat,
        ampm: true,
        rangeSplitter: "to",
        onClose: function() {
            setDateRange();
            runAllReports();
        }
    });
    
    $("#daterange-button").click(function() {
       $('#daterange').click();
       return false;
    });


    $("#divisionGroup").ufd({minWidth: 150});
    $("#device").ufd({minWidth: 150});

    function setDateRange() {
        var datum = $('#daterange').val();
        var datumopseg = new Array();
        datumopseg = datum.split(' to ');

        if (datum == "") {
            datumopseg[0] = new Date();
        }

        if (!datumopseg[1] || datumopseg[1] == "") {
            datumopseg[1] = datumopseg[0];
        }

        $("#start-date").val(datumopseg[0]);
        $("#end-date").val(datumopseg[1]);
    }

    function runReport(reportId, output) {

        $("#report").val(reportId);
        var outputSel = "#" + output;
        $(outputSel).mask("Loading...");

        $.ajax({
            type: "POST",
            url: "/ajax.php",
            data: $('#dashboard-form').serialize(),
            success: function(html) {
                hasReport = true;
                $(outputSel).unmask();

                var reportContentId = reportId + "-content";
                var reportContentIdSel = "#" + reportContentId;

                // Some workarounds to fix styling
                var reportContent = html.replace(/id="oReportDiv"/i, 'id="' + reportContentId + '"')
                reportContent = reportContent.replace(/HEIGHT:100%;WIDTH:100%/gi, '');
                $(outputSel).html(reportContent);

                // Modify the overflow property of the html that SSRS returns so scrollbars doesnt show up
                $(reportContentIdSel).css('overflow', 'visible');
                $(reportContentIdSel).css('height', '');
                $(reportContentIdSel + " div").css('height', '');

            },
            error: function(data) {
                maskArea.unmask();
                alert("There was a problem with the request.");
            }
        });
    }

    $('#divisionGroup').change(function() {
        var selected = $(this).find('option:selected');
        var divisionId = selected.attr('data-divisionId');
        var groupId = selected.attr('data-groupId');
        $('#division').val(divisionId);
        $('#group').val(groupId);
        
        $.post("/ajax.php", {
            action:"get_dashboard_request_information",
            group: groupId,
            division: divisionId
        }, function(data) {
            // Load in organizational data
            var devices = data.devices;

            $("#device")
                .find('option')
                .remove()
                .end();
                
            $("#device").append("<option value='0'>Select Vehicle...</option>");
            
            for (var i in devices) {
                $("#device").append("<option value='" + devices[i].DeviceID + "'>" + devices[i].Name + "</option>");
            }

            $("#device").ufd("changeOptions");
            
        }, "json");
        
        runFleetReports();
    });

    $('#device').change(function() {
        runDeviceReports();
    });

    function runDeviceReports() {
        if ($("#device").val() == 0) return;
        $("#dashboard_vehicle").css('min-height', "100px")
        runReport("dashboard_vehicle", "dashboard_vehicle");
    }
    
    function runFleetReports() {
        for (var i = 0; i < dashFleetReports.length; ++i) {
            runReport(dashFleetReports[i].id, dashFleetReports[i].id);
        }        
    }
    
    function runAllReports() {
        runDeviceReports();
        runFleetReports();
    }

    function formatDate(date) {
        var day = date.getDate();
	var month = date.getMonth();
	var year = date.getFullYear();
	month++; // adjust javascript month
	return jQuery.datepicker.formatDate( dateFormat, date );
    }

    //$("#daterange").datepicker("setDate",Date.parse("Today"));
    $("#daterange").val(formatDate(Date.parse("Today")));
    setDateRange();
    runAllReports();
    
});