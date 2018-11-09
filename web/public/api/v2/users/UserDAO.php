<?php
require_once '../Api.php';

use API\V2\ValidationException;


class UserDAO extends API\V2\Api
{
    public function getUsers(){
        $statement = $this->database->prepare("SELECT UserID, UserName, FirstName, LastName, Role.RoleName, LastLogin FROM Person LEFT JOIN Role ON Person.RoleName = Role.RoleID");

        $statement->execute();
        $statement->store_result();
        $statement->bind_result($userID, $userName, $firstName, $lastName, $role, $lastLogin);

        $users = [];
        /* fetch values */
        while ($statement->fetch()) {
            $users[] = ["id" => $userID, "username" => $userName, "firstname" => $firstName, "lastname" => $lastName, "role" => $role, "lastLogin" => $lastLogin];
        }
        $statement->close();
        return $users;
    }
}