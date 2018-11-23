<?php
namespace API\V2;
use mysqli;

require 'InfluxDBClient.php';
require 'exceptions/ValidationException.php';
require 'Validator.php';
require 'MQTTService.php';

class Api
{
    protected $influxDb;
    protected $validator;
    protected $database;
    protected $MQTTService;

    public function __construct()
    {
        // Cache Headers
        $ts = gmdate("D, d M Y H:i:s") . " GMT";
        header("Expires: $ts");
        header("Last-Modified: $ts");
        header("Pragma: no-cache");
        header("Cache-Control: no-cache, must-revalidate");
        // Class objects instantiate
        $this->validator = new Validator();
        $this->influxDb = new InfluxDBClient();
        $this->database = new mysqli(getenv('MYSQL_HOST').':3306', getenv('MYSQL_USER'), getenv('MYSQL_PASSWORD'), getenv('MYSQL_DATABASE'));
        $this->MQTTService = new MQTTService();
    }
}