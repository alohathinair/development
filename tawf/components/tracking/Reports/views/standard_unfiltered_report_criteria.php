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
</div>


<div class="clear"></div>
