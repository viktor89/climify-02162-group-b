<?php

//************************************************
//	Get users to be activated from specifik admin
//************************************************

require_once "../meta.php";

if( $currentUserID == ""){
	  	echo '{"status":"error"}';
		exit;
}

// Validate API key
$apiPassword = API_PASSWORD;
$phase_api_key = clean($_GET['fAY2YfpdKvR']);
$userID = clean($_GET['userID']);

if( $apiPassword !== $phase_api_key){
  	echo '{"status":"error"}';
	exit;
}

$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASSWORD;
$databasename = DB_NAME;



//fetch table rows from mysql db
$sql = "SELECT NewUserID FROM UserActivate WHERE AdminUserID = '$userID'"; 

$result = mysqli_query($conn, $sql) or die("Error in Selecting " . mysqli_error($conn));
	
$emparray = array();
while($row = mysqli_fetch_assoc($result))
{	
	
	$newID = $row["NewUserID"];
	//echo $newID;


	$sql1 = "SELECT UserName, FirstName, LastName, Email FROM Person WHERE UserID = '$newID'"; 
	$result1 = mysqli_query($conn, $sql1) or die("Error in Selecting " . mysqli_error($conn));
	$person = mysqli_fetch_assoc($result1);
	
	$temparray = [];
	array_push($temparray[UserName] =  $person["UserName"]);
	array_push($temparray[Email] =  $person["Email"]);
	array_push($temparray[FirstName] =  $person["FirstName"]);
	array_push($temparray[LastName] =  $person["LastName"]);

	array_push(	$emparray, $temparray);
}




$userActivate = json_encode( $emparray , JSON_UNESCAPED_UNICODE );
echo $userActivate;

$conn->close();


?>