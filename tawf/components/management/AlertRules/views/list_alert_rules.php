<?php
$u = TAWUser::singleton();
if ($u->accessLevel == ACCESS_LEVEL_ADMINISTRATOR) { 
    echo '<input type="hidden" value=1 id="all-divisions"/>';
}

?>

<h2>Alert Rules</h2>


<button id="new-alert-rule">Add New Alert Rule</button>

<ul id="alert-rules-list" style="vertical-align: top;">
</ul>
