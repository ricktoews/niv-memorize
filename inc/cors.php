<?php
/**
 * Cross Origin Resource Sharing
 *
 * Allow javascript to access routes from other domains
 *
 */

// get app instance
$slim = Slim::getInstance();

// send CORS access control header if http_origin is
// allowed via allow_xhr_origin call
//send header saying its ok to access from $origin
$origin = $_SERVER['HTTP_ORIGIN'];
$slim->response()->header( 'Access-Control-Allow-Origin',      $origin );
$slim->response()->header( 'Access-Control-Allow-Methods',     'GET,PUT,POST,DELETE');
$slim->response()->header( 'Access-Control-Allow-Headers',     'orgin, content-type, accept, x-requested-with');
$slim->response()->header( 'Access-Control-Allow-Credentials', 'true');

