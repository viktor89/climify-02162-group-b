<?php

//************************************************
//	Delete buildings
//************************************************

//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once "../meta.php";

if( $currentUserID == ""){
    echo '{"status":"error"}';
    exit;
}

// Validate API key
$apiPassword = API_PASSWORD;
$phase_api_key = clean($_POST['fAY2YfpdKvR']);



if( $apiPassword !== $phase_api_key){
    echo '{"status":"error"}';
    exit;
} 

$buildingID = clean($_POST['buildingID']);



if( $buildingID == ""){
    echo '{"status":"error"}';
    exit;
}

if( intval($currentUserRole) !== 1){
    echo '{"status":"error"}';
    exit;
}

$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASSWORD;
$databasename = DB_NAME;

$conn = new mysqli($servername, $username, $password, $databasename);
if ($conn->connect_error) {
    die("Connection error: " . $conn->connect_error);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM Institution WHERE InstID = ?");

$stmt->bind_param("i", $buildingID);    

if (!$stmt->execute()) { 
    echo '{"status":"error"}';
    $conn->close();
    exit;
} 

$result = $stmt->get_result();

if ($result->num_rows!==1){
    echo '{"status":"error"}';
    $conn->close();
    exit;
} 


$row = $result->fetch_assoc();
    $MunID = $row["MunID"];


if ($currentUserCompanyID!==$MunID){
    echo "currentUserCompanyID " . $currentUserCompanyID;
    echo " MunID " .$MunID;
    echo '{"status":"error"}';
    $conn->close();
    exit;
}



$stmt->close();


$stmt = $conn->prepare("DELETE FROM Institution WHERE InstID = ?");
$stmt->bind_param("i", $buildingID);

if (!$stmt->execute()) { 
    echo '{"status":"error"}';
    $conn->close();
    exit;
}

$stmt->close();

$conn->close();    	

echo '{"status":"ok"}';

?>

