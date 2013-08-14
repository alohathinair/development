<?php

define("APP_ROOT", ".");
require_once(APP_ROOT . "/loadlibs.php");

$app = new TAWFramework();

// Ensure we're logged in
if (!$app->login()) {
	$app->redirect(LOGIN_URL);
}

// Load all components
$app->load_component("jquery"); // We provide jquery to satisfy the requirements of most of our components js features, but they won't be used

$app->load_component("company");
$app->load_component("events");
$app->load_component("users");
$app->load_component("devices");
$app->load_component("landmarks");

$app->load_component("liveview");
$app->load_component("alerttemplates");
$app->load_component("reports");
$app->load_component("companyorganization");
$app->load_component("devicemanagement");
$app->load_component("alertrules");
$app->load_component("usermanagement");
$app->load_component("mappedreports");
$app->load_component("graphedreports");

if (!isset($_REQUEST["action"])) {
	die("You must provide an action");
}

$action = $_REQUEST["action"];

$app->$action();


?>