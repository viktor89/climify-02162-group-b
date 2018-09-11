<?php 

//************************************************
//	Delete Companyes
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
$stmt = $conn->prepare("DELETE icm_users_system 
                        FROM icm_users_system 
                        LEFT JOIN icm_users_company_system ON icm_users_system.userID = icm_users_company_system.userID
                        WHERE icm_users_company_system.companyID = ?");
                        
*/

$stmt = $conn->prepare("DELETE 
                        FROM Municipality
                        WHERE MunID = ?");


$stmt->bind_param("s", $phaseCompanyID);

/*
if ($stmt->execute()) { 
    $stmt = $conn->prepare("DELETE FROM icm_users_company_system WHERE companyID = ?");

    $stmt->bind_param("s", $phaseCompanyID);

    if ($stmt->execute()) { 
        
        $stmt = $conn->prepare("DELETE FROM icm_users_company WHERE companyID = ?");

        $stmt->bind_param("s", $phaseCompanyID);
*/
        if ($stmt->execute()) { 
            echo '{"status":"ok"}';
        } else {
            echo '{"status":"error"}';
            $stmt->close();
            $conn->close();
            exit;
        }

/*
    } else {
        echo '{"status":"error"}';
        $stmt->close();
        $conn->close();
        exit;
    }
}

$stmt->close();
*/


$conn->close();   

?>