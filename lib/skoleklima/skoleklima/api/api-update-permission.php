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

	$phasePermID = $_GET['permID']; 

	$phasePermRole2 = clean($_GET['permRole2']); 
	$phasePermRole3 = clean($_GET['permRole3']);
	$phasePermRole4 = clean($_GET['permRole4']); 
	$phaseSchool = clean($_GET['user-school']); 
	//echo '{"status": "ok"}';

	
	if(!$phasePermID) {
	  	echo '{"status":"error"}';
		exit;
	}

	if(  strlen($phaseSchool) == "" ){
	    echo '{"status":"error"}';
	    exit;
	}

	
	if(  strlen($phasePermRole2) == "" ){
	    echo '{"status":"error"}';
	    exit;
	}

	if(  strlen($phasePermRole3) == "" ){
	    echo '{"status":"error"}';
	    exit;
	}

	if(  strlen($phasePermRole4) == "" ){
	    echo '{"status":"error"}';
	    exit;
	}

	
	
	$conn = new mysqli($servername, $username, $password, $databasename);
	        if ($conn->connect_error) {
	            die("Connection error: " . $conn->connect_error);
	            exit;
	        }

	$sql = " DELETE FROM RolePermission WHERE PermID = '$phasePermID' ";
	$result = $conn->query($sql);

	$ok = 1;
	$one = 1;
	$two = 2;
	$three = 3;
	$four = 4;	

	if ($stmt = $conn->prepare("INSERT INTO RolePermission VALUES (?,?,?)")) {
		
		$stmt->bind_param("iii",$one,$phasePermID,$phaseSchool);
		
		$stmt->execute();

		$stmt->close();
			
		$ok = 1;
	
	}else{
		$ok = 0;
		echo '{"status":"error"}';
	}
	if($phasePermRole2 == "true"){
		if ($stmt = $conn->prepare("INSERT INTO RolePermission VALUES (?,?,?)")) {
		
			$stmt->bind_param("iii",$two,$phasePermID,$phaseSchool);
			
			$stmt->execute();
	
			$stmt->close();
				
			$ok = 1;
		
		}else{
			$ok = 0;
			echo '{"status":"error"}';
		}
	}
	
	if($phasePermRole3 == "true"){
		if ($stmt = $conn->prepare("INSERT INTO RolePermission VALUES (?,?,?)")) {
			
			$stmt->bind_param("iii",$three,$phasePermID,$phaseSchool);
			
			$stmt->execute();

			$stmt->close();
				
			$ok = 1;
		
		}else{
			$ok = 0;
			echo '{"status":"error"}';
		}
	}

	if($phasePermRole4 == "true"){
		if ($stmt = $conn->prepare("INSERT INTO RolePermission VALUES (?,?,?)")) {
			
			$stmt->bind_param("iii",$four,$phasePermID,$phaseSchool);
			
			$stmt->execute();

			$stmt->close();
				
			$ok = 1;
		
		}else{
			$ok = 0;
			echo '{"status":"error"}';
		}
	}



	if($ok == 1){	
		echo '{"status":"ok"}';
	}else{
		echo '{"status":"error"}';
	}
			


$conn->close();
	

?>





































































