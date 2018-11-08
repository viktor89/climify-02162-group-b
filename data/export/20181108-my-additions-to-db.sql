-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Vært: mysql
-- Genereringstid: 08. 11 2018 kl. 13:59:50
-- Serverversion: 8.0.12
-- PHP-version: 7.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `skoleklima`
--
CREATE DATABASE IF NOT EXISTS `skoleklima` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `skoleklima`;

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `Address`
--

CREATE TABLE `Address` (
  `AddressID` int(5) NOT NULL,
  `UserID` int(5) DEFAULT NULL,
  `Street` varchar(50) DEFAULT NULL,
  `ZipNo` int(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Data dump for tabellen `Address`
--

INSERT INTO `Address` (`AddressID`, `UserID`, `Street`, `ZipNo`) VALUES
(1, 1, 'nice street', 5454);

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `Area`
--

CREATE TABLE `Area` (
  `AreaID` int(5) NOT NULL,
  `MapID` int(5) DEFAULT NULL,
  `AreaName` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `DTUManager`
--

CREATE TABLE `DTUManager` (
  `UserID` int(5) NOT NULL,
  `UserName` varchar(30) DEFAULT NULL,
  `UserPassword` varchar(255) DEFAULT NULL,
  `LastLogin` date DEFAULT NULL,
  `Blocked` int(1) DEFAULT NULL,
  `Email` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Data dump for tabellen `DTUManager`
--

INSERT INTO `DTUManager` (`UserID`, `UserName`, `UserPassword`, `LastLogin`, `Blocked`, `Email`) VALUES
(1, 'manager', '$2y$10$YYDHtRzxdpECuExmF4.qeeDxxrYA0a3ifwQGwxJujdnIyOhkEpDF.', '2018-07-03', 1, 'test@test.com');

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `GeometryMap`
--

CREATE TABLE `GeometryMap` (
  `MapID` int(5) NOT NULL DEFAULT '0',
  `Latitude` float(11,8) DEFAULT NULL,
  `Longitude` float(11,8) DEFAULT NULL,
  `Scale` float(7,4) DEFAULT NULL,
  `Angle` float(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Data dump for tabellen `GeometryMap`
--

INSERT INTO `GeometryMap` (`MapID`, `Latitude`, `Longitude`, `Scale`, `Angle`) VALUES
(1, 0.97363293, 0.21850473, 12.3865, 15.73);

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `HasAttributeSensorUnit`
--

CREATE TABLE `HasAttributeSensorUnit` (
  `SensorAttributeID` int(5) NOT NULL DEFAULT '0',
  `SensorUnitID` int(5) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `InfluxInfo`
--

CREATE TABLE `InfluxInfo` (
  `MunID` int(5) DEFAULT NULL,
  `InfluxName` varchar(30) DEFAULT NULL,
  `InfluxUser` varchar(30) DEFAULT NULL,
  `InfluxPassword` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Data dump for tabellen `InfluxInfo`
--

INSERT INTO `InfluxInfo` (`MunID`, `InfluxName`, `InfluxUser`, `InfluxPassword`) VALUES
(1, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `Institution`
--

CREATE TABLE `Institution` (
  `InstID` int(5) NOT NULL,
  `InstName` varchar(30) NOT NULL,
  `MunID` int(5) NOT NULL,
  `InstDescription` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Data dump for tabellen `Institution`
--

INSERT INTO `Institution` (`InstID`, `InstName`, `MunID`, `InstDescription`) VALUES
(1, 'DTU', 1, '');

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `InstUser`
--

CREATE TABLE `InstUser` (
  `UserID` int(5) NOT NULL DEFAULT '0',
  `InstID` int(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Data dump for tabellen `InstUser`
--

INSERT INTO `InstUser` (`UserID`, `InstID`) VALUES
(2, 1),
(3, 1),
(4, 1),
(5, 1);

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `Location`
--

CREATE TABLE `Location` (
  `LocationID` int(5) NOT NULL,
  `AreaID` int(5) DEFAULT NULL,
  `LocationName` varchar(30) NOT NULL,
  `MapID` int(5) DEFAULT NULL,
  `XAxis` int(3) DEFAULT NULL,
  `YAxis` int(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Data dump for tabellen `Location`
--

INSERT INTO `Location` (`LocationID`, `AreaID`, `LocationName`, `MapID`, `XAxis`, `YAxis`) VALUES
(1, NULL, '1.A.', 1, NULL, NULL),
(2, NULL, '5.B.', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `Logbook`
--

CREATE TABLE `Logbook` (
  `MsgID` int(5) NOT NULL DEFAULT '0',
  `LocationID` int(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Data dump for tabellen `Logbook`
--

INSERT INTO `Logbook` (`MsgID`, `LocationID`) VALUES
(1, 1),
(2, 2);

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `Map`
--

CREATE TABLE `Map` (
  `MapID` int(5) NOT NULL,
  `InstID` int(5) DEFAULT NULL,
  `FileName` varchar(50) NOT NULL,
  `MapName` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Data dump for tabellen `Map`
--

INSERT INTO `Map` (`MapID`, `InstID`, `FileName`, `MapName`) VALUES
(1, 1, '5b3b60a2bb1ff.png', '303A'),
(2, 1, '5b3b60a2bb1ff.png', '303B');

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `Message`
--

CREATE TABLE `Message` (
  `MsgID` int(5) NOT NULL,
  `UserID` int(5) DEFAULT NULL,
  `MsgDate` date NOT NULL,
  `MsgTitle` varchar(30) NOT NULL,
  `MsgData` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Data dump for tabellen `Message`
--

INSERT INTO `Message` (`MsgID`, `UserID`, `MsgDate`, `MsgTitle`, `MsgData`) VALUES
(1, 2, '2018-08-27', 'Temperatur', 'It&#039;s too warm in the classroom and opening the windows don&#039;t provide enough air circulation.'),
(2, 2, '2018-08-27', 'Støj', 'People passing by in the hall is too noisy and disturbs the class.'),
(3, 1, '0000-00-00', 'Maintenance notice', 'Climify is scheduled for maintenance in two days');

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `Municipality`
--

CREATE TABLE `Municipality` (
  `MunID` int(5) NOT NULL,
  `MunName` varchar(30) NOT NULL,
  `DateOfCreation` date DEFAULT NULL,
  `Token` varchar(255) DEFAULT NULL,
  `Country` varchar(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Data dump for tabellen `Municipality`
--

INSERT INTO `Municipality` (`MunID`, `MunName`, `DateOfCreation`, `Token`, `Country`) VALUES
(1, 'København', '2018-07-03', '99dfe3afe0c69f52a7d748a7909e8238', 'DK');

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `News`
--

CREATE TABLE `News` (
  `MsgID` int(5) NOT NULL DEFAULT '0',
  `InstID` int(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Data dump for tabellen `News`
--

INSERT INTO `News` (`MsgID`, `InstID`) VALUES
(3, 1);

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `Permission`
--

CREATE TABLE `Permission` (
  `PermID` int(11) NOT NULL,
  `PermName` varchar(25) DEFAULT NULL,
  `PermDescription` varchar(75) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Data dump for tabellen `Permission`
--

INSERT INTO `Permission` (`PermID`, `PermName`, `PermDescription`) VALUES
(1, 'logbook', 'accessing the logbook');

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `Person`
--

CREATE TABLE `Person` (
  `UserID` int(5) NOT NULL,
  `UserName` varchar(7) NOT NULL,
  `FirstName` varchar(30) NOT NULL,
  `LastName` varchar(30) NOT NULL,
  `Email` varchar(50) NOT NULL,
  `RoleName` varchar(25) NOT NULL,
  `UserPassword` varchar(255) NOT NULL,
  `Blocked` int(1) DEFAULT NULL,
  `LastLogin` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Data dump for tabellen `Person`
--

INSERT INTO `Person` (`UserID`, `UserName`, `FirstName`, `LastName`, `Email`, `RoleName`, `UserPassword`, `Blocked`, `LastLogin`) VALUES
(1, 'James', 'James', 'Bond', 'test@test.com', '1', 'wmEfh6hv+DWx/pvWEv2IHujRNaZF6acAryDWrcuKXpg=', 1, NULL),
(2, 'bstrang', 'Bellatrix', 'LeStrange', 'test@hotmail.com', '2', 'yRzr9j/HZpY9R8DZtMQLzWtE989ZzZUhaEKL/bUYbW0=', 1, NULL),
(3, 'jakep', 'Jake', 'Peralta', 'test@hotmail.com', '2', 'YjCGBffwnrumUMAiftix17UygDO2iNbUR9+DsbJWEEc=', 1, NULL),
(4, 'amys', 'Amy', 'Santiago', 'test@hotmail.com', '2', '3KTehpnhvDbI5skUH7QfoCT/XsBSPmE3jfNE2aan0JU=', 1, NULL),
(5, 'admin', 'Viktor', 'Poulsen', 'viktor@maigaard.io', '1', 'admin', 1, NULL);

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `Phone`
--

CREATE TABLE `Phone` (
  `PhoneID` int(5) NOT NULL,
  `UserID` int(5) DEFAULT NULL,
  `PhoneNumber` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Data dump for tabellen `Phone`
--

INSERT INTO `Phone` (`PhoneID`, `UserID`, `PhoneNumber`) VALUES
(1, 1, '54545454');

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `ProjectManager`
--

CREATE TABLE `ProjectManager` (
  `UserID` int(5) NOT NULL DEFAULT '0',
  `MunID` int(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Data dump for tabellen `ProjectManager`
--

INSERT INTO `ProjectManager` (`UserID`, `MunID`) VALUES
(1, 1),
(5, 1);

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `ProjectManagerActivate`
--

CREATE TABLE `ProjectManagerActivate` (
  `UserID` int(5) NOT NULL DEFAULT '0',
  `MunID` int(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `QuickFeedback`
--

CREATE TABLE `QuickFeedback` (
  `QuickFeedbackID` int(5) NOT NULL,
  `LocationID` int(5) DEFAULT NULL,
  `Temperature` int(2) DEFAULT NULL,
  `Humidity` int(2) DEFAULT NULL,
  `CO2` int(2) DEFAULT NULL,
  `Noise` int(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `Role`
--

CREATE TABLE `Role` (
  `RoleID` int(11) NOT NULL DEFAULT '0',
  `RoleName` varchar(25) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Data dump for tabellen `Role`
--

INSERT INTO `Role` (`RoleID`, `RoleName`) VALUES
(0, 'Nothing'),
(1, 'Project manager'),
(2, 'Building manager'),
(3, 'User'),
(4, 'Limited User'),
(15, 'Project observer');

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `RolePermission`
--

CREATE TABLE `RolePermission` (
  `RoleID` int(11) NOT NULL,
  `PermID` int(5) NOT NULL,
  `InstID` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Data dump for tabellen `RolePermission`
--

INSERT INTO `RolePermission` (`RoleID`, `PermID`, `InstID`) VALUES
(0, 1, 1);

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `Room`
--

CREATE TABLE `Room` (
  `HubID` varchar(30) NOT NULL,
  `RoomName` varchar(30) DEFAULT NULL,
  `BuildingID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Data dump for tabellen `Room`
--

INSERT INTO `Room` (`HubID`, `RoomName`, `BuildingID`) VALUES
('B8-27-EB-C9-FD-4A', '46', 101),
('B8-27-EB-C9-FD-4B', '43', 2);

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `SensorAttribute`
--

CREATE TABLE `SensorAttribute` (
  `SensorAttributeID` int(5) NOT NULL,
  `SensorAttributeName` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `SensorInstance`
--

CREATE TABLE `SensorInstance` (
  `SensorID` varchar(50) NOT NULL DEFAULT '',
  `SensorTypeID` varchar(30) DEFAULT NULL,
  `LocationID` int(5) DEFAULT NULL,
  `HubID` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Data dump for tabellen `SensorInstance`
--

INSERT INTO `SensorInstance` (`SensorID`, `SensorTypeID`, `LocationID`, `HubID`) VALUES
('Temp sen', 'Temperature Sensor', 1, 'B8-27-EB-C9-FD-4A');

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `SensorType`
--

CREATE TABLE `SensorType` (
  `SensorTypeID` int(5) NOT NULL,
  `SensorTypeName` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `SensorUnit`
--

CREATE TABLE `SensorUnit` (
  `SensorUnitID` int(5) NOT NULL,
  `SensorUnitName` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `UserActivate`
--

CREATE TABLE `UserActivate` (
  `AdminUserID` int(5) NOT NULL,
  `NewUserID` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `Zip`
--

CREATE TABLE `Zip` (
  `ZipNo` int(5) NOT NULL DEFAULT '0',
  `City` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Data dump for tabellen `Zip`
--

INSERT INTO `Zip` (`ZipNo`, `City`) VALUES
(5454, 'California');

--
-- Begrænsninger for dumpede tabeller
--

--
-- Indeks for tabel `Address`
--
ALTER TABLE `Address`
  ADD PRIMARY KEY (`AddressID`),
  ADD KEY `UserID` (`UserID`),
  ADD KEY `ZipNo` (`ZipNo`);

--
-- Indeks for tabel `Area`
--
ALTER TABLE `Area`
  ADD PRIMARY KEY (`AreaID`),
  ADD KEY `MapID` (`MapID`);

--
-- Indeks for tabel `DTUManager`
--
ALTER TABLE `DTUManager`
  ADD PRIMARY KEY (`UserID`);

--
-- Indeks for tabel `GeometryMap`
--
ALTER TABLE `GeometryMap`
  ADD PRIMARY KEY (`MapID`);

--
-- Indeks for tabel `HasAttributeSensorUnit`
--
ALTER TABLE `HasAttributeSensorUnit`
  ADD PRIMARY KEY (`SensorAttributeID`,`SensorUnitID`),
  ADD KEY `SensorUnitID` (`SensorUnitID`);

--
-- Indeks for tabel `InfluxInfo`
--
ALTER TABLE `InfluxInfo`
  ADD KEY `MunID` (`MunID`);

--
-- Indeks for tabel `Institution`
--
ALTER TABLE `Institution`
  ADD PRIMARY KEY (`InstID`),
  ADD KEY `MunID` (`MunID`);

--
-- Indeks for tabel `InstUser`
--
ALTER TABLE `InstUser`
  ADD PRIMARY KEY (`UserID`),
  ADD KEY `InstID` (`InstID`);

--
-- Indeks for tabel `Location`
--
ALTER TABLE `Location`
  ADD PRIMARY KEY (`LocationID`),
  ADD KEY `AreaID` (`AreaID`),
  ADD KEY `MapID` (`MapID`);

--
-- Indeks for tabel `Logbook`
--
ALTER TABLE `Logbook`
  ADD PRIMARY KEY (`MsgID`),
  ADD KEY `LocationID` (`LocationID`);

--
-- Indeks for tabel `Map`
--
ALTER TABLE `Map`
  ADD PRIMARY KEY (`MapID`),
  ADD KEY `InstID` (`InstID`);

--
-- Indeks for tabel `Message`
--
ALTER TABLE `Message`
  ADD PRIMARY KEY (`MsgID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indeks for tabel `Municipality`
--
ALTER TABLE `Municipality`
  ADD PRIMARY KEY (`MunID`);

--
-- Indeks for tabel `News`
--
ALTER TABLE `News`
  ADD PRIMARY KEY (`MsgID`),
  ADD KEY `InstID` (`InstID`);

--
-- Indeks for tabel `Permission`
--
ALTER TABLE `Permission`
  ADD PRIMARY KEY (`PermID`);

--
-- Indeks for tabel `Person`
--
ALTER TABLE `Person`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `username_unique` (`UserName`);

--
-- Indeks for tabel `Phone`
--
ALTER TABLE `Phone`
  ADD PRIMARY KEY (`PhoneID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indeks for tabel `ProjectManager`
--
ALTER TABLE `ProjectManager`
  ADD PRIMARY KEY (`UserID`),
  ADD KEY `MunID` (`MunID`);

--
-- Indeks for tabel `ProjectManagerActivate`
--
ALTER TABLE `ProjectManagerActivate`
  ADD PRIMARY KEY (`UserID`),
  ADD KEY `MunID` (`MunID`);

--
-- Indeks for tabel `QuickFeedback`
--
ALTER TABLE `QuickFeedback`
  ADD PRIMARY KEY (`QuickFeedbackID`),
  ADD KEY `LocationID` (`LocationID`);

--
-- Indeks for tabel `Role`
--
ALTER TABLE `Role`
  ADD PRIMARY KEY (`RoleID`);

--
-- Indeks for tabel `RolePermission`
--
ALTER TABLE `RolePermission`
  ADD PRIMARY KEY (`RoleID`,`PermID`,`InstID`),
  ADD KEY `PermID` (`PermID`),
  ADD KEY `InstID` (`InstID`);

--
-- Indeks for tabel `Room`
--
ALTER TABLE `Room`
  ADD PRIMARY KEY (`HubID`),
  ADD KEY `fk_building_id` (`BuildingID`);

--
-- Indeks for tabel `SensorAttribute`
--
ALTER TABLE `SensorAttribute`
  ADD PRIMARY KEY (`SensorAttributeID`);

--
-- Indeks for tabel `SensorInstance`
--
ALTER TABLE `SensorInstance`
  ADD PRIMARY KEY (`SensorID`),
  ADD KEY `LocationID` (`LocationID`),
  ADD KEY `SensorTypeID` (`SensorTypeID`),
  ADD KEY `HubID` (`HubID`);

--
-- Indeks for tabel `SensorType`
--
ALTER TABLE `SensorType`
  ADD PRIMARY KEY (`SensorTypeID`);

--
-- Indeks for tabel `SensorUnit`
--
ALTER TABLE `SensorUnit`
  ADD PRIMARY KEY (`SensorUnitID`);

--
-- Indeks for tabel `UserActivate`
--
ALTER TABLE `UserActivate`
  ADD PRIMARY KEY (`NewUserID`),
  ADD KEY `AdminUserID` (`AdminUserID`);

--
-- Indeks for tabel `Zip`
--
ALTER TABLE `Zip`
  ADD PRIMARY KEY (`ZipNo`);

--
-- Brug ikke AUTO_INCREMENT for slettede tabeller
--

--
-- Tilføj AUTO_INCREMENT i tabel `Address`
--
ALTER TABLE `Address`
  MODIFY `AddressID` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Tilføj AUTO_INCREMENT i tabel `Area`
--
ALTER TABLE `Area`
  MODIFY `AreaID` int(5) NOT NULL AUTO_INCREMENT;

--
-- Tilføj AUTO_INCREMENT i tabel `DTUManager`
--
ALTER TABLE `DTUManager`
  MODIFY `UserID` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Tilføj AUTO_INCREMENT i tabel `Institution`
--
ALTER TABLE `Institution`
  MODIFY `InstID` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Tilføj AUTO_INCREMENT i tabel `Location`
--
ALTER TABLE `Location`
  MODIFY `LocationID` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Tilføj AUTO_INCREMENT i tabel `Map`
--
ALTER TABLE `Map`
  MODIFY `MapID` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Tilføj AUTO_INCREMENT i tabel `Message`
--
ALTER TABLE `Message`
  MODIFY `MsgID` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Tilføj AUTO_INCREMENT i tabel `Municipality`
--
ALTER TABLE `Municipality`
  MODIFY `MunID` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Tilføj AUTO_INCREMENT i tabel `Permission`
--
ALTER TABLE `Permission`
  MODIFY `PermID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Tilføj AUTO_INCREMENT i tabel `Person`
--
ALTER TABLE `Person`
  MODIFY `UserID` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Tilføj AUTO_INCREMENT i tabel `Phone`
--
ALTER TABLE `Phone`
  MODIFY `PhoneID` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Tilføj AUTO_INCREMENT i tabel `QuickFeedback`
--
ALTER TABLE `QuickFeedback`
  MODIFY `QuickFeedbackID` int(5) NOT NULL AUTO_INCREMENT;

--
-- Tilføj AUTO_INCREMENT i tabel `SensorAttribute`
--
ALTER TABLE `SensorAttribute`
  MODIFY `SensorAttributeID` int(5) NOT NULL AUTO_INCREMENT;

--
-- Tilføj AUTO_INCREMENT i tabel `SensorType`
--
ALTER TABLE `SensorType`
  MODIFY `SensorTypeID` int(5) NOT NULL AUTO_INCREMENT;

--
-- Tilføj AUTO_INCREMENT i tabel `SensorUnit`
--
ALTER TABLE `SensorUnit`
  MODIFY `SensorUnitID` int(5) NOT NULL AUTO_INCREMENT;

--
-- Begrænsninger for dumpede tabeller
--

--
-- Begrænsninger for tabel `Address`
--
ALTER TABLE `Address`
  ADD CONSTRAINT `address_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Person` (`userid`) ON DELETE CASCADE,
  ADD CONSTRAINT `address_ibfk_2` FOREIGN KEY (`ZipNo`) REFERENCES `Zip` (`zipno`) ON DELETE CASCADE;

--
-- Begrænsninger for tabel `Area`
--
ALTER TABLE `Area`
  ADD CONSTRAINT `area_ibfk_1` FOREIGN KEY (`MapID`) REFERENCES `Map` (`mapid`) ON DELETE CASCADE;

--
-- Begrænsninger for tabel `GeometryMap`
--
ALTER TABLE `GeometryMap`
  ADD CONSTRAINT `geometrymap_ibfk_1` FOREIGN KEY (`MapID`) REFERENCES `Map` (`mapid`) ON DELETE CASCADE;

--
-- Begrænsninger for tabel `HasAttributeSensorUnit`
--
ALTER TABLE `HasAttributeSensorUnit`
  ADD CONSTRAINT `hasattributesensorunit_ibfk_1` FOREIGN KEY (`SensorAttributeID`) REFERENCES `SensorAttribute` (`sensorattributeid`),
  ADD CONSTRAINT `hasattributesensorunit_ibfk_2` FOREIGN KEY (`SensorUnitID`) REFERENCES `SensorUnit` (`sensorunitid`);

--
-- Begrænsninger for tabel `InfluxInfo`
--
ALTER TABLE `InfluxInfo`
  ADD CONSTRAINT `influxinfo_ibfk_1` FOREIGN KEY (`MunID`) REFERENCES `Municipality` (`munid`);

--
-- Begrænsninger for tabel `Institution`
--
ALTER TABLE `Institution`
  ADD CONSTRAINT `institution_ibfk_1` FOREIGN KEY (`MunID`) REFERENCES `Municipality` (`munid`);

--
-- Begrænsninger for tabel `InstUser`
--
ALTER TABLE `InstUser`
  ADD CONSTRAINT `instuser_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Person` (`userid`) ON DELETE CASCADE,
  ADD CONSTRAINT `instuser_ibfk_2` FOREIGN KEY (`InstID`) REFERENCES `Institution` (`instid`) ON DELETE SET NULL;

--
-- Begrænsninger for tabel `Location`
--
ALTER TABLE `Location`
  ADD CONSTRAINT `location_ibfk_1` FOREIGN KEY (`AreaID`) REFERENCES `Area` (`areaid`) ON DELETE CASCADE,
  ADD CONSTRAINT `location_ibfk_2` FOREIGN KEY (`MapID`) REFERENCES `Map` (`mapid`) ON DELETE CASCADE;

--
-- Begrænsninger for tabel `Logbook`
--
ALTER TABLE `Logbook`
  ADD CONSTRAINT `logbook_ibfk_1` FOREIGN KEY (`MsgID`) REFERENCES `Message` (`msgid`) ON DELETE CASCADE,
  ADD CONSTRAINT `logbook_ibfk_2` FOREIGN KEY (`LocationID`) REFERENCES `Location` (`locationid`) ON DELETE CASCADE;

--
-- Begrænsninger for tabel `Map`
--
ALTER TABLE `Map`
  ADD CONSTRAINT `map_ibfk_1` FOREIGN KEY (`InstID`) REFERENCES `Institution` (`instid`) ON DELETE CASCADE;

--
-- Begrænsninger for tabel `Message`
--
ALTER TABLE `Message`
  ADD CONSTRAINT `message_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Person` (`userid`) ON DELETE SET NULL;

--
-- Begrænsninger for tabel `News`
--
ALTER TABLE `News`
  ADD CONSTRAINT `news_ibfk_1` FOREIGN KEY (`MsgID`) REFERENCES `Message` (`msgid`) ON DELETE CASCADE,
  ADD CONSTRAINT `news_ibfk_2` FOREIGN KEY (`InstID`) REFERENCES `Institution` (`instid`) ON DELETE CASCADE;

--
-- Begrænsninger for tabel `Phone`
--
ALTER TABLE `Phone`
  ADD CONSTRAINT `phone_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Person` (`userid`) ON DELETE CASCADE;

--
-- Begrænsninger for tabel `ProjectManager`
--
ALTER TABLE `ProjectManager`
  ADD CONSTRAINT `projectmanager_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Person` (`userid`),
  ADD CONSTRAINT `projectmanager_ibfk_2` FOREIGN KEY (`MunID`) REFERENCES `Municipality` (`munid`) ON DELETE SET NULL;

--
-- Begrænsninger for tabel `ProjectManagerActivate`
--
ALTER TABLE `ProjectManagerActivate`
  ADD CONSTRAINT `projectmanageractivate_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Person` (`userid`),
  ADD CONSTRAINT `projectmanageractivate_ibfk_2` FOREIGN KEY (`MunID`) REFERENCES `Municipality` (`munid`) ON DELETE SET NULL;

--
-- Begrænsninger for tabel `QuickFeedback`
--
ALTER TABLE `QuickFeedback`
  ADD CONSTRAINT `quickfeedback_ibfk_1` FOREIGN KEY (`LocationID`) REFERENCES `Location` (`locationid`) ON DELETE SET NULL;

--
-- Begrænsninger for tabel `RolePermission`
--
ALTER TABLE `RolePermission`
  ADD CONSTRAINT `rolepermission_ibfk_1` FOREIGN KEY (`RoleID`) REFERENCES `Role` (`roleid`),
  ADD CONSTRAINT `rolepermission_ibfk_2` FOREIGN KEY (`PermID`) REFERENCES `Permission` (`permid`),
  ADD CONSTRAINT `rolepermission_ibfk_3` FOREIGN KEY (`InstID`) REFERENCES `Institution` (`instid`);

--
-- Begrænsninger for tabel `SensorInstance`
--
ALTER TABLE `SensorInstance`
  ADD CONSTRAINT `sensorinstance_ibfk_1` FOREIGN KEY (`LocationID`) REFERENCES `Location` (`locationid`) ON DELETE SET NULL,
  ADD CONSTRAINT `sensorinstance_ibfk_3` FOREIGN KEY (`HubID`) REFERENCES `Room` (`hubid`) ON DELETE CASCADE;

--
-- Begrænsninger for tabel `UserActivate`
--
ALTER TABLE `UserActivate`
  ADD CONSTRAINT `useractivate_ibfk_1` FOREIGN KEY (`AdminUserID`) REFERENCES `Person` (`userid`),
  ADD CONSTRAINT `useractivate_ibfk_2` FOREIGN KEY (`NewUserID`) REFERENCES `Person` (`userid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
