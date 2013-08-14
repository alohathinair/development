<?php
define("APP_ROOT", ".");
require_once(APP_ROOT . "/loadlibs.php");

$app = new TAWFrameworkRendered();

unset($_SESSION["tawuser"]);

header("Location: /");
?>
