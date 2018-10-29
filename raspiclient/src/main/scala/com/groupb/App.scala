package com.groupb

import org.eclipse.paho.client.mqttv3._
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence
import com.paulgoldbaum.influxdbclient._
import scala.concurrent.ExecutionContext.Implicits.global
import akka.actor.{Actor, ActorSystem, ActorRef, Props}
import com.typesafe.akka.extension.quartz.QuartzSchedulerExtension
import com.typesafe.config.ConfigFactory

/**
  * @author pll
  */
object App extends App {
  val registerURL = ConfigFactory.load("endpoints").getString("endpoints.register")

  val influxdb = InfluxDB.connect("localhost", 8086, "openhab", "AnotherSuperbPassword456-")
  val database = influxdb.selectDatabase("openhab_db")
  val brokerURL = ConfigFactory.load("endpoints").getString("endpoints.mqtt")
  val topic = "qwe123"
  val persistance = new MemoryPersistence
  val client = new MqttClient(brokerURL, MqttClient.generateClientId, persistance)
  client.connect
  client.subscribe(topic)
  val callback = new MQTTHandler(HttpHandler)
  client.setCallback(callback)

  HttpHandler.postRequest(registerURL, JsonMapper.wrapForTransport(MACAddress.computeMAC, "[]"))

  val transmitter = Transmission(database, HttpHandler)
  val system = ActorSystem()
  val transmissionActor = system.actorOf(Props(new TransmissionActor(transmitter)), name = "TransmissionActor")
  val scheduler = QuartzSchedulerExtension(system)
  scheduler.schedule("Every5Minutes", transmissionActor, "send")

  sys.addShutdownHook({
    println("Shutdown")
    client.disconnect
    scheduler.shutdown(_)
    influxdb.close
    System.exit(0)
  })
}
