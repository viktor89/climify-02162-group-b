ALTER TABLE SensorInstance DROP FOREIGN KEY sensorinstance_ibfk_3; ALTER TABLE SensorInstance ADD CONSTRAINT sensorinstance_ibfk_3 FOREIGN KEY (HubID) REFERENCES Room(hubid) ON DELETE CASCADE ON UPDATE CASCADE;