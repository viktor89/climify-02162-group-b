<?php 

//************************************************
//	Get influx DB information
//************************************************


require_once "../admin-meta.php";
require_once "../session.php";

$phaseSessionToken = clean($_POST[sessionToken]);

if( $phaseSessionToken != $adminSessionToken ){
    echo '{"status":"error"}';
    exit;
}

if (!$systemAccess) {
    echo '{"status":"error"}';
    exit;
}

$phaseCompanyID=clean($_POST["id"]);

if ($phaseCompanyID == "") {
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

$stmt = $conn->prepare("SELECT * FROM icm_users_company WHERE companyID = ? ORDER BY companyID DESC LIMIT 1");
        $stmt->bind_param("s", $phaseCompanyID); 

if (!$stmt->execute()) { 
    echo '{"status":"error"}';
    $stmt->close();
    $conn->close();
    exit;
}

$result = $stmt->get_result();

if ($result->num_rows==1){
    while($row = $result->fetch_assoc()) {
        $DBIfxName = $row["dbName"];
        $DBIfxUser = $row["dbUser"];
        $DBIfxPass = $row["dbPass"];
    }
}

$stmt->close();
$conn->close();

$DBIfxPass = decrypt($DBIfxPass, ENCRYPTION_KEY_INFLUX);

$returnFromIfx = file_get_contents("http://193.200.45.37:8086/query?u=".$DBIfxUser."&p=".$DBIfxPass."&db=".$DBIfxName."&q=SHOW%20MEASUREMENTS%20limit%201");

$returnFromIfx = json_decode($returnFromIfx, true);

if ($returnFromIfx[results][0][series][0][name] != "measurements") {
    echo '{"status":"error"}';
    exit;
} 

echo '{"status":"ok","dbName":"'.$DBIfxName.'", "dbUser":"'.$DBIfxUser.'", "dbPass":"'.$DBIfxPass.'"}';

?>
