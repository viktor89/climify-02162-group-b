# Climify

## Web service
The files for the web service is given web/public.

## Raspberry Pi
The following section will describe how to setup openHAB and the client software on the Raspberry Pi.

### openHAB

The generalized setup for openHAB can be found in the following links:
- https://www.openhab.org/docs/installation/linux.html#installation
- https://community.openhab.org/t/influxdb-grafana-persistence-and-graphing/13761

The Linux installation has been tested with Raspbian 9 Stretch using the installation steps described in the Apt section. The InfluxDB installation and setup within openHAB follows the steps given in the link without any additional steps.
The final part of the openHAB setup is installing the Z-Wave binding, which was done after starting up openHAB for the first time. The binding can be installed using the Paper UI by clicking on Extensions and then search for Z-Wave under the Bindings tab.
After setting up the Z-wave binding then go into Configuration and set the Auto Items to active. This will automatically setup the required entries in the Influx database, which will later be transferred to Climify.

### Client
The client software for the Raspberry Pi can be found in raspiclient folder. It is a Maven project that requires the following items:
- Java Development Kit version 8 or newer: https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html
- Maven: https://maven.apache.org/
- A Scala 2.12 or newer compiler (Note the binaries for the different platforms is at the bottom of the page): https://www.scala-lang.org/download/

Once all the above items have been successfully installed then go into the raspiclient folder and type mvn package. This will download all the dependencies for the project and give two resulting jar files. The first jar file contains only the project's source code and the second one contains the source code plus dependencies.
The jar with the dependencies must then be transferred to the Raspberry Pi, which can done either using a USB stick or using scp. The jar file can then be executed on the Pi using the command java -jar raspiclient-0.0.1-jar-with-dependencies.jar.

The source code for client is in the raspiclient/src/main/scala/com/group folder.
