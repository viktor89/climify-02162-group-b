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

    public function getBuildingsAndRooms() {
        $statement = $this->database->prepare("SELECT MapID, MapName FROM Map");

        $statement->execute();
        $statement->store_result();
        $statement->bind_result($id, $buildingName);

        $tree = [];
        /* fetch values */
        while ($statement->fetch()) {
            $tree["id"] = $id;
            $tree["name"] = $buildingName;
            $tree{"rooms"} = [];
            $roomsStatement = $this->database->prepare("SELECT HubID, RoomName FROM Room WHERE BuildingID = ?");
            $roomsStatement->bind_param("d", $id);
            $roomsStatement->execute();
            $roomsStatement->store_result();
            $roomsStatement->bind_result($hubID, $roomName);
            while ($statement->fetch()) {
                $tree{"rooms"}[] = ["id" => $hubID, "roomName" => $roomName];
            }
        }
        $statement->close();

        return $tree;
    }
}
