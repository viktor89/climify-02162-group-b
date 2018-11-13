package com.groupb

import scala.language.postfixOps
import akka.actor.{ ActorSystem, Props }
import akka.testkit.{ ImplicitSender, TestActors, TestKit }
import org.scalatest.{ BeforeAndAfterAll, Matchers, WordSpecLike }
import org.scalamock.scalatest.MockFactory

class TransmissionActorTests() extends TestKit(ActorSystem("TransmissionActorTests")) with ImplicitSender
  with WordSpecLike with Matchers with BeforeAndAfterAll with MockFactory {

  override def afterAll: Unit = {
    TestKit.shutdownActorSystem(system)
  }

  "A TransmissionActor" must {

    "handle a send message" in {
      val mockTransmission = mock[Transmission]
      val actor = system.actorOf(Props(new TransmissionActor(mockTransmission)), name = "actor1")
      actor ! "send"
    }

    "handle a different message and do nothing" in {
      val mockTransmission = mock[Transmission]
      val actor = system.actorOf(Props(new TransmissionActor(mockTransmission)), name = "actor2")
      actor ! "different"
    }
  }
}
