<?php

//************************************************
//	Insert Content
//************************************************

    require_once "../../meta.php";

    // Validate API key
	$apiPassword = API_PASSWORD;
	$phase_api_key = clean($_POST['fAY2YfpdKvR']);

	if( $apiPassword !== $phase_api_key){
	  	echo '{"status":"error"}';
		exit;
    }

    if(!$currentUserID){
	  	echo '{"status":"error"}';
		exit;
    }
    
	$servername = DB_HOST;
	$username = DB_USER;
	$password = DB_PASSWORD;
	$databasename = DB_NAME;

    $phaseUserName = clean($_POST['username']);
    $phaseUserPass = clean($_POST['password']);
    $phasecontentID = clean($_POST['contentID']);
    $DBUserPass;
    $DBUserRole;
    $DBUserID;
    

    if($phaseUserName == ""){
	  	echo '{"status":"error"}';
		exit;
    }
    if($phaseUserPass == ""){
	  	echo '{"status":"error"}';
		exit;
    }
    if($phasecontentID == ""){
	  	echo '{"status":"error"}';
		exit;
    }
    
    $conn = new mysqli($servername, $username, $password, $databasename);
    if ($conn->connect_error) {
        die("Connection error: " . $conn->connect_error);
        exit;
    }

    $stmt = $conn->prepare("SELECT * FROM icm_users_system WHERE userName = ?");

	$stmt->bind_param("s", $phaseUserName);

	$stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows==1){
        while($row = $result->fetch_assoc()) {
            $DBUserPass = $row["userPassword"];
            $DBUserRole = $row["role"];
            $DBUserID = $row["userID"];
        }
    }
    
    $stmt->close();

    $passPhaseDecrypted = decrypt($phaseUserPass, ENCRYPTION_KEY);
    $passDBDecrypted = decrypt($DBUserPass, ENCRYPTION_KEY);

    if ($passPhaseDecrypted !== $passDBDecrypted) {
        echo '{"status":"error user"}';
        $conn->close();
		exit;
    }

    $conn = new mysqli($servername, $username, $password, $databasename);
    if ($conn->connect_error) {
        die("Connection error: " . $conn->connect_error);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM uvm_content_tags WHERE contentID = ?");
    $stmt->bind_param("s", $phasecontentID);

    if (!$stmt->execute()) { 
        echo '{"status":"error"}';
        $conn->close();
        exit;
    }

    if ($DBUserRole==1) {
        $stmt = $conn->prepare("DELETE FROM uvm_content WHERE contentID = $phasecontentID");
    } else {
        $stmt = $conn->prepare("DELETE FROM uvm_content WHERE contentID = $phasecontentID AND author = $DBUserID");
    }

    $stmt->bind_param("sssss", $phaseTitle, $phaseDecription, $phaseDelta, $currentTime, $phaseLevel);
    if ($stmt->execute()) {
        $stmt->close();
        echo '{"status":"ok"}';
    } else {
        $stmt->close();
        echo '{"status":"error"}';
    }
    
    $conn->close();
    
?>