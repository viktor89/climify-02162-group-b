/******************* SQL der ikke længer benyttes *******************/





// USER NAME: "admin", PASSWORD: "admin".

CREATE TABLE IF NOT EXISTS icm_ic_meter_login (
      loginID int NOT NULL AUTO_INCREMENT primary key,
      loginName varchar(255) NOT NULL,
      loginPassword varchar(255) NOT NULL,
      lastICMeterSync varchar(255),
      token varchar(255)
);

INSERT INTO icm_ic_meter_login (loginID, loginName, loginPassword) 
VALUES (1, "username", "password");

SET GLOBAL event_scheduler = ON;

CREATE EVENT update_token
    ON SCHEDULE
      EVERY 1 DAY
    DO
      UPDATE `icm_ic_meter_login` SET `token`=concat(
              char(round(rand()*25)+97),
              char(round(rand()*25)+97),
              char(round(rand()*25)+97),
              char(round(rand()*25)+97),
              '-',
              char(round(rand()*25)+97),
              char(round(rand()*25)+97),
              char(round(rand()*25)+97),
              char(round(rand()*25)+97),
              '-',
              char(round(rand()*25)+97),
              char(round(rand()*25)+97),
              char(round(rand()*25)+97),
              char(round(rand()*25)+97),
              '-',
              char(round(rand()*25)+97),
              char(round(rand()*25)+97),
              char(round(rand()*25)+97),
              char(round(rand()*25)+97),
              '-',
              char(round(rand()*25)+97),
              char(round(rand()*25)+97),
              char(round(rand()*25)+97),
              char(round(rand()*25)+97)
             );

INSERT INTO icm_users (userName, userPassword, role, eMail, firstName, schoolAllowed) 
VALUES ("admin", "igPe+bqW4DODaueTlB6FZYl9ZlTW7o1I4fjJmueD58Q=", "1", "", "", "") ;

// USER: admin - PASS: admin             