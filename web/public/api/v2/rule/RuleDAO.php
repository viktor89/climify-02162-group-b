<?php
require_once '../Api.php';

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
            $rules[] = ["id" => $ruleId, "type" => $type, "unit" => $unit, "upperThreshold" => $upperThreshold, "lowerThreshold" => $lowerThreshold];
        }
        $statement->close();

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
}
