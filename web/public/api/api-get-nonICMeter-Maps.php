<?php 
//session_start();

//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//error_reporting(E_ALL);



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


// Validate API key
$apiPassword = API_PASSWORD;
$phase_api_key = clean($_GET['fAY2YfpdKvR']);


if( $apiPassword !== $phase_api_key){
    echo '{"status":"error"}';
    exit;
} 

$InstID = $_GET["InstID"];





//When you have a map you can get all the areas -> locations --> sensors tied to the map
$stmt = $conn->prepare("SELECT MapName,MapID FROM Map WHERE InstID = ? ORDER BY MapName;"); 

$stmt->bind_param("i",$InstID);

$stmt->execute();

$result = $stmt->get_result();

$stmt->close();






if (!$result) {

    echo '{"status":"error"}';
    exit;
}




//Array for all Areas on map:
$maps=[];




while ($currentMapArray = mysqli_fetch_assoc($result)) {
    
    array_push($maps,$currentMapArray);
  
}
 
//echo print_r($areas);


$mapsData = json_encode( $maps , JSON_UNESCAPED_UNICODE );
echo ($mapsData);

$conn->close();




?>