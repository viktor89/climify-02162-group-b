<?php

//************************************************
//	Get Schools
//************************************************

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

if( $currentUserID == ""){
	  	echo '{"status":"error"}';
		exit;
	}


$InstNames=[];


//fetch table rows from mysql db
$sql = "SELECT InstName, InstID FROM Institution WHERE MunID = '$currentUserCompanyID' ORDER BY InstName ASC"; 



$result = mysqli_query($conn, $sql) or die("Error in Selecting " . mysqli_error($conn));


//create an array
$emparray = array();
while($row = mysqli_fetch_assoc($result))
{
    $emparray[] = $row;
}




/*
while ($row = $result->fetch_assoc()) {
        array_push($row["InstName"]);
    }
*/






$jsonArray = json_encode( $emparray , JSON_UNESCAPED_UNICODE );
echo $jsonArray;

$conn->close();




?>