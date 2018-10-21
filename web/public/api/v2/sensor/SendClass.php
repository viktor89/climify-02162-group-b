<?php
require_once '../Api.php';
use InfluxDB\Database;
use InfluxDB\Point;

class SendClass extends API\V2\Api
{
    public function writeDataAsPoints($data){
        $points = [];

        if(empty($data->mac)){throw new Exception('No mac address provided!');}

        foreach($data->data as $measurement){
            $this->validateMeasurement($measurement);
            $points[] =
                new Point(
                    'sensor_measurements', // name of the table
                    $measurement->value, // the measurement value
                    ['sensor_name' => $measurement->sensorName, 'raspberry_id' => $data->mac],
                    [],
                    $measurement->time // Time precision has to be set to seconds!
                );
        }

        if(!$this->database->writePoints($points, Database::PRECISION_SECONDS)){throw new Exception('Unexpected error while writing data points');}
    }
}