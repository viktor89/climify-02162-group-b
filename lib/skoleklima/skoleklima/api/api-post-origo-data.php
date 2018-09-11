<?php

//************************************************
//	Post origo data from floorplan
//************************************************

	require_once "../meta.php";

	if( $currentUserID == ""){
	  	echo '{"status":"currentUserID error"}';
		exit;
	} 
	
	// Validate API key
	// TODO: WAIT UNTIL MERGE
	
	$apiPassword = API_PASSWORD;
	$phase_api_key = clean($_POST['fAY2YfpdKvR']);

	if( $apiPassword !== $phase_api_key){
	  	echo '{"status":"error"}';
		exit;
	} 
	

	$servername = DB_HOST;
	$username = DB_USER;
	$password = DB_PASSWORD;
	$databasename = DB_NAME;

	$phaseMapID = clean($_POST['mapID']);
	$phaseLat = clean($_POST['lat']);
	$phaseLng = clean($_POST['lng']);
	$phaseScale = clean($_POST['scale']);
	$phaseRotDiff = clean($_POST['rotDiff']);


	if( $phaseMapID == ""){
	  	echo '{"status":"error"}';
		exit;
	} 

	if( $phaseLat == ""){
	  	echo '{"status":"error"}';
		exit;
	} 

	if( $phaseLng == ""){
	  	echo '{"status":"error"}';
		exit;
	} 

	if( $phaseScale == ""){
	  	echo '{"status":"error"}';
		exit;
	} 

	if( $phaseRotDiff == ""){
	  	echo '{"status":"error"}';
		exit;
	} 


	$conn = new mysqli($servername, $username, $password, $databasename);
	if ($conn->connect_error) {
		die("Connection error: " . $conn->connect_error);
		exit;
	}

// This has been moved to api-upload-map.php
/*
	// First, fetch the foreign key MapID
	$stmt = "SELECT MapID FROM Map WHERE FileName = '5a8eb23fa95bd.png'";
	
	$result = $conn -> query($stmt);
	if (!$result) {
		die("Error in Selecting " . $conn->error);
	}

	if ($result -> num_rows == 1) {
		while($row = $result->fetch_assoc()) {
			$mapID = $row["MapID"];
		}
	}
 */

 	// Insert origo data for MapID
	$stmt = $conn->prepare("INSERT INTO GeometryMap (MapID, Latitude, Longitude, Scale, Angle) values (?,?,?,?,?)");
	
	$stmt->bind_param("idddd", $phaseMapID, $phaseLat, $phaseLng, $phaseScale, $phaseRotDiff);
	
	if ($stmt->execute()) { 
   		echo '{"status":"ok"}';
	} else {
	   echo '{"status":"error"}';
	}

	$stmt->close();
    $conn->close();

?>