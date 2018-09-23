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

    $phaseUserName = clean($_POST['username']);
    $phaseUserPass = clean($_POST['password']);
    $phasecontentID = clean($_POST['contentID']);

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

	if (!$stmt->execute()) { 
        echo '{"status":"error"}';
        $conn->close();
        exit;
    }

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
        echo '{"status":"error"}';
        $conn->close();
		exit;
    }

    $stmt = $conn->prepare("SELECT * 
        FROM uvm_content 
        WHERE contentID = ? 
        ORDER BY contentID 
        DESC LIMIT 1");
    $stmt->bind_param("s", $phasecontentID);    
    
    if (!$stmt->execute()) { 
        echo '{"status":"error"}';
        $conn->close();
        exit;
    }
    $result = $stmt->get_result();

    while($row = mysqli_fetch_assoc($result))
    {
        $tempContent = $row;
    }

    $content = json_encode( $tempContent , JSON_UNESCAPED_UNICODE );
	echo $content;

    $stmt->close();

    $conn->close();

?>