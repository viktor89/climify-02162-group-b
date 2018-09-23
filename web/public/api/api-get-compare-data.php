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



if( $currentUserID == ""){
      echo '{"status":"error"}';
    exit;
  }
  

// Validate API key
$apiPassword = API_PASSWORD;
$phase_api_key = clean($_POST['fAY2YfpdKvR']);
$LocationIDs = array_unique(json_decode($_POST['LocationIDs']));
$from = clean($_POST['from']);
$to = clean($_POST['to']);



$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASSWORD;
$databasename = DB_NAME;


if( $apiPassword !== $phase_api_key){
  	echo '{"status":"error"}';
	exit;
}





$mariaLines=[];
$sensors=[];



foreach ($LocationIDs as &$value) {



    $result = $conn->query("SELECT SensorID,LocationID FROM SensorInstance WHERE LocationID='$value'"); 

    //echo "value " . $value;


    $row_cnt = $result->num_rows;

    if ($row_cnt!=0) {

        $currentSensorIDArray = mysqli_fetch_assoc($result);

        array_push($mariaLines,$currentSensorIDArray);
    }



}






foreach ($mariaLines as &$value) {



    //LAST() -> newest entry


    $currentSensorRow = $database->query('SELECT * FROM "' . $value["SensorID"] . '"' . " WHERE time >='" . $from . "' AND time <='" . $to . "'");




    $currentPoints = $currentSensorRow ->getPoints();



    $currentPoints[0]["LocationID"]= $value["LocationID"];




    array_push($sensors,$currentPoints);


}













$isEmpty=1;
for ($x = 0; $x < count($sensors); $x++) {

    //Only having LocationID
    if (count($sensors[$x][0])>1){
        $isEmpty=0;
    }

} 



$sensorData = json_encode( $sensors , JSON_UNESCAPED_UNICODE );

if ( $isEmpty==1){
    echo '{"status":"nodata"}';
    exit; 
}


else{
    echo ($sensorData);
}



$conn->close();


$database->close();

?>