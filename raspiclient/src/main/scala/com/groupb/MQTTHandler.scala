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
        val dataMsg = DataMessage(MACAddress.computeMAC, JsonMapper.toJson(response.body))
        handler.postRequest(inboxURL, JsonMapper.toJson(dataMsg))
    }
  }

  override def messageArrived(topic: String, message: MqttMessage) = {
    val msg = JsonMapper.convert[Message](message.toString)
    act(msg)
  }

  override def connectionLost(cause: Throwable) = {
    println(cause.toString)
  }

  override def deliveryComplete(token: IMqttDeliveryToken) = {
    println(s"Delivered Message :${token.getMessage}")
  }
}
