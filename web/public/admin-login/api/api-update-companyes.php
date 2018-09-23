 <?php 

//************************************************
//	Update Companyes
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
$phaseCompanyFirstName = clean($_POST["firstname"]);
$phaseCompanyLastName = clean($_POST["lastname"]);
$phaseCompanyStreet1 = clean($_POST["street1"]);
$phaseCompanyStreet2 = clean($_POST["street2"]);
$phaseCompanyCity = clean($_POST["city"]);
$phaseCompanyZipcode = clean($_POST["zipcode"]);
$phaseCompanyEmail = clean($_POST["email"]);
$phaseCompanyPhone1 = clean($_POST["phone1"]);
$phaseCompanyPhone2 = clean($_POST["phone2"]);
$phaseCompanyBlocked = clean($_POST["blocked"]);

if ($phaseCompanyID == "") {
    echo '{"status":"error"}';
    exit;
}
if ($phaseCompanyFirstName == "") {
    echo '{"status":"error"}';
    exit;
}
if ($phaseCompanyLastName == "") {
    echo '{"status":"error"}';
    exit;
}
if ($phaseCompanyStreet1 == "") {
    echo '{"status":"error"}';
    exit;
}
if ($phaseCompanyCity == "") {
    echo '{"status":"error"}';
    exit;
}
if ($phaseCompanyZipcode == "") {
    echo '{"status":"error"}';
    exit;
}
if ( $phaseCompanyEmail !== "") {
    if( !preg_match('/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/', $phaseCompanyEmail) ) {
        echo '{"status":"error"}';
        exit;
    } 
} else {
    echo '{"status":"error"}';
    exit;
}
if ($phaseCompanyPhone1 == "") {
    echo '{"status":"error"}';
    exit;
}
if (!in_array($phaseCompanyBlocked, array("0","1"), true )) {
    echo '{"status": "error"}';
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

$stmt = $conn->prepare("UPDATE icm_users_company SET 
companyContactFirstName = ?, companyContactLastName = ?, companyAddressStreet1 = ?, companyAddressStreet2 = ?, companyAddressCity = ?, companyAddressZip = ?, companyEmail = ?, companyPhone1 = ?, companyPhone2 = ?, userBlocked = ? 
WHERE companyID = ?");


$stmt->bind_param("sssssssssss", $phaseCompanyFirstName, $phaseCompanyLastName, $phaseCompanyStreet1, $phaseCompanyStreet2, $phaseCompanyCity, $phaseCompanyZipcode, $phaseCompanyEmail, $phaseCompanyPhone1, $phaseCompanyPhone2, $phaseCompanyBlocked, $phaseCompanyID);

if ($stmt->execute()) { 
    echo '{"status":"ok"}';
} else {
    echo '{"status":"error"}';
    $stmt->close();
    $conn->close();
    exit;
}

$stmt->close();
$conn->close();   

?>