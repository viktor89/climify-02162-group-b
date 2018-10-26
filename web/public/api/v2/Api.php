<?php
namespace API\V2;
require '../../../vendor/autoload.php';
require 'InfluxDBClient.php';
require 'exceptions/ValidationException.php';
require 'Validator.php';

class Api
{
    protected $influxDb;
    protected $validator;

    public function __construct()
    {
        try {
            $this->validator = new Validator();
            $this->influxDb = new InfluxDBClient();
        }
        catch (Exception $e) {
            http_response_code(500);
            die($e->getMessage());
        }
    }
}