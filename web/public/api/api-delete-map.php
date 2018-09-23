<?php

//************************************************
//	Delete map
//************************************************

require_once "../meta.php";

if( $currentUserID == ""){
      echo '{"status":"error"}';
    exit;
  }

// Validate API key
$apiPassword = API_PASSWORD;
$phase_api_key = clean($_GET['fAY2YfpdKvR']);
$phaseRole = clean($_GET['role']);
$phaseSchool = clean($_GET['school']);
$mapID = clean($_GET['id']);

$filePath = "";
$fileSchool = "";
$uploadDirectory = "../map-upload/";

$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASSWORD;
$databasename = DB_NAME;

if( $apiPassword !== $phase_api_key){
  	echo '{"status":"error"}';
	  exit;
}

if( $phaseRole !== "1" && $phaseRole !== "2" ){
  	echo '{"status":"error"}';
    exit;
}

if ($currentUserRole != 1 && $currentUserRole!=2){
    echo '{"status":"error"}';
    exit;   
}


if( $phaseSchool == "" ){
  	echo '{"status":"error"}';
	  exit;
}

if( $mapID == "" ){
    echo '{"status":"error"}';
    exit;
}

$conn = new mysqli($servername, $username, $password, $databasename);
    if ($conn->connect_error) {
        die("Connection error: " . $conn->connect_error);
        exit;
    }

$sql = "SELECT * FROM Map WHERE mapID = '$mapID' ";   


$result = $conn->query($sql);
  if(!$result) {
    die("Error: " . $conn->error);
  }

if ($result->num_rows==1){ 
    while($row = $result->fetch_assoc()) {
    $filePath = $row["FileName"];
    $fileSchool = $row["InstID"];
  }
} else {
  echo '{"status":"error"}';
  exit;
}

if( $phaseSchool !== $fileSchool ){
    echo '{"status":"error"}';
    exit;
    $conn->close();
}

$sql = "DELETE FROM Map WHERE mapID = '$mapID' ";

$result = $conn->query($sql);
  if(!$result) {
    die("Error: " . $conn->error);
  }

$conn->close();

unlink( $uploadDirectory . DIRECTORY_SEPARATOR . $filePath ); 

echo '{"status":"ok"}';

?>