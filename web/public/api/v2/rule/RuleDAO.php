<?php
require_once $_SERVER['DOCUMENT_ROOT'].'/api/v2/Api.php';

use API\V2\ValidationException;
use InfluxDB\Point;

class RuleDAO extends API\V2\Api
{
    public function getRules() {
        $statement = $this->database->prepare("SELECT Rule.id, type, unit, UpperThreshold, LowerThreshold FROM Rule LEFT JOIN RuleType on RuleType.id = RuleType");

        $statement->execute();
        $statement->store_result();
        $statement->bind_result($ruleId, $type, $unit, $upperThreshold, $lowerThreshold);

        $rules = [];
        /* fetch values */
        while ($statement->fetch()) {
            $rules[] = ["id" => $ruleId, "type" => $type, "unit" => $unit, "upperThreshold" => $upperThreshold, "lowerThreshold" => $lowerThreshold, "rooms" => []];
        }
        $statement->close();

        for($i = 0; $i < count($rules); $i++){
            $statement = $this->database->prepare("SELECT Room.HubID, Room.RoomName FROM RoomRule NATURAL JOIN Room WHERE id = ?");
            $statement->bind_param("d", $rules[$i]['id']);
            $statement->execute();
            $statement->store_result();
            $statement->bind_result($roomId, $roomName);
            while ($statement->fetch()) {
                $rules[$i]['rooms'][] = ["id" => $roomId, "name" => $roomName];
            }
            $statement->close();
        }

        return $rules;
    }

    public function deleteRule($data) {
        $statement = $this->database->prepare("DELETE FROM Rule WHERE id = ?");
        $statement->bind_param("s", $data->ruleId);
        $statement->execute();
        $statement->close();
    }

    public function createRule($data) {
        $statement = $this->database->prepare("INSERT INTO Rule (RuleType, UpperThreshold, LowerThreshold) VALUES (?, ?, ?)");
        $statement->bind_param("ddd", $data->ruleType, $data->upperThreshold, $data->lowerThreshold);
        $statement->execute();
        return $this->database->insert_id;
    }

    public function updateRule($data) {
        $statement = $this->database->prepare("UPDATE Rule SET RuleType = ?, UpperThreshold = ?, LowerThreshold = ? WHERE id = ?");
        $statement->bind_param("dddd", $data->ruleType, $data->upperThreshold, $data->lowerThreshold, $data->ruleId);
        $statement->execute();
    }

    public function getRuleTypes() {
        $statement = $this->database->prepare("SELECT id, type, unit FROM RuleType");

        $statement->execute();
        $statement->store_result();
        $statement->bind_result($ruleTypeId, $type, $unit);

        $ruleTypes = [];
        /* fetch values */
        while ($statement->fetch()) {
            $ruleTypes [] = ["id" => $ruleTypeId, "type" => $type, "unit" => $unit];
        }
        $statement->close();
        return $ruleTypes ;
    }
}
