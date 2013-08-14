$(function() {
    // Setup dates
    $('#start-date,#end-date').datetimepicker({
        ampm: true,
        buttonImage: "/images/calendar.gif",
        buttonImageOnly: true,
        showOn: 'button',
        showAnim:'slideDown',
        ampm: true,
        dateFormat: 'mm-dd-yy'
    });

    validator = $("#post-report").validate({
        errorContainer: $("#reports-error"),
        errorLabelContainer: $("#reports-error-list"),
        wrapper: "li",
        rules: {
            "start-date": "required",
            "end-date": "required",
            "min-idle-minutes": {
                required: true,
                digits: true,
                min: 0,
                max: 1440                
            }

        },
        messages: {
            "start-date": "Please enter a Start Date.<br/>",
            "end-date": "Please enter an End Date.<br/>",
            "min-idle-minutes": "Minimun Idle Minutes must be between 0 and 1440.<br/>"
        }
    });

/*    $("#run-report").click(function() {
        $("#report-results-iframe").slideDown();
    });
*/

});