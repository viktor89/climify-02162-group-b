<?php
namespace API\V2;

class Validator
{
    /**
     * @param $measurement
     * @throws ValidationException
     */
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

    /**
     * @param $topic
     * @throws \Exception
     */
    public static function validateMQTTTopic($topic) {
        if(empty($topic)) throw new \Exception("No topic supplied!");
    }

    /**
     * @param $object
     * @throws \Exception
     */
    public static function validateSensorObject($object) {
        if(empty($object)) throw new \Exception("Empty sensor object received");
        if(empty($object->sensorType)) throw new \Exception("Empty sensor type name received");
        if(empty($object->sensorName)) throw new \Exception("Empty sensor name received");
    }

    /**
     * @param $string
     * @throws \Exception
     */
    public static function requiredString($string){
        if(empty($string)) throw new \Exception("Empty string");
    }
}