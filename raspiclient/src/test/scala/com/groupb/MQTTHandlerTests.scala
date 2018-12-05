package com.groupb

import scalaj.http.HttpResponse
import com.typesafe.config.ConfigFactory
import scala.util.{Success, Failure}
import org.eclipse.paho.client.mqttv3.{MqttDeliveryToken, MqttMessage}
import com.paulgoldbaum.influxdbclient.Database
import org.scalatest.{FlatSpec, Matchers}
import akka.actor.{ ActorSystem, Props }
import akka.testkit.{ ImplicitSender, TestActors, TestActorRef, TestKit }
import org.scalatest.{ BeforeAndAfterAll, Matchers, WordSpecLike }
import org.scalamock.scalatest.MockFactory
import akka.testkit.TestActorRef

class MQTTHandlerTests extends TestKit(ActorSystem("MQTTHandlerTests")) with ImplicitSender
    with WordSpecLike with Matchers with BeforeAndAfterAll with MockFactory {
  val responseMap = Map[String, IndexedSeq[String]]()

  override def afterAll: Unit = {
    TestKit.shutdownActorSystem(system)
  }

  "MQTTHandler" must {
    "handle a lost connection" in {
      val mockDB = mock[Database]
        (mockDB.query _).expects(*,*).never
        (mockDB.multiQuery _).expects(*,*).never
        (mockDB.exec _).expects(*).never
      val dbactor = TestActorRef(new DBActor(mockDB))
      val mockHandler = mock[HttpConnection]
      (mockHandler.postRequest _).expects(*,*).never
      (mockHandler.getRequest _).expects(*).never
      val actor = TestActorRef(new MessageActor(mockHandler, dbactor))
      val handler = new MQTTHandler(actor)
      handler.connectionLost(new Throwable())
    }

    "handle receiving a delivery token" in {
      val mockDB = mock[Database]
        (mockDB.query _).expects(*,*).never
        (mockDB.multiQuery _).expects(*,*).never
        (mockDB.exec _).expects(*).never
      val dbactor = TestActorRef(new DBActor(mockDB))
      val mockHandler = mock[HttpConnection]
      (mockHandler.postRequest _).expects(*,*).never
      (mockHandler.getRequest _).expects(*).never
      val actor = TestActorRef(new MessageActor(mockHandler, dbactor))
      val handler = new MQTTHandler(actor)
      handler.deliveryComplete(new MqttDeliveryToken("test"))
    }

    "handle a MQTTMessage consisting of ApproveThing" in {
      val mockDB = mock[Database]
        (mockDB.query _).expects(*,*).never
        (mockDB.multiQuery _).expects(*,*).never
        (mockDB.exec _).expects(*).never
      val dbactor = TestActorRef(new DBActor(mockDB))
      val mockHandler = mock[HttpConnection]
      (mockHandler.postRequest _) expects("http://localhost:8080/rest/inbox/test/approve", "test") returns(Success(new HttpResponse[String]("", 200, responseMap)))
      val actor = TestActorRef(new MessageActor(mockHandler, dbactor))
      val handler = new MQTTHandler(actor)
      val approveThing = ApproveThing("test")
      handler.messageArrived("topic", new MqttMessage(JsonMapper.toJson(approveThing).getBytes()))
    }

    "handle a MQTTMessage consisting of TState" in {
      val mockDB = mock[Database]
        (mockDB.query _).expects(*,*).never
        (mockDB.multiQuery _).expects(*,*).never
        (mockDB.exec _).expects(*).never
      val dbactor = TestActorRef(new DBActor(mockDB))
      val mockHandler = mock[HttpConnection]
      (mockHandler.postRequest _) expects("http://localhost:8080/rest/items/test", "20") returns(Success(new HttpResponse[String]("", 200, responseMap)))
      val actor = TestActorRef(new MessageActor(mockHandler, dbactor))
      val handler = new MQTTHandler(actor)
      val tstate = TState("test", "20")
      handler.messageArrived("topic", new MqttMessage(JsonMapper.toJson(tstate).getBytes()))
    }

    "handle a MQTTMessage consisting of ViewInbox" in {
      val mockDB = mock[Database]
        (mockDB.query _).expects(*,*).never
        (mockDB.multiQuery _).expects(*,*).never
        (mockDB.exec _).expects(*).never
      val dbactor = TestActorRef(new DBActor(mockDB))
      val mockHandler = mock[HttpConnection]
      val dataMsg = JsonMapper.wrapForTransport(MACAddress.computeMAC, "[]")
      val inboxURL = ConfigFactory.load("endpoints").getString("endpoints.inbox")
      inSequence {
        (mockHandler.postRequest _) expects("http://localhost:8080/rest/discovery/bindings/zwave/scan", "") returns(Success(new HttpResponse[String]("", 200, responseMap)))
        (mockHandler.getRequest _) expects("http://localhost:8080/rest/inbox") returns(Success(new HttpResponse[String]("[]", 200, responseMap)))
        (mockHandler.postRequest _) expects(inboxURL, dataMsg) returns(Success(new HttpResponse[String]("", 200, responseMap)))
      }
      val actor = TestActorRef(new MessageActor(mockHandler, dbactor))
      val handler = new MQTTHandler(actor)
      val viewInbox = ViewInbox()
      handler.messageArrived("topic", new MqttMessage(JsonMapper.toJson(viewInbox).getBytes()))
    }

    "handle a MQTTMessage consisting of ViewInbox where OpenHAB fails during inbox fetch" in {
      val mockDB = mock[Database]
        (mockDB.query _).expects(*,*).never
        (mockDB.multiQuery _).expects(*,*).never
        (mockDB.exec _).expects(*).never
      val dbactor = TestActorRef(new DBActor(mockDB))
      val mockHandler = mock[HttpConnection]
      val dataMsg = JsonMapper.wrapForTransport(MACAddress.computeMAC, "[]")
      val inboxURL = ConfigFactory.load("endpoints").getString("endpoints.inbox")
      inSequence {
        (mockHandler.postRequest _) expects("http://localhost:8080/rest/discovery/bindings/zwave/scan", "") returns(Success(new HttpResponse[String]("", 200, responseMap)))
        (mockHandler.getRequest _) expects("http://localhost:8080/rest/inbox") returns(Failure(new RuntimeException("Exception was thrown")))
        (mockHandler.postRequest _) expects(inboxURL, dataMsg) returns(Success(new HttpResponse[String]("", 200, responseMap)))
      }
      val actor = TestActorRef(new MessageActor(mockHandler, dbactor))
      val handler = new MQTTHandler(actor)
      val viewInbox = ViewInbox()
      handler.messageArrived("topic", new MqttMessage(JsonMapper.toJson(viewInbox).getBytes()))
    }

    "handle a DeleteItem message where the OpenHAB call succeeds" in {
      val mockDB = mock[Database]
      val mockHandler = mock[HttpConnection]
      inSequence {
        (mockHandler.deleteRequest _) expects("http://localhost:8080/rest/items/test") returns(Success(new HttpResponse[String]("", 200, responseMap)))
        (mockDB.exec _) expects ("DROP MEASUREMENT test")
      }

      val dbactor = TestActorRef(new DBActor(mockDB))
      val actor = TestActorRef(new MessageActor(mockHandler, dbactor))
      val handler = new MQTTHandler(actor)
      val deleteItem = DeleteItem("test")
      handler.messageArrived("topic", new MqttMessage(JsonMapper.toJson(deleteItem).getBytes()))
    }

    "handle a DeleteItem message where the OpenHAB call fails" in {
      val mockDB = mock[Database]
        (mockDB.query _).expects(*,*).never
        (mockDB.multiQuery _).expects(*,*).never
        (mockDB.exec _).expects(*).never
      val dbactor = TestActorRef(new DBActor(mockDB))
      val mockHandler = mock[HttpConnection]
      (mockHandler.deleteRequest _) expects("http://localhost:8080/rest/items/test") returns(Failure(new RuntimeException("Exception was thrown")))
      val actor = TestActorRef(new MessageActor(mockHandler, dbactor))
      val handler = new MQTTHandler(actor)
      val deleteItem = DeleteItem("test")
      handler.messageArrived("topic", new MqttMessage(JsonMapper.toJson(deleteItem).getBytes()))
    }

    "forward an invalid message to the MessageActor if the MQTTMessage payload is not JSON" in {
      val mockDB = mock[Database]
        (mockDB.query _).expects(*,*).never
        (mockDB.multiQuery _).expects(*,*).never
        (mockDB.exec _).expects(*).never
      val dbactor = TestActorRef(new DBActor(mockDB))
      val mockHandler = mock[HttpConnection]
      (mockHandler.postRequest _).expects(*,*).never
      (mockHandler.getRequest _).expects(*).never
      val actor = TestActorRef(new MessageActor(mockHandler, dbactor))
      val handler = new MQTTHandler(actor)
      handler.messageArrived("topic", new MqttMessage("...".getBytes()))
    }

    "forward an invalid message to the MessageActor if the MQTTMessage payload does not follow the ICD actions" in {
      val mockDB = mock[Database]
        (mockDB.query _).expects(*,*).never
        (mockDB.multiQuery _).expects(*,*).never
        (mockDB.exec _).expects(*).never
      val dbactor = TestActorRef(new DBActor(mockDB))
      val mockHandler = mock[HttpConnection]
      (mockHandler.postRequest _).expects(*,*).never
      (mockHandler.getRequest _).expects(*).never
      val actor = TestActorRef(new MessageActor(mockHandler, dbactor))
      val handler = new MQTTHandler(actor)
      handler.messageArrived("topic", new MqttMessage("{ \"test\" : \"data\"}".getBytes()))
    }
  }
}
