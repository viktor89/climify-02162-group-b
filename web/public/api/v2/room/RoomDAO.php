<?php
require_once '../Api.php';

use API\V2\ValidationException;


class RoomDAO extends API\V2\Api
{
    public function getRooms(){
        $statement = $this->database->prepare("SELECT MapID, MapName FROM Map");

        $statement->execute();
        $statement->store_result();
        $statement->bind_result($buildingID, $buildingName);

        $buildings = [];
        /* fetch values */
        while ($statement->fetch()) {
            $buildings[] = ["id" => $buildingID, "name" => $buildingName];
        }
        $statement->close();
        return $buildings;
    }

    public function getRoomByName($name) {
        $statement = $this->database->prepare("SELECT MapID FROM Map where MapName = ?");
        $statement->bind_param("i", $name);
        $statement->execute();
        $statement->store_result();
        $statement->bind_result($buildingID);
        $statement->fetch();
        $statement->close();
        return $buildingID;
    }
}