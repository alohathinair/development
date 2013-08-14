<?php

class ReportFilter {

    private $filter_data;

    function  __construct($filter_data) {
        $this->filter_data = $filter_data;
    }

    public function createLabelFilter($label, $required) {
        echo '<label class="report-param-name">' . $label;
        if ($required)
            echo '<span class="required">*</span>';
        echo "</label>";
    }

    public function createFieldsetFilterHeader($label, $required) {
        echo "<fieldset>";
        $this->createLabelFilter($label, $required);
	echo "<div>";
    }
    
    public function createFieldsetFilterFooter() {
   	echo "</div>";
	echo "<div class='clear'></div>";
        echo "</fieldset>"; 
    }

    public function createDriverGroupFilter() {
        $this->createFieldsetFilterHeader("Division/Group:", true);
        echo "<select name='divisionGroup' id='divisionGroup'>";
        echo "</select>";
        echo "<input type='hidden' name='division' id='division' value=0>";
        echo "<input type='hidden' name='group' id='group' value=0>";
        $this->createFieldsetFilterFooter();
    }

    public function createDriverFilter() {
        $this->createFieldsetFilterHeader("Driver:", true);
    	echo "<select name='driver' id='drivers'>";
        // This is already loaded by an ajax call in the report
        /*foreach ($this->filter_data["users"] as $users) {
                echo "<option value='" . $users["CompanyUserID"] . "'>" . $users["CompanyUserName"] . "</option>";
        }*/
	echo "</select>";
        $this->createFieldsetFilterFooter();
    }

    public function createVehicleFilter() {
        $this->createFieldsetFilterHeader("Vehicle:", true);
        echo "<select name='device' id='device'>";
        echo "<option value='0'>All Vehicles</option>";
        foreach ($this->filter_data["devices"] as $device) {
            echo "<option value='" . $device["DeviceID"] . "'>" . $device["Name"] . "</option>";
        }
        echo "</select>";
        $this->createFieldsetFilterFooter();
    }

    public function createLandmarksFilter() {
        $this->createFieldsetFilterHeader("Landmark:", true);
        echo "<select name='landmark' id='landmark'>";
        echo "<option value='0'>All Landmarks</option>";
        foreach ($this->filter_data["landmarks"] as $landmark) {
            echo "<option value='" . $landmark["GeoFenceID"] . "'>" . $landmark["FenceName"] . "</option>";
        }
        echo "</select>";
        $this->createFieldsetFilterFooter();
    }

    public function createStartDateFilter() {
        //$adjustment = (3600 * (TAWUser::singleton()->get_time_adjustment() - 6));
        $now = TAWUser::singleton()->getUserCurrentTime();
        $fromDate = mktime(0, 0, 0, date("m", $now), date("d", $now), date("Y", $now));
        $sFromDate = date("m-d-Y h:i a", $fromDate);

        $this->createFieldsetFilterHeader("Start Date-Time:", true);
        echo "<input name='start-date' id='start-date' size=23 value='".$sFromDate. "'/>";
        $this->createFieldsetFilterFooter();
    }

    public function createEndDateFilter() {
        //$adjustment = (3600 * (TAWUser::singleton()->get_time_adjustment() - 6));
        $now = TAWUser::singleton()->getUserCurrentTime();
        $toDate   = mktime(23, 59, 59, date("m", $now), date("d", $now), date("Y", $now));
        $sToDate = date("m-d-Y h:i a", $toDate);

        $this->createFieldsetFilterHeader("End Date-Time:", true);
        echo "<input name='end-date' id='end-date' size=23 value='".$sToDate. "'/>";
        $this->createFieldsetFilterFooter();
    }

    public function createMinIdleMinutesFilter() {
        $this->createFieldsetFilterHeader("Minimum Idle Minutes:", true);
        echo "<input name='min-idle-minutes' id='min-idle-minutes' size=5 value='5'/>";
        $this->createFieldsetFilterFooter();
    }

	public function createEventTypeFilter() {
        $this->createFieldsetFilterHeader("Event Type:", true);
        echo "<select name='eventtype' id='eventtype'>";
        echo "<option value='0'>All Event Types</option>";
        foreach ($this->filter_data["eventtypes"] as $eventtype) {
            echo "<option value='" . $eventtype["ActionEventTypeID"] . "'>" . $eventtype["Name"] . "</option>";
        }
        echo "</select>";
        $this->createFieldsetFilterFooter();
    }
}

?>
