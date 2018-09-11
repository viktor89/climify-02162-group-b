<?php

//************************************************
//	Delete user 
//************************************************

require_once "../meta.php";

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

$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASSWORD;
$databasename = DB_NAME;

$phaseCurrentUserName = clean($_GET['current-username']); 
$phaseDeleteUserName = clean($_GET['delete-username']); 


if ( $phaseCurrentUserName == "" ) {
    echo '{"status":"error"}';
    exit;
}

if ( $phaseDeleteUserName == "" ) {
    echo '{"status":"error"}';
    exit;
}

if ( $phaseCurrentUserName == $phaseDeleteUserName ) {
    echo '{"status":"error", "message":"self"}';
    exit;
}

$conn = new mysqli($servername, $username, $password, $databasename);
if ($conn->connect_error) {
    die("Connection error: " . $conn->connect_error);
    exit;
}



$sql = " SELECT * FROM Person NATURAL JOIN InstUser NATURAL JOIN Institution WHERE UserName = '$phaseDeleteUserName' ";  

$result = $conn->query($sql);
if(!$result) {
    die("Error: " . $conn->error);
}




if ($result->num_rows==1){	
    while($row = $result->fetch_assoc()) {
        $tryingToDeleteRole = $row["RoleName"];
        $tryingToDeleteUserID = $row["UserID"];
        $tryingToDeleteInstID = $row["InstID"];
        $tryingToDeleteMunID = $row["MunID"];
    }
} else {
    echo '{"status":"error"}';
    $conn->close();
    exit;
}
/*
echo "phaseCurrentUserName " . $phaseCurrentUserName;

echo "tryingToDeleteRole " . $tryingToDeleteRole;

echo "currentUserRole " . $currentUserRole;
*/
if ($tryingToDeleteRole <= $currentUserRole){
    echo '{"status":"error"}';
    $conn->close();
    exit; 

}


//Checking if school / muncipality matches
/*
echo "tryingToDeleteMunID " .$tryingToDeleteMunID;

echo " currentUserCompanyID " .$currentUserCompanyID;
*/
if ($currentUserRole==1){
    if( $tryingToDeleteMunID != $currentUserCompanyID){
        echo '{"status":"error"}';
        $conn->close();
        exit;  
    }

}

else{

    if ($tryingToDeleteInstID != $InstID){
        echo '{"status":"error"}';
        $conn->close();
        exit;
    }
}





//echo "tryingToDeleteUserID " .$tryingToDeleteUserID;


//If made it through validation -> delete user

$sql = "DELETE FROM InstUser WHERE UserID = '$tryingToDeleteUserID' "; 

$conn->query($sql);

$sql = "DELETE FROM Person WHERE UserID = '$tryingToDeleteUserID' ";  

if ($conn->query($sql)){

echo '{"status": "ok"}';

}





$conn->close();

?>
