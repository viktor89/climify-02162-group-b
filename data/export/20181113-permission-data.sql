DELETE FROM RolePermission WHERE 1;
DELETE FROM Permission WHERE 1;

INSERT INTO Permission(PermID,PermName,PermDescription) VALUES  (1,'Manage Institution','');
INSERT INTO Permission(PermID,PermName,PermDescription) VALUES  (2,'Manage Devices','');
INSERT INTO Permission(PermID,PermName,PermDescription) VALUES  (3,'Graphs','');
INSERT INTO Permission(PermID,PermName,PermDescription) VALUES  (4,'Manage Users & Roles','');
INSERT INTO Permission(PermID,PermName,PermDescription) VALUES  (5,'Climate Control','');

INSERT INTO `RolePermission` (`RoleID`, `PermID`, `InstID`) VALUES (1, 1, 1);
INSERT INTO `RolePermission` (`RoleID`, `PermID`, `InstID`) VALUES (1, 2, 1);
INSERT INTO `RolePermission` (`RoleID`, `PermID`, `InstID`) VALUES (1, 3, 1);
INSERT INTO `RolePermission` (`RoleID`, `PermID`, `InstID`) VALUES (1, 4, 1);
INSERT INTO `RolePermission` (`RoleID`, `PermID`, `InstID`) VALUES (1, 5, 1);