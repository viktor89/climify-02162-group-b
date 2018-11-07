<?php
require_once '../Api.php';

use API\V2\ValidationException;
use InfluxDB\Point;

class SensorDAO extends API\V2\Api
{
    /**
     * @param $json
     * @throws ValidationException
     * @throws Exception
     */
    public function writeDataAsPoints($json){
         $points = [];
         if(empty($json)){
             throw new Exception('Unable to parse json');
         }
         if(empty($json->mac)){
             throw new ValidationException('No mac address provided!');
         }

         foreach($json->data as $measurement){
             $this->validator::validateMeasurement($measurement);
             $points[] =
                 new Point(
                     'sensor_measurements', // name of the table
                     (float) sprintf("%.2f", $measurement->value), // the measurement value
                     ['sensor_name' => $measurement->sensorName, 'hubID' => $json->mac, "sensor_type" => $measurement->sensorType],
                     [],
                     $measurement->time // Time precision has to be set to seconds!
                 );
         }

         if(!$this->influxDb->writePoints($points)){
             throw new Exception('Unexpected error while writing data points');
         }
     }
}
