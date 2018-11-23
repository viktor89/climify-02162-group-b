<?php

use API\V2\ValidationException;

require_once './RoleDAO.php';
require '../../../vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    die("Method not allowed!");
}
try {
    date_default_timezone_set('UTC');
    # Get JSON as a string
    $json_str = file_get_contents('php://input');
    # Get as an object
    $data = json_decode($json_str);

    $roleDAO = new RoleDAO();
    $roleDAO->deleteRole($data);

    echo json_encode(["status" => "ok"]);
} catch (ValidationException $e){
    http_response_code(400);
    die($e->getMessage());
} catch (Exception $e) {
    http_response_code(500);
    die($e->getMessage());
}