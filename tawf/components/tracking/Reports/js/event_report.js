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
            "end-date": "required"
        },
        messages: {
            "start-date": "Please enter a Start Date.<br/>",
            "end-date": "Please enter an End Date.<br/>"
        }
    });

/*    $("#run-report").click(function() {
        $("#report-results-iframe").slideDown();
    });
*/

});