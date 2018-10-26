<?php

namespace API\V2;
require '../../../vendor/autoload.php';

use InfluxDB\Client;
use InfluxDB\Database;

class InfluxDBClient
{
    private $client;
    private $database;

    public function __construct()
    {
        $this->client = new Client(getenv('INFLUXDB_HOST'), '8086', getenv('MYSQL_USER'), getenv('MYSQL_PASSWORD'));
        $this->database = $this->client->selectDB('skoleklima');
    }

    public function writePoints($points, $precision = Database::PRECISION_SECONDS){
        return $this->database->writePoints($points, $precision);
    }

    public function getDataSeries(string $mac){
        $result = $this->database->query('SELECT last("value") AS "value" FROM "sensor_measurements" WHERE time > now() - 1h GROUP BY time(10s), "sensor_name", "raspberry_id" FILL(previous)');
        return $result->getSeries();
    }
}