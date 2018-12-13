<?php

use API\V2\ValidationException;

require_once './SensorDAO.php';
require '../../../vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    die("Method not allowed!");
}
try {
    date_default_timezone_set('UTC');
    header('Content-Type: application/json');
    $SensorDAO = new SensorDAO();
    $sensorTypes = $SensorDAO->getSensorTypes();
    echo json_encode($sensorTypes);
} catch (ValidationException $e){
    http_response_code(400);
    die($e->getMessage());
} catch (Exception $e) {
    http_response_code(500);
    die($e->getMessage());
}