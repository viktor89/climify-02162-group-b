<?php
namespace API\V2;
require '../../../vendor/autoload.php';
require 'Validator.php';
require 'InfluxDBClient.php';

use InfluxDB\Client;


class Api
{
    protected $influxDb;
    protected $validator;

    public function __construct()
    {
        header('Content-Type: application/json');
        try {
            $this->validator = new Validator();
            $this->influxDb = new InfluxDBClient();
        } catch (Client\Exception $e) {
            http_response_code(500);
            die($e->getMessage());
        }
    }
}