LOCK TABLES
Role WRITE,
RolePermission WRITE;

#remove blocking constraints
ALTER TABLE RolePermission DROP FOREIGN KEY rolepermission_ibfk_1;
UPDATE Role SET RoleID = '10' WHERE RoleID = '0';

#alter table
ALTER TABLE Role CHANGE RoleID RoleID INT(11) NOT NULL AUTO_INCREMENT;

# reinstate constraints
UPDATE Role SET RoleID = '0' WHERE RoleID = '10';
ALTER TABLE RolePermission ADD CONSTRAINT rolepermission_ibfk_1 FOREIGN KEY (RoleID) REFERENCES Role (RoleID);

UNLOCK TABLES;