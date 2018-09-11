<?php 

//************************************************
//	Admin login
//************************************************

require_once "../admin-meta.php";
require_once "../session.php";

$phaseSessionToken = clean($_POST[sessionToken]);

if( $phaseSessionToken != $adminSessionToken ){
    echo '{"status":"errortoken"}';
    exit;
}



$phaseUsername=clean($_POST["user"]);


$myResponse = "error";

if ( $phaseUsername == "" ) {
    echo '{"status":"error"}';
    exit;
}


$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASSWORD;
$databasename = DB_NAME;
$pepper = HASH_PEPPER;

$conn = new mysqli($servername, $username, $password, $databasename);
if ($conn->connect_error) {
    die("Connection error: " . $conn->connect_error);
    exit;
}

$stmt = $conn->prepare("SELECT MunID FROM Person NATURAL JOIN ProjectManager WHERE UserName = ? LIMIT 1");

$stmt->bind_param("s", $phaseUsername);

if (!$stmt->execute()) { 
    echo '{"status":"errorexc"}';
    $conn->close();
    exit;
}

$result = $stmt->get_result();

if ($result->num_rows==1){
    while($row = $result->fetch_assoc()) {
        $MunID = $row["MunID"];
    }
}

header("Content-type:application/json");
echo json_encode(array(
'MunID' => $MunID
));

$stmt->close();
$conn->close();
exit;


?>