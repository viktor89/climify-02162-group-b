<?php 

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
define('DB_NAME', 'ic-meter-development');

/** MySQL database username */
define('DB_USER', 'system');

/** MySQL database password XXX */
define('DB_PASSWORD', 'XXX-PASSWORD-XXX');

/** MySQL hostname */
define('DB_HOST', 'localhost:3306');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

// ** Signin-token XXX ** //
define("SIGNIN_TOKEN", "XXX");

// ** Encryption-key XXX ** //
define("ENCRYPTION_KEY", "XXX");

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
	$accessToken = "";
	$tokenValidTime = "";



if ($currentUserCompanyID) {
	// ** API-password ** //
	require_once "token.php"; // TOKEN FJERNET
	define('API_PASSWORD', $api_key);
}

    // Pass SIGNIN_TOKEN onto login.js
    if ($_POST['fileName'] == "login") {
        echo '{"senderFirst":"' . SIGNIN_TOKEN . '"}';
        exit;
    }

?>