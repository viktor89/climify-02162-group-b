package com.groupb

import org.eclipse.paho.client.mqttv3._
import scalaj.http._

trait HttpConnection {
  def getRequest(url : String) : HttpResponse[String]
  def postRequest(url : String, data : String) : HttpResponse[String]
}

object HttpHandler extends HttpConnection {
  def getRequest(url : String) = Http(url).asString
  def postRequest(url : String, data : String) = Http(url).postData(data).asString
}

class MQTTHandler(val handler : HttpConnection) extends MqttCallback {
  def act(msg : Message) = {
    msg match {
      case ApproveThing(name) =>
        handler.postRequest("http://localhost:8080/rest/inbox/" + name + "/approve", name)
      case TState(uuid, temp) =>
        handler.postRequest("http://localhost:8080/rest/items/" + uuid, Integer.toString(temp))
      case ViewInbox() =>
        handler.postRequest("http://localhost:8080/rest/discovery/bindings/zwave/scan", "")
        val response = handler.getRequest("http://localhost:8080/rest/inbox")
        handler.postRequest("http://se2-webapp02.compute.dtu.dk/api/v2/sensor/inbox/",
          JsonMapper.wrapForTransport(MACAddress.computeMAC, JsonMapper.toJson(response.body)))
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
