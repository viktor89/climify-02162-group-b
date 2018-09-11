<?php
header('Access-Control-Allow-Origin: *');

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

    
    

if ($stmt = $conn->prepare("SELECT MapID FROM Map")) {

    //echo "working";

    /* execute query */
    $stmt->execute();

    /* bind result variables */
    $stmt->bind_result($result);

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






header('Content-type:application/json');

echo json_encode(array(
'mapID' => $result
));

exit();


?>