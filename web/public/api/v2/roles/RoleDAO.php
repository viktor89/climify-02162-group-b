<?php
require_once '../Api.php';

use API\V2\ValidationException;


class RoleDAO extends API\V2\Api
{
    public function getRoles(){
        $statement = $this->database->prepare("SELECT RoleID, RoleName FROM Role");

        $statement->execute();
        $statement->store_result();
        $statement->bind_result($roleID, $roleName);

        $users = [];
        /* fetch values */
        while ($statement->fetch()) {
            $users[] = ["id" => $roleID, "name" => $roleName];
        }
        $statement->close();
        return $users;
    }
}