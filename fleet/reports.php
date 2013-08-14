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
$app->load_component("googlemaps");
$app->load_component("events");
$app->load_component("devices");
$app->load_component("users");
$app->load_component("company");
$app->load_component("companyorganization");
$app->load_component("notifications");
$app->load_component("reports");
$app->load_component("routeplayback");
$app->load_component("mappedreports");
$app->load_component("graphedreports");

// Add application scripts and styles
$app->set_layout("private");
$app->set_view("reports");


$app->add_component_js("jquery", "jquery.selectboxes.min");
$app->add_component_js("jquery", "jquery.scrollTo-min");
$app->add_component_js("jquery", "jquery-ui-timepicker");
$app->add_component_js("jquery", "jquery.loadmask.min");
$app->add_component_js("jquery", "jquery.validate.min");
$app->add_component_js("jquery", "jquery.paginate");
$app->add_component_js("jqueryui", "jquery.ui.ufd.min");

$app->add_css("/css/master.css");
$app->add_component_css("reports", "reports_layout");

$app->add_component_css("jquery", "jquery.loadmask");
$app->add_component_css("jquery", "jquery.paginate");
$app->add_component_css("jqueryui", "ufd-base");
$app->add_component_css("jqueryui", "plain/plain");

$app->add_component_js("reports", "reports");
$app->add_component_js("reports", "reports-schedule");
$app->add_component_js("events", "event-mapping");
$app->obtain_report_request_information();
$app->configure_report_direction();

// Add report-specific javascript & css
if ($app->report_type != "placeholder") {
    
    $report = $app->create_report($app->report_type);
    $include = $report->get_report_includes();

    if ($include != '') {
        $app->add_component_js("reports", $include . "_report");
        $app->add_component_css("reports", $include . "_report");
    }
}

/*$params = $app->get_report_parameters("/Reports/Driver Events");
print_r($params);
*/
$app->render();
?>