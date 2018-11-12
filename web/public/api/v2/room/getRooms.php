<?php

use API\V2\ValidationException;

require_once './RoomDAO.php';
require '../../../vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    die("Method not allowed!");
}
try {
    date_default_timezone_set('UTC');
    $roomDAO = new RoomDAO();
    $rooms = $roomDAO->getRooms();
    echo json_encode($rooms);
} catch (ValidationException $e){
    http_response_code(400);
    die($e->getMessage());
} catch (Exception $e) {
    http_response_code(500);
    die($e->getMessage());
}