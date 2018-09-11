<?php
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
$servername = "193.200.45.37:3306";
$username = "system";
$dbname =  "ic-meter-development";
$password = "53RHkKs6tYT7DpdW";

// Create connection
$conn = new mysqli($servername, $username, $password,$dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
//echo "Connected successfully";

    
    

if ($stmt = $conn->prepare("SELECT Scale, Angle, Longitude, Latitude FROM Map NATURAL JOIN GeometryMap WHERE MapID = 13")) {
    //echo "working";

    /* execute query */
    $stmt->execute();

    /* bind result variables */
    $result = $stmt->get_result();

    /* fetch value */
    $stmt->fetch();

    /* close statement */
    $stmt->close();
    
}

/*
else{

    echo "didnt work";  
}
*/ 

//$emparray = array();
$row = mysqli_fetch_assoc($result);
//while($row = mysqli_fetch_assoc($result))
//{
  //  $emparray[] = $row;
//}
//echo "$phaseSchool = " . $phaseSchool;

//$mapData = json_encode( $emparray , JSON_UNESCAPED_UNICODE );
echo json_encode($row);


?>