package com.groupb

import org.eclipse.paho.client.mqttv3._
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence
import com.paulgoldbaum.influxdbclient._
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._
import akka.actor.{Actor, ActorSystem, ActorRef, Props}

/**
  * @author pll
  */
object App extends App {
  val influxdb = InfluxDB.connect("localhost", 8086, "openhab", "AnotherSuperbPassword456-")
  val database = influxdb.selectDatabase("openhab_db")
  val brokerURL = s"tcp://broker.mqttdashboard.com:1883"
  val topic = "qwe123"
  val persistance = new MemoryPersistence
  val client = new MqttClient(brokerURL, MqttClient.generateClientId, persistance)
  client.connect
  client.subscribe(topic)
  val callback = new MQTTHandler(HttpHandler)
  client.setCallback(callback)

  HttpHandler.postRequest("http://se2-webapp02.compute.dtu.dk/api/v2/sensor/register.php",
    JsonMapper.wrapForTransport(MACAddress.computeMAC, "[]"))

  val system = ActorSystem()
  val transmissionActor = system.actorOf(Props(new TransmissionActor(database, HttpHandler)), name = "TransmissionActor")
  val taskControl = system.scheduler.schedule(2 seconds, 5 minutes) {
    transmissionActor ! "send"
  }

  sys.addShutdownHook({
    println("Shutdown")
    client.disconnect
    taskControl.cancel
    influxdb.close
    System.exit(0)
  })
}
