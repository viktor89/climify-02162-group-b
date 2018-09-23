<?php

//************************************************
//	Get messages
//************************************************

require_once "../meta.php";

if( $currentUserID == ""){
    echo '{"status":"error"}';
    exit;
}

// Validate API key
$apiPassword = API_PASSWORD;
$phase_api_key = clean($_GET['fAY2YfpdKvR']);

if( $apiPassword !== $phase_api_key){
    echo '{"status":"error"}';
    exit;
} 

$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASSWORD;
$databasename = DB_NAME;

$phaseSchool = clean($_GET['school']);
$phaseStart = clean($_GET['start']);
$phaseType = clean($_GET['type']);

if( $phaseSchool == ""){
    echo '{"status":"error"}';
    exit;
} 





$conn = new mysqli($servername, $username, $password, $databasename);
if ($conn->connect_error) {
    die("Connection error: " . $conn->connect_error);
    exit;
}


if ($currentUserRole != 1){
    if ($currentUserSchoolAllowed != $phaseSchool || $currentUserRole == 4){
        echo '{"status":"error"}';
        exit;
    } 
}


if ($phaseType==1){

    $stmt = $conn->prepare("SELECT MsgID,UserID,MsgDate,MsgTitle,MsgData,LocationName,LocationID FROM Message NATURAL JOIN Logbook NATURAL JOIN Location NATURAL JOIN Map NATURAL JOIN Institution WHERE InstID  = ? ORDER BY MsgDate DESC LIMIT 3 OFFSET ?");

}

else {

    $stmt = $conn->prepare("SELECT MsgID,UserID,MsgDate,MsgTitle,MsgData FROM Message NATURAL JOIN ProjectManager NATURAL JOIN News WHERE InstID  = ? ORDER BY MsgDate DESC LIMIT 3 OFFSET ?");
}   



$stmt->bind_param("ii",$phaseSchool,$phaseStart);

$stmt->execute();

$result = $stmt->get_result();

$emparray = array();
while($row = mysqli_fetch_assoc($result))
{
    $emparray[] = $row;
}

$messages = json_encode( $emparray , JSON_UNESCAPED_UNICODE );
echo $messages;

$stmt->close();

$conn->close();    	

?>