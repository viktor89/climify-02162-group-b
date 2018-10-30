package com.groupb

import org.eclipse.paho.client.mqttv3._
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence
import com.paulgoldbaum.influxdbclient._
import scala.language.postfixOps
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._
import akka.actor.{Actor, ActorSystem, ActorRef, Props, PoisonPill}
import com.typesafe.config.ConfigFactory

/**
  * @author pll
  */
object App extends App {
  val influxdbConfig = ConfigFactory.load("influxdb")
  val endpointConfig = ConfigFactory.load("endpoints")
  val registerURL = endpointConfig.getString("endpoints.register")

  val influxdb = InfluxDB.connect(influxdbConfig.getString("influxdb.address"),
    influxdbConfig.getInt("influxdb.port"),
    influxdbConfig.getString("influxdb.user"),
    influxdbConfig.getString("influxdb.password"))
  val database = influxdb.selectDatabase(influxdbConfig.getString("influxdb.dbname"))
  val brokerURL = endpointConfig.getString("endpoints.mqtt")
  val topic = "qwe123"
  val persistance = new MemoryPersistence
  val client = new MqttClient(brokerURL, MqttClient.generateClientId, persistance)
  client.connect
  client.subscribe(topic)
  val callback = new MQTTHandler(HttpHandler)
  client.setCallback(callback)

  HttpHandler.postRequest(registerURL, JsonMapper.toJson(MacMessage(MACAddress.computeMAC)))

  val transmitter = Transmission(database, HttpHandler)
  val system = ActorSystem()
  val transmissionActor = system.actorOf(Props(new TransmissionActor(transmitter)), name = "TransmissionActor")
  val scheduler = system.scheduler.schedule(2 seconds, 5 minutes, transmissionActor, "send") 

  sys.addShutdownHook({
    println("Shutdown")
    client.disconnect
    scheduler.cancel
    transmissionActor ! PoisonPill
    influxdb.close
    System.exit(0)
  })
}
