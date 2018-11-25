CREATE TABLE RuleType ( id INT NOT NULL AUTO_INCREMENT , type VARCHAR(50) NOT NULL , unit VARCHAR(10) NOT NULL , PRIMARY KEY (id));
# Insert default values
INSERT INTO RuleType(id, type, unit) VALUES (NULL, 'Temperature', '°C');
INSERT INTO RuleType(id, type, unit) VALUES (NULL, 'Humidity', '%');
INSERT INTO RuleType(id, type, unit) VALUES (NULL, 'CO2 Level', 'ppm');