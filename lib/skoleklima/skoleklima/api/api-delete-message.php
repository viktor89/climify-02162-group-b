<?php

//************************************************
//	Delete message
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

$phaseUserId = clean($_GET['userId']);
$phaseUserId = (string)$phaseUserId;
$phaseMessageId = clean($_GET['messageId']);
$userRole;
$messageAuthor;

if ( $phaseUserId == "" ) {
    echo '{"status":"error"}';
    exit;
}

if ( $phaseMessageId == "" ) {
    echo '{"status":"error"}';
    exit;
}

$conn = new mysqli($servername, $username, $password, $databasename);
if ($conn->connect_error) {
    die("Connection error: " . $conn->connect_error);
    exit;
}

$stmt = $conn->prepare("SELECT RoleName FROM Person Where UserID = ?");

$stmt->bind_param("i", $phaseUserId);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows==1){
    while($row = $result->fetch_assoc()) {
        $userRole = $row["RoleName"];
    }
}

$stmt->close();



if ($userRole == "1" || $userRole == "15" || $userRole == "2" ) {

    $stmt = $conn->prepare("DELETE FROM Message WHERE MsgID = ?");

    $stmt->bind_param("i", $phaseMessageId);

    $stmt->execute();

    if ($stmt->execute()) { 
        echo '{"status":"ok"}';
    } else {
        echo '{"status":"error"}';
        $stmt->close();
        $conn->close();
        exit;
    }

    $stmt->close();

} else {

    $stmt = $conn->prepare("SELECT UserID FROM Message WHERE MsgID = ?");

    $stmt->bind_param("i", $phaseMessageId);

    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows==1){
        while($row = $result->fetch_assoc()) {
            $messageAuthor = $row["UserID"];
        }
    }

    $stmt->close();

    if ( $messageAuthor == $phaseUserId ) {

        $stmt = $conn->prepare("DELETE FROM Message WHERE MsgID = ?");

        $stmt->bind_param("i", $phaseMessageId);

        $stmt->execute();

        if ($stmt->execute()) { 
            echo '{"status":"ok"}';
        } else {
            echo '{"status":"error"}';
            $stmt->close();
            $conn->close();
            exit;
        }

        $stmt->close();

    } else {
        echo '{"status":"error"}';
        $conn->close();
        exit;
    }
}

$conn->close();

?>