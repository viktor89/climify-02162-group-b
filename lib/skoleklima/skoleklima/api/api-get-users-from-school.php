<?php

//************************************************
//	Get users from school
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

$pahseSchool = clean($_GET['school']);

if( $pahseSchool == "" ){
    echo '{"status":"error"}';
    exit;
}

$conn = new mysqli($servername, $username, $password, $databasename);
if ($conn->connect_error) {
    die("Connection error: " . $conn->connect_error);
    exit;
}



if ($currentUserRole==4){
    echo '{"status":"error"}';
    exit;
}


//fetch table rows from mysql db
$sql = "SELECT UserPassword, UserName, RoleName, Email, FirstName, LastName FROM Person JOIN InstUser ON Person.UserID = InstUser.UserID WHERE InstID = 1 && Blocked = 1 ORDER BY userName ASC"; 

$result = mysqli_query($conn, $sql) or die("Error in Selecting " . mysqli_error($conn));

$emparray = array();
while($row = mysqli_fetch_assoc($result))
{	
    //echo 'just user id '. $row["UserID"];
    $temparray = [];
    $passwordDecrypted = decrypt($row["UserPassword"], ENCRYPTION_KEY);
    array_push($temparray[UserName] =  $row["UserName"]);
    array_push($temparray[UserPassword] =  $passwordDecrypted);
    array_push($temparray[RoleName] = $row["RoleName"]);
    array_push($temparray[Email] =  $row["Email"]);
    array_push($temparray[FirstName] =  $row["FirstName"]);
    array_push($temparray[LastName] =  $row["LastName"]);
    array_push(	$emparray, $temparray);
}

$sajSchools = json_encode( $emparray , JSON_UNESCAPED_UNICODE );
echo $sajSchools;

$conn->close();
?>
