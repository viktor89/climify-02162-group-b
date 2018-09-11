<?php
/*
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
*/

require_once "../meta.php";
header("Access-Control-Allow-Origin: *");
$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASSWORD;
$databasename =  DB_NAME;

$mapID = $_POST['mapID'];
// Create connection
//echo "Connected successfully";

if( $currentUserID == ""){
    echo '{"status":"error"}';
    exit;
}

// Validate API key
$apiPassword = API_PASSWORD;
$phase_api_key = clean($_POST['fAY2YfpdKvR']);

if( $apiPassword !== $phase_api_key){
    echo '{"status":"error"}';
    exit;
} 


if( $mapID == ""){
    echo '{"status":"error"}';
    exit;
}
//echo($polygonData);
//echo($mapID);

$conn = new mysqli($servername, $username, $password, $databasename);
if ($conn->connect_error) {
    die("Connection error: " . $conn->connect_error);
    exit;
}




$sql = " SELECT * FROM Map NATURAL JOIN Institution WHERE MapID = '$mapID' ";  

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



$stmt = $conn->prepare("SELECT LocationID, LocationName, XAxis, YAxis FROM Map NATURAL JOIN Location WHERE MapID = '$mapID'");
// $stmt = $conn->prepare("SELECT MapID FROM Map");

if ($stmt->execute()) {
    $result = $stmt->get_result();

    $emparray = array();
    while($row = mysqli_fetch_assoc($result))
    {
        $emparray[] = $row;
    }
    echo json_encode($emparray);
} else {
    echo '{"status":"error"}';
}

$stmt->close();
$conn->close();

/*  
else{

    echo "didnt work";  
}
*/ 
//SELECT AsText(g) FROM geom;
?>
