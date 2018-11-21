package com.groupb

import scalaj.http.HttpResponse
import com.typesafe.config.ConfigFactory
import scala.util.{Success, Failure}
import org.eclipse.paho.client.mqttv3.{MqttDeliveryToken, MqttMessage}
import org.scalatest.{FlatSpec, Matchers}
import org.scalamock.scalatest.MockFactory

class MQTTHandlerTests extends FlatSpec with Matchers with MockFactory {
  val responseMap = Map[String, IndexedSeq[String]]()

  "A MQTTHandler" should "handle a lost connection" in {
    val handler = new MQTTHandler(HttpHandler)
    handler.connectionLost(new Throwable())
  }

  it should "handle receiving a delivery token" in {
    val handler = new MQTTHandler(HttpHandler)
    handler.deliveryComplete(new MqttDeliveryToken("test"))
  }

  it should "act upon an ApproveThing message" in {
    val mockHandler = mock[HttpConnection]
    (mockHandler.postRequest _) expects("http://localhost:8080/rest/inbox/test/approve", "test") returns(Success(new HttpResponse[String]("", 200, responseMap)))

    val handler = new MQTTHandler(mockHandler)
    val approveThing = ApproveThing("test")
    val response = handler.act(approveThing)
    response.isSuccess should be (true)
    response.get.body should be ("")
    response.get.code should be (200)
    response.get.headers should be (responseMap)
  }

  it should "act upon a TState message" in {
    val mockHandler = mock[HttpConnection]
    (mockHandler.postRequest _) expects("http://localhost:8080/rest/items/test", "20") returns(Success(new HttpResponse[String]("", 200, responseMap)))

    val handler = new MQTTHandler(mockHandler)
    val tstate = TState("test", "20")
    val response = handler.act(tstate)
    response.isSuccess should be (true)
    response.get.body should be ("")
    response.get.code should be (200)
    response.get.headers should be (responseMap)
  }

  it should "act upon a ViewInbox message" in {
    val mockHandler = mock[HttpConnection]
    val dataMsg = DataMessage(MACAddress.computeMAC, "\"\"")
    val inboxURL = ConfigFactory.load("endpoints").getString("endpoints.inbox")
    inSequence {
      (mockHandler.postRequest _) expects("http://localhost:8080/rest/discovery/bindings/zwave/scan", "") returns(Success(new HttpResponse[String]("", 200, responseMap)))
      (mockHandler.getRequest _) expects("http://localhost:8080/rest/inbox") returns(Success(new HttpResponse[String]("", 200, responseMap)))
      (mockHandler.postRequest _) expects(inboxURL, JsonMapper.toJson(dataMsg)) returns(Success(new HttpResponse[String]("", 200, responseMap)))
    }
    val handler = new MQTTHandler(mockHandler)
    val viewInbox = ViewInbox()
    val response = handler.act(viewInbox)
    response.isSuccess should be (true)
    response.get.body should be ("")
    response.get.code should be (200)
    response.get.headers should be (responseMap)
  }

  it should "act upon a ViewInbox message where OpenHAB fails during inbox fetch" in {
    val mockHandler = mock[HttpConnection]
    val dataMsg = DataMessage(MACAddress.computeMAC, "\"\"")
    val inboxURL = ConfigFactory.load("endpoints").getString("endpoints.inbox")
    inSequence {
      (mockHandler.postRequest _) expects("http://localhost:8080/rest/discovery/bindings/zwave/scan", "") returns(Success(new HttpResponse[String]("", 200, responseMap)))
      (mockHandler.getRequest _) expects("http://localhost:8080/rest/inbox") returns(Failure(new RuntimeException("Exception was thrown")))
    }
    val handler = new MQTTHandler(mockHandler)
    val viewInbox = ViewInbox()
    val response = handler.act(viewInbox)
    response.isFailure should be (true)
  }

  it should "handle a MQTTMessage consisting of ApproveThing" in {
    val mockHandler = mock[HttpConnection]
    (mockHandler.postRequest _) expects("http://localhost:8080/rest/inbox/test/approve", "test") returns(Success(new HttpResponse[String]("", 200, responseMap)))

    val handler = new MQTTHandler(mockHandler)
    val approveThing = ApproveThing("test")
    handler.messageArrived("topic", new MqttMessage(JsonMapper.toJson(approveThing).getBytes()))
  }

  it should "handle a MQTTMessage consisting of TState" in {
    val mockHandler = mock[HttpConnection]
    (mockHandler.postRequest _) expects("http://localhost:8080/rest/items/test", "20") returns(Success(new HttpResponse[String]("", 200, responseMap)))

    val handler = new MQTTHandler(mockHandler)
    val tstate = TState("test", "20")
    handler.messageArrived("topic", new MqttMessage(JsonMapper.toJson(tstate).getBytes()))
  }

  it should "handle a MQTTMessage consisting of ViewInbox" in {
    val mockHandler = mock[HttpConnection]
    val dataMsg = DataMessage(MACAddress.computeMAC, "\"\"")
    val inboxURL = ConfigFactory.load("endpoints").getString("endpoints.inbox")
    inSequence {
      (mockHandler.postRequest _) expects("http://localhost:8080/rest/discovery/bindings/zwave/scan", "") returns(Success(new HttpResponse[String]("", 200, responseMap)))
      (mockHandler.getRequest _) expects("http://localhost:8080/rest/inbox") returns(Success(new HttpResponse[String]("", 200, responseMap)))
      (mockHandler.postRequest _) expects(inboxURL, JsonMapper.toJson(dataMsg)) returns (Success(new HttpResponse[String]("", 200, responseMap)))
    }
    val handler = new MQTTHandler(mockHandler)
    val viewInbox = ViewInbox()
    handler.messageArrived("topic", new MqttMessage(JsonMapper.toJson(viewInbox).getBytes()))
  }

    it should "handle a MQTTMessage consisting of ViewInbox where OpenHAB fails during inbox fetch" in {
    val mockHandler = mock[HttpConnection]
    val dataMsg = DataMessage(MACAddress.computeMAC, "\"\"")
    val inboxURL = ConfigFactory.load("endpoints").getString("endpoints.inbox")
    inSequence {
      (mockHandler.postRequest _) expects("http://localhost:8080/rest/discovery/bindings/zwave/scan", "") returns(Success(new HttpResponse[String]("", 200, responseMap)))
      (mockHandler.getRequest _) expects("http://localhost:8080/rest/inbox") returns(Failure(new RuntimeException("Exception was thrown")))
    }
    val handler = new MQTTHandler(mockHandler)
    val viewInbox = ViewInbox()
    handler.messageArrived("topic", new MqttMessage(JsonMapper.toJson(viewInbox).getBytes()))
  }


  it should "do nothing when the MQTT payload is not in JSON" in {
    val mockHandler = mock[HttpConnection]
    val handler = new MQTTHandler(mockHandler)
    handler.messageArrived("topic", new MqttMessage("...".getBytes()))
  }

  it should "do nothing when the MQTTMessage payload does not follow the ICD actions" in {
    val mockHandler = mock[HttpConnection]
    val handler = new MQTTHandler(mockHandler)
    handler.messageArrived("topic", new MqttMessage("{ \"test\" : \"data\"}".getBytes()))
  }
}
