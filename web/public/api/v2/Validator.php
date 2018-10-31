<?php
namespace API\V2;

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

    /**
     * @param $message
     * @throws \Exception
     */
    public static function validateMQTTMessage($message){
        if(is_null($message["payload"])) throw new \Exception("Invalid MQTT Message - a payload is required");
        if(empty($message["payload"])) throw new \Exception("Invalid MQTT Message - a payload value is required");
        json_encode($message);
        if(json_last_error() !== 0) throw new \Exception("unable to parse json");
    }

    public static function validateMQTTTopic($topic) {
        if(empty($topic)) throw new \Exception("No topic supplied!");
    }
}