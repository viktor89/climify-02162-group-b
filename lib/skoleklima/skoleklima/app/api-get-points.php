<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once "./meta.php";
header("Access-Control-Allow-Origin: *");
$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASSWORD;
$databasename =  DB_NAME;

$mapID = $_POST['mapID'];
// Create connection
//echo "Connected successfully";

if( $mapID == ""){
        echo '{"status":"mapIDerror"}';
        exit;
}
//echo($polygonData);
//echo($mapID);
     
$conn = new mysqli($servername, $username, $password, $databasename);
    if ($conn->connect_error) {
        die("Connection error: " . $conn->connect_error);
        exit;
    }

$stmt = $conn->prepare("SELECT X, Y, LocationID, LocationName FROM Map NATURAL JOIN Location NATURAL JOIN LocationPoints WHERE MapID = '$mapID'");
   // $stmt = $conn->prepare("SELECT MapID FROM Map");

if ($stmt->execute()) {
    $result = $stmt->get_result();

    $emparray = array();
    while($row = mysqli_fetch_assoc($result))
    {
        $emparray[] = $row;
    }
    echo json_encode($emparray);
} else {
        echo '{"status":"error"}';
}

$stmt->close();
$conn->close();

/*  
else{

    echo "didnt work";  
}
*/ 
//SELECT AsText(g) FROM geom;
?>
