<?php

//************************************************
//	Update new building
//************************************************

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

$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASSWORD;
$databasename = DB_NAME;

$buildingID = clean($_POST['id']);
$buildingName = clean($_POST['name']);
$buildingDecription = clean($_POST['decription']);
$MunID = clean($_POST['MunID']);


if( $buildingID == ""){
    echo '{"status":"error"}';
    exit;
}





$conn = new mysqli($servername, $username, $password, $databasename);
if ($conn->connect_error) {
    die("Connection error: " . $conn->connect_error);
    exit;
}




if ($buildingName){
    $stmt = $conn->prepare("UPDATE Institution SET InstName=? WHERE InstID=?");
    $stmt->bind_param("si", $buildingName, $buildingID);

    if (!$stmt->execute()) { 
        echo '{"status":"error"}';
        $conn->close();
        exit;
    } else {
        echo '{"status":"ok"}';
    }

    $stmt->close();
}



$conn->close();

?>
