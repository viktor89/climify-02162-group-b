<?php
namespace API\V2;
require '../../../vendor/autoload.php';

class Validator
{
    public static function validateMeasurement($measurement) {
        if(!is_float((float) sprintf("%.2f", $measurement->value))){
            throw new ValidationException('Measurement value not a float');
        };
        if(empty($measurement->sensorName)){
            throw new ValidationException('Sensor name wasn\'t a string');
        }
        if(!self::isValidTimeStamp($measurement->time)){
            throw new ValidationException('Timestamp not valid');
        }
    }

    public static function isValidTimeStamp($timestamp)
    {
        if(is_string($timestamp)){
            $timestamp = intval($timestamp);
        }
        if(($timestamp <= PHP_INT_MAX) && ($timestamp >= ~PHP_INT_MAX)){
            return true;
        };
        return false;
    }
}