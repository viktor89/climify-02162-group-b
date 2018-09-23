<?php

//************************************************
//	Create user 
//************************************************

	require_once "../meta.php";

	$phaseFirstName=clean($_POST["nameFirst"]);
	$phaseLastName=clean($_POST["nameLast"]);
	$phaseEmail=clean($_POST["email"]);
	$phaseUserName=clean($_POST["uName"]);
	$phaseAdmin=clean($_POST["admin"]);
	$phasePassword=clean($_POST["pWord"]);
	$phaseRole=clean($_POST["role"]);


	// Start post validation 
function exitApi(){
    echo '{"status":"error post validation"}';
    exit;
}

if( $phaseFirstName == ""){
    exitApi();
}
if( $phaseLastName == ""){
    exitApi();
} 
if( $phaseUserName == ""){
    exitApi();
}  
if ( $phaseEmail !== "") {
    if( !preg_match('/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/', $phaseEmail) ) {
        exitApi();
    } 
} else {
    exitApi();
}
if( $phaseAdmin == ""){
    exitApi();
}
if( $phasePassword == ""){
    exitApi();
}
if( $phaseRole == ""){
    exitApi();
}

	$servername = DB_HOST;
	$username = DB_USER;
	$password = DB_PASSWORD;
	$databasename = DB_NAME;

	//Create password
	$rand_pass_num = array("A","B","C","D","E","F","G","H","I","J");
	$rand_pass_sym = array("!","@");
	$pass = bin2hex(openssl_random_pseudo_bytes(3)).$rand_pass_sym[array_rand($rand_pass_sym)].$rand_pass_num[array_rand($rand_pass_num)];

//echo '{"role" : "'.$phaseRole.'", "firstname": "'.$phaseFirstName.'", "lastname": "'.$phaseLastName.'", "username": "'.$phaseUserName.'", "pass": "'.$encryptedPass.'", "mail": "'.$phaseEmail.'", "inst": "'.$InstID.'"}';

	if( strlen($phaseUserName) < 4 || strlen($phaseUserName) > 8 || preg_match('/\s/',$phaseUserName)){
	    echo '{"status":"error uname"}';
	    exit;
	}

	if (in_array($phaseUserName, $illegal_Usernames)) {
		echo '{"status":"error uname new user", "message": "illegal" }';
		exit;
	}

	
	$conn = new mysqli($servername, $username, $password, $databasename);
	if ($conn->connect_error) {
	    die("Connection error: " . $conn->connect_error);
	    exit;
	}

	//Insert into Person table
	$encryptedPass = encrypt($phasePassword, ENCRYPTION_KEY);

	$zero = 0;
	$lastLogin = null;



	if ($stmt = $conn->prepare("INSERT INTO Person VALUES (?,?,?,?,?,?,?,?,?)")) {

		$stmt->bind_param("issssisis",$zero,$phaseUserName,$phaseFirstName,$phaseLastName,$phaseEmail,$phaseRole,$encryptedPass,$zero,$lastLogin);

		$stmt->execute();
		
		$UserID = $conn->insert_id;

		//echo($stmt->error);

		$stmt->close();
		
		echo '{"status": "ok", "genPassword": "'.$phasePassword.'" }';
	}


	else{

	echo '{"status":"error insert into person"}';
	}

	//Insert into activate user table

	// get admin ID
	$sql = "SELECT UserID FROM Person WHERE UserName='$phaseAdmin' ";  

	$result = $conn->query($sql);

	$row = mysqli_fetch_assoc($result);
	$adminID = $row["UserID"];

	// get new user ID
	$sql = "SELECT UserID FROM Person WHERE UserName='$phaseUserName' ";  

	$result = $conn->query($sql);
	
	$row = mysqli_fetch_assoc($result);
	$newUserID = $row["UserID"];

	//echo "Phaseshool " . $phaseSchool;
	if ($stmt = $conn->prepare("INSERT INTO UserActivate VALUES (?,?)")) {

		$stmt->bind_param("ii",$adminID,$newUserID);

		$stmt->execute();

		//echo($stmt->error);

		$stmt->close();
		
		
	// echo '{"status": "ok", "genPassword": "'.$phasePassword.'" }';
	} else{

		echo '{"status":"error useractive insert"}';
		
	}

	

    $conn->close();

?>
