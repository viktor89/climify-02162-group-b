<?php

namespace API\V2;


class Validator
{
    public static function validateMeasurement($measurement) {
        if(!is_float((float) sprintf("%.2f", $measurement->value))){
            throw new \Exception('Measurement value not a float');
        };
        if(empty($measurement->sensorName)){
            throw new \Exception('Sensor name wasn\'t a string');
        }
        if(!self::isValidTimeStamp($measurement->time)){
            throw new \Exception('Timestamp not valid');
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