

<div id="wrapper-reports">
  <table width="100%" border="0" cellspacing="0" cellpadding="5">
    <tr>
      <td width="25%"><strong>Select Report Type</strong></td>
      <td width="25%"><strong>Select Device / Operator</strong></td>
      <td width="25%"><strong>Select Date To Display</strong></td>
      <td width="25%" align="center">&nbsp;</td>
    </tr>
 
 
 	<tr>
 	
 		<td>
 			<select id="report-type">
 			
 				<option value="1">Engine On Time</option>
 			
 			</select>
 		</td>
 	
 		<td>
 		
	 		<select id="device-filter">
	        <optgroup label="Drivers">
	           <?php
	          foreach ($this->filter_data["users"] as $users) {
	          	echo "<option value='2-" . $users["CompanyUserID"] . "'>" . $users["CompanyUserName"] . "</option>";
	          }
	          ?>
	          </optgroup>
	
	      </select>
	 		
 		</td>
 	
 
      <td><input id="date-start-filter" style="width: 80px;" value="<?php echo date("m/d/Y"); ?>"></td>
      <td align="left"><input name="button" type="submit" class="button" id="run-search" value="Display" /></td>
    </tr>
  </table>
  
<div id="display-results" style="width: 99%;">
<iframe id="graph-frame" width="950" height="650" style="border: none;"></iframe>

</div>