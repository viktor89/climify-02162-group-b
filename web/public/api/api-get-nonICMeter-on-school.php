<?php 
//session_start();
/*
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
*/



require_once "../meta-influx.php";


$servername_influx = DB_HOST_INFLUX;
$serverport_influx = DB_PORT_INFLUX;
$dbname_influx = DB_NAME_INFLUX;

$database = InfluxDB\Client::fromDSN(sprintf('influxdb://user:pass@%s:%s/%s', $servername_influx, $serverport_influx, $dbname_influx));

require_once "../meta.php";

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


$MapID = $_GET["MapID"];



//When you have a map you can get all the areas -> locations --> sensors tied to the map
//$result = $conn->query("SELECT SensorID,SensorAlias,XAxis,YAxis FROM Area NATURAL JOIN Location NATURAL JOIN SensorInstance WHERE MapID = '$MapID'"); 
$result = $conn->query("SELECT SensorID, SensorAlias, XAxis,YAxis, Map.MapID,Area.AreaID,MapName,AreaName,LocationName FROM Map JOIN Area JOIN Location JOIN SensorInstance WHERE Map.MapID='$MapID' and Area.MapID=Map.MapID and Location.AreaID=Area.AreaID and SensorInstance.LocationID=Location.LocationID ORDER BY MapName, AreaName;"); 

//^^ TODO, right now the retrievel of sensor attributes doesen't consider SensorType, and one SensorType might have other attributes than another.


//$counter=0;


//Array for all Sensors on map:
$sensors=[];




while ($currentSensorIDArray = mysqli_fetch_assoc($result)) {
    


    //LAST() -> newest entry
   $currentSensorRow = $database->query('SELECT last(*) FROM "' . $currentSensorIDArray["SensorID"] . '"');  //This gives us fx: last_Humidity


    
   $currentPoints = $currentSensorRow ->getPoints();
    
  $currentPoints[0]["SensorID"]= $currentSensorIDArray["SensorID"];

  if ($currentSensorIDArray["SensorAlias"]!=null){
  $currentPoints[0]["SensorAlias"]= $currentSensorIDArray["SensorAlias"];
  }
  else{
    $currentPoints[0]["SensorAlias"]="Unnamed";
  }

  $currentPoints[0]["XAxis"]= $currentSensorIDArray["XAxis"];
    $currentPoints[0]["YAxis"]= $currentSensorIDArray["YAxis"];
    /*
    if (counter==0){
    echo print_r($currentPoints);
    }
    */
    
    array_push($sensors,$currentPoints);


    //$counter++;
   
}
 






/*
while ($points[$counter]) {
    echo print_r($points[$counter]);
    $counter++;
}

*/




//echo print_r($sensors);

$sensorData = json_encode( $sensors , JSON_UNESCAPED_UNICODE );
echo ($sensorData);

$conn->close();

$database->close();



?>