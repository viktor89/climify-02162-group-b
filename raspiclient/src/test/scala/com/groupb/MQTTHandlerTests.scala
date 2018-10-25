package com.groupb

import scalaj.http._
import com.fasterxml.jackson.core.JsonParseException
import com.fasterxml.jackson.databind.JsonMappingException
import org.eclipse.paho.client.mqttv3.{MqttDeliveryToken, MqttMessage}
import org.scalatest.{FlatSpec, Matchers}
import org.scalamock.scalatest.MockFactory

class MQTTHandlerTests extends FlatSpec with Matchers with MockFactory {
  val responseMap = Map[String, IndexedSeq[String]]()

  "A MQTTHandler" should "handle a lost connection" in {
    val handler = new MQTTHandler(HttpHandler)
    handler.connectionLost(new Throwable())
  }

  it should "handle recieving a delivery token" in {
    val handler = new MQTTHandler(HttpHandler)
    handler.deliveryComplete(new MqttDeliveryToken("test"))
  }

  it should "act upon an ApproveThing message" in {
    val mockHandler = mock[HttpConnection]
    (mockHandler.postRequest _)
      .expects("http://localhost:8080/rest/inbox/test/approve", "test")
      .returns(new HttpResponse[String]("", 200, responseMap))

    val handler = new MQTTHandler(mockHandler)
    val approveThing = ApproveThing("test")
    val response = handler.act(approveThing)
    response.body should be ("")
    response.code should be (200)
    response.headers should be (responseMap)
  }

  it should "act upon a TState message" in {
    val mockHandler = mock[HttpConnection]
    (mockHandler.postRequest _)
      .expects("http://localhost:8080/rest/items/test", "20")
      .returns(new HttpResponse[String]("", 200, responseMap))

    val handler = new MQTTHandler(mockHandler)
    val tstate = TState("test", 20)
    val response = handler.act(tstate)
    response.body should be ("")
    response.code should be (200)
    response.headers should be (responseMap)
  }

  it should "act upon a ViewInbox message" in {
    val mockHandler = mock[HttpConnection]

    inSequence {
      (mockHandler.postRequest _)
        .expects("http://localhost:8080/rest/discovery/bindings/zwave/scan", "")
        .returns(new HttpResponse[String]("", 200, responseMap))
      (mockHandler.getRequest _)
        .expects("http://localhost:8080/rest/inbox")
        .returns(new HttpResponse[String]("", 200, responseMap))
      (mockHandler.postRequest _)
        .expects("http://se2-webapp02.compute.dtu.dk/api/v2/sensor/inbox.php", JsonMapper.wrapForTransport(MACAddress.computeMAC, "\"\""))
        .returns(new HttpResponse[String]("", 200, responseMap))

    }
    val handler = new MQTTHandler(mockHandler)
    val viewInbox = ViewInbox()
    val response = handler.act(viewInbox)
    response.body should be ("")
    response.code should be (200)
    response.headers should be (responseMap)
  }

  it should "handle a MQTTMessage consisting of ApproveThing" in {
    val mockHandler = mock[HttpConnection]
    (mockHandler.postRequest _)
      .expects("http://localhost:8080/rest/inbox/test/approve", "test")
      .returns(new HttpResponse[String]("", 200, responseMap))

    val handler = new MQTTHandler(mockHandler)
    val approveThing = ApproveThing("test")
    handler.messageArrived("topic", new MqttMessage(JsonMapper.toJson(approveThing).getBytes()))
  }

  it should "handle a MQTTMessage consisting of TState" in {
    val mockHandler = mock[HttpConnection]
    (mockHandler.postRequest _)
      .expects("http://localhost:8080/rest/items/test", "20")
      .returns(new HttpResponse[String]("", 200, responseMap))

    val handler = new MQTTHandler(mockHandler)
    val tstate = TState("test", 20)
    handler.messageArrived("topic", new MqttMessage(JsonMapper.toJson(tstate).getBytes))
  }

  it should "handle a MQTTMessage consisting of ViewInbox" in {
    val mockHandler = mock[HttpConnection]

    inSequence {
      (mockHandler.postRequest _)
        .expects("http://localhost:8080/rest/discovery/bindings/zwave/scan", "")
        .returns(new HttpResponse[String]("", 200, responseMap))
      (mockHandler.getRequest _)
        .expects("http://localhost:8080/rest/inbox")
        .returns(new HttpResponse[String]("", 200, responseMap))
      (mockHandler.postRequest _)
        .expects("http://se2-webapp02.compute.dtu.dk/api/v2/sensor/inbox.php", JsonMapper.wrapForTransport(MACAddress.computeMAC, "\"\""))
        .returns(new HttpResponse[String]("", 200, responseMap))

    }
    val handler = new MQTTHandler(mockHandler)
    val viewInbox = ViewInbox()
    handler.messageArrived("topic", new MqttMessage(JsonMapper.toJson(viewInbox).getBytes()))
  }

  it should "throw a JsonParseException when the MQTTMessage payload is not in JSON format" in {
    val handler = new MQTTHandler(HttpHandler)
    a [JsonParseException] should be thrownBy {
      handler.messageArrived("topic", new MqttMessage("...".getBytes()))
    }
  }

  it should "throw a JsonMappingException when the MQTTMessage payload does not follow the ICD actions" in {
    val handler = new MQTTHandler(HttpHandler)
    a [JsonMappingException] should be thrownBy {
      handler.messageArrived("topic", new MqttMessage("{ \"test\" : \"data\"}".getBytes()))
    }
  }
}
