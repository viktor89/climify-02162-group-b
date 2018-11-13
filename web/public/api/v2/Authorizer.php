<?php
namespace API\V2;

class Authorizer extends API
{
    public function userHasPermisson($userID, $permission) {
        $statement = $this->database->prepare("SELECT UserName FROM (((Permission INNER JOIN RolePermission ON Permission.PermID = RolePermission.PermID) INNER JOIN Role ON RolePermission.RoleID = Role.RoleID) INNER JOIN Person ON Role.RoleID = Person.RoleName) WHERE UserID = ? AND PermName = ?");
        $statement->bind_param("ds", $userID, $permission);
        $statement->execute();
        $statement->store_result();
        $statement->bind_result($username);
        $statement->fetch();
        return $username !== null;
    }
}