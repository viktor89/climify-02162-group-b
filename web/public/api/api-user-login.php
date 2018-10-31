<?php

//************************************************
//	Login 
//************************************************
session_start();
require_once "../meta.php";


// Validate API key
$apiPassword = SIGNIN_TOKEN;
$phase_api_key = clean($_GET['fAY2YfpdKvR']);

if( $apiPassword !== $phase_api_key){
    die('{"status":"error", "info":"token"}');
} 

$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASSWORD;
$databasename = DB_NAME;

// Store user input (username, password) in variables
$phaseUsername = clean(strtolower($_GET['username'])); 
$phasePassword = clean($_GET['password']); 
$phasePasswordRex=(string)preg_replace("/ /","+",$phasePassword);
$phasePasswordDecrypt = $phasePassword;
$currentTime = date("d-m-Y, H:i");
$phaseUsername = clean($phaseUsername);
$phasePasswordDecrypt = $phasePassword;

$conn = new mysqli($servername, $username, $password, $databasename);
if ($conn->connect_error) {
    die("Connection error: " . $conn->connect_error);
}

if ($stmt = $conn->prepare("SELECT * FROM Person WHERE UserName = ?")){
    $stmt->bind_param("s", $phaseUsername);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($UserID,$phaseUsername,$FirstName,$LastName,$Email,$RoleName,$UserPassword,$Blocked,$LastLogin);
    $stmt->fetch();
    $stmt->close();
}

if ($RoleName == 1 || $RoleName == 15){
    if ($stmt = $conn->prepare("SELECT * FROM ProjectManager WHERE UserID = ?")){
        $stmt->bind_param("i", $UserID);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($UserID,$MunID);
        $stmt->fetch();
        $stmt->close();
    }
    $permLogBook = 1;
}
if ($stmt = $conn->prepare("SELECT * FROM InstUser WHERE UserID = ?")){
    $stmt->bind_param("i", $UserID);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($UserID,$InstID);
    $stmt->fetch();
    $stmt->close();
}
if ($stmt = $conn->prepare("SELECT MunID, InstName FROM Institution WHERE InstID = ?")){
    $stmt->bind_param("i", $InstID);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($MunID, $InstName);
    $stmt->fetch();
    $stmt->close();
}

if ( true ) {
    if ($Blocked === 1) {
        // Store user-info from variables in sessions
        $_SESSION['userID'] = $UserID;
        $_SESSION['userName'] = $phaseUsername;
        $_SESSION['userRole'] = $RoleName; 
        $_SESSION['userFirstName'] = $FirstName;
        $_SESSION['userLastName'] = $LastName;
        $_SESSION['userEmail'] = $Email;
        $_SESSION['schoolAllowed'] = $InstID;
        $_SESSION['companyID'] = $MunID;
        $_SESSION['schoolAllowedName'] = $InstName;
        $_SESSION['permLogbook'] = $permLogBook;
        header('Content-type: text/html');
        echo json_encode(["status"=> "approve", "school"=> $InstName]);
    } else {
        echo json_encode(["status"=> "error"]);
    }
} else {
    echo json_encode(["status"=> "error"]);
}
$conn->close();
