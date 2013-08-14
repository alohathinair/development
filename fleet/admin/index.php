<?php
define("APP_ROOT", "..");
require_once(APP_ROOT . "/loadlibs.php");
//
$app = new TAWFrameworkRendered();

// Ensure we're logged in
if (!$app->login()) {
	$app->redirect(LOGIN_URL);
}

$user = TAWUser::singleton();
if ($user->accessLevel == ACCESS_LEVEL_MANAGER) {	// Since this is the index, if we are dealing with a manager redirect it to vehicles
	$app->redirect('/admin/vehicles.php');
	exit;
} else if ($user->accessLevel < ACCESS_LEVEL_ADMINISTRATOR) {
	$app->display_not_authorized();
}

/*
 * Valid user. We need to start adding our components. This page is the Dashboard page (also referred to as Live View)
 * It requires TAWF components mapping, events (backend for reading and managing events), notifications (event listings; depends on mapping 
 * and events), monitoring (watches for new events and device history), geofences (for displaying geofences).
 */
$app->load_component("jquery");
$app->load_component("jqueryui");
$app->load_component("googlemaps");
$app->load_component("company");
$app->add_component_js("jquery", "jquery-ui-timepicker");


// Add application scripts and styles
$app->set_layout("admin");
$app->set_view("admin/company");

$app->add_css("/css/master.css");
$app->add_component_js("company", "company-information");
$app->update_company_data();

$app->obtain_company_data();
$app->render();

?>