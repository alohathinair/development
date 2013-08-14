<input type="hidden" name="report" value="event" />
<input type="hidden" name="action" value="generate_driver_events_report" />

<?php
    require_once 'ReportFilter.php';
    $rf = new ReportFilter($this->filter_data);

?>
<hr/>

<div id="standard-unfiltered-criteria-left-col">
        <? $rf->createDriverGroupFilter(); ?>
	    <? $rf->createDriverFilter(); ?>
        <? $rf->createVehicleFilter(); ?>
</div>

<div id="standard-unfiltered-criteria-right-col">
        <? $rf->createStartDateFilter(); ?>
        <? $rf->createEndDateFilter(); ?>
        <? $rf->createEventTypeFilter(); ?>
</div>


<div class="clear"></div>