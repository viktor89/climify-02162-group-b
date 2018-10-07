<?php
echo "starting...";
$message = json_encode(["payload" => "value"]);
$connection = new Mosquitto\Client;

$connection->onConnect(function() use ($connection, $message) {
    echo "publishing";
    $connection->publish('qwe123', $message, 2);
    $connection->disconnect();
});

$connection->connect("broker.mqttdashboard.com");

// Loop around to permit the library to do its work
// This function will call the callback defined in `onConnect()`
// and disconnect cleanly when the message has been sent
$connection->loopForever();

echo "done";
