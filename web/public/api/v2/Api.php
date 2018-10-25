<?php
namespace API\V2;
require '../../../vendor/autoload.php';

use InfluxDB\Client;


class Api
{
    protected $client;
    protected $database;

    public function __construct()
    {
        try {
            $this->client = new Client(getenv('INFLUXDB_HOST'), '8086', getenv('MYSQL_USER'), getenv('MYSQL_PASSWORD'));
            //$this->client = Client::fromDSN('influxdb://' . getenv('MYSQL_USER') . ':' . getenv('MYSQL_USER_PASSWORD') . '@'.getenv('INFLUXDB_HOST').':8086/' . getenv('MYSQL_DATABASE') . '&precision=s', 5)->getClient();
            $this->database = $this->client->selectDB('skoleklima');
        } catch (Client\Exception $e) {
            http_response_code(500);
            die($e->getMessage());
        }
    }

    public function validateMeasurement($measurement) {
        if(!is_float($measurement->value)){throw new \Exception('Measurement value was not a float');}
        if(empty($measurement->sensorName)){throw new \Exception('Sensor name wasn\'t a string');}
        if(!$this->isValidTimeStamp($measurement->time)){throw new \Exception('Timestamp not valid');}
    }

    private function isValidTimeStamp($timestamp)
    {
        if(is_string($timestamp)){
            $timestamp = intval($timestamp);
        }
        return ($timestamp <= PHP_INT_MAX) && ($timestamp >= ~PHP_INT_MAX);
    }
}