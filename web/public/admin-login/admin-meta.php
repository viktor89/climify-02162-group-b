<?php 

// ** Conpany meta info ** //
$software_Name = "Klimaovervågning";
$company_Name = "DTU Compute";
$system_version = "1.0.0";

// ** Set server time ** //
date_default_timezone_set('Europe/Copenhagen');

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'skoleklima');

/** MySQL database username */
define('DB_USER', 'skoleklima');

/** MySQL database password XXX */
define('DB_PASSWORD', 'skoleklima');

/** MySQL hostname XXX */
define('DB_HOST', 'mysqldb:3306');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. s*/
define('DB_COLLATE', '');

// ** Encryption-key XXX ** //
define("ENCRYPTION_KEY", "XXX");

// ** Encryption-key XXX ** //
define("ENCRYPTION_KEY_USERS", "XXX");

// ** Encryption-key XXX ** //
define("HASH_PEPPER", "XXX");

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
	$systemAccess = $_SESSION['adminAccess'];
?>
