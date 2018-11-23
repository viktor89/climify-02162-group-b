<?php

use API\V2\ValidationException;

require_once $_SERVER['DOCUMENT_ROOT'].'/api/v2/rule/RuleDAO.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    die("Method not allowed!");
}
try {
    date_default_timezone_set('UTC');
    $ruleDAO = new RuleDAO();
    $rules = $ruleDAO->getRuleTypes();
    echo json_encode($rules);
} catch (ValidationException $e){
    http_response_code(400);
    die($e->getMessage());
} catch (Exception $e) {
    http_response_code(500);
    die($e->getMessage());
}