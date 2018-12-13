package com.groupb

import org.eclipse.paho.client.mqttv3.{ MqttCallback, MqttMessage, IMqttDeliveryToken }
import akka.actor.ActorRef
import scala.util.{ Success, Failure }

class MQTTHandler(val msgHandler : ActorRef) extends MqttCallback {
  override def messageArrived(topic: String, message: MqttMessage) = {
    JsonMapper.convert[Message](message.toString) match {
      case Success(msg) => msgHandler ! msg
      case Failure(e) => msgHandler ! "Invalid JSON"
    }
  }

  override def connectionLost(cause: Throwable) = {
    msgHandler ! Log(cause.toString)
  }

  override def deliveryComplete(token: IMqttDeliveryToken) = {
    println(s"Delivered Message :${token.getMessage}")
  }
}
