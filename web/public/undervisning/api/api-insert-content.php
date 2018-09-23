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

    $currentTime = date("d-m-Y");
    $phaseUserName = clean($_POST['username']);
    $phaseUserPass = clean($_POST['password']);
    $phasecontentID = clean($_POST['contentID']);
    $phaseTitle = clean($_POST['title']);
    $phaseDecription = clean($_POST['decription']);
    $phaseDelta = $_POST['delta']; // FARLIG !!! Mulighed for SQL Injection !!!
    $phaseLevel = clean($_POST['level']);
    $pharseTags = $_POST['tags'];
   
    $DBUserPass;
    $DBUserRole;
    $DBUserID;
    $DBContentID = "";

    if($phaseUserName == ""){
	  	echo '{"status":"error"}';
		exit;
    }
    if($phaseUserPass == ""){
	  	echo '{"status":"error"}';
		exit;
    }
    if( strlen($phaseTitle) < 10 || strlen($phaseTitle) > 100 ){
	    echo '{"status":"error"}';
	    exit;
    }
    if( strlen($phaseDecription) < 50 || strlen($phaseDecription) > 300 ){
	    echo '{"status":"error"}';
	    exit;
	}
    if($phaseDelta == ""){
	  	echo '{"status":"error"}';
		exit;
    }
    if (!in_array($phaseLevel, array("1","2","3"), true )) {
		echo '{"status": "error"}';
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

    if ($phasecontentID) {

        if ($DBUserRole==1) {
            $stmt = $conn->prepare("UPDATE uvm_content SET title=?, decription=?, delta=?, postDate=?, teashLevel=? WHERE contentID = $phasecontentID");
        } else {
            $stmt = $conn->prepare("UPDATE uvm_content SET title=?, decription=?, delta=?, postDate=?, teashLevel=? WHERE contentID = $phasecontentID AND author = $DBUserID");
        }

        $stmt->bind_param("sssss", $phaseTitle, $phaseDecription, $phaseDelta, $currentTime, $phaseLevel);
        if ($stmt->execute()) {
            $stmt->close();

            // START TAG

            $stmt = $conn->prepare("DELETE FROM uvm_content_tags WHERE contentID = ?");
            $stmt->bind_param("s", $phasecontentID);

            if (!$stmt->execute()) { 
                echo '{"status":"error"}';
                $conn->close();
                exit;
            }
                        
            foreach ($pharseTags as &$value) {  

                $tagId;
                if ($value !== "") {
                    $tag = clean($value);
                    
                    $stmt = $conn->prepare("SELECT * FROM uvm_tags WHERE tagTitle = ?");
                    $stmt->bind_param("s", $tag);
                    $stmt->execute();
                    $stmt->store_result();
                    $stmt->bind_result();
                    $stmt->fetch();

                    if ($stmt->num_rows==0) {

                        $stmt = $conn->prepare("INSERT INTO uvm_tags (tagTitle) values (?)");
                        $stmt->bind_param("s", $tag);
                        $stmt->execute();

                        $sql = "SELECT MAX(tagID) AS this_tag FROM uvm_tags"; 
                        $result = mysqli_query($conn, $sql) or die("Error in Selecting " . mysqli_error($conn));

                        if ($result->num_rows==1){ 
                            while($row = $result->fetch_assoc()) {
                                $tagId = $row["this_tag"];
                            }
                        } 
                        
                    } else {

                        $stmt = $conn->prepare("SELECT tagID FROM uvm_tags WHERE tagTitle = ?");
                        $stmt->bind_param("s", $tag);
                        $stmt->execute();
                        $result = $stmt->get_result();

                        while($row = $result->fetch_assoc()) {
                            $tagId = $row["tagID"];
                        }

                    }

                    $stmt = $conn->prepare("INSERT INTO uvm_content_tags (contentID, tagID) values (?,?)");
                    $stmt->bind_param("ss", $phasecontentID, $tagId);

                    if (!$stmt->execute()) { 
                        echo '{"status":"error"}';
                        $conn->close();
                        exit;
                    }

                }
            }

            // SLUT TAG

            echo '{"status":"ok", "message":"update", "contentID":"'.$phasecontentID.'"}';
        } else {
            $stmt->close();
            echo '{"status":"error"}';
        }

    } else {

        $stmt = $conn->prepare("INSERT INTO uvm_content (title, decription, delta, postDate, author, teashLevel) values (?,?,?,?,?,?)");
        $stmt->bind_param("ssssss", $phaseTitle, $phaseDecription, $phaseDelta, $currentTime, $DBUserID, $phaseLevel);

        if ($stmt->execute()) {
            $stmt->close();

            $sql = "SELECT MAX(contentID) AS max_page FROM uvm_content"; 
            $result = mysqli_query($conn, $sql) or die("Error in Selecting " . mysqli_error($conn));

            if ($result->num_rows==1){ 
                while($row = $result->fetch_assoc()) {
                    $DBContentID = $row["max_page"];
                }
            } 

            // START TAG
            
            foreach ($pharseTags as &$value) {
                $tagId;
                if ($value !== "") {
                    $tag = clean($value);
                    
                    $stmt = $conn->prepare("SELECT * FROM uvm_tags WHERE tagTitle = ?");
                    $stmt->bind_param("s", $tag);
                    $stmt->execute();
                    $stmt->store_result();
                    $stmt->bind_result();
                    $stmt->fetch();

                    if ($stmt->num_rows==0) {

                        $stmt = $conn->prepare("INSERT INTO uvm_tags (tagTitle) values (?)");
                        $stmt->bind_param("s", $tag);
                        $stmt->execute();

                        $sql = "SELECT MAX(tagID) AS this_tag FROM uvm_tags"; 
                        $result = mysqli_query($conn, $sql) or die("Error in Selecting " . mysqli_error($conn));

                        if ($result->num_rows==1){ 
                            while($row = $result->fetch_assoc()) {
                                $tagId = $row["this_tag"];
                            }
                        } 
                        
                    } else {

                        $stmt = $conn->prepare("SELECT tagID FROM uvm_tags WHERE tagTitle = ?");
                        $stmt->bind_param("s", $tag);
                        $stmt->execute();
                        $result = $stmt->get_result();

                        while($row = $result->fetch_assoc()) {
                            $tagId = $row["tagID"];
                        }

                    }

                    $stmt = $conn->prepare("INSERT INTO uvm_content_tags (contentID, tagID) values (?,?)");
                    $stmt->bind_param("ss", $DBContentID, $tagId);

                    if (!$stmt->execute()) { 
                        echo '{"status":"error"}';
                        $conn->close();
                        exit;
                    }

                }
            }

            // SLUT TAG

            $stmt->close();
            
            echo '{"status":"ok", "message":"insert", "contentID":"'.$DBContentID.'"}';

        } else {
            $stmt->close();
            echo '{"status":"error"}';
            
        }
    }

    $conn->close();

?>