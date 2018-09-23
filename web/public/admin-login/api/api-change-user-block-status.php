<?php 

//************************************************
//	Change user block/unblock status
//************************************************

//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//error_reporting(E_ALL);

require_once "../admin-meta.php";
require_once "../session.php";

$phaseSessionToken = clean($_POST[sessionToken]);




if( $phaseSessionToken != $adminSessionToken ){
    echo '{"status":"error"}';
    exit;
}
if (!$systemAccess) {
    echo '{"status":"error"}';
    exit;
}

$phaseUserId = clean($_POST["userid"]);
$phaseBlockStatus = clean(strtolower($_POST["block"]));

//echo "blocked " .$phaseBlockStatus . " UserID " . $phaseUserId;

if ($phaseUserId == "") {
    echo '{"status":"error"}';
    exit;
}

if (!in_array($phaseBlockStatus, array("0","1"), true )) {
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


$phaseUserId = intval($phaseUserId);


//To guarantee it is a project manager that we activate:
$stmt = $conn->prepare("SELECT RoleName FROM Person WHERE UserID = ?");

$stmt->bind_param("i", $phaseUserId);

$stmt->execute();

$stmt->bind_result($RoleName);

$stmt->fetch();

$stmt->close();

if ($RoleName!=1){
    echo '{"status":"error"}';
    exit;
}





//changeStatusPM(IN vYes INT(1),IN vNewUserID INT(5), OUT vStatus VARCHAR(10))

if ($phaseBlockStatus==1){
    $stmt = $conn->prepare("CALL changeStatusPM(?,?)");

    $stmt->bind_param("ii", $phaseBlockStatus, $phaseUserId);

    if ($stmt->execute()) { 
        echo '{"status":"active"}';
    }
    else {
        echo '{"status":"error"}';
    }
}

else if ($phaseBlockStatus==0){


    $stmt = $conn->prepare("UPDATE Person SET Blocked = ? WHERE UserID = ?");

    $stmt->bind_param("ii", $phaseBlockStatus, $phaseUserId);

    if ($stmt->execute()) { 

        echo '{"status":"blocked"}';
    } else {
        echo '{"status":"error"}';
    }

    $stmt->close();

}

$conn->close();

?>