<?php
require_once(APP_ROOT . "/loadlibs.php");
require_once(TAWF_ROOT . "/TAWSite.php");
//require_once("cloudfiles/cloudfiles.php");
require_once(TAWF_ROOT . "/lib/cloudfiles/cloudfiles.php");


try {
    $u = TAWUser::singleton();
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

    $site = TAWSiteFactory::getSite();

	} catch (Exception $e) {
}
?>

<!DOCTYPE HTML>

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

            <div id="main-area">
<?php $this->render_view(); ?>



            <!--<div id="footer">
                    <img class="menu-item" src="/images/menu-left.jpg" />
                    <img style="float: right;" src="/images/menu-right.jpg" />
	<div style="clear: both;"></div>
            </div>-->

            </div>

        </div>

    </body>
</html>