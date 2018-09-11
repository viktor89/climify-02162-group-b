<?php
/*
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
*/
require_once "./meta.php";
header("Access-Control-Allow-Origin: *");
$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASSWORD;
$databasename =  DB_NAME;


$points = json_decode($_POST['points']);
$mapID = $_POST['mapID'];
$polygonTestData = "polydata";
$areaID = null;
$locationName = $_POST['locName'];
$locationID = 0;
$pointID = 0;
$xaxis = $_POST['xaxis'];
$yaxis = $_POST['yaxis'];
// Create connection

//echo "Connected successfully";


if( $points == ""){
        echo '{"status":"polygon error"}';
        exit;
    }
if( $mapID == ""){
        echo '{"status":"mapID error"}';
        exit;
    }
    if( $xaxis == ""){
        echo '{"status":"xaxis error"}';
        exit;
    }
    if( $yaxis == ""){
        echo '{"status":"yaxis error"}';
        exit;
    }
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
//echo($polygonData);

//exit;
$stmt = $conn->prepare("INSERT INTO Location values(?,?,?,?,?,?)"); 

$stmt->bind_param("iisiii", $locationID, $areaID, $locationName, $mapID, $xaxis, $yaxis);

if ($stmt->execute()) {
    $stmt->close();
    //echo $points[0]->x;


    $sql = "SELECT MAX(LocationID) as LocID FROM Location";
    $result = $conn -> query($sql);


    if (!$result) {
      die("Error in Selecting " . $conn->error);
    }

    if ($result -> num_rows == 1) {
        while($row = $result->fetch_assoc()) {
            $locID = $row["LocID"];
        }
    }


    foreach($points as $value) {
        $stmt = $conn->prepare("INSERT INTO LocationPoints values(?,?,?,?)"); 
        $stmt->bind_param("iiii", $pointID, $value->x, $value->y, $locID);
        //$stmt->close();
        if ($stmt->execute()) {
            $stmt->close();
        }
        else {
            echo "error";
        }
    }
  

   echo '{"status":"    ok"}';
    // exit;
} else {
       // $stmt->close() 
        echo '{"status":"error"}';
        
}
//$stmt->close();
$conn->close();

/*  
else{

    echo "didnt work";  
}
*/ 

?>