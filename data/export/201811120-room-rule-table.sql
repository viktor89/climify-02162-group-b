CREATE TABLE RoomRule ( id INT NOT NULL AUTO_INCREMENT , RoomId VARCHAR(30) NOT NULL, RuleId INT NOT NULL, PRIMARY KEY (id));
# Add foreign key constraints
ALTER TABLE RoomRule ADD CONSTRAINT fk_rule_id FOREIGN KEY (RuleId) REFERENCES Rule(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE RoomRule ADD CONSTRAINT fk_room_id FOREIGN KEY (RoomId) REFERENCES Room(HubID) ON DELETE CASCADE ON UPDATE CASCADE; 