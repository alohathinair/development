<html>
<head>
<?php echo $this->get_extensions(); ?>
<title>Fleet Tracker</title>
</head>
<body>

<div id="container">

<div id="header">
	<h1>Fleet Tracker</h1>
</div>

<div id="navbar">
	<img class="menu-item" src="/images/menu-left.jpg" />
	<a class="menu-item" style="padding-left: 0px;" href="/">Live View</a>
	<img class="menu-item" src="/images/menu-item-divider.jpg" />
	<a class="menu-item" href="/landmarks.php">Landmarks</a>
	<img class="menu-item" src="/images/menu-item-divider.jpg" />
	<a class="menu-item" href="/reports.php">Reports</a>
	<img class="menu-item" src="/images/menu-item-divider.jpg" />
	<a class="menu-item" href="/admin/">Administration</a>
	<img class="menu-item" src="/images/menu-item-divider.jpg" />
	<a class="menu-item" href="/logout.php">Logout</a>
	<img style="float: right;" src="/images/menu-right.jpg" />
	<div style="clear: both;"></div>
</div>
<br />

<?php $this->render_view(); ?>



<div id="footer">
	<img class="menu-item" src="/images/menu-left.jpg" />
	<img style="float: right;" src="/images/menu-right.jpg" />
	<div style="clear: both;"></div>
</div>

</div>

</body>
</html>