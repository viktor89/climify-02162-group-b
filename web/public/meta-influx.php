<?php 
//session_start();
require 'vendor/autoload.php';
// ** Conpany meta info ** //
$software_Name = "Klimaovervågning";
$company_Name = "DTU Compute";
$company_Email = "magbac@dtu.dk";

require_once "version.php";

// ** Set server time ** //
date_default_timezone_set('Europe/Copenhagen');

// ** Website url ** //
$company_Website = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME_INFLUX', getenv('MYSQL_DATABASE'));

/** MySQL database username */
define('DB_USER', getenv('INFLUXDB_USER'));

/** MySQL database password XXX */
define('DB_PASSWORD', getenv('INFLUXDB_USER_PASSWORD'));

/** MySQL hostname XXX */
define('DB_HOST_INFLUX', 'influx-db');

define('DB_PORT_INFLUX', '8086');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

// ** Signin-token XXX ** //
//define("SIGNIN_TOKEN", "XXX");

// ** Encryption-key XXX ** //
define("ENCRYPTION_KEY", "XXX");

$illegal_Usernames = ["root", "admin", "administrator", "webadmin", "sysadmin", "netadmin", "guest", "user", "web", "test", "testing", "mail", "email", "expert", "ftp", "help", "hr", "info", "manager", "marketing", "mysql", "office", "password", "pass", "postmaster", "support", "upload", "uploader", "www", "data", "www-data", "system"];



//session_start();
/*
	$currentUserID = $_SESSION['userID'];
	$currentUserName = $_SESSION['userName'];
	$currentUserRole = $_SESSION['userRole'];
	$currentUserFirstName = $_SESSION['userFirstName'];
	$currentUserLastName = $_SESSION['userLastName'];
	$currentUserEmail = $_SESSION['userEmail'];
	$currentUserSchoolAllowed = $_SESSION['schoolAllowed'];
	$currentUserLastLogin = $_SESSION['lastLogin'];
	$currentUserCompanyID = $_SESSION['companyID'];
	$accessToken = "";
	$tokenValidTime = "";

if ($currentUserCompanyID) {
	// ** API-password ** //
	require_once "token.php"; // TOKEN FJERNET
	define('API_PASSWORD', $api_key);
}*/

?>