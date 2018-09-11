<?php

//************************************************
//	Upload map
//************************************************

//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//error_reporting(E_ALL);

require_once "../meta.php";



if( $currentUserID == ""){
      echo '{"status":"error"}';
    exit;
  }

// Validate API key
$apiPassword = API_PASSWORD;
$phase_api_key = clean($_GET['fAY2YfpdKvR']);
$phase_school = clean($_GET['school']);
$phaseRole = clean($_GET['role']);
$phaseTitle = clean($_GET['title']);

$uniqid = uniqid();
$fname = $uniqid . ".png";

$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASSWORD;
$databasename = DB_NAME;

// TODO: WAIT UNTIL MERGE
/*
if( $apiPassword !== $phase_api_key){
  	echo '{"status":"error"}';
	exit;
}
*/

if( $phaseRole !== "1" && $phaseRole !== "2" ){
  	echo '{"status":"error"}';
	exit;
}

if( $phase_school == "" ){
  	echo '{"status":"error"}';
	exit;
}

if( $phaseTitle == "" ){
  	echo '{"status":"error"}';
	exit;
}

$validateImage = getimagesize($_FILES['file']['tmp_name']);
if($validateImage['mime'] != 'image/png' && $validateImage['mime'] != 'image/gif' && $validateImage['mime'] != 'image/jpeg') {
    echo '{"status":"error"}';
    exit;
}

if(isset($_FILES['file']) and !$_FILES['file']['error']){
    move_uploaded_file($_FILES['file']['tmp_name'], "../map-upload/" . $fname);
} else {
	echo '{"status":"error"}';
	exit;
}

$conn = new mysqli($servername, $username, $password, $databasename);
    if ($conn->connect_error) {
        die("Connection error: " . $conn->connect_error);
        exit;
    }

$nul = 0;

$sql = "SELECT InstID FROM Institution WHERE InstName = '$phase_school';";

$InstID = $conn->query($sql);

$stmt = $conn->prepare("INSERT INTO Map values(?,?,?,?)"); 

$stmt->bind_param("iiss",$nul, $InstID ,$fname, $phaseTitle);

if ($stmt->execute()){
    $stmt->close();

    // Fetch the foreign key MapID
    $sql = "SELECT MAX(MapID) as MapID FROM Map";
    
    $result = $conn -> query($sql);
    if (!$result) {
      die("Error in Selecting " . $conn->error);
    }

    if ($result -> num_rows == 1) {
      while($row = $result->fetch_assoc()) {
        $mapID = $row["MapID"];
      }
    }

    echo '{"status":"ok","mapID":"' . $mapID . '"}';
} else {
    die("Error: " . $conn->error);
    exit;
}

$conn->close();

?>