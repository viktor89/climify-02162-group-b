<?php 
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//error_reporting(E_ALL);

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



$LocationID = $_GET["LocationID"];




$sql = " SELECT * FROM Location NATURAL JOIN Map NATURAL JOIN Institution WHERE LocationID = '$LocationID' ";  

$result = $conn->query($sql);
if(!$result) {
    die("Error: " . $conn->error);
}


$row = $result->fetch_assoc();
$InstIDForLocation = $row["InstID"];
$MunIDForLocation = $row["MunID"];




if ($currentUserRole == 1){
    if ($MunIDForLocation!=$currentUserCompanyID){
        echo '{"status":"error"}';
        exit;
    }

}

else{
    if ($InstIDForLocation != $InstID){
        echo '{"status":"error"}';
        exit;
    }
}





//When you have a map you can get all the areas -> locations --> sensors tied to the map
//$result = $conn->query("SELECT SensorID,SensorAlias,XAxis,YAxis FROM Area NATURAL JOIN Location NATURAL JOIN SensorInstance WHERE MapID = '$MapID'"); 
$result = $conn->query("SELECT SensorID FROM Location NATURAL JOIN SensorInstance WHERE LocationID='$LocationID'");

//^^ TODO, right now the retrievel of sensor attributes doesen't consider SensorType, and one SensorType might have other attributes than another.

//$counter=0;

//Array for all Sensors on map:
$sensors=[];

while ($currentSensorIDArray = mysqli_fetch_assoc($result)) {


    //LAST() -> newest entry
    $currentSensorRow = $database->query('SELECT last(*) FROM "' . $currentSensorIDArray["SensorID"] . '"');  //This gives us fx: last_Humidity


    $currentPoints = $currentSensorRow ->getPoints();

    $currentPoints[0]["SensorID"]= $currentSensorIDArray["SensorID"];


    array_push($sensors,$currentPoints);


    //$counter++;

}

//echo print_r($sensors);

$sensorData = json_encode( $sensors , JSON_UNESCAPED_UNICODE );
echo json_encode(["status"=>"ok", $sensorData]);

$conn->close();

$database->close();



?>