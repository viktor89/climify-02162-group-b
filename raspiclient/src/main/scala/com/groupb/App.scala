package com.groupb

import org.eclipse.paho.client.mqttv3._
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence

/**
 * @author pll
 */
object App extends App {

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

  subscribeToMQTT
}
