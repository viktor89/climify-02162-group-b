<?php
require_once './GetDataClass.php';
require '../../../vendor/autoload.php';

date_default_timezone_set('UTC');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    die("Method not allowed!");
}

try {
    $getDataClass = new getDataClass();
    header('Content-Type: application/json');
    echo json_encode($getDataClass->getSensorData());
}
// This is very bad practice
catch (Exception $e) {
    http_response_code(500);
    die($e->getMessage());
}