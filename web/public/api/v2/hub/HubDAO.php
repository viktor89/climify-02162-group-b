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
    public function addNewHub($mac){
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

    public function registerHub($data){
        if(empty($data->mac)){
            throw new Exception("No mac address provided");
        }

        $mac_escaped = $this->database->real_escape_string($data->mac);
        $building_escaped = $this->database->real_escape_string($data->building);
        $room_escaped = $this->database->real_escape_string($data->room);

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
        $statement->bind_result($hubMac);

        $hubs = [];
        /* fetch values */
        while ($statement->fetch()) {
            $hubs[] = ["mac" => $hubMac, "ip" => "127.127.127.127"];
        }
        $statement->close();

        echo json_encode($hubs);
    }

    public function getRegisteredHubs(){
        $statement = $this->database->prepare("SELECT HubID, MapName, RoomName FROM Room LEFT JOIN Map ON MapID = BuildingID WHERE RoomName IS NOT NULL AND BuildingID IS NOT NULL");

        $statement->execute();
        $statement->store_result();
        $statement->bind_result($hubMac, $building, $room);

        $hubs = [];
        /* fetch values */
        while ($statement->fetch()) {
            $hubs[] = ["mac" => $hubMac, "building" => $building, "room" => $room, "ip" => "127.127.127"];
        }
        $statement->close();

        echo json_encode($hubs);
    }
}