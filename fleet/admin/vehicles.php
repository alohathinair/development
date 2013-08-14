<html doctype-root-element="html" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd" omit-xml-declaration="yes" />
<?php
define("APP_ROOT", "..");
require_once(APP_ROOT . "/loadlibs.php");

$app = new TAWFrameworkRendered();

// Ensure we're logged in
if (!$app->login()) {
	$app->redirect(LOGIN_URL);
}

$user = TAWUser::singleton();
if ($user->accessLevel < ACCESS_LEVEL_MANAGER) {
	$app->display_not_authorized();
}

/*
 * Valid user. We need to start adding our components. This page is the Dashboard page (also referred to as Live View)
 * It requires TAWF components mapping, events (backend for reading and managing events), notifications (event listings; depends on mapping 
 * and events), monitoring (watches for new events and device history), geofences (for displaying geofences).
 */
$app->load_component("jquery");
$app->load_component("jqueryui");
$app->load_component("devices");
$app->load_component("users");
$app->load_component("devicemanagement");
$app->load_component("googlemaps");

// Add application scripts and styles
$app->set_layout("admin");
$app->set_view("admin/vehicles");

$app->add_css("/css/master.css");

$app->render();
?>