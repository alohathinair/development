<input type="hidden" name="report" value="event" />
<input type="hidden" name="action" value="generate_vehicle_idling_report" />

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
        <? $rf->createMinIdleMinutesFilter(); ?>
</div>


<div class="clear"></div>
