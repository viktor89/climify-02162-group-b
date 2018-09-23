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

	//fetch table rows from mysql db
    $sql = "SELECT PermID, PermName, PermDescription, RoleID FROM Permission NATURAL JOIN RolePermission WHERE InstID = 1 ORDER BY PermID"; 

    $result = mysqli_query($conn, $sql) or die("Error in Selecting " . mysqli_error($conn));
        
    $emparray = array();
    while($row = mysqli_fetch_assoc($result))
    {	
		//echo 'just user id '. $row["UserID"];
    	$temparray = [];
		array_push($temparray[PermID] =  $row["PermID"]);
		array_push($temparray[PermName] =  $row["PermName"]);
    	array_push($temparray[PermDescription] = $row["PermDescription"]);
    	array_push($temparray[RoleID] =  $row["RoleID"]);
       	array_push(	$emparray, $temparray);
    }

    $sajSchools = json_encode( $emparray , JSON_UNESCAPED_UNICODE );
	echo $sajSchools;

	$conn->close();
?>
