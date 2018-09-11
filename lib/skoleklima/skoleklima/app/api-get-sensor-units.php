<?php 
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//error_reporting(E_ALL);
require_once "./meta.php";

$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASSWORD;
$databasename = DB_NAME;

$conn = new mysqli($servername, $username, $password, $databasename);
if ($conn->connect_error) {
	die("Connection error: " . $conn->connect_error);
	exit;
}

//TODO check for userrole (permissions)

$LocationID = $_GET["LocationID"];


//When you have a map you can get all the areas -> locations --> sensors tied to the map
//$result = $conn->query("SELECT SensorID,SensorAlias,XAxis,YAxis FROM Area NATURAL JOIN Location NATURAL JOIN SensorInstance WHERE MapID = '$MapID'"); 
$result = $conn->query("SELECT SensorAttributeName, SensorUnitName, SensorID FROM SensorInstance NATURAL JOIN SensorType NATURAL JOIN TypeHAU NATURAL JOIN SensorAttribute NATURAL JOIN SensorUnit WHERE LocationID='$LocationID' ORDER BY SensorID"); 

//^^ TODO, right now the retrievel of sensor attributes doesen't consider SensorType, and one SensorType might have other attributes than another.

//$counter=0;

//Array for all Sensors on map:
$sensors=array();
$currentSensor = array();
$iniCounter = 0;
while ($currentSensorData = mysqli_fetch_assoc($result)) {
  if ($iniCounter == 0){
    $currentSensorID = $currentSensorData["SensorID"];
    $iniCounter++;
  }
  if ($currentSensorData["SensorID"] == $currentSensorID){
    array_push($currentSensor,$currentSensorData);
  }
  else{
      array_push($sensors,$currentSensor);
      $currentSensor = array();
      array_push($currentSensor,$currentSensorData);
  }
   $currentSensorID = $currentSensorData["SensorID"];
}
 array_push($sensors,$currentSensor);

$sensorData = json_encode($sensors , JSON_UNESCAPED_UNICODE );
echo ($sensorData);

$conn->close();

$database->close();



?>