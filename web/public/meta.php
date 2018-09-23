<?php
error_reporting(0);
// ** Conpany meta info ** //
$software_Name = "Climate monitoring";
$company_Name = "DTU Compute";
$company_Email = "magbac@dtu.dk";

require_once "version.php";

// ** Set server time ** //
date_default_timezone_set('Europe/Copenhagen');

// ** Website url ** //
$company_Website = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', getenv('MYSQL_DATABASE'));

/** MySQL database username */
define('DB_USER', getenv('MYSQL_USER'));

/** MySQL database password XXX */
define('DB_PASSWORD', getenv('MYSQL_PASSWORD'));

/** MySQL hostname XXX */
define('DB_HOST', getenv('MYSQL_HOST').':3306');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

// ** Signin-token XXX ** //
define("SIGNIN_TOKEN", "h8e0cebb05f8e003aa2a6a4f4dcfa51a");

// ** Encryption-key XXX ** //
define("ENCRYPTION_KEY", "XXX");
define("ENCRYPTION_KEY_INFLUX", "XXX");

$illegal_Usernames = ["root", "admin", "administrator", "webadmin", "sysadmin", "netadmin", "guest", "user", "web", "test", "testing", "mail", "email", "expert", "ftp", "help", "hr", "info", "manager", "marketing", "mysql", "office", "password", "pass", "postmaster", "support", "upload", "uploader", "www", "data", "www-data", "system"];

function encrypt($string, $key) {
	$iv = mcrypt_create_iv(
    mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC),
    MCRYPT_DEV_URANDOM
	);
	$encrypted = base64_encode(
	    $iv .
	    mcrypt_encrypt(
	        MCRYPT_RIJNDAEL_128,
	        hash('sha256', $key, true),
	        $string,
	        MCRYPT_MODE_CBC,
	        $iv
	    )
	);
	return $encrypted;
}

function decrypt($string, $key) {
	$data = base64_decode($string);
	$iv = substr($data, 0, mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC));
	$decrypted = rtrim(
	    mcrypt_decrypt(
	        MCRYPT_RIJNDAEL_128,
	        hash('sha256', $key, true),
	        substr($data, mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC)),
	        MCRYPT_MODE_CBC,
	        $iv
	    ),
	    "\0"
	);
	return $decrypted;
}

function clean($e) {
    $e = strip_tags($e);
    $e = htmlspecialchars($e, ENT_QUOTES);
    return ($e);
}

session_start();

$currentUserID = $_SESSION['userID'];
$currentUserName = $_SESSION['userName'];
$currentUserRole = $_SESSION['userRole'];
$currentUserFirstName = $_SESSION['userFirstName'];
$currentUserLastName = $_SESSION['userLastName'];
$currentUserEmail = $_SESSION['userEmail'];
$currentUserSchoolAllowed = $_SESSION['schoolAllowed'];
$currentUserLastLogin = $_SESSION['lastLogin'];
$currentUserCompanyID = $_SESSION['companyID'];
$InstID = $_SESSION['schoolAllowed'];
$currentUserSchoolAllowedName = $_SESSION['schoolAllowedName'];
$currentPermLogbook = $_SESSION['permLogbook'];
$accessToken = "";
$tokenValidTime = "";

// Current company Influx Database login information - is set when user sign in
$influxName = $_SESSION['infN']; // Influx db name
$influxUser = $_SESSION['infU']; // Influx db user
$influxPass = $_SESSION['infP']; // Influx db pass
$influxPass = decrypt($influxPass, ENCRYPTION_KEY_INFLUX);

if ($currentUserCompanyID) {
	// ** API-password ** //
	require_once "token.php"; // TOKEN FJERNET
	define('API_PASSWORD', $api_key);
}

?>