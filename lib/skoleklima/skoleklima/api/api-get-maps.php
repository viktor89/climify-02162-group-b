<?php

//************************************************
//	Get maps
//************************************************

require_once "../meta.php";

if( $currentUserID == ""){
	  	echo '{"status":"error"}';
		exit;
	}

// Validate API key
$apiPassword = API_PASSWORD;
$phase_api_key = clean($_GET['fAY2YfpdKvR']);
$phaseSchool = clean($_GET['school']);

$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASSWORD;
$databasename = DB_NAME;


if( $apiPassword !== $phase_api_key){
  	echo '{"status":"error"}';
	exit;
}

if( $phaseSchool == "" ){
  	echo '{"status":"error"}';
	exit;
}

$conn = new mysqli($servername, $username, $password, $databasename);
        if ($conn->connect_error) {
            die("Connection error: " . $conn->connect_error);
            exit;
        }

//fetch table rows from mysql db
$sql = "SELECT * FROM Map WHERE InstID = '$phaseSchool' ORDER BY MapName ASC"; 

$result = mysqli_query($conn, $sql) or die("Error in Selecting " . mysqli_error($conn));
    
//create an array
$emparray = array();
while($row = mysqli_fetch_assoc($result))
{
    $emparray[] = $row;
}

//echo "$phaseSchool = " . $phaseSchool;


$sajMaps = json_encode( $emparray , JSON_UNESCAPED_UNICODE );
echo $sajMaps;

$conn->close();


?>