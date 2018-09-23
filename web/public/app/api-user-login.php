<?php
//error_reporting(E_ALL);
//ini_set("display_errors", 1);
//************************************************
//  Login 
//************************************************
session_start();
require_once "./meta.php";


// Validate API key
$apiPassword = SIGNIN_TOKEN;
$phase_api_key = clean($_POST['fAY2YfpdKvR']);

if( $apiPassword !== $phase_api_key){
    echo '{"status":"error", "info":"token"}';
    exit;
} 

$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASSWORD;
$databasename = DB_NAME;

// Store user input (username, password) in variables
$phaseUsername = clean(strtolower($_POST['username'])); 
$phasePassword = clean($_POST['password']); 
$phasePasswordRex=(string)preg_replace("/ /","+",$phasePassword);
$phasePasswordDecrypt = decrypt($phasePasswordRex, ENCRYPTION_KEY);
$currentTime = date("d-m-Y, H:i");
$phaseUsername = clean($phaseUsername);
$phasePasswordDecrypt = clean($phasePasswordDecrypt);

$LastLogin = date("Y-m-d");

$conn = new mysqli($servername, $username, $password, $databasename);
if ($conn->connect_error) {
    die("Connection error: " . $conn->connect_error);
    exit;
}


if ($stmt = $conn->prepare("SELECT * FROM Person WHERE UserName = ?")){

    $stmt->bind_param("s", $phaseUsername);

    $stmt->execute();

    $stmt->bind_result($UserID,$phaseUsername,$FirstName,$LastName,$Email,$RoleName,$UserPassword,$Blocked,$lastLogin);

    $stmt->fetch();

    $stmt->close();
}

// Only building manager has access
if ($RoleName == 2){

    if ($stmt = $conn->prepare("SELECT * FROM InstUser WHERE UserID = ?")){

        $stmt->bind_param("i", $UserID);

        $stmt->execute();

        $stmt->bind_result($UserID);

        $stmt->fetch();

        $stmt->close();

    }
    if ($stmt = $conn->prepare("SELECT MunID, InstName FROM Institution WHERE InstID = ?")){

        $stmt->bind_param("i", $InstID);

        $stmt->execute();

        $stmt->bind_result($MunID, $InstName);

        $stmt->fetch();

        $stmt->close();

    }


    $sPasswordDBDecrypted = decrypt($UserPassword, ENCRYPTION_KEY);


    if ( $sPasswordDBDecrypted === $phasePasswordDecrypt ) {

        if ($Blocked == 1) {
            // Store user-info from variables in sessions
            $_SESSION['userID'] = $UserID;
            $_SESSION['userName'] = $phaseUsername;
            $_SESSION['userRole'] = 1;  //TODO implement that you can have string "Project Manager"
            $_SESSION['userFirstName'] = $FirstName;
            $_SESSION['userLastName'] = $LastName;
            $_SESSION['userEmail'] = $Email;
            $_SESSION['schoolAllowed'] = $InstID;
            $_SESSION['companyID'] = $MunID;


            echo '{ "status": "ok", 
                    "school":"'.$InstName.'"
                }';

        } else {
            echo '{"status": "error"}';
        }

    }  else {
        echo '{"status": "error"}';
    }

} else {

    echo '{"status": "error"}';
}

$stmt->close();
$conn->close();

?>
