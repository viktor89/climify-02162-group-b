<?php
/*
 *
{
  "mac": "6f73g27fg3",
  "data": [
    {
      "sensorName": "name1",
      "time": "2176321761267",
      "value": "21"
    },
    {
      "sensorName": "name2",
      "time": "21763217613412123",
      "value": "11"
    }
  ]
}
 */
require '../../../vendor/autoload.php';

use InfluxDB\Client;
use InfluxDB\Database;
use InfluxDB\Point;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die("Method not allowed!");
}

# Get JSON as a string
$json_str = file_get_contents('php://input');

# Get as an object
$data = json_decode($json_str);
$points = [];

foreach($data->data as $measurement){
    try {
        $points[] =
            new Point(
                $measurement->sensorName, // name of the measurement
                $measurement->value, // the measurement value
                [],
                [],
                number_format(microtime(true), 0, "", "") // Time precision has to be set to seconds!
            );
    } catch (\InfluxDB\Database\Exception $e) {
        http_response_code(500);
        die($e->getMessage());
    }
}

$client = Client::fromDSN('influxdb://'.getenv('MYSQL_USER').':'.getenv('MYSQL_USER_PASSWORD').'@influx-db:8086/'.getenv('MYSQL_DATABASE'), 5)->getClient();
$database = $client->selectDB('skoleklima');

try {
    $result = $database->writePoints($points, Database::PRECISION_MICROSECONDS);
} catch (\InfluxDB\Exception $e) {
    http_response_code(500);
    die($e->getMessage());
}

$result = $database->query('select * from skoleklima LIMIT 5');

// get the points from the resultset yields an array
$points = $result->getPoints();

var_dump($points);