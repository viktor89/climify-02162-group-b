<?php
require_once $_SERVER['DOCUMENT_ROOT'].'/api/v2/Api.php';

use API\V2\ValidationException;


class PermissionDAO extends API\V2\Api
{
    public function getPermissions(){
        $statement = $this->database->prepare("SELECT PermID,PermName FROM Permission");

        $statement->execute();
        $statement->store_result();
        $statement->bind_result($permID, $permName);

        $permissions = [];
        /* fetch values */
        while ($statement->fetch()) {
            $permissions[] = ["permID" => $permID, "permName" => $permName];
        }
        $statement->close();
        return $permissions;
    }

    public function set($data){
        $roleID_escaped = empty($data->roleID) ? null : $this->database->real_escape_string($data->roleID);
        $permID_escaped = empty($data->permID) ? null : $this->database->real_escape_string($data->permID);
        $instID_escaped = empty($data->instID) ? null : $this->database->real_escape_string($data->instID);

        $statement = $this->database->prepare("INSERT INTO RolePermission (RoleID,PermID,InstID) VALUES (?,?,?)");
        $statement->bind_param("ddd", $roleID_escaped,$permID_escaped,$instID_escaped);

        $statement->execute();
        $affectedRows = $statement->affected_rows;
        $statement->close();

        if($affectedRows < 0) {
            throw new ValidationException("Permission already set!");
        }
    }

    public function remove($data){
        $roleID_escaped = empty($data->roleID) ? null : $this->database->real_escape_string($data->roleID);
        $permID_escaped = empty($data->permID) ? null : $this->database->real_escape_string($data->permID);
        $instID_escaped = empty($data->instID) ? null : $this->database->real_escape_string($data->instID);

        $statement = $this->database->prepare("DELETE FROM RolePermission WHERE RoleID = ? AND PermID = ? AND InstID = ?");
        $statement->bind_param("ddd", $roleID_escaped,$permID_escaped,$instID_escaped);

        $statement->execute();
        $affectedRows = $statement->affected_rows;
        $statement->close();

        if($affectedRows < 0) {
            throw new ValidationException("Permission not found!");
        }
    }

}