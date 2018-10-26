<?php
require_once '../Api.php';

class GetDataClass extends API\V2\Api
{
    // Todo: Validate room and sensors before writing data
    public function getSensorData($data){
        $points = [];

        if(empty($data->mac)){
            throw new Exception('No mac address provided!');
        }

        echo json_encode($this->influxDb->getDataSeries($data->mac));
    }
}