package com.groupb

import org.eclipse.paho.client.mqttv3._
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence
import java.util.concurrent._
import scalaj.http._

/**
 * @author pll
 */
object App extends App {
  val executor = new ScheduledThreadPoolExecutor(1)
  val task = new Runnable {
    def run() = {
      val data = InfluxDBHandler.readData
      val body = Http("http://se2-webapp02.compute.dtu.dk/api/v2/sensor/send/")
        .postData(JsonMapper.wrapForTransport(MACAddress.computeMAC, data))
        .asString
      if (body.code == 200) {
        InfluxDBHandler.clearDB
      }
    }
  }

  def subscribeToMQTT() = {
    val brokerURL = s"tcp://broker.mqttdashboard.com:8000"
    val topic = "qwe123"
    val persistance = new MemoryPersistence
    val client = new MqttClient(brokerURL, MqttClient.generateClientId, persistance)
    client.connect
    client.subscribe(topic)
    val callback = new MQTTHandler(HttpHandler)
    client.setCallback(callback)
  }

  Http("http://se2-webapp02.compute.dtu.dk/api/v2/sensor/register/")
    .postData(JsonMapper.wrapForTransport(MACAddress.computeMAC, "[]"))
    .asString
  val future = executor.scheduleAtFixedRate(task, 2, 5, TimeUnit.SECONDS)

  sys.addShutdownHook({
    println("Shutdown")
    future.cancel(false)
    System.exit(0)
  })
  subscribeToMQTT
}
