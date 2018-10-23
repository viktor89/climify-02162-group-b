package com.groupb

import org.eclipse.paho.client.mqttv3._
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence
import java.util.concurrent._
import scalaj.http._
import com.paulgoldbaum.influxdbclient._
import scala.concurrent.ExecutionContext.Implicits.global

/**
 * @author pll
 */
object App extends App {
  val influxdb = InfluxDB.connect("localhost", 8086, "openhab", "AnotherSuperbPassword456-")
  val database = influxdb.selectDatabase("openhab_db")
  val executor = new ScheduledThreadPoolExecutor(1)
  val task = new Runnable {
    def run() = {
      InfluxDBHandler.clearDB(database)(Sequencer.transmitData(HttpHandler)(InfluxDBHandler.readData(database)))
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

  HttpHandler.postRequest("http://se2-webapp02.compute.dtu.dk/api/v2/sensor/register.php",
    JsonMapper.wrapForTransport(MACAddress.computeMAC, "[]"))
  val future = executor.scheduleAtFixedRate(task, 2, 5, TimeUnit.SECONDS)

  sys.addShutdownHook({
    println("Shutdown")
    future.cancel(false)
    influxdb.close()
    System.exit(0)
  })
  subscribeToMQTT
}
