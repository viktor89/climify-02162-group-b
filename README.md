# Climify

## Web service
We've extended skoleklima with React components and a new API. This approach has been chosen as it best suits a gradual re-write of the codebase into a more structured version. This way we're keeping the old stuff running alongside new features we implement. However there are some of the original files that has been modified during the development:
- The SQL files in data/export
- Chronograf has been added. The file for it is in data/Chronograf
- api-get-sensor-on-school.php (located in web/public/api)
- api-get-building.php (located in web/public/api)
- api-get-company-info.php (located in web/public/api)
- api-get-influx-info.php (located in web/public/api)
- api-get-sensor-on-school.php (located in web/public/api)
- api-user-login.php (located in web/public/api)

### React
The react source code is located in the react folder. This is transpiled with babel into a single executable javascript-file which we run in the web-app. The files that constitutes the React functionality in the web application are as follows (but not limited to the actually listed files)
- react/src/index.js
- react/src/component/LocationSelector.css
- react/src/component/LocationSelector.js
- react/src/component/PendingHubsTable.js
- react/src/component/PendingSensorsTable.js
- react/src/component/RegisteredHubsTable.js
- react/src/component/RolesTable.js
- react/src/component/SensorsTable.js
- react/src/component/UsersTable.js
- react/src/container/Graphs.js
- react/src/container/ManageInstitution.js
- react/src/container/ManageSensors.js
- react/src/container/ManageUsers.js

### Api V2
The new API is located in web/public/api/v2. In here we've built a class-based api instead of the old sequential api. The actual files that consititutes the new API are as follows (but not limited to the actually listed files)
- Api.php
- InfluxDBClient.php
- MQTTService.php
- Validator.php
- AuthorizationException.php (located in the folder web/public/api/v2/exceptions)
- ValidationException.php (located in the folder web/public/api/v2/exceptions)
- HubDAO.php (located in the folder web/public/api/v2/hub)
- add.php (located in the folder web/public/api/v2/hub)
- approve.php (located in the folder web/public/api/v2/hub)
- getPendingHubs.php (located in the folder web/public/api/v2/hub)
- getRegisteredHubs.php (located in the folder web/public/api/v2/hub)
- remove.php (located in the folder web/public/api/v2/hub)
- update.php (located in the folder web/public/api/v2/hub)
- Institution.php (located in the folder web/public/api/v2/institution)
- getBuildings.php (located in the folder web/public/api/v2/institution)
- getInstitutions.php (located in the folder web/public/api/v2/institution)
- RoleDAO.php (located in the folder web/public/api/v2/roles)
- getRoles.php (located in the folder web/public/api/v2/roles)
- RoomDAO.php (located in the folder web/public/api/v2/room)
- getRooms.php (located in the folder web/public/api/v2/room)
- SensorDAO.php (located in the folder web/public/api/v2/sensor)
- approve.php (located in the folder web/public/api/v2/sensor)
- getData.php (located in the folder web/public/api/v2/sensor)
- getPendingSensors.php (located in the folder web/public/api/v2/sensor)
- getSensors.php (located in the folder web/public/api/v2/sensor)
- register.php (located in the folder web/public/api/v2/sensor)
- remove.php (located in the folder web/public/api/v2/sensor)
- send.php (located in the folder web/public/api/v2/sensor)
- UserDAO.php (located in the folder web/public/api/v2/users)
- getUsers.php (located in the folder web/public/api/v2/users)

## Raspberry Pi
The following section will describe how to setup openHAB and the client software on the Raspberry Pi.

### openHAB
The generalized setup for openHAB can be found in the following links:
- https://www.openhab.org/docs/installation/linux.html#installation
- https://community.openhab.org/t/influxdb-grafana-persistence-and-graphing/13761

The Linux installation has been tested with Raspbian 9 Stretch using the installation steps described in the Apt section, which is given here again for the sake of brewity. 
- The openHAB2 repository should be added on Raspbian 9 Stretch, which is done by executing the following commands on the Raspberry Pi (This will add the repository for the stable version of openHAB):
```bash
wget -qO - 'https://bintray.com/user/downloadSubjectPublicKey?username=openhab' | sudo apt-key add -
sudo apt-get install apt-transport-https
echo 'deb https://dl.bintray.com/openhab/apt-repo2 stable main' | sudo tee /etc/apt/sources.list.d/openhab2.list
```
- The local repository should be resynchronized using the following command
```bash
sudo apt update
```
- openHAB can then be installed by executing the following command
```bash
sudo apt install openHAB2 openHAB2-addons
```
- Since Raspbian 9 uses SystemD openHAB can be started automatically by executing the following commands
```bash
sudo systemctl enable openHAB2
sudo systemctl start openHAB2
```

The InfluxDB installation and setup within openHAB follows the steps given in the link without any additional steps. But as with the setup of openHAB the required steps will be given here as well:
- The repository for InfluxDB can be added by executing the following commands
```bash
curl -sL https://repos.influxdata.com/influxdb.key | sudo apt-key add -
echo "deb https://repos.influxdata.com/debian stretch stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
```
This will add the InfluxDB specifically for the Debian 9 Stretch on which Raspbian 9 is based on.
- The local repository should be resynchronized using the following command
```bash
sudo apt update
```
- InfluxDB can then be installed by executing the following command
```bash
sudo apt install influxdb
```
- Since Raspbian 9 uses SystemD openHAB can be started automatically by executing the following commands
```bash
sudo systemctl enable influxdb
sudo systemctl start influxdb
```
- The final steps for setting up the InfluxDB and connecting it to openHAB is given in the following sections on https://community.openhab.org/t/influxdb-grafana-persistence-and-graphing/13761
  - InfluxDB Installation and Setup. It should be noted that the database must have a retention policy of 1 day.
```bash
CREATE DATABASE openhab_db WITH DURATION 1d
```
  - Connecting openHAB to InfluxDB (use the default address 127.0.0.1:8086 in the /etc/openhab2/services/influxdb.cfg file)

The final part of the openHAB setup is installing the Z-Wave binding, which was done after starting up openHAB for the first time. The binding can be installed using the Paper UI by clicking on Extensions and then search for Z-Wave under the Bindings tab.
After setting up the Z-wave binding then go into Configuration and set the Auto Items to active. This will automatically setup the required entries in the Influx database, which will later be transferred to Climify.

### Client
The client software for the Raspberry Pi can be found in raspiclient folder. It is a Maven project that requires the following items:
- Java Development Kit version 8 or newer: https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html
- Maven: https://maven.apache.org/
- A Scala 2.12 or newer compiler (Note the binaries for the different platforms is at the bottom of the page): https://www.scala-lang.org/download/

Once all the above items have been successfully installed then go into the raspiclient folder and type mvn package. This will download all the dependencies for the project and give two resulting jar files. The first jar file contains only the project's source code and the second one contains the source code plus dependencies.
The jar with the dependencies must then be transferred to the Raspberry Pi, which can done either using a USB stick or using scp. The jar file can then be executed on the Pi using the command java -jar raspiclient-0.0.1-jar-with-dependencies.jar.

The source code for client is in the raspiclient/src/main/scala/com/groupb folder and the units tests related to different classes is in src/test/scala/com/groupb.

### Current issues/improvements
- MQTT broker: In the original release the client used broker.mqttdashboard.com as its broker. The address of it was hard-coded into the original version. This has now be fixed such that addresses to external locations are not hard-coded into the client itself. As it stands now all the external endpoints are defined in src/main/resources/endpoints.conf file, which allows the client itself to be reconfigured between builds. The current broker is still broker.mqttdashboard.com, but it will now be easier to switch the broker to self-hosted broker on the Climify server, which in turn that an intruder would have to gain access to the self-hosted broker in order to manipulate the client.
- Protocol improvements: The current version of the client still uses the basic version of the protocol, but it can be improved by either adding additional information to the http response or having an additional message arriving via MQTT. The additional information can then be used to determine how many of the transmitted data points that has been stored and also what data points that has been transferred successfully. Based on this the actually stored data can be removed from the Raspberry Pi's InfluxDB and thereby minimise the data duplication in the individual transmissions.
- The communication with Climify's and OpenHAB's REST API: Is implemented using the library scalaj-http, which can make different kinds of http requests. The consumation of the RESP APIs could be potentially improved by using e.g. akka-http (https://github.com/akka/akka-http) or Spring, but at this point in time the simplicity of scalaj-http along with the Jackson library for handling JSON messages is preferrable to introducing a new library.
