<?php
require_once '../Api.php';
use InfluxDB\Point;

class SendClass extends API\V2\Api
{
    // Todo: Validate room and sensors before writing data
    public function writeDataAsPoints($data){
        $points = [];

        if(empty($data->mac)){
            throw new Exception('No mac address provided!');
        }

        foreach($data->data as $measurement){
            $this->validator::validateMeasurement($measurement);
            $points[] =
                new Point(
                    'sensor_measurements', // name of the table
                    (float) sprintf("%.2f", $measurement->value), // the measurement value
                    ['sensor_name' => $measurement->sensorName, 'raspberry_id' => $data->mac],
                    [],
                    $measurement->time // Time precision has to be set to seconds!
                );
        }

        if(!$this->influxDb->writePoints($points)){
            throw new Exception('Unexpected error while writing data points');
        }
    }
}