<?php
require '../api/v2/Validator.php';
require '../vendor/autoload.php';

use API\V2\Validator;

class MQTTService
{
    private $connection;
    private $validator;
    public function __construct()
    {
        $this->connection = new Mosquitto\Client;
        $this->validator = new Validator();
    }

    /**
     * @param $topic
     * @param $message
     * @return bool
     * @throws Exception
     */
    public function sendMessage($topic, $message) {
        $this->validator::validateMQTTMessage($message);
        $this->validator::validateMQTTTopic($topic);

        $this->connection->onConnect(function() use ($topic, $message) {
            $this->connection->publish($topic, json_encode($message), 2);
            $this->connection->disconnect();
        });

        $this->connection->connect("broker.mqttdashboard.com");

        // Loop around to permit the library to do its work
        // This function will call the callback defined in `onConnect()`
        // and disconnect cleanly when the message has been sent
        $this->connection->loopForever();
        return true;
    }
}   