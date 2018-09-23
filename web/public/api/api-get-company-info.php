<?php

//************************************************
//	Get company info
//************************************************
    
require_once "../meta.php";

if( $currentUserID == ""){
    echo '{"status":"error"}';
    exit;
} 

// Validate API key
$apiPassword = API_PASSWORD;
$phase_api_key = clean($_POST['fAY2YfpdKvR']);

if( $apiPassword !== $phase_api_key){
    echo '{"status":"error"}';
    exit;
} 

if (!$currentUserCompanyID) {
    echo '{"status":"error"}';
    exit;
}

$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASSWORD;
$databasename = DB_NAME;


$stmt = $conn->prepare("SELECT * FROM icm_users_company WHERE companyID = ?");

	$stmt->bind_param("s", $currentUserCompanyID);

	$stmt->execute();

	$result = $stmt->get_result();

	$stmt->close();

	if ($result->num_rows==1){
		
		while($row = $result->fetch_assoc()) {
			$DBCompanyName = $row["companyName"];
			$DBFirstName = $row["companyContactFirstName"];
			$DBLastName = $row["companyContactLastName"];
			$DBAddress1 = $row["companyAddressStreet1"];
			$DBAddress2 = $row["companyAddressStreet2"];
			$DBCity = $row["companyAddressCity"];
			$DBZip = $row["companyAddressZip"];
			$DBEmail = $row["companyEmail"];
			$DBPhone1 = $row["companyPhone1"];
			$DBPhone2 = $row["companyPhone2"];
			$DBCreateDate = $row["companyCreateDate"];
        }

    }

echo 	'{"status": "ok", 
        "company":"'.$DBCompanyName.'", 
        "firstName":"'.$DBFirstName.'", 
        "lastName":"'.$DBLastName.'", 
        "address1":"'.$DBAddress1.'",
        "address2":"'.$DBAddress2.'",
        "city":"'.$DBCity.'",
        "zip":"'.$DBZip.'",
        "email":"'.$DBEmail.'",
        "phone1":"'.$DBPhone1.'",
        "phone2":"'.$DBPhone2.'",
        "createDate":"'.$DBCreateDate.'"
    }';

?>
