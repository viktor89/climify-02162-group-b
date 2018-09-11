<?php

//************************************************
//	Update other user 
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

	//user who wants to update
	$phaseCurrentUserName = $_GET['current-username']; 
	$CurrentUserRole;
	$UpdateUserRole;

	$phaseUserName = clean($_GET['username']); 
	$phasePassword = clean($_GET['password']);
	$phaseFirstName = clean($_GET['first-name']); 
	$phaseLastName = clean($_GET['last-name']);
	$phaseEmail = clean(strtolower($_GET['email']));
	$phaseRole = clean($_GET['role']);

	$passUppercase = preg_match('@[A-Z]@', $phasePassword);
	$passLowercase = preg_match('@[a-z]@', $phasePassword);
	$passNumber = preg_match('@[0-9]@', $phasePassword);

	if(!$passUppercase || !$passLowercase || !$passNumber || strlen($phasePassword) < 8) {
	  	echo '{"status":"error"}';
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

	if ( $phaseCurrentUserName == "" ) {
		echo '{"status":"error"}';
		exit;
	}

	if ( $phaseRole == "" ) {
		echo '{"status":"error"}';
		exit;
	}

	if ( $phaseCurrentUserName == $phaseUserName ) {
		echo '{"status":"error"}';
		exit;
	}


	$conn = new mysqli($servername, $username, $password, $databasename);
	        if ($conn->connect_error) {
	            die("Connection error: " . $conn->connect_error);
	            exit;
	        }

	$sql = "SELECT * from Person WHERE UserName = '$phaseUserName' ";  

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

	$sql = "SELECT * from Person WHERE UserName = '$phaseCurrentUserName' ";    

    $result = $conn->query($sql);
        if(!$result) {
            die("Error: " . $conn->error);
        }

    if ($result->num_rows==1){	
		while($row = $result->fetch_assoc()) {
	        $UpdateUserRole = $row["RoleName"];
		}
	}  else {
		echo '{"status":"error"}';
		$conn->close();
		exit;
	}


	if ( $CurrentUserRole == 2 ) {
		if ( $CurrentUserRole < $UpdateUserRole ) {
			echo '{"status":"error"}';
			$conn->close();
			exit;
		}
		if ( $UpdateUserRole == 1 ) {
			echo '{"status":"error"}';
			$conn->close();
			exit;
		}
	}

	$encryptedPass = encrypt($phasePassword, ENCRYPTION_KEY);

	$sql = "UPDATE Person SET FirstName='$phaseFirstName', LastName='$phaseLastName', Email='$phaseEmail', UserPassword='$encryptedPass', RoleName='$phaseRole' WHERE UserName = '$phaseUserName' "; 

	$result = $conn->query($sql);
	    if(!$result) {
	        echo '{"status":"error"}';
			$conn->close();
			exit;
	    } else {
	        echo '{"status":"ok"}';
    	}


$conn->close();
	

?>





































































