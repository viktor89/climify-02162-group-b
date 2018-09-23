<?php 

	require_once "meta.php";
	$servername = DB_HOST;
	$username = DB_USER;
	$password = DB_PASSWORD;
	$databasename = DB_NAME;

	$api_key;

	$conn = new mysqli($servername, $username, $password, $databasename);
	        if ($conn->connect_error) {
	            die("Connection error: " . $conn->connect_error);
	            exit;
	        }

    $sql = "SELECT Token FROM Municipality WHERE MunID = '$currentUserCompanyID' ";  
    
    $result = $conn->query($sql);
        if(!$result) {
            die("Error: " . $conn->error);
        }

    if ($result->num_rows==1){
		while($row = $result->fetch_assoc()) {
			$api_key = $row["Token"];
		}
	} else {
		$conn->close();
		exit;
	}

	define('API_PASSWORD', $api_key);

?>