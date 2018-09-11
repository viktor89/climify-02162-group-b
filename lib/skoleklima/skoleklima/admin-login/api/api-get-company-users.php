<?php 

//************************************************
//	Get Companye Users
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

$phaseCompanyID = clean($_POST["companyid"]);

if ($phaseCompanyID == "") {
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

/*
$stmt = $conn->prepare("SELECT icm_users_system.userID, icm_users_system.userName, icm_users_system.role, icm_users_system.firstName, icm_users_system.lastName, icm_users_system.userBlocked, icm_users_system.eMail, icm_users_system.lastLogin
                        FROM icm_users_system 
                        LEFT JOIN icm_users_company_system ON icm_users_system.userID = icm_users_company_system.userID
                        WHERE icm_users_company_system.companyID = ?
                        ORDER BY icm_users_system.userID DESC");
*/

$stmt = $conn->prepare("SELECT * FROM Person NATURAL JOIN ProjectManager WHERE MunID = ?
UNION
SELECT * FROM Person NATURAL JOIN ProjectManagerActivate WHERE MunID = ?
ORDER BY Blocked ASC");
                        
$stmt->bind_param("ss", $phaseCompanyID,$phaseCompanyID); 

$stmt->execute();

$result = $stmt->get_result();

$emparray = array();
while($row = mysqli_fetch_assoc($result))
{
    $emparray[] = $row;
}

$messages = json_encode( $emparray , JSON_UNESCAPED_UNICODE );
echo $messages;

$stmt->close();

$conn->close();   

?>