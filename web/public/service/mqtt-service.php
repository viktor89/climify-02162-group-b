<?php
echo "starting...";

$c = new Mosquitto\Client;

$c->onConnect(function() use ($c) {
    echo "publishing";
    $c->publish('qwe123', json_encode(["payload" => "value"]), 2);
    $c->disconnect();
});

$c->connect("broker.mqttdashboard.com");

// Loop around to permit the library to do its work
// This function will call the callback defined in `onConnect()`
// and disconnect cleanly when the message has been sent
$c->loopForever();

echo "done";
