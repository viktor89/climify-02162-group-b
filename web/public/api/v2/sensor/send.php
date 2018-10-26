<?php

use API\V2\ValidationException;

require_once './SendClass.php';
require '../../../vendor/autoload.php';

date_default_timezone_set('UTC');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die("Method not allowed!");
}

try {
    # Get JSON as a string
    $json_str = file_get_contents('php://input');

    # Get as an object
    $data = json_decode($json_str);

    $sendClass = new SendClass();
    $sendClass->writeDataAsPoints($data);
    header('Content-Type: application/json');
}
catch (ValidationException $e){
    http_response_code(400);
    die($e->getMessage());
}
catch (Exception $e) {
    http_response_code(500);
    die($e->getMessage());
}