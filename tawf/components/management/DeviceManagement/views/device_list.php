<style type="text/css">
    #grid .k-toolbar k-grid-toolbar
    {
        min-height: 27px !important;
    }

</style>


<h2>Vehicle Management</h2>

<div id="device-filter">
    <label>Division/Group:</label>
    <select class="text" id="division-group">
    	<?php 
    		$u = TAWUser::singleton();
    		if ($u->accessLevel == ACCESS_LEVEL_ADMINISTRATOR) {
		?>
            <option value='0'>All Divisions All Groups</option>
        <?php } ?>     
    </select>

</div>

<div id="grid"></div>

