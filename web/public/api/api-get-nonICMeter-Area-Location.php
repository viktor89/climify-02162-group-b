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


$MapID = $_GET["MapID"];


$sql = " SELECT * FROM Map NATURAL JOIN Institution WHERE MapID = '$MapID' ";  

$result = $conn->query($sql);
if(!$result) {
    die("Error: " . $conn->error);
}


$row = $result->fetch_assoc();
$InstIDForMap = $row["InstID"];
$MunIDForMap = $row["MunID"];




if ($currentUserRole == 1){    
    if ($MunIDForMap!=$currentUserCompanyID){
        echo '{"status":"error"}';
        exit;
    }

}

else{
    if ($InstIDForMap != $InstID){
        echo '{"status":"error"}';
        exit;
    }
}



//When you have a map you can get all the areas -> locations --> sensors tied to the map
$stmt = $conn->prepare("SELECT MapID,MapName,LocationID,LocationName FROM Map NATURAL JOIN Location WHERE MapID = ? ORDER BY LocationName"); 

$stmt->bind_param("i",$MapID);

$stmt->execute();

$result = $stmt->get_result();

$stmt->close();






if (!$result) {

    //echo "Errormessage: %s\n" . $conn->error;
}




//Array for all Areas on map:
$areas=[];




while ($currentAreaIDArray = mysqli_fetch_assoc($result)) {

    array_push($areas,$currentAreaIDArray);

}

//echo print_r($areas);


$areaData = json_encode( $areas , JSON_UNESCAPED_UNICODE );
echo ($areaData);

$conn->close();




?>