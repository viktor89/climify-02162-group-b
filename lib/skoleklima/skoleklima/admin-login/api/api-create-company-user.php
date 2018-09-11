<?php 

//************************************************
//	Create Companye Users
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
$phaseUsername = clean(strtolower($_POST["username"]));
$phaseUserFirstName = clean($_POST["firstname"]);
$phaseUserLastName = clean($_POST["lastname"]);
$phaseUserEmail = clean($_POST["email"]);
$setUserSchool = "";
$setUserRole = "1";
$setUserBlock = "1";

if ($phaseCompanyID == "") {
    echo '{"status":"error"}';
    exit;
}
if( strlen($phaseUsername) < 4 || strlen($phaseUsername) > 8 || preg_match('/\s/',$phaseUsername)){
    echo '{"status":"error"}';
    exit;
}

$rand_pass_num = array("A","B","C","D","E","F","G","H","I","J");
$rand_pass_sym = array("!","@");
$setUserPass = bin2hex(openssl_random_pseudo_bytes(3)).$rand_pass_sym[array_rand($rand_pass_sym)].$rand_pass_num[array_rand($rand_pass_num)];
$encryptedPass = encrypt($setUserPass, ENCRYPTION_KEY_USERS);

$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASSWORD;
$databasename = DB_NAME;

$conn = new mysqli($servername, $username, $password, $databasename);
if ($conn->connect_error) {
    die("Connection error: " . $conn->connect_error);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM Person WHERE UserName = ?");
$stmt->bind_param("s", $phaseUsername);
if (!$stmt->execute()) { 
    echo '{"status":"error"}';
    $stmt->close();
    $conn->close();
    exit;
}

//echo "username " . $phaseUsername . " EncryptedPass " . $encryptedPass;


$result = $stmt->get_result();
if ($result->num_rows!=0){	
    echo '{"status":"error", "message": "userOcupied"}';
    $conn->close();
    exit;
} 
/*
$stmt = $conn->prepare("INSERT INTO icm_users_system (userName, userPassword, role, eMail, firstName, lastName, schoolAllowed, userBlocked) values (?,?,?,?,?,?,?,?)");
$stmt->bind_param("ssssssss", $phaseUsername, $encryptedPass, $setUserRole, $phaseUserEmail, $phaseUserFirstName, $phaseUserLastName, $setUserSchool, $setUserBlock);
if ($stmt->execute()) { 
    $sql = "SELECT MAX(userID) AS this_id FROM icm_users_system"; 
    $result = mysqli_query($conn, $sql) or die("Error in Selecting " . mysqli_error($conn));
    if ($result->num_rows==1){ 
        while($row = $result->fetch_assoc()) {
            $userId = $row["this_id"];
        }
    }
    $stmt->close();
    
    */

    $nul=0;
    $RoleName = 1; //Project Manager
    $LastLogin=null;
    $Blocked=1;


    
    $stmt = $conn->prepare("INSERT INTO Person VALUES (?,?,?,?,?,?,?,?,?)");
    $stmt->bind_param("issssisis",$nul,$phaseUsername,$phaseUserFirstName,$phaseUserLastName,$phaseUserEmail,$RoleName,$encryptedPass,$Blocked,$null);
    if ($stmt->execute()) { 
        echo '{"status":"ok","userID":"'.$userId.'", "pass":"'.$setUserPass.'"}';
        $UserID = $conn->insert_id;
    } else {
        echo '{"status":"error"}';
    }


$stmt->close();


$stmt = $conn->prepare("INSERT INTO ProjectManager VALUES (?,?)");
    $stmt->bind_param("ii",$UserID,$phaseCompanyID);
    $stmt->execute();




$conn->close();
?>