<?php
define("APP_ROOT", ".");
require_once(APP_ROOT . "/loadlibs.php");

$app = new TAWFrameworkRendered();

// Make sure they aren't already logged in. If they are, lets forward them to the proper interface
if (!$app->has_postdata() && $app->login()) {
	
} 

// Do the login if we have post data
if ($app->has_postdata()) {
	if ($app->login($_POST["email"], $_POST["password"])) {
		$app->redirect("/");
	}
}

// We need to load our custom language file
$app->load_lang("lang.yml");

// Show our layout. Since we don't need a viewing system since it's just two pages for this tawf application we just use a layout
$app->set_layout("login");
$app->render();
?>