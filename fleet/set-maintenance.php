<?php
define("MAINTENANCE_FILE", "tmp/is_doing_maintenance.txt");
$isDoingMaintenance = (file_exists(MAINTENANCE_FILE)) ? true : false;

if (isset($_POST["toggle-maintenance"])) {
	if ($isDoingMaintenance) {
		unlink(MAINTENANCE_FILE);
	} else {
		touch(MAINTENANCE_FILE);
	}
	
	$isDoingMaintenance = !$isDoingMaintenance;
}

?>

<html>
<head>
<title>Set Maintenance State for Tracker</title>
</head>
<body>
<center>
<form method="POST">
<input type="submit" name="toggle-maintenance" value="<?php echo ($isDoingMaintenance) ? "Enable Site" : "Disable Site"; ?>" />
</center>
</body>
</html>
