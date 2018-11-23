<?php

use API\V2\ValidationException;

require_once './RuleDAO.php';
require '../../../vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die("Method not allowed!");
}
try {
    date_default_timezone_set('UTC');
    $json_str = file_get_contents('php://input');
    # Get as an object
    $data = json_decode($json_str);
    $ruleDAO = new RuleDAO();
    $rules = $ruleDAO->deleteRule($data);
    echo json_encode($rules);
} catch (ValidationException $e){
    http_response_code(400);
    die($e->getMessage());
} catch (Exception $e) {
    http_response_code(500);
    die($e->getMessage());
}