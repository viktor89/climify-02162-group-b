package com.groupb

import org.eclipse.paho.client.mqttv3._
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence
import com.paulgoldbaum.influxdbclient._
import scala.language.postfixOps
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._
import akka.actor.{Actor, ActorSystem, ActorRef, Props}
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
  
  val mac = MACAddress.computeMAC
  println(mac)

  val registerMsg = DataMessage(mac, JsonMapper.toJson(ItemFetcher.getOpenHABList(HttpHandler)))
  HttpHandler.postRequest(registerURL, JsonMapper.toJson(registerMsg))

  val transmitter = Transmission(database, HttpHandler)
  val system = ActorSystem()
  val transmissionActor = system.actorOf(Props(new TransmissionActor(transmitter)), name = "TransmissionActor")
  val msgHandler = system.actorOf(Props(new MessageActor(HttpHandler)), name = "MessageHandler")
  val scheduler = system.scheduler.schedule(2 seconds, 1 minutes, transmissionActor, "send")

  val brokerURL = endpointConfig.getString("endpoints.mqtt")
  val persistance = new MemoryPersistence
  val client = new MqttClient(brokerURL, MqttClient.generateClientId, persistance)
  client.connect
  client.subscribe(mac)
  val callback = new MQTTHandler(msgHandler)
  client.setCallback(callback)
}
