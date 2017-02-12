<?php
session_start();
require 'vendor/autoload.php';
require 'cgi-bin/connect.php';
require 'inc/maxverse.php';

if (spl_autoload_register(function($class) {
    $path = __DIR__ . '/inc/classes/' . $class . '.php';
    require_once $path;
})) {
}
else {
    echo "Evidently there was a problem loading $class<br/>";
}

$app = new \Slim\Slim();
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '*';
$app->response()->header( 'Access-Control-Allow-Origin',      $origin );
$app->response()->header( 'Access-Control-Allow-Methods',     'GET,PUT,POST,DELETE');
$app->response()->header( 'Access-Control-Allow-Headers',     'orgin, content-type, accept, x-requested-with');
$app->response()->header( 'Access-Control-Allow-Credentials', 'true');

$app->response()->header('Content-Type', 'application/json');

$app->put('/login', 'login');
$app->put('/logout', 'logout');
$app->put('/saveresult', 'saveResult');
$app->put('/remedial', 'saveRemedial');
$app->get('/check/:user_id/:text_table/:verse_id', 'checkPreviousDrill');
$app->get('/sources/bible(/:start)', 'getBibleSources');
$app->get('/getpassage/:book(/:chapter)(/:verse)', 'getPassage');
$app->get('/titlematches/:str', 'getTitleMatches');
$app->get('/poems', 'getPoetryTitles');
$app->get('/poem/:name', 'getPoetry');
$app->post('/passage', 'savePassage');


function login() {
	$app = new \Slim\Slim();
	$data = json_decode($app->request()->getBody());

	if (isset($data->fb_user_id)) {
		$fb_user_id = $data->fb_user_id;
		$login = Login::login_with_fb($fb_user_id);
		// Probably should set session: $login['id'], $fb_user_id;
	}
	else {
		$login = array('msg' => 'No fb_user_id specified');
	}

	echo json_encode($login);
}

function logout() {
	$payload = Login::logout();

	echo json_encode($payload);
}

function saveResult() {
	$app = new \Slim\Slim();
	$data = json_decode($app->request()->getBody());
	$result = Drill::saveResult($data);

	echo json_encode($result);
}

function saveRemedial() {
	$app = new \Slim\Slim();
	$data = json_decode($app->request()->getBody());
	$result = Drill::saveRemedial($data);

	echo json_encode($result);
}

function checkPreviousDrill($user_id, $text_table, $verse_id) {
	$results = Drill::checkPreviousDrill($user_id, $text_table, $verse_id);

	echo json_encode($results);
}

function getBibleSources($start = null) {
    $src = new Sources('bible');
    $data = $src->getSources();
	$books = array_map(function($item) { return $item['name']; }, $data);
	if ($start !== null) {
		$books = array_filter($books, function($book) use ($start) { return $start == strtolower(substr($book, 0, strlen($start))); });
	}
    echo json_encode($books);
}

function getPassage($book, $chapter = null, $verse = null) {
    $psg = new Passage($book, $chapter, $verse);
    $data = $psg->getScriptureText();
    echo json_encode($data);
}

function getTitleMatches($str) {
    $matches = new TitleMatches();
    $data = $matches->get($str);
    echo json_encode($data);
}

function getPoetryTitles() {
	$dir = './modules/memory/memtext/';
	$dh = opendir($dir);
	$entries = array();
	while ($entry = readdir($dh)) {
		if (preg_match('/^(.+)\.txt$/', $entry, $matches))
			$entries[] = $matches[1];
	}
	$data = array(
		'entries' => $entries,
	);

	echo json_encode($data);
	
}

function getPoetry($name) {
	$file = './modules/memory/memtext/' . $name . '.txt';
	$str = file_get_contents($file);
	list($title, $text) = explode("\n", $str, 2);
	$stanzas = array_map(function($stanza) { return explode("\n", $stanza); }, explode("\n\n", $text));
	$data = array(
		'title' => $title,
		'text' => $stanzas,
	);
	echo json_encode($data);
	
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function savePassage() {
	$app = new \Slim\Slim();;
	$data = json_decode($app->request()->getBody());

	$book_id = $data->book_id;
	$chapter = $data->chapter;
	$verse = $data->verse;
	$pattern = $data->pattern;
	$psg = new Passage($book_id, $chapter, $verse);
	$result = $psg->save($pattern);

	echo json_encode($result);
}

$app->run();
