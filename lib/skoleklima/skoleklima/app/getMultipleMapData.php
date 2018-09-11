<?php
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//error_reporting(E_ALL);
require_once "./meta.php";
$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASSWORD;
$databasename = DB_NAME;

$appName = $_POST["appName"];

if ($appName == "") {
    echo '{"status":"error"}';
    exit;

}

// Create connection
$conn = new mysqli($servername, $username, $password,$databasename);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
//echo "Connected successfully";

if ($_POST["appName"] == "sensorApp") {
    $sql = "SELECT MapID, Scale, Angle, Longitude, Latitude FROM InstUser NATURAL JOIN Institution Natural Join Map Natural Join GeometryMap WHERE UserID = '$currentUserID'";
} else if ($_POST["appName"] == "feedbackApp") {
    $sql = "SELECT MapID, Scale, Angle, Longitude, Latitude FROM Map Natural Join GeometryMap";
} else {
    echo '{"status":"error"}';
    exit;
}

if ($stmt = $conn->prepare($sql)) {

    //echo "working";

    /* execute query */
    $stmt->execute();

    /* bind result variables */
    $result = $stmt->get_result();

    /* fetch value */
    $stmt->fetch();

    /* close statement */
    $stmt->close();

} else {
    echo '{"status":"error"}';
    exit;
}

$emparray = array();

while($row = mysqli_fetch_assoc($result))
{
    $emparray[] = $row;
}
echo json_encode($emparray);

$conn->close();

?>