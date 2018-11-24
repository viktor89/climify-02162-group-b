package com.groupb

import com.typesafe.config.ConfigFactory
import scala.language.postfixOps
import scalaj.http.HttpResponse
import scala.util.{ Success, Failure }
import akka.actor.{ ActorSystem, Props }
import akka.testkit.{ ImplicitSender, TestActors, TestActorRef, TestKit }
import org.scalatest.{ BeforeAndAfterAll, Matchers, WordSpecLike }
import org.scalamock.scalatest.MockFactory

class ActorTests() extends TestKit(ActorSystem("ActorTests")) with ImplicitSender
  with WordSpecLike with Matchers with BeforeAndAfterAll with MockFactory {

  override def afterAll: Unit = {
    TestKit.shutdownActorSystem(system)
  }

  "A TransmissionActor" must {
    "handle a send message" in {
      val mockTransmission = mock[Transmission]
      (mockTransmission.transmit _).expects().noMoreThanOnce 
      val actor = TestActorRef(new TransmissionActor(mockTransmission))
      actor ! "send"
    }

    "handle a different message and do nothing" in {
      val mockTransmission = mock[Transmission]
      (mockTransmission.transmit _).expects().never
      val actor = TestActorRef(new TransmissionActor(mockTransmission))
      actor ! "different"
    }
  }

  "MessageActor" must {
    "handle a ApproveThing message" in {
      val responseMap = Map[String, IndexedSeq[String]]()
      val mockHandler = mock[HttpConnection]
      (mockHandler.postRequest _) expects("http://localhost:8080/rest/inbox/test/approve", "test") returns(Success(new HttpResponse[String]("", 200, responseMap)))
      val actor = TestActorRef(new MessageActor(mockHandler))
      actor ! ApproveThing("test")
    }

    "handle a TState message" in {
      val responseMap = Map[String, IndexedSeq[String]]()
      val mockHandler = mock[HttpConnection]
      (mockHandler.postRequest _) expects("http://localhost:8080/rest/items/test", "20") returns(Success(new HttpResponse[String]("", 200, responseMap)))
      val actor = TestActorRef(new MessageActor(mockHandler))
      actor ! TState("test", "20")
    }

    "handle a ViewInbox where OpenHAB call does succeed" in {
      val responseMap = Map[String, IndexedSeq[String]]()
      val dataMsg = DataMessage(MACAddress.computeMAC, "\"\"")
      val inboxURL = ConfigFactory.load("endpoints").getString("endpoints.inbox")
      val mockHandler = mock[HttpConnection]
      inSequence {
        (mockHandler.postRequest _) expects("http://localhost:8080/rest/discovery/bindings/zwave/scan", "") returns(Success(new HttpResponse[String]("", 200, responseMap)))
        (mockHandler.getRequest _) expects("http://localhost:8080/rest/inbox") returns(Success(new HttpResponse[String]("", 200, responseMap)))
        (mockHandler.postRequest _) expects(inboxURL, JsonMapper.toJson(dataMsg)) returns(Success(new HttpResponse[String]("", 200, responseMap)))
      }
      val actor = TestActorRef(new MessageActor(mockHandler))
      actor ! ViewInbox()
    }

    "handle a ViewInbox where OpenHAB call fails" in {
      val responseMap = Map[String, IndexedSeq[String]]()
      val dataMsg = DataMessage(MACAddress.computeMAC, "[]")
      val inboxURL = ConfigFactory.load("endpoints").getString("endpoints.inbox")
      val mockHandler = mock[HttpConnection]
      inSequence {
        (mockHandler.postRequest _) expects("http://localhost:8080/rest/discovery/bindings/zwave/scan", "") returns(Success(new HttpResponse[String]("", 200, responseMap)))
        (mockHandler.getRequest _) expects("http://localhost:8080/rest/inbox") returns(Failure(new RuntimeException("Exception was thrown")))
        (mockHandler.postRequest _) expects(inboxURL, JsonMapper.toJson(dataMsg)) returns(Success(new HttpResponse[String]("", 200, responseMap)))
      }
      val actor = TestActorRef(new MessageActor(mockHandler))
      actor ! ViewInbox()
    }

    "do nothing if a different message was received" in {
      val mockHandler = mock[HttpConnection]
      (mockHandler.postRequest _).expects(*,*).never
      (mockHandler.getRequest _).expects(*).never
      val actor = TestActorRef(new MessageActor(mockHandler))
      actor ! "different"
    }
  }
}
