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

	$servername = DB_HOST;
	$username = DB_USER;
	$password = DB_PASSWORD;
    $databasename = DB_NAME;

    $conn = new mysqli($servername, $username, $password, $databasename);
	        if ($conn->connect_error) {
	            exitApi();
            }
            
    $tagID = [];

    $stmt = $conn->prepare("SELECT DISTINCT tagID
                            FROM (
                            SELECT tagID,COUNT(1) occurrences
                            FROM uvm_content_tags GROUP BY tagID
                            ORDER BY occurrences DESC) AS t LIMIT 40
                            ");

    if (!$stmt->execute()) { 
        $stmt->close();
        $conn->close();
        exitApi();
    }
    $result = $stmt->get_result();
    if ($result->num_rows==0){
        $stmt->close();
        $conn->close(); 
        exitApi();
    }
    while($row = mysqli_fetch_assoc($result))
    {
        array_push($tagID,$row["tagID"]);
    }
    $stmt->close();

    $ids = implode(", ",$tagID);

    $stmt = $conn->prepare("SELECT * 
        FROM uvm_tags 
        WHERE tagID IN ($ids)
        ORDER BY uvm_tags.tagID DESC LIMIT 40
        ");
    
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