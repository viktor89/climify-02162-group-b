<?php

//************************************************
//	Encrypt
//************************************************

require_once "meta.php";

// Validate API key
$apiPassword = SIGNIN_TOKEN;
$phase_api_key = clean($_GET['fAY2YfpdKvR']);
$phaseEncrypt = clean($_GET['encrypt']);

//Validate
if( $apiPassword !== $phase_api_key ){
    echo '{"status":"error"}';
  exit;
}

if( $phaseEncrypt == "" ){
    echo '{"status":"error"}';
    exit;
}

$sEncrypted = encrypt($phaseEncrypt, ENCRYPTION_KEY);

echo '{"status":"ok", "encrypt":"'.$sEncrypted.'"}';

?>