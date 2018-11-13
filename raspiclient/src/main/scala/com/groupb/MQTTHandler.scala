package com.groupb

import org.eclipse.paho.client.mqttv3._
import scalaj.http._
import com.typesafe.config.ConfigFactory

class MQTTHandler(val handler : HttpConnection) extends MqttCallback {
  def act(msg : Message) = {
    msg match {
      case ApproveThing(name) =>
        handler.postRequest("http://localhost:8080/rest/inbox/" + name + "/approve", name)
      case TState(uuid, temp) =>
        handler.postRequest("http://localhost:8080/rest/items/" + uuid, temp)
      case ViewInbox() =>
        val inboxURL = ConfigFactory.load("endpoints").getString("endpoints.inbox")
        handler.postRequest("http://localhost:8080/rest/discovery/bindings/zwave/scan", "")
        val response = handler.getRequest("http://localhost:8080/rest/inbox")
        response match {
          case Some(resp) => handler.postRequest(inboxURL, JsonMapper.toJson(DataMessage(MACAddress.computeMAC, JsonMapper.toJson(resp.body))))
          case None => None
        }
    }
  }

  override def messageArrived(topic: String, message: MqttMessage) = {
    JsonMapper.convert[Message](message.toString) match {
      case Some(msg) => act(msg)
      case None => println("Invalid message")
    }
  }

  override def connectionLost(cause: Throwable) = {
    println(cause.toString)
  }

  override def deliveryComplete(token: IMqttDeliveryToken) = {
    println(s"Delivered Message :${token.getMessage}")
  }
}
