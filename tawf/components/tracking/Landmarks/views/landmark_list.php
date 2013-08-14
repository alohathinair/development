<div id="landmark-table-container">
<table id="landmark-table">
    <?
        $import_result = $this->data["landmarks_import_result"];
        if (isset($import_result)) {
       ?>

    <div id="import-alert" class="alert-message">
        <a id="import-alert-close" class="close" href="#">x</a>
        <p>
            <? echo $import_result["imported"] . " rows imported successfully. ";
                 if (count($import_result["errors"]) > 0) {
                     $errors = implode(",", $import_result["errors"]);
                     echo "<br>Error importing the folowing rows: " . $errors;
                 }
              ?>
        </p>
    </div>
     <?
        }   
    ?>

    <thead>
		<tr>
			<th width="30%">Name</th>
			<th width="30%">Driver</th>
			<th width="40%">Location</th>
			<!--<th width="30%">Tags</th>-->
		</tr>
	</thead>
	<tbody id="landmark_list"></tbody>
</table>
</div>
<div id="landmark-map"></div>
<div style="clear: both;"></div>

