<?php
require_once '../Api.php';

use API\V2\ValidationException;
use InfluxDB\Point;

class InstitutionDAO extends API\V2\Api
{
    public function getInstitutions() {
        $statement = $this->database->prepare("SELECT InstID, InstName FROM Institution");

        $statement->execute();
        $statement->store_result();
        $statement->bind_result($instID, $instName);

        $institutions = [];
        /* fetch values */
        while ($statement->fetch()) {
            $institutions[] = ["id" => $instID, "name" => $instName];
        }
        $statement->close();

        return $institutions;
    }
}
