<?php

require_once(APP_ROOT . "/loadlibs.php");
require_once(TAWF_ROOT . "/TAWSite.php");
require_once(TAWF_ROOT . "/lib/cloudfiles/cloudfiles.php");

try {
    $u = TAWUser::singleton();
    $site = TAWSiteFactory::getSite();
    $c_id = $u->get_company_id();
    $showCompanyLogo = false;
    $auth = new CF_Authentication("thinair1", "08170493ad0c4d545ba602ab9eb3c55f");
    $auth->authenticate();
    $conn = new CF_Connection($auth);
    $logos_container = $conn->get_container("Company Logos");
    try {
        $obj = $logos_container->get_object("$c_id-logo");
        if ($obj)
            $showCompanyLogo = true;
    } catch (NoSuchObjectException $e) {

    }

} catch (Exception $e) {

}

?>

<html>
    <head>
        <?php echo $this->get_extensions(); ?>
        <title><?php echo $site->getSiteTitle(); ?></title>
        <link rel="stylesheet" type="text/css" href="<?php echo $site->getSiteCSS(); ?> "/>
    </head>
    <body>
        <div id="container">
            <div id="top-area">


                <?php include_once 'navbar.php' ?>
            </div>
            
            <div style="clear: both;"></div>

            <div id="admin-menu">
                <ul id="admin-menu-items">

<?php if ($u->accessLevel == ACCESS_LEVEL_ADMINISTRATOR) { ?>
                    <li><a class="admin-menu-item<?= $this->get_view() == "admin/company" ? "-selected" : "" ?>" href="/admin/">Settings</a></li>
                    <li><a class="admin-menu-item<?= $this->get_view() == "admin/organization" ? "-selected" : "" ?>" href="/admin/organization.php">Organization</a></li>
<?php } ?>
                    
                    <li><a class="admin-menu-item<?= $this->get_view() == "admin/vehicles" ? "-selected" : "" ?>" href="/admin/vehicles.php">Vehicles</a></li>
                    <li><a class="admin-menu-item<?= $this->get_view() == "admin/alert-templates" ? "-selected" : "" ?>" href="/admin/alert-templates.php">Alert Templates</a></li>
                    <li><a class="admin-menu-item<?= $this->get_view() == "admin/alert-rules" ? "-selected" : "" ?>" href="/admin/alert-rules.php">Alert Rules</a></li>
                    <li><a class="admin-menu-item<?= $this->get_view() == "admin/user-management" ? "-selected" : "" ?>" href="/admin/user-management.php">User Management</a></li>
                </ul>
            </div>

            <!--<div id="footer">
                    <img class="menu-item" src="/images/menu-left.jpg" />
                    <img style="float: right;" src="/images/menu-right.jpg" />
		<div style="clear: both;"></div>
	</div>-->


            <div id="wrapper-body">

                <?php $this->render_view(); ?>
            </div>

        </div>

    </body>
</html>
