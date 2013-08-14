<div id="dialog-edit-device" class="form-dialog" title="Vehicle/Equipment Detail">
	<form>

            <div class="left-col">

                <div class="section">

                    <span class="section-title">General Information</span>

                    <div class="section-content">

                        <fieldset>
                                <label>Serial #:</label>
                                <span id="device-edit-serial"></span>
                        </fieldset>

                        <fieldset>
                                <label>Short Name:</label>
                                <input id="device-edit-name" class="text">
                        </fieldset>

                    </div>

                </div>

                <div class="section">

                    <span class="section-title">Vehicle Information</span>

                    <div class="section-content">

                        <fieldset>
                                <label>Type:</label>
                                <select class="text" id="device-edit-vehicleTypeID">
                                        <option value='0'>Unknown</option>
                                </select>
                        </fieldset>

                        <fieldset>
                                <label>Make:</label>
                                <input id="device-edit-vehicleMake" class="text">
                        </fieldset>

                        <fieldset>
                                <label>Model:</label>
                                <input id="device-edit-vehicleModel" class="text">
                        </fieldset>

                        <fieldset>
                                <label>Year:</label>
                                <input id="device-edit-vehicleYear" maxlength="4" class="text">
                        </fieldset>
                        <fieldset>
                                <label>Color:</label>
                                <input id="device-edit-vehicleColor" class="text">
                        </fieldset>
                        <fieldset>
                                <label>Plate #:</label>
                                <input id="device-edit-vehiclePlate" class="text">
                        </fieldset>
                        <fieldset>
                                <label>VIN:</label>
                                <input id="device-edit-vehicleVin" class="text">
                        </fieldset>
                        <fieldset>
                                <label>Entered Odometer:</label>
                                <input id="device-edit-enteredOdometer" class="text">&nbsp;miles
                        </fieldset>
                        <fieldset>
                                <label>Entered On:</label>
                                <span id="device-edit-enteredOdometerModified"></span>
                        </fieldset>
                       <fieldset>
                                <label>Current Odometer:</label>
                                <span id="device-edit-currentOdometer"></span>&nbsp;miles
                        </fieldset>
                </div>

                </div>

            </div>

            <div class="right-col">

                 <div class="section">

                    <span class="section-title">Assign To</span>

                    <div class="section-content">

                        <fieldset>
                                <label>Group:</label>
                                <select class="text" id="device-edit-group">
                                        <option value='0'>Not Assigned</option>
                                </select>
                        </fieldset>

                        <fieldset>
                                <label>Driver:</label>
                                <select class="text" id="device-edit-user">
                                        <option value='0'>Not Assigned</option>
                                </select>
                        </fieldset>

                        <fieldset>
                                <label>External ID:</label>
                                <input id="device-edit-externalIdentifier" class="text">
                        </fieldset>

                    </div>
                 </div>

                 <div class="section">

                    <span class="section-title">Additional Information</span>

                    <div class="section-content">

                        <fieldset>
                                <label>Grant Number:</label>
                                <input id="device-edit-grantNumber" class="text">
                        </fieldset>

                        <fieldset>
                                <label>Grantee Name:</label>
                                <input id="device-edit-granteeName" class="text">
                        </fieldset>

                        <fieldset>
                                <label>Activity Number:</label>
                                <input id="device-edit-activityNumber" class="text">
                        </fieldset>

                    </div>
                 </div>


                 <div class="section">

                    <span class="section-title">Notes</span>

                    <div class="section-content">

                        <fieldset>

                                <textarea id="device-edit-notes" rows="6" ></textarea>

                        </fieldset>

                    </div>
                 </div>

            </div>

	</form>
</div>