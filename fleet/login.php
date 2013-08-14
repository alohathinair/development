<?php
define("APP_ROOT", ".");
require_once(APP_ROOT . "/loadlibs.php");

$app = new TAWFrameworkRendered();

// Make sure they aren't already logged in. If they are, lets forward them to the proper interface
if (!$app->has_postdata() && $app->login()) {

}

// Do the login if we have post data
if ($app->has_postdata()) {
    $remember_me = isset($_POST["remember_me"]) ? ($_POST["remember_me"] == 1) : false;
    $site = isset($_POST["site"]) ? $_POST["site"] : null;
    if ($app->login($_POST["email"], $_POST["password"], $remember_me, $site)) {
        $app->redirect("/");
    }
}

if (isset($_POST["newlogin"])) {
	if ($_POST["newlogin"] == "yes") {
    $app->redirect("/login.php?invalid=1");
	}
}

// We need to load our custom language file
$app->load_lang("lang.yml");

// Show our layout. Since we don't need a viewing system since it's just two pages for this tawf application we just use a layout
$app->set_layout("login");
$app->render();
?>