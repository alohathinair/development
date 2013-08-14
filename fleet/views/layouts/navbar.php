<div id="navbar" class="navbar">
    <img style="float:left; margin-left: 10px" id="navbar-logo" src="<? echo $site->getLogoURL(); ?>" alt="Fleet Tracker"/>


<ul>
    <li><a class="navbar-btn-single <?= $this->get_view() == "liveview" ? "navbar-selected" : "" ?>" style="padding-left: 0px;" href="/">Map View</a></li>
    <?php
    if ($u->accessLevel >= ACCESS_LEVEL_MANAGER) {
    ?>

        <li><a class="navbar-btn-first <?= $this->get_view() == "dashboard" ? "navbar-selected" : "" ?>" href="/dashboard.php">Dashboard</a></li>
        <li><a class="navbar-btn-middle <?= $this->get_view() == "reports" ? "navbar-selected" : "" ?>" href="/reports.php">Reports</a></li>
        <li><a class="navbar-btn-middle <?= $this->get_view() == "landmarks" ? "navbar-selected" : "" ?>" href="/landmarks.php">Landmarks</a></li>

    <?php
        if ($u->accessLevel >= ACCESS_LEVEL_MANAGER) {
    ?>
            <li><a class="navbar-btn-last <?= strpos($this->get_view(), "admin") === 0 ? "navbar-selected" : "" ?>" href="/admin/">Administration</a></li>

    <?php
        }
    }
    ?>
    <li><a class="navbar-btn-single" href="/logout.php">Logout</a></li>

</ul>
<img id="navbar-thinairlogo" src="/images/ThinAirLogoPower.png" style="margin-right: 20px;" />
</div>
<div style="clear: both;"></div>
