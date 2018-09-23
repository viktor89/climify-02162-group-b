<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
$servername = "193.200.45.37:3306";
$username = "system";
$dbname =  "ic-meter-development";
$password = "53RHkKs6tYT7DpdW";
$mapID = $_POST['mapID'];

// Create connection
//echo "Connected successfully";

if( $mapID == ""){
        echo '{"status":"mapIDerror"}';
        exit;
}
//echo($polygonData);
//echo($mapID);
    
$conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Connection error: " . $conn->connect_error);
        exit;
    }


$stmt = $conn->prepare("SELECT AsText(LocationPolygon) AS LocationPolygon FROM Map NATURAL JOIN Location WHERE MapID = '$mapID'" );


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
