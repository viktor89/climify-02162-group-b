<?php 

//************************************************
//	Update database info
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

$phaseID = clean($_POST["id"]);
$phaseName = clean($_POST["name"]);
$phaseUser = clean($_POST["user"]);
$phasePass = clean($_POST["pass"]);

if ($phaseID == "") {
    echo '{"status":"error"}';
    exit;
}
if ($phaseName == "") {
    echo '{"status":"error"}';
    exit;
}
if ($phaseUser == "") {
    echo '{"status":"error"}';
    exit;
}
if ($phasePass == "") {
    echo '{"status":"error"}';
    exit;
}

$returnFromIfx = file_get_contents("http://193.200.45.37:8086/query?u=".$phaseUser."&p=".$phasePass."&db=".$phaseName."&q=SHOW%20MEASUREMENTS%20limit%201");

$returnFromIfx = json_decode($returnFromIfx, true);

if ($returnFromIfx[results][0][series][0][name] != "measurements") {
    echo '{"status":"error", "message": "wrongInfo"}';
    exit;
}

$phasePass = encrypt($phasePass, ENCRYPTION_KEY_INFLUX);

$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASSWORD;
$databasename = DB_NAME;

$conn = new mysqli($servername, $username, $password, $databasename);
if ($conn->connect_error) {
    die("Connection error: " . $conn->connect_error);
    exit;
}

$stmt = $conn->prepare("UPDATE icm_users_company SET 
dbUser = ?, dbPass = ?, dbName = ? 
WHERE companyID = ?");

$stmt->bind_param("ssss", $phaseUser, $phasePass, $phaseName, $phaseID);

if ($stmt->execute()) { 
    echo '{"status":"ok"}';
} else {
    echo '{"status":"error"}';
    $stmt->close();
    $conn->close();
    exit;
}

$stmt->close();
$conn->close();

?>
