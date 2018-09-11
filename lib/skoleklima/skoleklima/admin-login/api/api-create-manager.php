<?php 

//************************************************
//	Create Companye Users
//************************************************

require_once "../admin-meta.php";
require_once "../session.php";

$phaseSessionToken = clean($_POST[sessionToken]);
$pepper = HASH_PEPPER;

if( $phaseSessionToken != $adminSessionToken ){
    echo '{"status":"error"}';
    exit;
}
if (!$systemAccess) {
    echo '{"status":"error"}';
    exit;
}

$phaseUsername = clean(strtolower($_POST["username"]));
$phasePassword = clean(strtolower($_POST["password"]));



if( strlen($phaseUsername) < 4 || strlen($phaseUsername) > 8 || preg_match('/\s/',$phaseUsername)){
    echo '{"status":"error"}';
    exit;
}



$phasePasswordPepper = $phasePassword.$pepper;
$hashed_pass = password_hash($phasePasswordPepper, PASSWORD_DEFAULT, ["cost"=>10]);

$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASSWORD;
$databasename = DB_NAME;

$conn = new mysqli($servername, $username, $password, $databasename);
if ($conn->connect_error) {
    die("Connection error: " . $conn->connect_error);
    exit;
}

$nul=0;
$null=null;
$Blocked=1;

$stmt = $conn->prepare("INSERT INTO DTUManager values (?,?,?,?,?)");

$stmt->bind_param("isssi",$nul,$phaseUsername,$hashed_pass,$null,$Blocked);

if($stmt->execute()){
    echo '{"status":"ok","pass":"'. $setUserPass .'"}';
}

else{
    echo '{"status":"error"}';
    exit;
}

$stmt->close();








$conn->close();
?>