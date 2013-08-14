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
$app->load_component("geocoder");

$app->load_component("company");
$app->load_component("devices");
$app->load_component("landmarks");
$app->load_component("users");

$app->load_component("events");
$app->load_component("notifications");
$app->load_component("routeplayback");

$app->load_component("jqtip");
$app->add_component_js("companyorganization", "organization");

// The all-important live-view component for providing us all the stuff we need for a live view!
$app->load_component("liveview");

// Add application scripts and styles
$app->set_layout("private");
$app->set_view("liveview");

$app->add_js("/js/liveview.js");
$app->add_css("/css/master.css");
$app->add_css("/css/liveview.css");

$app->render();
?>