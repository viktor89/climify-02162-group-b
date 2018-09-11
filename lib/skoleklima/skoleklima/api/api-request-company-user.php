<?php 

//************************************************
//	Request new company user
//************************************************
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//error_reporting(E_ALL);
require_once "../meta.php";

/*

$secret="6LcTlEQUAAAAANwum0cvt_k_aaK6n9-Gsaqz44Oq";
$response=$_POST["captcha"];

$verify=file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$secret}&response={$response}");
$captcha_success=json_decode($verify);
if ($captcha_success->success==false) {
    echo '{"status":"error"}'; 
    exit;
}
*/
$phaseUserName=clean($_POST["userName"]);
$phaseUserPass=clean($_POST["userPass"]);
$phaseCompName=clean($_POST["compName"]);
$phaseMunName=clean($_POST["munName"]);
$phaseNameFirst=clean($_POST["nameFirst"]);
$phaseNameLast=clean($_POST["nameLast"]);
$phaseEmail=clean($_POST["email"]);
$phasePhone1=clean($_POST["phone1"]);
$phasePhone2=clean($_POST["phone2"]);
$phaseStreet1=clean($_POST["street1"]);
$phaseStreet2=clean($_POST["street2"]);
$phaseZip=clean($_POST["zip"]);
$phaseCity=clean($_POST["city"]);
$phaseCountry=clean($_POST["Country"]);
$currentTime = date("d-m-Y, H:i");


// Start post validation 
function exitApi(){
    echo '{"status":"error"}';
    exit;
}

if( $phaseCompName == ""){
    exitApi();
}
if( $phaseNameFirst == ""){
    exitApi();
} 
if( $phaseNameLast == ""){
    exitApi();
}  
if ( $phaseEmail !== "") {
    if( !preg_match('/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/', $phaseEmail) ) {
        exitApi();
    } 
} else {
    exitApi();
}
if( $phasePhone1 == ""){
    exitApi();
}
if( $phaseStreet1 == ""){
    exitApi();
}
if( $phaseZip == ""){
    exitApi();
}
if( $phaseCity == ""){
    exitApi();
}
// End post validation 

// New company token
//Generate a random string.
$newCompanyToken = openssl_random_pseudo_bytes(16);
//Convert the binary data into hexadecimal representation.
$newCompanyToken = bin2hex($newCompanyToken);

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
/*
$stmt = $conn->prepare("INSERT INTO icm_users_company 
(companyName, companyContactFirstName, companyContactLastName, companyAddressStreet1, companyAddressStreet2, companyAddressCity, companyAddressZip, companyEmail, companyPhone1, companyPhone2, companyCreateDate, token) 
values (?,?,?,?,?,?,?,?,?,?,?,?)");


$stmt->bind_param("ssssssssssss", $phaseCompName, $phaseNameFirst, $phaseNameLast, $phaseStreet1, $phaseStreet2, $phaseCity, $phaseZip, $phaseEmail, $phaseStreet1, $phaseStreet2, $currentTime, $newCompanyToken);

*/


//Det er problematisk at have "Ø'er"
/*
if ($phaseMunName == "København"){
$phaseMunName = "Kobenhavn";
}*/


//NOW INSERTING PERSON:

$et=1;

$nul = 0;

$RoleName=1;

$encryptedPass = encrypt($phaseUserPass, ENCRYPTION_KEY);


$stmt = $conn->prepare("INSERT INTO Person VALUES (?,?,?,?,?,?,?,?,?)");


$stmt->bind_param("issssisis",$nul,$phaseUserName,$phaseNameFirst,$phaseNameLast,$phaseEmail,$RoleName,$encryptedPass,$nul,$null);

if(!$stmt->execute()){
    
    echo '{"status":"error"}';
    exit;
    
}

//Now get ID from the one you just inserted

$UserID = $conn->insert_id;

$stmt->close();



$stmt = $conn->prepare("SELECT MunID FROM Municipality WHERE MunName=?");

$stmt->bind_param("s",$phaseMunName);

if ($stmt->execute()) { 
    echo '{"status":"ok"}';
} else {
    echo '{"status":"error"}';
    exit;
}

//Nedenstående linje er meget vigtig ift. num_rows
$stmt->store_result();

$stmt->bind_result($MunID);

$stmt->fetch();




$null = null;



if ($stmt->num_rows==0){

$stmt->close();
//The muncipality isn't yet registered in our database
$stmt = $conn->prepare("INSERT INTO Municipality (MunID,MunName,DateOfCreation,Token,Country) values (?,?,CURDATE(),?,?)");

$stmt->bind_param("isss",$nul,$phaseMunName,$newCompanyToken,$phaseCountry);

$stmt->execute();

$stmt->close();

//Get ID from the one we just inserted
$MunID = $conn->insert_id;

}




//TODO !!! De to nedenstående queries skal udføres i en procedure ved activation of user!!


//TODO - få fat i rigtige influx data og ikke bare nulls
$stmt = $conn->prepare("INSERT INTO InfluxInfo VALUES (?,?,?,?)");

$stmt->bind_param("isss",$MunID,$null,$null,$null);

$stmt->execute();

$stmt->close();

    
    


//INSERTING ProjectManagerActivate SO IT STILL NEEDS TO BE ACTIVATED
$stmt = $conn->prepare("INSERT INTO ProjectManagerActivate VALUES (?,?)");


$stmt->bind_param("ii",$UserID,$MunID);

$stmt->execute();

//Now get ID from the one you just inserted

$stmt->close();


$phasePhone1 = strval($phasePhone1);
//NOW INSERTING PHONE FOR CONTACTPERSON

$stmt = $conn->prepare("INSERT INTO Phone VALUES (?,?,?)");


$stmt->bind_param("iis",$nul,$UserID,$phasePhone1);

$stmt->execute();

$stmt->close();

//echo "userid " . $UserID . " phone " . $phasePhone1;


$phasePhone2 = strval($phasePhone2);
if ($phasePhone2!="" && $phasePhone2!=null){

$stmt = $conn->prepare("INSERT INTO Phone VALUES (?,?,?)");


$stmt->bind_param("iis",$nul,$UserID,$phasePhone2);

$stmt->execute();

$stmt->close();
    
}



$stmt = $conn->prepare("SELECT ZipNo FROM Zip WHERE ZipNo=?");

$stmt->bind_param("i",$phaseZip);

$stmt->execute();

//Nedenstående linje er meget vigtig ift. num_rows
$stmt->store_result();

$stmt->bind_result($ZipNo);

$stmt->fetch();




if ($stmt->num_rows==0){

$stmt->close();


$stmt = $conn->prepare("INSERT INTO Zip VALUES (?,?)");


$stmt->bind_param("is",$phaseZip,$phaseCity);

$stmt->execute();

$stmt->close();

}



$stmt = $conn->prepare("INSERT INTO Address VALUES (?,?,?,?)");


$stmt->bind_param("iisi",$nul,$UserID,$phaseStreet1,$phaseZip);

$stmt->execute();

$stmt->close();



$phaseStreet2 = strval($phaseStreet2);
if ($phaseStreet2 != "" && $phaseStreet2 !=null){
    
$stmt = $conn->prepare("INSERT INTO Address VALUES (?,?,?,?)");
    
$stmt->bind_param("iisi",$nul,$UserID,$phaseStreet2,$phaseZip);

$stmt->execute();

$stmt->close();
    
}





$conn->close();


?>