# Climify

## Web service
The files for the web service is given web/public.

## Raspberry Pi
The following section will describe how to setup openHAB and the client software on the Raspberry Pi.

### openHAB
The generalized setup for openHAB can be found in the following links:
- https://www.openhab.org/docs/installation/linux.html#installation
- https://community.openhab.org/t/influxdb-grafana-persistence-and-graphing/13761

The Linux installation has been tested with Raspbian 9 Stretch using the installation steps described in the Apt section, which is given here again for the sake of brewity. 
- The openHAB2 repository should be added on Raspbian 9 Stretch, which is done by executing the following commands on the Raspberry Pi (This will add the repository for the stable version of openHAB):
wget -qO - 'https://bintray.com/user/downloadSubjectPublicKey?username=openhab' | sudo apt-key add -
sudo apt-get install apt-transport-https
echo 'deb https://dl.bintray.com/openhab/apt-repo2 stable main' | sudo tee /etc/apt/sources.list.d/openhab2.list
- The local repository should be resynchronized using the following command
sudo apt update
- openHAB can then be installed by executing the following command
sudo apt install openHAB2 openHAB2-addons
- Since Raspbian 9 uses SystemD openHAB can be started automatically by executing the following commands
sudo systemctl enable openHAB2
sudo systemctl start openHAB2

The InfluxDB installation and setup within openHAB follows the steps given in the link without any additional steps. But as with the setup of openHAB the required steps will be given here as well:
- The repository for InfluxDB can be added by executing the following commands
curl -sL https://repos.influxdata.com/influxdb.key | sudo apt-key add -
echo "deb https://repos.influxdata.com/debian stretch stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
This will add the InfluxDB specifically for the Debian 9 Stretch on which Raspbian 9 is based on.
- The local repository should be resynchronized using the following command
sudo apt update
- InfluxDB can then be installed by executing the following command
sudo apt install influxdb
- Since Raspbian 9 uses SystemD openHAB can be started automatically by executing the following commands
sudo systemctl enable influxdb
sudo systemctl start influxdb
- The final steps for setting up the InfluxDB and connecting it to openHAB is given in the following sections on https://community.openhab.org/t/influxdb-grafana-persistence-and-graphing/13761
  - InfluxDB Installation and Setup
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
