<?php
require_once $_SERVER['DOCUMENT_ROOT'].'/api/v2/Api.php';

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

    public function getBuildingsAndRooms() {
        $statement = $this->database->prepare("SELECT MapID, MapName FROM Map");

        $statement->execute();
        $statement->store_result();
        $statement->bind_result($buildingID, $buildingName);

        $buildings = [];
        /* fetch values */
        while ($statement->fetch()) {
            $buildings[] = [
                "id" => $buildingID,
                "name" => $buildingName,
                "rooms" => []
            ];
        }
        $statement->close();

        for($i = 0; $i < count($buildings); $i++){
            $statement = $this->database->prepare("SELECT HubID, RoomName FROM Room WHERE BuildingID = ?");
            $statement->bind_param("d", $buildings[$i]["id"]);
            $statement->execute();
            $statement->store_result();
            $statement->bind_result($hubID, $roomName);
            while ($statement->fetch()) {
                $buildings[$i]["rooms"][] = ["hubID" => $hubID, "roomName" => $roomName];
            }
            $statement->close();
        }

        return $buildings;
    }
}
