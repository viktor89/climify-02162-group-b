<?php 
//session_start();
/*
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
*/

//TODO - Der bliver ikke opdateret ordentligt i tabellen..


require_once "../meta.php";

$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASSWORD;
$databasename = DB_NAME;


    $conn = new mysqli($servername, $username, $password, $databasename);
            if ($conn->connect_error) {
                die("Connection error: " . $conn->connect_error);
                exit;
            }

//TODO check for userrole (permissions)




$LocationID = $_GET["LocationID"];
$LocationName = $_GET["LocationName"];






if( !$result = $conn->query("UPDATE Location SET LocationName = '$LocationName' WHERE LocationID = '$LocationID' ")){
echo '{"status":"error"}';
//echo "error: " . $conn->error;
}

else{
echo '{"status":"ok"}';
}




   

 
//$json = '{"isNull":"' + $checkIfNull + '"}';
//echo $json;


$conn->close();




?>