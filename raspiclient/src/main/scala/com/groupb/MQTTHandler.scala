package com.groupb

import org.eclipse.paho.client.mqttv3._

class MQTTHandler extends MqttCallback {
  override def messageArrived(topic: String, message: MqttMessage) = {
    val action = JsonMapper.convert[Message](message.toString)
    action.act
  }

  override def connectionLost(cause: Throwable) = {
    println(cause.toString)
  }

  override def deliveryComplete(token: IMqttDeliveryToken) = {
    println(s"Delivered Message :${token.getMessage}")
  }
}
