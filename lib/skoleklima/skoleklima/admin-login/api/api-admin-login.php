<?php 

//************************************************
//	Admin login
//************************************************

require_once "../admin-meta.php";
require_once "../session.php";

$phaseSessionToken = clean($_POST[sessionToken]);

if( $phaseSessionToken != $adminSessionToken ){
    echo '{"status":"errortoken"}';
    exit;
}



$phaseUsername=clean($_POST["username"]);

$phasePassword=clean($_POST["password"]);
$phasePasswordRex=(string)preg_replace("/ /","+",$phasePassword);




$myResponse = "error";

if ( $phaseUsername == "" ) {
    echo '{"status":"error"}';
    exit;
}

if ( $phasePassword == "" ) {
    echo '{"status":"error"}';
    exit;
}


$secret="6LcTlEQUAAAAANwum0cvt_k_aaK6n9-Gsaqz44Oq";
$response=$_POST["captcha"];

$verify=file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$secret}&response={$response}");
$captcha_success=json_decode($verify);
if ($captcha_success->success==false) {
    echo '{"status":"error"}'; 
    exit;
}


$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASSWORD;
$databasename = DB_NAME;
$pepper = HASH_PEPPER;

$conn = new mysqli($servername, $username, $password, $databasename);
if ($conn->connect_error) {
    die("Connection error: " . $conn->connect_error);
    exit;
}

$stmt = $conn->prepare("SELECT UserID,UserPassword,Blocked FROM DTUManager WHERE UserName = ? LIMIT 1");

$stmt->bind_param("s", $phaseUsername);

if (!$stmt->execute()) { 
    echo '{"status":"errorexc"}';
    $conn->close();
    exit;
}

$result = $stmt->get_result();

if ($result->num_rows==1){
    while($row = $result->fetch_assoc()) {
        $DBUserID = $row["UserID"];
        $DBUserPass = $row["UserPassword"];
        $DBUserUserBlocked = $row["Blocked"];
    }

}

$stmt->close();


    if (password_verify ( $phasePassword . $pepper , $DBUserPass )) {
    if ($DBUserUserBlocked == 1 ) {
        session_start();		
        $_SESSION['adminAccess'] = true;
        $_SESSION['session-time-admin'] = time();
        
        $stmt = $conn->prepare("UPDATE Person SET LastLogin = ? WHERE UserID = ?");

        $stmt->bind_param("si", date("Y-m-d, H:i"), $DBUserID);

        if ($stmt->execute()) { 
            session_start();		
            $_SESSION['adminAccess'] = true;
            $_SESSION['session-time-admin'] = time();
            echo '{"status":"ok"}';
            $stmt->close();
            $conn->close();
            exit;
        } else {
            echo '{"status":"error"}';
            $stmt->close();
            $conn->close();
            exit;
        }


    } else {
        echo '{"status":"errornotverif"}';
        $conn->close();
        exit; 
    }
} else {
    echo '{"status":"errornorow"}';
    $conn->close();
    exit;
};

?>