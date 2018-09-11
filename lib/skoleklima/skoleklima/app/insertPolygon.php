<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once "./meta.php";
header("Access-Control-Allow-Origin: *");
$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASSWORD;
$databasename = DB_NAME;

$polygonData = $_POST['polyData'];
$mapID = $_POST['mapID'];
$polygonTestData = "polydata";
$mapTestID = 2;
$areaID = null;
$locationName = $_POST['locName'];
$locationID = 0;
// Create connection

//echo "Connected successfully";
if( $polygonData == ""){
        echo '{"status":"polygonerror"}';
        exit;
    }
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
//$sql = "SELECT * FROM Institution WHERE InstID = 1";
//$result = $conn->query($sql);
//$test = $result->fetch_assoc();
echo($polygonData);

//exit;
$stmt = $conn->prepare("INSERT INTO Location values(?,?,?,?,ST_GEOMFROMTEXT(?))"); 


//$stmt = $conn->prepare("INSERT INTO Map values(?,?,?,?)"); 
//echo("hej2");
//$stmt->bind_param("iiss",$locationID, $areaID ,$locationName, $polygonData);
//echo("hej3");

//$stmt = $conn->prepare("INSERT INTO Location values(?,?,?,?,?)"); 
$stmt->bind_param("iisis", $locationID, $areaID, $locationName, $mapID,$polygonData);
if ($stmt->execute()) {
    $stmt->close();
   echo '{"status":"ok"}';
    // exit;
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