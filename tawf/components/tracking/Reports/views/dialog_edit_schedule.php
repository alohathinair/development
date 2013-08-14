
<div id="schedule-dialog" title="Scheduled Report" class="form-dialog">

    <div id="schedule-dialog-container">

    <form id="schedule-dialog-form">

        <h2>Report Delivery Options</h2>
        <div class="schedule-section">
            <fieldset>
                    <label>Email Recipients:</label>
                    <input type="text" value="" id="schedule-recipients" name="schedule-recipients"><br/>
                    <span class="note">Use (;) to separate multiple e-mail addresses</span>
            </fieldset>

            <fieldset>
                    <label>Render Format:</label>

                    <select id="schedule-format">
                        <option value="PDF">PDF</option>
                        <option value="EXCEL">Excel</option>
                        <option value="WORD">Word</option>
                    </select>
            </fieldset>
        </div>

        <h2>Schedule</h2>
        <div class="schedule-section">
            <fieldset>
                    <input type="radio" name="schedule-days" id="schedule-custom-days" value="0">
                    <label>On the following days:</label><br/>
                    <div id="schedule-days-of-week">
                        <?php
                            $dayOfWeeks = array(
                                array("ID" => "monday", "Value" => "Mon"),
                                array("ID" => "tuesday", "Value" => "Tue"),
                                array("ID" => "wednesday", "Value" => "Wed"),
                                array("ID" => "thursday", "Value" => "Thu"),
                                array("ID" => "friday", "Value" => "Fri"),
                                array("ID" => "saturday", "Value" => "Sat"),
                                array("ID" => "sunday", "Value" => "Sun"),
                            );
                            $i = 0;
                            foreach ($dayOfWeeks as $dayOfWeek) {
                                echo "<input type='checkbox' name='schedule-day[]' class='schedule-day' id='schedule-".$dayOfWeek["ID"] ."' value=" . $dayOfWeek["ID"] . ">" . $dayOfWeek["Value"] ."&nbsp;&nbsp;";
                                $i++;
                            }
                        ?>
                    </div>
            </fieldset>

            <div style="clear: both"></div>
            
            <fieldset>
                    <input type="radio" name="schedule-days" id="schedule-every-weekday" value="1">
                    <label>Every weekday</label>
            </fieldset>

            <fieldset>

                    <label>Start Time:</label>

                    <select id="schedule-hour">
                            <option value='12'>12</option>
                            <?php
                            for ($i = 1; $i != 12; $i++) {
                                    $k = $i;
                                    if ($k < 10) {
                                            $k = "0" . $k;
                                    }
                                    echo "<option value='$i'>$i</option>\n";
                            }
                            ?>
                    </select>
                    <select id="schedule-minute">:
                            <option value='00'>00</option>
                            <option value='15'>15</option>
                            <option value='30'>30</option>
                            <option value='45'>45</option>
                    </select>
                    <select id="schedule-ampm"><option value='AM'>am</option><option value='PM'>pm</option></select>
            </fieldset>

        </div>

        <h2>Report Parameters</h2>
        <div class="schedule-section">
            <fieldset>
                <label>Division/Group:</label>
                <select id="schedule-group">
                </select>
            </fieldset>

            <fieldset>
                <label>Driver:</label>
                <select id="schedule-driver">
                </select>
            </fieldset>

            <fieldset>
                <label>Vehicle</label>
                <select id="schedule-device">
                    <?php
                        echo "<option value='0'>All Vehicles</option>";
                        foreach ($this->filter_data["devices"] as $device) {
                            echo "<option value='" . $device["DeviceID"] . "'>" . $device["Name"] . "</option>";
                        }
                    ?>
                </select>
            </fieldset>
        </div>

        <div id="schedule-report-error" class="errors-wrapper">
            <ol id="schedule-report-error-list"></ol>
        </div>

    </form>

    </div>
    
</div>
