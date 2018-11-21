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
}
