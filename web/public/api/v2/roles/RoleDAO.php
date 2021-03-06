<?php
require_once $_SERVER['DOCUMENT_ROOT'].'/api/v2/Api.php';

use API\V2\ValidationException;


class RoleDAO extends API\V2\Api
{
    public function getRoles(){
        $statement = $this->database->prepare("SELECT RoleID, RoleName FROM Role");
        //TODO rollens permissions skal være med, gerne som key/value(boolean) pair

        $statement->execute();
        $statement->store_result();
        $statement->bind_result($roleID, $roleName);

        $roles = [];
        /* fetch values */
        while ($statement->fetch()) {
            $roles[] = ["id" => $roleID, "name" => $roleName, "permissions" => []];
        }
        $statement->close();

        for($i = 0; $i < count($roles); $i++){
            $statement = $this->database->prepare("SELECT PermID as pid, PermName, CASE WHEN (SELECT PermID from RolePermission NATURAL JOIN Permission where RoleID = ? AND PermID = pid) IS NULL THEN false ELSE true END as HasPermission FROM Permission");
            $statement->bind_param("d", $roles[$i]["id"]);
            $statement->execute();
            $statement->store_result();
            $statement->bind_result($permID, $permName, $hasPermission);
            while ($statement->fetch()) {
                $roles[$i]{"permissions"}[] = ["permID" => $permID, "permName" => $permName, "hasPermission" => $hasPermission];
            }
            $statement->close();
        }

        return $roles;
    }

    public function createRole($data){
        $roleName_escaped = empty($data->roleName) ? null : $this->database->real_escape_string($data->roleName);

        $statement = $this->database->prepare("INSERT INTO Role (RoleName) VALUES (?)");
        $statement->bind_param("s",$roleName_escaped);

        $statement->execute();
        $roleID = $this->database->insert_id;
        $affectedRows = $statement->affected_rows;
        $statement->close();

        if($affectedRows < 0) {
            throw new ValidationException("Role not created!");
        }

        return $roleID;
    }

    public function editRole($data){
        $roleID_escaped = empty($data->roleID) ? null : $this->database->real_escape_string($data->roleID);
        $roleName_escaped = empty($data->roleName) ? null : $this->database->real_escape_string($data->roleName);

        $statement = $this->database->prepare("UPDATE Role SET RoleName=? WHERE RoleID = ?");
        $statement->bind_param("sd",$roleName_escaped,$roleID_escaped);

        $statement->execute();
        $affectedRows = $statement->affected_rows;
        $statement->close();

        if($affectedRows < 0) {
            throw new ValidationException("Role not edited!");
        }
    }

    public function deleteRole($data){
        $roleID_escaped = empty($data->roleID) ? null : $this->database->real_escape_string($data->roleID);

        $statement = $this->database->prepare("DELETE FROM Role WHERE RoleID = ?");
        $statement->bind_param("d", $roleID_escaped);

        $statement->execute();
        $affectedRows = $statement->affected_rows;
        $statement->close();

        if($affectedRows < 0) {
            throw new ValidationException("Role not found!");
        }
    }
}