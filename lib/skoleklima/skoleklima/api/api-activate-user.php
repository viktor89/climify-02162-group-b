<?php

//************************************************
//	Delete user 
//************************************************

	require_once "../meta.php";

	//echo "INSIDE ACTIVATE USER";

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

	$phaseCurrentUserID = clean($_GET['current-userID']); 
	$phaseDeleteUserName = clean($_GET['delete-username']); 
	$CurrentUserRole;

	if ( $phaseCurrentUserID == "" ) {
		echo '{"status":"error"}';
		exit;
	}

	if ( $phaseDeleteUserName == "" ) {
		echo '{"status":"error"}';
		exit;
	}

	$conn = new mysqli($servername, $username, $password, $databasename);
	        if ($conn->connect_error) {
	            die("Connection error: " . $conn->connect_error);
	            exit;
	        }

    $sql = " SELECT RoleName FROM Person WHERE UserID = '$phaseCurrentUserID' ";  

    $result = $conn->query($sql);
        if(!$result) {
            die("Error: " . $conn->error);
        }

    if ($result->num_rows==1){	
		while($row = $result->fetch_assoc()) {
	        $CurrentUserRole = $row["RoleName"];
		}
	} else {
		echo '{"status":"error"}';
		$conn->close();
		exit;
	}

	if ( $CurrentUserRole == 1 || $CurrentUserRole == 2 || $CurrentUserRole == 3) {		
	} else {
		echo '{"status":"error"}';
		$conn->close();
		exit;
	}

	//echo "delete user name ";
	//echo $phaseDeleteUserName;
	
	$sql = " SELECT UserID FROM Person WHERE UserName = '$phaseDeleteUserName' ";  

    $result = $conn->query($sql);
        if(!$result) {
            die("Error: " . $conn->error);
        }

    if ($result->num_rows==1){	
		while($row = $result->fetch_assoc()) {
			$DeleteUserID = $row["UserID"];
		}
	}  else {
		echo '{"status":"error"}';
		$conn->close();
		exit;
	}


	//echo "delete user ID ";
	//echo $DeleteUserID;


	$sql = " DELETE FROM UserActivate WHERE NewUserID = '$DeleteUserID' ";

	$result = $conn->query($sql);
    

    $conn->close();

?>
