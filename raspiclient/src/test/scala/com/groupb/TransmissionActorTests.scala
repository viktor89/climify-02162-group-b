package com.groupb

import com.paulgoldbaum.influxdbclient._
import com.paulgoldbaum.influxdbclient.Parameter.Precision.Precision
import org.scalatest.{FlatSpec, Matchers}
import org.scalamock.scalatest.MockFactory
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import akka.actor.{Actor, ActorSystem, ActorRef, Props}

class TransmissionActorTests extends FlatSpec with Matchers with MockFactory {
  val responseMap = Map[String, IndexedSeq[String]]()

  def simulation(json : String) = Future {
    QueryResult.fromJson(json)
  }

  "A TransmissionActor" should "handle a send instruction, where transmission goes smoothly (no data in db)" in {
    val jsonResult = """{"results":[{"series":[]}]}"""
    val data = IndexedSeq[Data]()
    val json = JsonMapper.wrapForTransport(MACAddress.computeMAC, JsonMapper.toJson(data))
    val mockDB = mock[Database]
    val mockHandler = mock[HttpConnection]

    inSequence {
      (mockDB.query _)
        .expects("SELECT * FROM /^*/ LIMIT 1000", *)
        .returns(simulation(jsonResult))
      (mockHandler.postRequest _)
        .expects("http://se2-webapp02.compute.dtu.dk/api/v2/sensor/send.php", json)
        .returns(new HttpResponse[String]("", 200, responseMap))
    }

    val system = ActorSystem()
    val transmissionActor = system.actorOf(Props(new TransmissionActor(mockDB, mockHandler)), name = "TransmissionActor")

    transmissionActor ! "send"
  }

  it should "handle a send instruction, where transmission goes smoothly (data in db)" in {
    val jsonResult = """{"results":[{"series":[{"name":"test","columns":["time", "value"],"values":[["1", "0"], ["2", "0"], ["3", "0"]],"tags":{"tag": "value"}}]}]}"""
    val data = IndexedSeq(Data("test", 1, 0), Data("test", 2, 0), Data("test", 3, 0))
    val json = JsonMapper.wrapForTransport(MACAddress.computeMAC, JsonMapper.toJson(data))
    val mockDB = mock[Database]
    val mockHandler = mock[HttpConnection]

    inSequence {
      (mockDB.query _)
        .expects("SELECT * FROM /^*/ LIMIT 1000", *)
        .returns(simulation(jsonResult))
      (mockHandler.postRequest _)
        .expects("http://se2-webapp02.compute.dtu.dk/api/v2/sensor/send.php", json)
        .returns(new HttpResponse[String]("", 200, responseMap))
      (mockDB.exec _)
        .expects("DELETE FROM test WHERE time = 1")
      (mockDB.exec _)
        .expects("DELETE FROM test WHERE time = 2")
      (mockDB.exec _)
        .expects("DELETE FROM test WHERE time = 3")
    }

    val system = ActorSystem()
    val transmissionActor = system.actorOf(Props(new TransmissionActor(mockDB, mockHandler)), name = "TransmissionActor")

    transmissionActor ! "send"
  }

  it should "handle a send instruction that fails (no data in db)" in {
    val jsonResult = """{"results":[{"series":[]}]}"""
    val data = IndexedSeq[Data]()
    val json = JsonMapper.wrapForTransport(MACAddress.computeMAC, JsonMapper.toJson(data))
    val mockDB = mock[Database]
    val mockHandler = mock[HttpConnection]

    inSequence {
      (mockDB.query _)
        .expects("SELECT * FROM /^*/ LIMIT 1000", *)
        .returns(simulation(jsonResult))
      (mockHandler.postRequest _)
        .expects("http://se2-webapp02.compute.dtu.dk/api/v2/sensor/send.php", json)
        .returns(new HttpResponse[String]("", 404, responseMap))
    }

    val system = ActorSystem()
    val transmissionActor = system.actorOf(Props(new TransmissionActor(mockDB, mockHandler)), name = "TransmissionActor")

    transmissionActor ! "send"
  }

  it should "handle a send instruction that fails (data in db)" in {
    val jsonResult = """{"results":[{"series":[{"name":"test","columns":["time", "value"],"values":[["1", "0"], ["2", "0"], ["3", "0"]],"tags":{"tag": "value"}}]}]}"""
    val data = IndexedSeq(Data("test", 1, 0), Data("test", 2, 0), Data("test", 3, 0))
    val json = JsonMapper.wrapForTransport(MACAddress.computeMAC, JsonMapper.toJson(data))
    val mockDB = mock[Database]
    val mockHandler = mock[HttpConnection]

    inSequence {
      (mockDB.query _)
        .expects("SELECT * FROM /^*/ LIMIT 1000", *)
        .returns(simulation(jsonResult))
      (mockHandler.postRequest _)
        .expects("http://se2-webapp02.compute.dtu.dk/api/v2/sensor/send.php", json)
        .returns(new HttpResponse[String]("", 404, responseMap))
    }

    val system = ActorSystem()
    val transmissionActor = system.actorOf(Props(new TransmissionActor(mockDB, mockHandler)), name = "TransmissionActor")

    transmissionActor ! "send"
  }

  it should "do nothing when receiving a invalid instruction" in {
    val mockDB = mock[Database]
    val mockHandler = mock[HttpConnection]

    val system = ActorSystem()
    val transmissionActor = system.actorOf(Props(new TransmissionActor(mockDB, mockHandler)), name = "TransmissionActor")
    transmissionActor ! "invalid"
  }
}
