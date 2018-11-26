<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/api/v2/Api.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/api/v2/hub/HubDAO.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/api/v2/sensor/SensorDAO.php';

use API\V2\ValidationException;
use InfluxDB\Point;

class SensorDAO extends API\V2\Api
{
    /**
     * @param $sensorName
     * @return bool
     * @throws Exception
     */
    public function isSensorApproved($sensorName)
    {
        $this->validator::requiredString($sensorName);
        $statement = $this->database->prepare("SELECT SensorID FROM SensorInstance WHERE approved AND SensorID = ?");
        $statement->bind_param("s", $sensorName);
        $statement->execute();
        $statement->store_result();
        $statement->bind_result($sensorId);
        $sensors = [];
        /* fetch values */
        while ($statement->fetch()) {
            $sensors[] = $sensorId;
        }
        $statement->close();
        return count($sensors)>0;
    }

    public function sensorExists($sensorName) {
        $this->validator::requiredString($sensorName);
        $statement = $this->database->prepare("SELECT SensorID FROM SensorInstance WHERE SensorID = ?");
        $statement->bind_param("s", $sensorName);
        $statement->execute();
        $statement->store_result();
        $statement->bind_result($sensorId);
        $sensors = [];
        /* fetch values */
        while ($statement->fetch()) {
            $sensors[] = $sensorId;
        }
        $statement->close();
        return count($sensors)>0;
    }

    /**
     * @param $json
     * @throws Exception
     */
    public function registerPendingSensor($json)
    {
        foreach ($json->data as $pendingSensor) {
            $this->validator::validateSensorObject($pendingSensor);
            $sensorName = $pendingSensor->sensorName;
            $sensorTypeName = $pendingSensor->sensorType;
            $hubID = $json->mac;
            $statement = $this->database->prepare("SELECT SensorTypeID FROM SensorType WHERE SensorTypeName = ?");
            $statement->bind_param("s", $sensorTypeName);
            $statement->execute();
            $statement->bind_result($sensorTypeID);
            $statement->fetch();

            if ($sensorTypeID === null) {
                $statement->close();
                $statement = $this->database->prepare("INSERT INTO SensorType (SensorTypeName) VALUES (?)");
                $statement->bind_param("s", $sensorTypeName);
                $statement->execute();
                $sensorTypeID = $this->database->insert_id;
            }

            $statement->close();
            $statement = $this->database->prepare("INSERT INTO SensorInstance (SensorID, SensorTypeID, LocationID, HubID, approved) VALUES (?, ?, NULL, ?, 0)");
            $statement->bind_param("sss", $sensorName, $sensorTypeID, $hubID);
            $statement->execute();
        }
    }

    /**
     * @param $data
     * @throws ValidationException
     * @throws Exception
     */
    public function writeDataAsPoints($data)
    {
        $points = [];
        $hubDAO = new HubDAO();
        if (!$hubDAO->isHubRegistered($data->mac)) {
            throw new ValidationException('Hub not registered!');
        };
        foreach($data->data as $sensor) {
            if (!$this->sensorExists($sensor->sensorName)) {
                $object = new stdClass();
                $object->mac = $data->mac;
                $object->data = [$sensor];
                $this->registerPendingSensor($object);
            }
            if($this->isSensorApproved($sensor->sensorName)){
                $this->validator::validateMeasurement($sensor);
                $points[] =
                    new Point(
                        'sensor_measurements', // name of the table
                        (float)sprintf("%.2f", $sensor->value), // the measurement value
                        ['sensor_name' => $sensor->sensorName, 'hubID' => $data->mac, "sensor_type" => $sensor->sensorType],
                        [],
                        $sensor->time // Time precision has to be set to seconds!
                    );
            }
        }

        if (!$this->influxDb->writePoints($points)) {
            throw new Exception('Unexpected error while writing data points');
        }
    }

    public function getSensors()
    {
        $statement = $this->database->prepare("SELECT HubID, MapName, RoomName, SensorTypeName, SensorID FROM Room NATURAL JOIN SensorInstance LEFT JOIN Map ON BuildingID = MapID LEFT JOIN SensorType ON SensorType.SensorTypeID = SensorInstance.SensorTypeID WHERE approved");
        $statement->execute();
        $statement->store_result();
        $statement->bind_result($hubMac, $building, $room, $stype, $sID);
        $sensors = [];
        /* fetch values */
        while ($statement->fetch()) {
            $sensors[] = ["HubID" => $hubMac, "Building" => $building, "Room" => $room, "SensorType" => $stype, "SensorID" => $sID, "running" => count($this->influxDb->getDataSeries($sID, 5)) > 0];
        }
        $statement->close();
        return $sensors;
    }

    public function getPendingSensors()
    {
        $statement = $this->database->prepare("SELECT HubID, MapName, RoomName, SensorTypeName, SensorID FROM Room NATURAL JOIN SensorInstance LEFT JOIN Map ON BuildingID = MapID LEFT JOIN SensorType ON SensorType.SensorTypeID = SensorInstance.SensorTypeID WHERE NOT approved");
        $statement->execute();
        $statement->store_result();
        $statement->bind_result($hubMac, $building, $room, $stype, $sID);
        $sensors = [];
        /* fetch values */
        while ($statement->fetch()) {
            $sensors[] = ["HubID" => $hubMac, "Building" => $building, "Room" => $room, "SensorType" => $stype, "SensorID" => $sID];
        }
        $statement->close();
        return $sensors;
    }

    public function approveSensor($data)
    {
        $statement = $this->database->prepare("UPDATE SensorInstance SET approved = '1' WHERE SensorID = ?");
        $statement->bind_param("s", $data->sensorID);
        $statement->execute();
        /* fetch values */
        $statement->close();
        $this->MQTTService->sendMessage($data->mac, ["type" => "ApproveThing", "name" => $data->sensorID]);
    }

    public function removeSensor($data)
    {
        $statement = $this->database->prepare("DELETE FROM SensorInstance WHERE SensorID = ?");
        $statement->bind_param("s", $data->sensorID);
        $statement->execute();
        /* fetch values */
        $statement->close();
    }

    public function getSensorData($data)
    {
        return $this->influxDb->getDataSeries($data->sensorName, $data->minutes);
    }
}
