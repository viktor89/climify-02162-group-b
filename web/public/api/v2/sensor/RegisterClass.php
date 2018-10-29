<?php
require_once '../Api.php';

class RegisterClass extends API\V2\Api
{
    public function registerDevice($mac){
        if(empty($mac)){
            throw new Exception("No mac address provided");
        }
        $locationId = '';
        $database = new mysqli(getenv('MYSQL_HOST').':3306', getenv('MYSQL_USER'), getenv('MYSQL_PASSWORD'), getenv('MYSQL_DATABASE'));
        $statement = $database->prepare('SELECT LocationID FROM Location');
        $statement->execute();
        $statement->bind_result($locationId);
        while($statement->fetch()) {
            var_dump($locationId);
        }
        $statement->close();
    }
}