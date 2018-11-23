<?php

namespace API\V2;
require  $_SERVER['DOCUMENT_ROOT'].'/vendor/autoload.php';

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

    /**
     * @param $points
     * @param string $precision
     * @return bool
     * @throws \Exception
     */
    public function writePoints($points, $precision = Database::PRECISION_SECONDS){
        return $this->database->writePoints($points, $precision);
    }

    /**
     * @return array
     * @throws \Exception
     */
    public function getDataSeries($sensorName, $minutes){
        $result = $this->database->query('SELECT last("value") AS "last_value" FROM "skoleklima"."autogen"."sensor_measurements" WHERE time > now() - '.$minutes.'m AND "sensor_name"=\''.$sensorName.'\' GROUP BY time(1m) FILL(previous)');
        return $result->getSeries();
    }
}