<?php
require_once '../Api.php';

class GetDataClass extends API\V2\Api
{
    public function getSensorData(){
        return $this->influxDb->getDataSeries();
    }
}