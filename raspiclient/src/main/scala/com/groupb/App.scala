package com.groupb

import org.eclipse.paho.client.mqttv3._
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence
import java.util.concurrent._

/**
 * @author pll
 */
object App extends App {
  val executor = new ScheduledThreadPoolExecutor(1)
  val task = new Runnable {
    def run(): Unit = {
      val data = InfluxDBHandler.readData
      val msg = new RootMessage(data)
      val body = HTTPHandler.postRequest("http://se2-webapp02.compute.dtu.dk/send",
        JsonMapper.toJson(msg))
      if (body == "200") {
        InfluxDBHandler.clearDB
      }
    }
  }

  def subscribeToMQTT() : Unit = {
    val brokerURL = s"tcp://broker.mqttdashboard.com:8000"
    val topic = "qwe123"
    val persistance = new MemoryPersistence
    val client = new MqttClient(brokerURL, MqttClient.generateClientId, persistance)
    client.connect
    client.subscribe(topic)
    val callback = new MQTTHandler
    client.setCallback(callback)
  }

  HTTPHandler.postRequest("http://se2-webapp02.compute.dtu.dk/register", MACAddress.computeMAC)
  executor.scheduleAtFixedRate(task, 2, 5, TimeUnit.SECONDS)
  subscribeToMQTT
}
