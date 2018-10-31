<?php
require_once '../Api.php';

use API\V2\ValidationException;


class HubDAO extends API\V2\Api
{
    /**
     * @param $mac
     * @return false|string
     * @throws ValidationException
     */
    public function registerNewHub($mac){
        if(empty($mac)){
            throw new Exception("No mac address provided");
        }

        $mac_escaped = $this->database->real_escape_string($mac);;
        $locationId = null;
        $roomName = null;

        $statement = $this->database->prepare("INSERT INTO Room (HubID, RoomName, BuildingID) VALUES (?, ?, ?)");
        $statement->bind_param("ssd", $mac_escaped, $roomName, $locationId);

        $statement->execute();
        $affectedRows = $statement->affected_rows;
        $statement->close();

        if($affectedRows < 0) {
            throw new ValidationException("Hub already registered!");
        }
        echo json_encode(["status" => "ok"]);
    }

    public function getPendingHubs(){
        $statement = $this->database->prepare("SELECT HubID FROM Room WHERE RoomName IS NULL AND BuildingID IS NULL");

        $statement->execute();
        $statement->store_result();
        $statement->bind_result($hub);

        $hubIds = [];
        /* fetch values */
        while ($statement->fetch()) {
            $hubIds[] = $hub;
        }
        $statement->close();

        echo json_encode($hubIds);
    }
}