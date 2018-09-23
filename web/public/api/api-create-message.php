<?php

//************************************************
//	Create message
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
$phase_api_key = clean($_POST['fAY2YfpdKvR']);

if( $apiPassword !== $phase_api_key){
    echo '{"status":"error"}';
    exit;
} 

$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASSWORD;
$databasename = DB_NAME;

$phaseUserID = clean($_POST['userID']);
$phaseSchool = clean($_POST['school']);
$phaseType = clean($_POST['type']);
$LocationID = clean($_POST['LocationID']);
$currentTime = date("Y-m-d");

$phaseTitle = clean($_POST['title']);
$phaseBody = clean($_POST['body']);
$phaseBody = nl2br ( $phaseBody, true );

if( $phaseUserID == ""){
    echo '{"status":"error"}';
    exit;
} 

/*
	if (!in_array($phaseType, array("1","2"), true )) {
		echo '{"status": "error"}';
		exit;
	}
	*/


if( $phaseTitle == ""){
    echo '{"status":"error"}';
    exit;
} 


if( $phaseBody == ""){
    echo '{"status":"error"}';
    exit;
} 

$conn = new mysqli($servername, $username, $password, $databasename);
if ($conn->connect_error) {
    die("Connection error: " . $conn->connect_error);
    exit;
}

/*

	$stmt = $conn->prepare("INSERT INTO icm_messages ( messageType, school, title, body, author, icMeter, postDate) values (?,?,?,?,?,?,?)");

	$stmt->bind_param("sssssss", $phaseType, $phaseSchool, $phaseTitle, $phaseBody, $phaseUserID, $phaseBoxQR, $currentTime);


	$nul = 0;

*/

$nul = 0;







if ($phaseType==1 && ($currentUserRole==1 || $currentUserRole==2 || $currentUserRole==3)){
    
       $stmt = $conn->prepare("INSERT INTO Message values (?,?,?,?,?)");

    $stmt->bind_param("iisss",$nul,$phaseUserID,$currentTime,$phaseTitle,$phaseBody);


    if ($stmt->execute()) { 
        echo '{"status":"ok"}';

        $MsgID = $conn->insert_id;
    } else {
        echo '{"status":"error"}';

    }
    $stmt->close();



    $stmt = $conn->prepare("INSERT INTO Logbook values (?,?)");

    $stmt->bind_param("ii",$MsgID,$LocationID);

    $stmt->execute();
    
    $stmt->close();



}


else if ($phaseType==2 && ($currentUserRole==1 || $currentUserRole==2 )){
    
       $stmt = $conn->prepare("INSERT INTO Message values (?,?,?,?,?)");

    $stmt->bind_param("iisss",$nul,$phaseUserID,$currentTime,$phaseTitle,$phaseBody);


    if ($stmt->execute()) { 
        echo '{"status":"ok"}';

        $MsgID = $conn->insert_id;
    } else {
        echo '{"status":"error"}';

    }
    $stmt->close();

    //echo "phaseSchool " . $phaseSchool;

 $stmt = $conn->prepare("INSERT INTO News values (?,?)");

    $stmt->bind_param("ii",$MsgID,$phaseSchool);

    $stmt->execute();
    
    $stmt->close();


}




$conn->close();

?>