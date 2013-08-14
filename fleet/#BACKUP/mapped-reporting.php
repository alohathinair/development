<?php
define("APP_ROOT", ".");
require_once(APP_ROOT . "/loadlibs.php");

$app = new TAWFrameworkRendered();

// Ensure we're logged in
if (!$app->login()) {
	$app->redirect(LOGIN_URL);
}

/*
 * Valid user. We need to start adding our components. This page is the Dashboard page (also referred to as Live View)
 * It requires TAWF components mapping, events (backend for reading and managing events), notifications (event listings; depends on mapping 
 * and events), monitoring (watches for new events and device history), geofences (for displaying geofences).
 */
$app->load_component("jquery");
$app->load_component("jqueryui");
$app->load_component("googlemaps");
$app->load_component("events");
$app->load_component("devices");
$app->load_component("users");
$app->load_component("company");
$app->load_component("companyorganization");
$app->load_component("notifications");
$app->load_component("routeplayback");
$app->load_component("mappedreports");

// Add application scripts and styles
$app->set_layout("private");
$app->set_view("mapped-reporting");
$app->add_component_js("jquery", "jquery.scrollTo-min");

$app->add_component_js("mappedreporting", "search");
//$app->add_js("/js/reports.js");

//$app->add_css("/css/reports.css");

//$app->add_component_js("events", "event-mapping");




$app->add_css("/css/master.css");
$app->obtain_mapped_report_request_information();
$app->render();
?>