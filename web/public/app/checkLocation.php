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
 
$x = $_POST['xCoord'];
$y = $_POST['yCoord'];
$mapID = $_POST['mapID'];
$polygonTestData = "polydata";
$mapTestID = 2;
$areaID = null;
$locationName = "notNull";
$locationID = 0;
// Create connection

//echo "Connected successfully";
//echo($polygonData);
//echo($mapID);
    
$conn = new mysqli($servername, $username, $password, $databasename);
    if ($conn->connect_error) {
        die("Connection error: " . $conn->connect_error);
        exit;
    }
//$sql = "SELECT * FROM Institution WHERE InstID = 1";
//$result = $conn->query($sql);
//$test = $result->fetch_assoc();
//
    if( $x == ""){
        echo '{"status":"polygonerror"}';
        exit;
    }
    if( $y == ""){
        echo '{"status":"mapIDerror"}';
        exit;
    }
//$stmt = $conn->prepare("SELECT LocationID, LocationName FROM Location WHERE ST_CONTAINS(MapID = 14 AND LocationPolygon, point('$x','$y'))");
$stmt = $conn->prepare("SELECT LocationID, LocationName FROM Location WHERE MapID = '$mapID' AND ST_CONTAINS(LocationPolygon, point('$x','$y'))");
//$sql = "SELECT * FROM Location WHERE ST_CONTAINS(LocationPolygon, point('$x','$y'))";
//exit;
//$stmt = $conn->prepare("INSERT INTO Location values(?,?,?,?,ST_GEOMFROMTEXT(?))"); 


//$stmt = $conn->prepare("INSERT INTO Map values(?,?,?,?)"); 
//echo("hej2");
//$stmt->bind_param("iiss",$locationID, $areaID ,$locationName, $polygonData);
//echo("hej3");

//$stmt = $conn->prepare("INSERT INTO Location values(?,?,?,?,?)"); 
//$stmt->bind_param("iisis", $locationID, $areaID, $locationName, $mapID,$polygonData);
if ($stmt->execute()) {
     //echo '{"status":"ok"}';
   $result = $stmt->get_result();

    $emparray = array();
    while($row = mysqli_fetch_assoc($result))
    {
        $emparray[] = $row;
    }
    echo json_encode($emparray);
} else {
       // $stmt->close() 
        echo '{"status":"error"}';
}
$stmt->close();
$conn->close();
/*  
else{

    echo "didnt work";  
}
*/ 

?>