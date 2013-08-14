
<form method="post" enctype="multipart/form-data">
    <div>
        <div style="float: left; width: 300px;">
            <h3>Company Information</h3>
            <div>
                <div>
                    <div>Name:</div> <div><input name="company_name" value="<?php echo $this->data["CompanyInfo"]["CompanyName"]; ?>"></div>
                </div>

                <div>
                    <div>E-Mail:</div> <div><input name="company_email" value="<?php echo $this->data["CompanyInfo"]["CompanyEmail"]; ?>"></div>
                </div>

                <div>
                    <div>Phone:</div> <div><input name="company_phone" value="<?php echo $this->data["CompanyInfo"]["CompanyPhone"]; ?>"></div>
                </div>

                <div>
                    <div>Logo:</div> <div><input type="file" name="logo"></div>
                </div>
                <div>
                    <div>Street:</div> <div><input name="company_address" value="<?php echo $this->data["CompanyInfo"]["CompanyAddress"]; ?>"></div>
                </div>

                <div>
                    <div>City:</div> <div><input name="company_city" value="<?php echo $this->data["CompanyInfo"]["CompanyCity"]; ?>"></div>
                </div>

                <div>
                    <div>State:</div> <div><input name="company_state" value="<?php echo $this->data["CompanyInfo"]["CompanyState"]; ?>"></div>
                </div>

                <div>
                    <div>Zip:</div> <div><input name="company_zip" value="<?php echo $this->data["CompanyInfo"]["CompanyZipCode"]; ?>"></div>
                </div>


                <br>
            </div>
        </div>

        <div style="float: left;">
            <h3>Vehicle Settings</h3>

            <h5>Hours of Operation</h5>
		Vehicles are allowed to travel between <input id="business-hours-start" name="business-hours-start" style="width: 80px" value="<?php echo date("h:i A", strtotime($this->data["CompanyInfo"]["CompanyAfterHoursEnd"])); ?>"> and <input name="business-hours-end" id="business-hours-end" style="width: 80px" value="<?php echo date("h:i A", strtotime($this->data["CompanyInfo"]["CompanyAfterHoursStart"])); ?>"><br>

                 <label>On the following days:</label>
                    <div id="schedule-days-of-week">
                        <?php
                        $dayOfWeeks = array(
                                array("ID" => "mon", "Value" => "Mon"),
                                array("ID" => "tue", "Value" => "Tue"),
                                array("ID" => "wed", "Value" => "Wed"),
                                array("ID" => "thu", "Value" => "Thu"),
                                array("ID" => "fri", "Value" => "Fri"),
                                array("ID" => "sat", "Value" => "Sat"),
                                array("ID" => "sun", "Value" => "Sun"),
                            );
                            $i = 0;
                            foreach ($dayOfWeeks as $dayOfWeek) {
                                $checked = $this->data["CompanyInfo"][$dayOfWeek["ID"]] ? "checked" : "";
                                echo "<input type='checkbox' ".$checked . " name='hh[]' id='schedule-".$dayOfWeek["ID"] ."' value=" . $dayOfWeek["ID"] . ">" . $dayOfWeek["Value"] ."&nbsp;&nbsp;";
                                $i++;
                            }
                        ?>
                    </div>
            <h5>Company Speed Limit</h5>
		Vehicles shouldn't travel faster than <input id="business-speed-limit" name="business-speed-limit" style="width: 40px" value="<?php echo $this->data["CompanyInfo"]["CompanySpeedLimit"]; ?>"> mph/kph

            <h5>Posted Speed Limit</h5>
            Vehicles should not exceed  <input id="over-posted-speed-limit" name="over-posted-speed-limit" style="width: 40px" value="<?php echo $this->data["CompanyInfo"]["OverPostedSpeedLimit"]; ?>"> mph/kph over posted speed limit<br/>
            <input type='checkbox' name='use-average-speed' value=1 <? if ($this->data["CompanyInfo"]["UseAverageSpeed"]) echo "checked"; ?> id='use-average-speed'>Use Average Road Speed as posted speed limit (when needed)

            <h3>Interface Settings</h3>

            <input type="button" id="update-map-settings" value="Change Default Map View">
            <br/><br/><br/>

            <div>
                <div>Custom Overlay:</div> <div><input type="file" name="overlay"></div>
            </div>
            


            <input type="hidden" name="map-latitude" id="map-latitude" value="<?php echo $this->data["CompanyInfo"]["CompanyDefaultMapLatitude"]; ?>">
            <input type="hidden" name="map-longitude" id="map-longitude" value="<?php echo $this->data["CompanyInfo"]["CompanyDefaultMapLongitude"]; ?>">
            <input type="hidden" name="map-zoom" id="map-zoom" value="<?php echo $this->data["CompanyInfo"]["CompanyDefaultMapZoom"]; ?>">
        </div>

        <div style="clear: both;">
        
        <input id="save-company-settings" type="submit" value="Save" style="margin-left: 600px;" />
        </div>
    </div>
</form>

<div id="map-view-dialog" title="Change Default Map View">
    <div id="map" style="height: 450px; width: 600px;">
    </div>
</div>