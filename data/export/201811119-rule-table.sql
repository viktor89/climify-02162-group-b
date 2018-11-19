CREATE TABLE Rule ( id INT NOT NULL AUTO_INCREMENT , type VARCHAR(50) NOT NULL , unit VARCHAR(10) NOT NULL , PRIMARY KEY (id));
# Insert default values
INSERT INTO Rule(id, type, unit) VALUES (NULL, 'Temperature', '°C');
INSERT INTO Rule(id, type, unit) VALUES (NULL, 'Humidity', '%');
INSERT INTO Rule(id, type, unit) VALUES (NULL, 'CO2 Level', 'ppm');