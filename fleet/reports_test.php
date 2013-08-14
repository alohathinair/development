<?php
define("APP_ROOT", ".");
require_once(APP_ROOT . "/loadlibs.php");

$app = new TAWFrameworkRendered();

// Ensure we're logged in
if (!$app->login()) {
	$app->redirect(LOGIN_URL);
}

    ini_set('display_errors', 1);
    error_reporting(E_ALL | E_STRICT);
    
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
/*$app->load_component("mappedreports");
$app->load_component("graphedreports");
*/
// Add application scripts and styles

$app->set_layout("private");
$app->set_view("reports");


$app->add_component_js("jquery", "jquery.selectboxes.min");
$app->add_component_js("jquery", "jquery.scrollTo-min");
$app->add_component_js("jquery", "jquery-ui-timepicker");
$app->add_component_js("jqueryui", "jquery.ui.ufd.min");


$app->add_css("/css/master.css");
$app->add_component_css("reports", "reports_layout");

$app->add_component_css("jqueryui", "ufd-base");
$app->add_component_css("jqueryui", "plain/plain");

$app->add_component_js("reports", "reports");
$app->add_component_js("events", "event-mapping");
//$app->obtain_report_request_information();
$app->configure_report_direction();

// Add report-specific javascript & css
if ($app->report_type != "placeholder") {
	$app->add_component_js("reports", $app->report_type . "_report");
	$app->add_component_css("reports", $app->report_type . "_report");
}

$app->render();

// TODO - Check all this, it should go somewhere else
try {

    $reports = $app->get_report_list();
   
   // print_r($reports);

    $params = $app->get_report_parameters("/Reports/Driver Events");
    foreach($params as $param) {
        print_r($param->ValidValues);
        echo count($param->ValidValues);
    }
    
} catch (SSRSReportException $serviceException) {
    echo $serviceException->GetErrorMessage();
}

?>
