<script type="text/javascript">

    <?php
    $u = TAWUser::singleton();
    $reports = $this->get_dashboard_fleet_reports();
    $json = array();
    foreach ($reports as $report) {
        $json[] = array("id" => $report->get_id());
    }
    ?>

    var dashFleetReports = <?php echo json_encode($json) ?>;

</script>

<form id="dashboard-form" action="/ajax.php" method="POST" target="report-results-iframe">
    
    <input type="hidden" name="report" id="report" value="dashboard_vehicle" />
    <input type="hidden" name="action" value="generate_report" />
    <input type="hidden" name='start-date' id='start-date'/>
    <input type="hidden" name='end-date' id='end-date'/>

    <div id="dashboard-vehicle" class="dashboard-section">
        <div class="dashboard-section-header">

            <label class="dashboard-section-name">Vehicle Details</label>

            <select name='device' id='device'>
                <option value='0'>Select Vehicle...</option>
            <?php
                foreach ($this->filter_data["devices"] as $device) {
                    echo "<option value='" . $device["DeviceID"] ."'>" . $device["Name"] . "</option>";
                }
            ?>
            </select>

            
        </div>

        <div id="dashboard_vehicle"></div>
    </div>

   
   <div style="clear: both"></div>

    <div id="dashboard-fleet" class="dashboard-section">
        <div class="dashboard-section-header">

            <label class="dashboard-section-name">Fleet Details</label>
             <div style="float:left">
                <label>Division/Group:</label>
                <select name='divisionGroup' id='divisionGroup'>
<?php if ($u->accessLevel == ACCESS_LEVEL_ADMINISTRATOR) { ?>
                    <option value='0' data-divisionId=0 data-groupId=0>All Divisions All Groups</option>
<?php } ?>                    
                <?php
                    foreach ($this->filter_data["divisions"] as $division) {
                        echo "<option data-division=true data-groupId=0 data-divisionId='".$division["CompanyDivisionID"]."' value='" . $division["CompanyDivisionID"] . "'>" .  $division["CompanyDivisionName"] . "</option>";

                        foreach ($division["groups"] as $group) {
                            echo "<option data-group=true data-groupId='".$group["CompanyGroupID"]."' data-divisionId='".$division["CompanyDivisionID"]."' value='" . $group["CompanyGroupID"] ."'>&nbsp;&nbsp;" . $group["CompanyGroupName"] . "</option>";
                        }
                    }
                ?>
                </select>

                <input type='hidden' name='division' id='division'>
                <input type='hidden' name='group' id='group'>
             </div>

            <div id="from-wrapper">
                <label>From:</label>
                <input type="text" value="today" id="daterange" />
                <button id="daterange-button"><img src="/images/calendar.gif"></button>
            </div>
        </div>



        <div id="dashboard_fleet_distance_traveled" class="dashboard_fleet"></div>
        <div id="dashboard_fleet_stops" class="dashboard_fleet"></div>
        <div id="dashboard_fleet_engine_on_off" class="dashboard_fleet"></div>
        
        <div style="clear: both"></div>

        <div id="dashboard_fleet_engine_idle" class="dashboard_fleet"></div>
        <div id="dashboard_fleet_excessive_speed" class="dashboard_fleet"></div>
        <div id="dashboard_fleet_average_speed" class="dashboard_fleet"></div>

    </div>


    </form>
