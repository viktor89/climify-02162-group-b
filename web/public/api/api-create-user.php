<?php

//************************************************
//	Create user 
//************************************************

require_once "../meta.php";


$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASSWORD;
$databasename = DB_NAME;

$rand_pass_num = array("A","B","C","D","E","F","G","H","I","J");
$rand_pass_sym = array("!","@");
$pass = bin2hex(openssl_random_pseudo_bytes(3)).$rand_pass_sym[array_rand($rand_pass_sym)].$rand_pass_num[array_rand($rand_pass_num)];

//$phaseCurrentUserName = $_GET['currentUserName']; 
$CurrentUserRole;

$phaseUserName = clean(strtolower($_GET['userName'])); 
$phasePassword = $pass; 
$phaseFirstName = clean($_GET['firstName']); 
$phaseLastName = clean($_GET['lastName']);
$phaseEmail = clean(strtolower($_GET['email']));
$phaseRole = clean($_GET['role']);
$phaseSchool = clean($_GET['school']);


if( $currentUserID == ""){
    echo '{"status":"error"}';
    exit;
}

// Validate API key
$apiPassword = API_PASSWORD;
$phase_api_key = clean($_GET['fAY2YfpdKvR']);


if( $apiPassword !== $phase_api_key){
    echo '{"status":"error"}';
    exit;
} 


if ($currentUserRole!=1){
    if ($phaseSchool!=$InstID){
        echo '{"status":"error"}';
        exit;
    }
}


else{

    $sql = "SELECT MunID FROM Institution WHERE InstID = '$phaseSchool' ";  

    $result = $conn->query($sql);
    if(!$result) {
        die("Error: " . $conn->error);
    }



    if ($result->num_rows==1){	
        $row = $result->fetch_assoc();
        $MunIDForSchool = $row["MunID"];
    }

    //echo "MunIDForSchool " . $MunIDForSchool;

    //  echo "currentUserCompanyID " . $currentUserCompanyID;
    if ($MunIDForSchool!= $currentUserCompanyID){
        echo '{"status":"error"}';
        exit;
    }

}



//echo '{"role" : "'.$phaseRole.'", "firstname": "'.$phaseFirstName.'", "lastname": "'.$phaseLastName.'", "username": "'.$phaseUserName.'", "pass": "'.$encryptedPass.'", "mail": "'.$phaseEmail.'", "inst": "'.$InstID.'"}';

if( strlen($phaseUserName) < 4 || strlen($phaseUserName) > 8 || preg_match('/\s/',$phaseUserName)){
    echo '{"status":"error"}';
    exit;
}

if (in_array($phaseUserName, $illegal_Usernames)) {
    echo '{"status":"error", "message": "illegal" }';
    exit;
}

if(  strlen($phaseFirstName) < 1 ){
    echo '{"status":"error"}';
    exit;
}

if(  strlen($phaseLastName) < 1 ){
    echo '{"status":"error"}';
    exit;
}


if ( $phaseEmail !== "") {
    if( !preg_match('/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/', $phaseEmail) ) {
        echo '{"status":"error"}';
        exit;
    } 
}



if ( $phaseRole == "" ) {
    echo '{"status":"error"}';
    exit;
}

if ( $phaseRole == "2" ) {
    if(  strlen($phaseSchool) < 1 ){
        echo '{"status":"error"}';
        exit;
    }
} elseif ( $phaseRole == "3" ) {
    if(  strlen($phaseSchool) < 1 ){
        echo '{"status":"error"}';
        exit;
    }

}  elseif ( $phaseRole == "4" ) {
    if(  strlen($phaseSchool) < 1 ){
        echo '{"status":"error"}';
        exit;
    }
}

$conn = new mysqli($servername, $username, $password, $databasename);
if ($conn->connect_error) {
    die("Connection error: " . $conn->connect_error);
    exit;
}







$sql = " SELECT * FROM Person WHERE UserName = '$phaseUserName' ";  

$result = $conn->query($sql);
if(!$result) {
    die("Error: " . $conn->error);
}

if ($result->num_rows==1){	
    echo '{"status":"error", "message": "userOccupied" }';
    $conn->close();
    exit;
} 

$encryptedPass = encrypt($phasePassword, ENCRYPTION_KEY);



$nul = 0;
$et = 1;

$ok = 1;

$LastLogin = null;

if ($stmt = $conn->prepare("INSERT INTO Person VALUES (?,?,?,?,?,?,?,?,?)")) {

    $stmt->bind_param("issssisis",$nul,$phaseUserName,$phaseFirstName,$phaseLastName,$phaseEmail,$phaseRole,$encryptedPass,$et,$LastLogin);

    $stmt->execute();


    //echo($stmt->error);

    $stmt->close();

    $ok = 1;
}else{
    $ok = 0;
    echo '{"status":"error"}';
}

if($ok == 1){
    if ($stmt = $conn->prepare("INSERT INTO InstUser VALUES (?,?)")) {

        $sql1 = "SELECT UserID FROM Person WHERE UserName = '$phaseUserName'"; 
        $result1 = mysqli_query($conn, $sql1);
        $person = mysqli_fetch_assoc($result1);


        $stmt->bind_param("ii", $person["UserID"], $phaseSchool);

        $stmt->execute();


        //echo($stmt->error);

        $stmt->close();

        echo '{"status": "ok", "genPassword": "'.$phasePassword.'" }';
    }


    else{

        echo '{"status":"error"}';
    }
}	





$conn->close();

?>

