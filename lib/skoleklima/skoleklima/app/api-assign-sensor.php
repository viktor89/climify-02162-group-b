<?php
    //ini_set('display_errors', 1);
    //ini_set('display_startup_errors', 1);
    //error_reporting(E_ALL);


require_once "./meta-influx.php";

$servername_influx = DB_HOST_INFLUX;
$serverport_influx = DB_PORT_INFLUX;
$dbname_influx = DB_NAME_INFLUX;

$database = InfluxDB\Client::fromDSN(sprintf('influxdb://user:pass@%s:%s/%s', $servername_influx, $serverport_influx, $dbname_influx));

require_once "./meta.php";
$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASSWORD;
$databasename = DB_NAME;

    /*
    // Validate API key
    $apiPassword = API_PASSWORD;
    $api_key = clean($_POST['fAY2YfpdKvR']);

    if( $apiPassword !== $api_key){
        echo '{"status":"error"}';
        exit;
    } 
    */

$sensorID = clean($_POST['sensorID']);
$userLocID = clean($_POST['userLocID']);
$sensorTypeName = clean($_POST['sensorTypeName']);

    if( $sensorID == ""){
    	echo '{"status":"sensorid error"}';
    	exit;
    } 

    if( $userLocID == ""){
    	echo '{"status":"loc error"}';
    	exit;
    } 

    if( $sensorTypeName == ""){
        echo '{"status":"typename error"}';
        exit;
    } 
    // Create connection
    $conn = new mysqli($servername, $username, $password, $databasename);

    // Check connection
    if ($conn->connect_error) {
    	die("Connection failed: " . $conn->connect_error);
    } 

    $sql = "SELECT SensorTypeID FROM SensorType WHERE SensorTypeName = '$sensorTypeName'";
// Find sensor type id

    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
    $sensorTypeID = $row["SensorTypeID"];

    // TODO: select one of the methods below
    // depending on where the sensor id is registered first

	// A) Check if sensor ID exists in MariaDB
    //$result = $conn->query("SELECT * FROM SensorInstance WHERE SensorID = '$sensorID'");

    // B) Check if sensor ID exists in InfluxDB
    $result = $database->query('SELECT last(*) FROM "' . $sensorID . '"');
    //$result = $database->prepare('SELECT last(*) FROM "' . $sensorID . '"');
    //$result = $database->prepare('SELECT last(*) FROM "'$sensorID'"');
	$points = $result->getPoints();

    if (count($points) == 0) {
    	echo '{"status":"error"}';
    	exit;
    }

    // TODO: if sensor ID already exists in MariaDB,
    // update the row instead.
    $stmt = $conn->prepare("INSERT INTO SensorInstance (SensorID, SensorTypeID, LocationID) values (?,?,?)");

    $stmt->bind_param("sii",$sensorID, $sensorTypeID , $userLocID);

    if ($stmt->execute()) {
    	echo '{"status":"ok"}';
    } else {
    	echo '{"status":"error"}';
    }

    
    $stmt->close();
    $conn->close();

    ?>