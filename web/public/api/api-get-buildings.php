<?php

//************************************************
//	Get buildings
//************************************************

require_once "../meta.php";

if( $currentUserID == ""){
    echo '{"status":"error"}';
    exit;
}

// Validate API key
$apiPassword = API_PASSWORD;
$phase_api_key = clean($_POST['fAY2YfpdKvR']);
$UserID = clean($_POST['userID']);

if( $apiPassword !== $phase_api_key){
    echo '{"status":"error"}';
    exit;
} 


if ($currentUserRole!==1){
    echo '{"status":"error"}';
    exit;
}

$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASSWORD;
$databasename = DB_NAME;

$conn = new mysqli($servername, $username, $password, $databasename);
if ($conn->connect_error) {
    die("Connection error: " . $conn->connect_error);
    exit;
}


$sql = "SELECT MunID FROM ProjectManager WHERE UserID = '$UserID' ";  

$result = $conn->query($sql);
if(!$result) {
    die("Error: " . $conn->error);
}

if ($result->num_rows==1){	
    while($row = $result->fetch_assoc()) {
        $MunID = $row["MunID"];
    }
} else {
    echo '{"status":"error"}';
    $conn->close();
    exit;
}        



$sql = "SELECT InstID, InstName, InstDescription FROM Institution WHERE MunID = '$MunID'";

//$stmt->execute();
$result = mysqli_query($conn, $sql) or die("Error in Selecting " . mysqli_error($conn));


//$result = $stmt->get_result();

if ($result->num_rows<1){
    echo '{"status":"error"}';
}


$emparray = array();
while($row = mysqli_fetch_assoc($result))
{	
    $temparray = [];
    array_push($temparray[InstID] =  $row["InstID"]);
    array_push($temparray[InstName] =  $row["InstName"]);
    array_push($temparray[InstDescription] =  $row["InstDescription"]);
    array_push(	$emparray, $temparray);
}

$buildings = json_encode( $emparray , JSON_UNESCAPED_UNICODE );
echo $buildings;


$stmt->close();

$conn->close();    	

?>
