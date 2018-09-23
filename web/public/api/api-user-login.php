<?php

//************************************************
//	Login 
//************************************************
session_start();
require_once "../meta.php";


// Validate API key
$apiPassword = SIGNIN_TOKEN;
$phase_api_key = clean($_GET['fAY2YfpdKvR']);

if( $apiPassword !== $phase_api_key){
    echo '{"status":"error", "info":"token"}';
    exit;
} 

$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASSWORD;
$databasename = DB_NAME;

// Store user input (username, password) in variables
$phaseUsername = clean(strtolower($_GET['username'])); 
$phasePassword = clean($_GET['password']); 
$phasePasswordRex=(string)preg_replace("/ /","+",$phasePassword);
$phasePasswordDecrypt = $phasePassword;
$currentTime = date("d-m-Y, H:i");
$phaseUsername = clean($phaseUsername);
$phasePasswordDecrypt = $phasePassword;

$conn = new mysqli($servername, $username, $password, $databasename);
if ($conn->connect_error) {
    die("Connection error: " . $conn->connect_error);
    exit;
}


if ($stmt = $conn->prepare("SELECT * FROM Person WHERE UserName = ?")){

    $stmt->bind_param("s", $phaseUsername);

    $stmt->execute();

    $stmt->bind_result($UserID,$phaseUsername,$FirstName,$LastName,$Email,$RoleName,$UserPassword,$Blocked,$LastLogin);

    $stmt->fetch();

    $stmt->close();
}

if ($RoleName == 1 || $RoleName == 15){

    if ($stmt = $conn->prepare("SELECT * FROM ProjectManager WHERE UserID = ?")){

        $stmt->bind_param("i", $UserID);

        $stmt->execute();

        $stmt->bind_result($UserID,$MunID);

        $stmt->fetch();

        $stmt->close();


    }

    $permLogBook = 1;

} else{

    if ($stmt = $conn->prepare("SELECT * FROM InstUser WHERE UserID = ?")){

        $stmt->bind_param("i", $UserID);

        $stmt->execute();

        $stmt->bind_result($UserID,$InstID);

        $stmt->fetch();

        $stmt->close();
    }


    if ($stmt = $conn->prepare("SELECT MunID, InstName FROM Institution WHERE InstID = ?")){

        $stmt->bind_param("i", $InstID);

        $stmt->execute();

        $stmt->bind_result($MunID, $InstName);

        $stmt->fetch();

        $stmt->close();


    }

    //Get logbook permission
    $logbookPermID = 2;

    $sql = "SELECT RoleID, PermID FROM RolePermission WHERE RoleID = $RoleName && PermID = $logbookPermID && InstID = $InstID";  

    $result = $conn->query($sql);
        if(!$result) {
            die("Error: " . $conn->error);
        }

    if ($result->num_rows==1){	
		$permLogBook = 1;
	} else {
		$permLogBook = 0;
	}

}


$sPasswordDBDecrypted = decrypt($UserPassword, ENCRYPTION_KEY);


if ( true ) {


    if ($Blocked == 1) {



        // Store user-info from variables in sessions
        $_SESSION['userID'] = $UserID;
        $_SESSION['userName'] = $phaseUsername;
        $_SESSION['userRole'] = $RoleName; 
        $_SESSION['userFirstName'] = $FirstName;
        $_SESSION['userLastName'] = $LastName;
        $_SESSION['userEmail'] = $Email;
        $_SESSION['schoolAllowed'] = $InstID;
        $_SESSION['companyID'] = $MunID;
        $_SESSION['schoolAllowedName'] = $InstName;
        $_SESSION['permLogbook'] = $permLogBook;


        echo 	'{"status": "approve", 
								"school":"'.$InstName.'"
							}';



    } else {
        echo '{"status": "error"}';
    }
} else {
    echo '{"status": "error"}';
}

$conn->close();

?>
