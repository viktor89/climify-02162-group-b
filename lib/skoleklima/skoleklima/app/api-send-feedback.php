<?php
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//error_reporting(E_ALL);
require_once "./meta.php";
header("Access-Control-Allow-Origin: *");
$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASSWORD;
$databasename = DB_NAME;


$locID = $_POST['locID'];
$temp = $_POST['temp'];
$humid = $_POST['humid'];
$co2 = $_POST['co2'];
$noise = $_POST['noise'];
$qfID = 0;

if( $locID == ""){
        echo '{"status":"locid"}';
        exit;
    }
if( $temp == ""){
        echo '{"status":"temp"}';
        exit;
    }
if( $humid == ""){
        echo '{"status":"humid"}';
        exit;
    }
if( $co2 == ""){
        echo '{"status":"co2"}';
        exit;
    }
if( $noise == ""){
        echo '{"status":"noise"}';
        exit;
    }
    
// Create connection
$conn = new mysqli($servername, $username, $password,$databasename);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$stmt = $conn->prepare("INSERT INTO QuickFeedback values(?,?,?,?,?,?)"); 

// attributes:
// QuickFeedbackID, LocationID, T, H, CO2, Noise
$stmt->bind_param("iiiiii", $qfID, $locID, $temp, $humid, $co2, $noise);

if ($stmt->execute()) {
    echo '{"status":"ok"}';
    exit;
} else {
    echo '{"status":"error"}';

}
$stmt->close();
$conn->close();

?>