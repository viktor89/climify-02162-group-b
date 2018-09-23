/******************* Adminbruger START *******************/

// USERNAME: "admin", PASSWORD: "1234".

CREATE TABLE IF NOT EXISTS icm_users_admin (
      userID int NOT NULL AUTO_INCREMENT primary key,
      userName varchar(30) NOT NULL,
      userPassword varchar(64) NOT NULL,
      lastLogin varchar(20),
      userBlocked tinyint(1) NOT NULL DEFAULT '0'
);

INSERT INTO icm_users_admin (userName, userPassword, lastLogin, userBlocked) 
VALUES ("admin", "$2y$10$AF1AuoWb0Ku3E3C72uwgAu8h8ehgttDpKx32q.WpFqq8KowYHAILa", "", "1");

/******************* Adminbruger SLUT *******************/

/******************* Firmabruger START *******************/

CREATE TABLE IF NOT EXISTS icm_users_company (
      companyID int NOT NULL AUTO_INCREMENT primary key,
      companyName varchar(255) NOT NULL,
      companyContactFirstName varchar(255) NOT NULL,
      companyContactLastName varchar(255) NOT NULL,
      companyAddressStreet1 varchar(255) NOT NULL,
      companyAddressStreet2 varchar(255),
      companyAddressCity varchar(255) NOT NULL,
      companyAddressZip int(6) NOT NULL,
      companyEmail varchar(255) NOT NULL,
      companyPhone1 varchar(255) NOT NULL,
      companyPhone2 varchar(255),
      companyCreateDate varchar(255) NOT NULL,
      loginName varchar(255) NOT NULL DEFAULT '0',
      loginPassword varchar(255) NOT NULL DEFAULT '0',
      lastICMeterSync varchar(255),
      userBlocked tinyint(1) NOT NULL DEFAULT '0',
      token varchar(32) NOT NULL DEFAULT '0'
);

/******************* Firmabruger SLUT *******************/

/******************* Systembrugere START *******************/

CREATE TABLE IF NOT EXISTS icm_users_system (
	userID int NOT NULL AUTO_INCREMENT primary key,
	userName varchar(255) NOT NULL,
	userPassword varchar(255) NOT NULL,
	role int NOT NULL,
	eMail varchar(255),
	firstName varchar(255),
	lastName varchar(255),
	schoolAllowed varchar(255),
      lastLogin varchar(20),
      userBlocked tinyint NOT NULL DEFAULT '1'
);

/******************* Systembrugere SLUT *******************/

/******************* Forbind brugertabeller START *******************/

CREATE TABLE IF NOT EXISTS icm_users_company_system (
      companyID int,
      userID int,
      FOREIGN KEY (companyID) REFERENCES icm_users_company(companyID) ON DELETE SET NULL,
      FOREIGN KEY (userID) REFERENCES icm_users_system(userID) ON DELETE SET NULL
);

/******************* Forbindbruger tabeller SLUT *******************/

/******************* Bygningstabeller START *******************/

CREATE TABLE IF NOT EXISTS icm_buildings (
      buildingID int NOT NULL AUTO_INCREMENT primary key,
	buildingName varchar(40) NOT NULL,
      buildingDecription varchar(255),
      WeatherLocationID MEDIUMINT
);

CREATE TABLE IF NOT EXISTS icm_users_company_buildings (
      companyID int,
      userID int,
      FOREIGN KEY (companyID) REFERENCES icm_users_company(companyID) ON DELETE SET NULL,
      FOREIGN KEY (buildingID) REFERENCES icm_buildings(buildingID) ON DELETE SET NULL
);

/******************* Bygningstabeller SLUT *******************/

/******************* Systemtabeller START *******************/

CREATE TABLE IF NOT EXISTS icm_maps (
      mapID int NOT NULL AUTO_INCREMENT primary key,
      fileName varchar(255),
      alias varchar(255),
      school varchar(255)
);

CREATE TABLE IF NOT EXISTS icm_ic_meters (
      boxQR varchar(10) NOT NULL primary key,
      boxName varchar(255),
      alias varchar(255) DEFAULT '',
      xData varchar(255) DEFAULT '',
      school varchar(255),
      ceilingHeight varchar(255),
      floorArea varchar(255),
      fromDate varchar(255),
      lastMeasurementDate varchar(255),
      mapID int,
      xAxes int(2),
      yAxes int(2),
      FOREIGN KEY (mapID) REFERENCES icm_maps(mapID) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS icm_messages (
      messageID int NOT NULL AUTO_INCREMENT primary key,
      messageType int(255) NOT NULL,
      school varchar(255) NOT NULL,
      title varchar(255) NOT NULL,
      body text NOT NULL,
      postDate varchar(255) NOT NULL,
      author int,
      icMeter varchar(255),
      FOREIGN KEY (author) REFERENCES icm_users_system(userID) ON DELETE SET NULL,
      FOREIGN KEY (icMeter) REFERENCES icm_ic_meters(boxQR) ON DELETE SET NULL
);

/******************* Systemtabeller SLUT *******************/

/******************* Undervisningsplatform START *******************/

CREATE TABLE IF NOT EXISTS uvm_content (
      contentID int NOT NULL AUTO_INCREMENT primary key,
      school varchar(255) NOT NULL,
      title varchar(255) NOT NULL,
      decription varchar(255) NOT NULL,
      delta LONGBLOB NOT NULL,
      postDate varchar(255) NOT NULL,
      author int,
      teashLevel int,
      FOREIGN KEY (author) REFERENCES icm_users_system(userID) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS uvm_tags (
      tagID int NOT NULL AUTO_INCREMENT primary key,
      tagTitle varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS uvm_content_tags (
      contentID int,
      tagID int,
      FOREIGN KEY (contentID) REFERENCES uvm_content(contentID) ON DELETE SET NULL,
      FOREIGN KEY (tagID) REFERENCES uvm_tags(tagID) ON DELETE SET NULL
);

/******************* Undervisningsplatform SLUT *******************/