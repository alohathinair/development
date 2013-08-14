<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

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
$app->load_component("dashboard");
$app->load_component("devices");
$app->load_component("companyorganization");
$app->load_component("reports");

// Add application scripts and styles
$app->set_layout("private");

$app->set_view("dashboard");

$app->add_css("/css/master.css");
$app->add_css("/css/dashboard.css");
$app->add_js("/js/dashboard.js");
$app->add_component_js("jquery", "daterangepicker.jQuery");
$app->add_component_js("jqueryui", "jquery.ui.ufd.min");
$app->add_component_js("jquery", "jquery.loadmask.min");

$app->add_component_css("jquery", "jquery.loadmask");
$app->add_component_css("jqueryui", "ufd-base");
$app->add_component_css("jqueryui", "plain/plain");
$app->add_component_css("jquery", "ui.daterangepicker");

$app->obtain_dashboard_request_information();

$app->render();
?>