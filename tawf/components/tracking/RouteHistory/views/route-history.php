<?php

$adjustment = (3600 * (TAWUser::singleton()->get_time_adjustment() - 6));
$now = time()+$adjustment;
$sFromDate = date("m-d-Y 12:00 ", $now) . "am";
$sToDate = date("m-d-Y 11:59 ", $now) . "pm";
?>

<script>
    var company_latitude = <?php echo $this->company_data["CompanyDefaultMapLatitude"]; ?>;
    var company_longitude = <?php echo $this->company_data["CompanyDefaultMapLongitude"]; ?>;
    var company_zoom = <?php echo $this->company_data["CompanyDefaultMapZoom"]; ?>;
</script>


<form action="/download-report.php" method="POST" id="post-report">

    <input type="hidden" name="action" value="get_route_history" />
    <input type="hidden" name="report-type" id="report-type" value="1">

    <div id="configure-report-container" >

        <div id="select-report-box" class="filter-container">

            <div style="float: left">
                <fieldset>
                    <label>Show:</label>
                    <select name="report" id="report">
                        <option value='2'>Driving History</option>
                        <option value='1'>Event History</option>
                    </select>
                </fieldset>
            </div>


            <div style="float: left">
                <div>
                    <fieldset>
                        <label id="start-date-label">Start Date-Time:<span class="required">*</span></label>
                        <div>
                            <input id="start_date" name="start_date" size="20" value="<?php echo $sFromDate; ?>">
                        </div>
                    </fieldset>
                </div>

                <div>
                    <fieldset>
                        <label id="end-date-label">End Date-Time:<span class="required">*</span></label>
                        <input id="end_date" name="end_date" size="20" value="<?php echo $sToDate; ?>">
                    </fieldset>
                </div>

            </div>


            <div id="select-report-drivers-box">
                <fieldset>
                    <label class="report-param-name">Driver(s):</label>

                    <select name="drivers[]" id="drivers" size="6" multiple="multiple" style="display: none">
                        <?php

                        foreach ($this->filter_data["users"] as $users) {
                            echo "<option value='" . $users["CompanyUserID"] . "'>" . $users["CompanyUserName"] . "</option>";
                        }
                        ?>
                    </select>

                    <span id="driver-box">
                        <select name="driver" id="driver">
                            <?php
                            foreach ($this->filter_data["users"] as $users) {
                                echo "<option value='" . $users["CompanyUserID"] . "'>" . $users["CompanyUserName"] . "</option>";
                            }
                            ?>
                        </select>
                    </span>
                </fieldset>

            </div>

            <div id="select-report-filters-box" style="display: none">
                <fieldset>
                    <label class="report-param-name">Filter(s):</label>

                    <select id="filters" name="filters[]" size="6" multiple="multiple">
                        <option value='1'>Landmark Arrival</option>
                        <option value='2'>Landmark Departure</option>
                        <option value='3'>Speeding</option>
                        <option value='4'>Stopped</option>
                        <option value='5'>After-hours Use</option>
                        <option value='6'>Approaching Destination</option>
                        <option value='7'>Engine Turned On</option>
                        <option value='8'>Engine Turned Off</option>
                        <option value='9'>Engine Started Idling</option>
                        <option value='10'>Engine Stopped Idling</option>
                        <option value='11'>Panic Button Pressed</option>
                    </select>
                </fieldset>
            </div>

            <div id="generate-report-box">
                <input type="button" value=" Generate " id="display-report" />
            </div>
            
            <div style="clear: both;"></div>

            <div id="reports-error">
                <ol id="reports-error-list"></ol>
            </div>

        </div>

    </div>

</form>
<div style="clear: both;"></div>

<div id="report-results">
    <div id="report-list">
        <div id="report-table-header">

        </div>

        <div id="route-playback-container">
            <a href="#"><span id="playback-backward">Backward</span></a>
            <a href="#"><span id="playback-home">Beginning</span></a>
            <a href="#"><span id="playback-stop">Stop</span></a>
            <a href="#"><span id="playback-forward">Forward</span></a>
        </div>
        <div id="report-list-column-headings">
            <img src="/images/bar-thin-left.png" style="float: left;" />
            <div id="report-list-column-heading1" style="width: 85px">Driver</div>
            <div id="report-list-column-heading2" style="width: 130px">Time</div>
            <div id="report-list-column-heading3" style="width: 130px">Event</div>
            <div id="report-list-column-heading4">Data</div>


            <img style="float: right;" src="/images/bar-thin-right.png" />
            <div style="clear:both;"></div>
        </div>
        <div id="report-list-container">

            <table id="report-list-results">

            </table>
            &nbsp;
        </div>
    </div>

    <div id="report-graphic-results">
        <div id="mapped-results">
            <div id="map"></div>
        </div>
        <div id="graphed-results" style="display: none;"></div>
    </div>

    <div style="clear: both;"></div>


</div>