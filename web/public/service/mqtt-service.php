<?php
$message = json_encode(["payload" => "value"]);
$connection = new Mosquitto\Client;

$response = ["status" => "error"]; // Will be overwritten on success

$connection->onConnect(function() use ($connection, $message, $response) {
    $connection->publish('qwe123', $message, 2);
    $response['status'] = 'success';
    echo json_encode($response);
    $connection->disconnect();
});

$connection->connect("broker.mqttdashboard.com");

// Loop around to permit the library to do its work
// This function will call the callback defined in `onConnect()`
// and disconnect cleanly when the message has been sent
$connection->loopForever();
