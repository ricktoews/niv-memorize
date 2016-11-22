<?php
if (spl_autoload_register(function($class) {
    $path = __DIR__ . '/' . $class . '.php';
    require_once $path;
})) {
}
else {
    echo "Evidently there was a problem loading $class<br/>";
}

