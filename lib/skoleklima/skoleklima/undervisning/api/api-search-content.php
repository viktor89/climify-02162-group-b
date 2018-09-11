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
/*
    if(!$currentUserID){
	  	echo '{"status":"error"}';
		exit;
    }
*/
	$servername = DB_HOST;
	$username = DB_USER;
	$password = DB_PASSWORD;
    $databasename = DB_NAME;
    
    $phaseOffset = clean($_POST['offset']);
    $phaseLimit = clean($_POST['limit']);
    $phaseLevel = clean($_POST['level']);

    $phaseTag = clean($_POST['tag']);
    $phaseSearch = clean($_POST['search']);
    
    if($phaseOffset == ""){
	  	exitApi();
    }
    if($phaseLimit == ""){
	  	exitApi();
    }
    if (!in_array($phaseLevel, array("1","2","3"), true )) {
		exitApi();
    }

    if($phaseSearch !== "" && $phaseTag !== ""){
        exitApi();
    }

    $conn = new mysqli($servername, $username, $password, $databasename);
	        if ($conn->connect_error) {
	            exitApi();
	        }

    // Get by tags
    if($phaseTag !== "" && $phaseSearch == ""){
        $stmt = $conn->prepare("SELECT uvm_content.contentID, uvm_content.author, uvm_content.title, uvm_content.decription 
        FROM uvm_content 
        LEFT JOIN uvm_content_tags ON uvm_content_tags.contentID = uvm_content.contentID
        WHERE uvm_content_tags.tagID = ?
        ORDER BY uvm_content_tags.contentID DESC
        ");
        $stmt->bind_param("s", $phaseTag);   
        if (!$stmt->execute()) { 
            echo '{"status":"error"}';
            $conn->close();
            exit;
        }
        $result = $stmt->get_result();
        if ($result->num_rows==0){
            echo '{"status":"error", "message":"noContent"}';
            $stmt->close();
            $conn->close();  
            exit;
        }
    }

    // Get by search
    if($phaseSearch !== "" && $phaseTag == ""){
        $stmt = $conn->prepare("SELECT uvm_content.contentID, uvm_content.author, uvm_content.title, uvm_content.decription 
            FROM uvm_content 
            WHERE (title LIKE ? OR decription LIKE ?) AND teashLevel = ? 
            ORDER BY contentID DESC
            LIMIT ? OFFSET ?");
        $param = "%$phaseSearch%";
        $stmt->bind_param("sssss", $param, $param, $phaseLevel, $phaseLimit, $phaseOffset);    
    }

    // Get all
    if($phaseSearch == "" && $phaseTag == ""){
        $stmt = $conn->prepare("SELECT uvm_content.contentID, uvm_content.author, uvm_content.title, uvm_content.decription 
            FROM uvm_content 
            WHERE teashLevel = ? 
            ORDER BY contentID 
            DESC LIMIT ? OFFSET ?");
        $stmt->bind_param("sss", $phaseLevel, $phaseLimit, $phaseOffset);    
    }

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