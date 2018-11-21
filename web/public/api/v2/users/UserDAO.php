<?php
require_once '../Api.php';

use API\V2\ValidationException;


class UserDAO extends API\V2\Api
{
    public function getUsers(){
        $statement = $this->database->prepare("SELECT UserID, UserName, FirstName, LastName, Email, Role.RoleName FROM Person LEFT JOIN Role ON Person.RoleName = Role.RoleID");

        $statement->execute();
        $statement->store_result();
        $statement->bind_result($userID, $userName, $firstName, $lastName, $email, $role);

        $users = [];
        /* fetch values */
        while ($statement->fetch()) {
            $users[] = ["id" => $userID, "username" => $userName, "firstname" => $firstName, "lastname" => $lastName, "email" => $email, "role" => $role];
        }
        $statement->close();
        return $users;
    }

    public function createUser($data){
        $userName_escaped = empty($data->userName) ? null : $this->database->real_escape_string($data->userName);
        $firstName_escaped = empty($data->firstName) ? null : $this->database->real_escape_string($data->firstName);
        $lastName_escaped = empty($data->lastName) ? null : $this->database->real_escape_string($data->lastName);
        $email_escaped = empty($data->email) ? null : $this->database->real_escape_string($data->email);
        $roleName_escaped = empty($data->roleName) ? null : $this->database->real_escape_string($data->roleName);
        $password_escaped = empty($data->password) ? null : $this->database->real_escape_string($data->password);

        $statement = $this->database->prepare("INSERT INTO Person (UserName,FirstName,LastName,Email,RoleName,UserPassword,Blocked,LastLogin) VALUES (?,?,?,?,?,?,1,null)");
        $statement->bind_param("ssssss",$userName_escaped,$firstName_escaped,$lastName_escaped,$email_escaped,$roleName_escaped,$password_escaped);

        $statement->execute();
        $userID = $this->database->insert_id;
        $affectedRows = $statement->affected_rows;
        $statement->close();

        if($affectedRows < 0) {
            throw new ValidationException("User not created!");
        }

        return $userID;
    }

    public function editUser($data){
        $userID_escaped = empty($data->userID) ? null : $this->database->real_escape_string($data->userID);
        $userName_escaped = empty($data->userName) ? null : $this->database->real_escape_string($data->userName);
        $firstName_escaped = empty($data->firstName) ? null : $this->database->real_escape_string($data->firstName);
        $lastName_escaped = empty($data->lastName) ? null : $this->database->real_escape_string($data->lastName);
        $email_escaped = empty($data->email) ? null : $this->database->real_escape_string($data->email);
        $roleName_escaped = empty($data->roleName) ? null : $this->database->real_escape_string($data->roleName);

        $statement = $this->database->prepare("UPDATE Person SET UserName=?,FirstName=?,LastName=?,Email=?,RoleName=? WHERE UserID = ?");
        $statement->bind_param("sssssd",$userName_escaped,$firstName_escaped,$lastName_escaped,$email_escaped,$roleName_escaped,$userID_escaped);

        $statement->execute();
        $affectedRows = $statement->affected_rows;
        $statement->close();

        if($affectedRows < 0) {
            throw new ValidationException("User not edited!");
        }
    }

    public function deleteUser($data){
        $userID_escaped = empty($data->userID) ? null : $this->database->real_escape_string($data->userID);

        $statement = $this->database->prepare("DELETE FROM Person WHERE UserID = ?");
        $statement->bind_param("d", $userID_escaped);

        $statement->execute();
        $affectedRows = $statement->affected_rows;
        $statement->close();

        if($affectedRows < 0) {
            throw new ValidationException("User not found!");
        }
    }
}