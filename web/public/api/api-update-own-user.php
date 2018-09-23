<?php

//************************************************
//	Update own user
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
$firstName = clean($_GET['firstName']); 
$lastName = clean($_GET['lastName']); 
$email = clean(strtolower($_GET['email'])); 
$newPass = clean($_GET['newPass']); 
$currentPass = clean($_GET['currentPass']);

$setPass; 
$getPassFromServer;

//Validate
if( $apiPassword !== $phase_api_key ){
  	echo '{"status":"error"}';
	exit;
}

if(  strlen($firstName) < 1 ){
    echo '{"status":"error"}';
    exit;
}

if(  strlen($lastName) < 1 ){
    echo '{"status":"error"}';
    exit;
}

if ( $email !== "" ) {
    if( !preg_match('/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/', $email) ) {
        echo '{"status":"error"}';
        exit;
    } 
} 

if ( $newPass !== "" ) {
    $setPass = $newPass;
} else {
    $setPass = $currentPass;
}

$passUppercase = preg_match('@[A-Z]@', $setPass);
$passLowercase = preg_match('@[a-z]@', $setPass);
$passNumber = preg_match('@[0-9]@', $setPass);

if(!$passUppercase || !$passLowercase || !$passNumber || strlen($setPass) < 8) {
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

$sql = "SELECT * from Person WHERE UserID = '$userID' ";  

$result = $conn->query($sql);
    if(!$result) {
        die('{"status":"error"}');
        exit;
    }

if ($result->num_rows==1){

    while($row = $result->fetch_assoc()) {
        $getPassFromServer = $row["UserPassword"];
    }

} else {
  die('{"status":"error"}');
  exit;
}

$sPasswordDecrypted = decrypt($getPassFromServer, ENCRYPTION_KEY);

// Validate password
if ( $sPasswordDecrypted !== $currentPass) {
  echo '{"status": "error", "message": "wrong_pass"}'; 
  exit;
}

$encryptedPass = encrypt($setPass, ENCRYPTION_KEY);

$sql = "UPDATE Person SET FirstName='$firstName', LastName='$lastName', Email='$email', userPassword='$encryptedPass' WHERE UserID = '$userID' "; 

$result = $conn->query($sql);
    if(!$result) {
        die('{"status":"error"}');
        $conn->close();
        exit;
    } else {
        echo '{"status":"ok"}';
    }


$conn->close();

?>


