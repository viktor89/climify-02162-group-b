<?php 

//************************************************
//	Update company user password
//************************************************

require_once "../admin-meta.php";
require_once "../session.php";

$phaseSessionToken = clean($_POST[sessionToken]);

if( $phaseSessionToken != $adminSessionToken ){
    echo '{"status":"error"}';
    exit;
}
if (!$systemAccess) {
    echo '{"status":"error"}';
    exit;
}

$phaseUserId = clean($_POST["userid"]);

if ($phaseUserId == "") {
    echo '{"status":"error"}';
    exit;
}

$rand_pass_num = array("A","B","C","D","E","F","G","H","I","J");
$rand_pass_sym = array("!","@");
$setUserPass = bin2hex(openssl_random_pseudo_bytes(3)).$rand_pass_sym[array_rand($rand_pass_sym)].$rand_pass_num[array_rand($rand_pass_num)];
$encryptedPass = encrypt($setUserPass, ENCRYPTION_KEY_USERS);

$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASSWORD;
$databasename = DB_NAME;

$conn = new mysqli($servername, $username, $password, $databasename);
if ($conn->connect_error) {
    die("Connection error: " . $conn->connect_error);
    exit;
}

$stmt = $conn->prepare("UPDATE icm_users_system SET userPassword = ? WHERE userID = ?");

$stmt->bind_param("ss", $encryptedPass, $phaseUserId);

if ($stmt->execute()) { 
    echo '{"status":"ok", "pass":"'.$setUserPass.'"}';
} else {
    echo '{"status":"error"}';
}

$stmt->close();
$conn->close();

?>