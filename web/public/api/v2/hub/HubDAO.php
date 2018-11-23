<?php
require_once $_SERVER['DOCUMENT_ROOT'].'/api/v2/Api.php';

use API\V2\ValidationException;


class HubDAO extends API\V2\Api
{
    public function addNewHub($mac){
        if(empty($mac)){
            throw new Exception("No mac address provided");
        }

        $mac_escaped = $this->database->real_escape_string($mac);;

        $statement = $this->database->prepare("INSERT INTO Room (HubID, RoomName, BuildingID) VALUES (?, NULL, NULL)");
        $statement->bind_param("s", $mac_escaped);

        $statement->execute();
        $affectedRows = $statement->affected_rows;
        $statement->close();

        if($affectedRows < 0) {
            throw new ValidationException("Hub already registered!");
        }
    }

    public function approveHub($data){
        $mac_escaped = $this->database->real_escape_string($data->mac);
        $building_escaped = $this->database->real_escape_string($data->building);
        $room_escaped = $this->database->real_escape_string($data->room);

        $statement = $this->database->prepare("UPDATE Room SET RoomName = ?, BuildingID = ? WHERE HubID LIKE ? ESCAPE '#'");
        $statement->bind_param("iis", $room_escaped, $building_escaped, $mac_escaped);
        $statement->execute();
        $affectedRows = $statement->affected_rows;
        $statement->close();

        if($affectedRows < 0) {
            throw new ValidationException("error!");
        }
        if(isset($data->receiveMode)){
            $this->MQTTService->sendMessage($data->mac, ["payload" => ["receiveMode" => $data->receiveMode]]);
        }
    }

    public function updateHub($data){
        $this->approveHub($data);
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

        return $hubs;
    }

    public function getRegisteredHubsByInstitution($institutionID){
        $statement = $this->database->prepare("SELECT HubID, MapName, RoomName FROM Room LEFT JOIN Map ON MapID = BuildingID WHERE Map.InstID = (?) AND RoomName IS NOT NULL AND BuildingID IS NOT NULL");
        $institutionID_escaped = $this->database->real_escape_string($institutionID);
        $statement->bind_param("i", $institutionID_escaped);

        $statement->execute();
        $statement->store_result();
        $statement->bind_result($hubMac, $building, $room);

        $hubs = [];
        /* fetch values */
        while ($statement->fetch()) {
            $hubs[] = ["mac" => $hubMac, "building" => $building, "room" => $room, "ip" => "127.127.127"];
        }
        $statement->close();

        return $hubs;
    }

    public function remove($data){
        $hub_escaped = empty($data->hubID) ? null : $this->database->real_escape_string($data->hubID);
        $statement = $this->database->prepare("DELETE FROM Room WHERE HubID LIKE ? ESCAPE '#'");
        $statement->bind_param("s", $hub_escaped);

        $statement->execute();
        $affectedRows = $statement->affected_rows;
        $statement->close();

        if($affectedRows < 0) {
            throw new ValidationException("Hub not found!");
        }
    }
}