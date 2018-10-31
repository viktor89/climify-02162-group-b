<?php
require_once './GetDataClass.php';
require '../../../vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    die("Method not allowed!");
}

try {
    date_default_timezone_set('UTC');
    $getDataClass = new SensorDAO();
    header('Content-Type: application/json');
    echo json_encode($getDataClass->getSensorData());
}
// This is very bad practice
catch (Exception $e) {
    http_response_code(500);
    die($e->getMessage());
}