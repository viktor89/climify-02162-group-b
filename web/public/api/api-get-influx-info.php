<?php

//************************************************
//	Get influx database info
//************************************************
require_once "../meta.php";
require_once "../meta-influx.php";

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
$returnFromIfx = file_get_contents("http://".getenv('INFLUXDB_HOST').":8086/query?u=".getenv('MYSQL_USER')."&p=".getenv('MYSQL_PASSWORD')."&db=".getenv('MYSQL_DATABASE')."&q=SHOW%20MEASUREMENTS%20limit%201");
$returnFromIfx = json_decode($returnFromIfx, true);

if ($returnFromIfx[results][0][series][0][name] != "measurements") {
    echo '{"status":"error"}';
    exit;
} 

echo '{"status":"ok"}';