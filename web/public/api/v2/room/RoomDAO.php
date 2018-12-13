<?php
require_once $_SERVER['DOCUMENT_ROOT'].'/api/v2/Api.php';
require_once $_SERVER['DOCUMENT_ROOT'].'/api/v2/sensor/SensorDAO.php';

use API\V2\ValidationException;


class RoomDAO extends API\V2\Api
{
    /**
     * @param $data
     * @return array
     * @throws \InfluxDB\Exception
     */
    public function getData($data) {
        return $this->influxDb->getDataSeriesForRoom($data->hubID, $data->minutes, $data->type);
    }
}