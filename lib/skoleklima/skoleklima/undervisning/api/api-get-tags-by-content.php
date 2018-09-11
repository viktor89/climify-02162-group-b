<?php

//************************************************
//	Search Content
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

    $phasecontentID = clean($_POST['contentID']);

    if($phasecontentID == ""){
	  	echo '{"status":"error"}';
		exit;
    }

    $servername = DB_HOST;
	$username = DB_USER;
	$password = DB_PASSWORD;
    $databasename = DB_NAME;

    $conn = new mysqli($servername, $username, $password, $databasename);
	        if ($conn->connect_error) {
	            exitApi();
            }
            
    $stmt = $conn->prepare("SELECT uvm_tags.tagID, uvm_tags.tagTitle
                            FROM uvm_content_tags
                            LEFT JOIN uvm_tags ON uvm_content_tags.tagID = uvm_tags.tagID
                            WHERE uvm_content_tags.contentID = ?
                            ");

    $stmt->bind_param("s", $phasecontentID);    
    
    if (!$stmt->execute()) { 
        echo '{"status":"error"}';
        $conn->close();
        exit;
    }
    $result = $stmt->get_result();
    $emparray = array();

    while($row = mysqli_fetch_assoc($result))
    {
        $emparray[] = $row;
    }

    $content = json_encode( $emparray , JSON_UNESCAPED_UNICODE );
	echo $content;

    $stmt->close();

    $conn->close(); 

    function exitApi() {
        echo '{"status": "error"}';
		exit;
    }

?>