<?php

//************************************************
//	Get influx database info
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

$returnFromIfx = file_get_contents("http://193.200.45.37:8086/query?u=".$influxUser."&p=".$influxPass."&db=".$influxName."&q=SHOW%20MEASUREMENTS%20limit%201");

$returnFromIfx = json_decode($returnFromIfx, true);

if ($returnFromIfx[results][0][series][0][name] != "measurements") {
    echo '{"status":"error"}';
    exit;
} 

echo '{"status":"ok"}';

?>
