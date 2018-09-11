<?php

//************************************************
//	Get users from search
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

	$pahseSearch = clean($_GET['search']);

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
    $sql = "SELECT * FROM Person WHERE UserName LIKE '%$pahseSearch%' OR Email LIKE '%$pahseSearch%' OR FirstName LIKE '%$pahseSearch%' OR LastName LIKE '%$pahseSearch%' ORDER BY userName ASC"; 

    $result = mysqli_query($conn, $sql) or die("Error in Selecting " . mysqli_error($conn));
        
    $emparray = array();
    while($row = mysqli_fetch_assoc($result))
    {	
    	$temparray = [];
    	$passwordDecrypted = decrypt($row["UserPassword"], ENCRYPTION_KEY);
    	array_push($temparray[userID] =  $row["UserID"]);
    	array_push($temparray[userName] =  $row["UserName"]);
    	array_push($temparray[userPassword] =  $passwordDecrypted);
    	array_push($temparray[role] = $row["RoleName"]);
    	array_push($temparray[eMail] =  $row["Email"]);
    	array_push($temparray[firstName] =  $row["FirstName"]);
    	array_push($temparray[lastName] =  $row["LastName"]);
       	array_push(	$emparray, $temparray);
    }

    $sajSchools = json_encode( $emparray , JSON_UNESCAPED_UNICODE );
	echo $sajSchools;

	$conn->close();
	
?>
