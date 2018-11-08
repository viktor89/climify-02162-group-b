ALTER TABLE `SensorInstance` ADD COLUMN `HubID` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL;

ALTER TABLE `SensorInstance`
  ADD CONSTRAINT `sensorinstance_ibfk_3` FOREIGN KEY (`HubID`) REFERENCES `Room` (`hubid`) ON DELETE CASCADE;

INSERT INTO SensorInstance (SensorID, SensorTypeID, LocationID, HubID) VALUES ('Temp sen', 1, 1, 'B8-27-EB-C9-FD-4A');