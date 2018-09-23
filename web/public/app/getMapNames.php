<?php
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//error_reporting(E_ALL);
//require_once "../meta.php";
header("Access-Control-Allow-Origin: *");
$servername = "193.200.45.37:3306";
$username = "system";
$dbname =  "ic-meter-development";
$password = "53RHkKs6tYT7DpdW";

// Create connection
echo "1"
$conn = new mysqli($servername, $username, $password,$dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
//echo "Connected successfully";

// $sql = "SELECT MapID as MapID FROM Map WHERE MAP";
$mapNames;
$sql = "SELECT MapName FROM SystemUser NATURAL JOIN Institution NATURAL JOIN Map WHERE UserID = 1";
$result = $conn -> query($sql);
if (!$result) {
    die("Error in Selecting " . $conn->error);
}

while($row = $result->mysql_fetch_array($result)) {
    array_push($mapNames, $row[0]);
}
echo json_encode($mapNames);

/*
else{

    echo "didnt work";  
}
*/ 

//$emparray = array();
//$row = mysqli_fetch_assoc($result);
//while($row = mysqli_fetch_assoc($result))
//{
    //$emparray[] = $row;
//}
//echo "$phaseSchool = " . $phaseSchool;

//$mapData = json_encode( $emparray , JSON_UNESCAPED_UNICODE );
echo json_encode($mapNames);


?>