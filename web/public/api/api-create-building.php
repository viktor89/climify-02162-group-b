<?php

//************************************************
//	Create new building
//************************************************
//error_reporting(E_ALL);
//ini_set("display_errors", 1);
    require_once "../meta.php";
    
	if( $currentUserID == ""){
	  	echo '{"status":"errorid"}';
		exit;
	} 
	
	// Validate API key
	$apiPassword = API_PASSWORD;
	$phase_api_key = clean($_POST['fAY2YfpdKvR']);

	if( $apiPassword !== $phase_api_key){
	  	echo "{status:error}";
		exit;
	} 

	$servername = DB_HOST;
	$username = DB_USER;
	$password = DB_PASSWORD;
	$databasename = DB_NAME;

    $buildingName = clean($_POST['name']);
    $buildingDecription = clean($_POST['decription']);
   // $buildingWeather = clean($_POST['weather']);
	
	if( $buildingName == ""){
	  	echo '{"status":"error"}';
		exit;
    }


    if ($currentUserRole != 1){
        echo '{"status":"error"}';
		exit;
    }
    

	$conn = new mysqli($servername, $username, $password, $databasename);
	if ($conn->connect_error) {
		die("Connection error: " . $conn->connect_error);
		exit;
	}

/*
	$stmt = $conn->prepare("INSERT INTO Institution (buildingName, buildingDecription, WeatherLocationID) values (?,?,?)");
	$stmt->bind_param("sss", $buildingName, $buildingDecription, $buildingWeather);
	
*/

	//INSERTING INSTITUTION
$nul=0;

//OBS sætter nul som værdi på buildingweathers plads, da vi ikke bruger det (men måske kommer til)
$stmt = $conn->prepare("INSERT INTO Institution VALUES (?,?,?,?)");

$stmt->bind_param("isis",$nul,$buildingName,$currentUserCompanyID,$buildingDecription);

            
            if (!$stmt->execute()) { 
                echo '{"status":"error"}';
                $conn->close();
                exit;
            } else {
                echo '{"status":"ok"}';
            }


	$stmt->close();
    $conn->close();
    
?>
