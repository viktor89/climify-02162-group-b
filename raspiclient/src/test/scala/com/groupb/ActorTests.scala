package com.groupb

import com.typesafe.config.ConfigFactory
import com.paulgoldbaum.influxdbclient.{ Database, QueryResult }
import scala.concurrent.ExecutionContext.Implicits.global
import scala.language.postfixOps
import scalaj.http.HttpResponse
import scala.util.{ Success, Failure }
import scala.concurrent.duration._
import scala.concurrent.{Await, ExecutionContext, Future}
import akka.pattern.ask
import akka.util.Timeout
import akka.actor.{ ActorSystem, Props }
import akka.testkit.{ ImplicitSender, TestActors, TestActorRef, TestKit }
import org.scalatest.{ BeforeAndAfterAll, Matchers, WordSpecLike }
import org.scalamock.scalatest.MockFactory

class ActorTests() extends TestKit(ActorSystem("ActorTests")) with ImplicitSender
    with WordSpecLike with Matchers with BeforeAndAfterAll with MockFactory {
  val responseMap = Map[String, IndexedSeq[String]]()

  def simulation(json : String) = Future {
    QueryResult.fromJson(json)
  }

  override def afterAll: Unit = {
    TestKit.shutdownActorSystem(system)
  }

  "TransmissionActor" must {
    "handle a send message and make a transmission that succeeds with no data in db" in {
      val sendURL = ConfigFactory.load("endpoints").getString("endpoints.send")
      val jsonResult = """{"results":[{"series":[]}]}"""
      val dataMsg =JsonMapper.wrapForTransport(MACAddress.computeMAC, "[]")
      val mockDB = mock[Database]
      val mockHandler = mock[HttpConnection]
      inSequence {
        (mockHandler.getRequest _) expects ("http://localhost:8080/rest/items?recursive=false") returns (Success(new HttpResponse[String]("[]", 200, responseMap)))
        (mockDB.query _) expects ("SELECT * FROM /^*/ WHERE time > now() - 7200s", *) returns (simulation(jsonResult))
        (mockHandler.postRequest _) expects (sendURL, dataMsg) returns (Success(new HttpResponse[String]("", 200, responseMap)))
        (mockDB.multiQuery _) expects (Seq[String](), *)
      }

      val dbactor = TestActorRef(new DBActor(mockDB))
      val actor = TestActorRef(new TransmissionActor(dbactor, mockHandler))
      actor ! "send"
    }

    "handle a send message and make a transmission that fails with no data in db" in {
      val sendURL = ConfigFactory.load("endpoints").getString("endpoints.send")
      val jsonResult = """{"results":[{"series":[]}]}"""
      val dataMsg = JsonMapper.wrapForTransport(MACAddress.computeMAC, "[]")
      val mockDB = mock[Database]
      val mockHandler = mock[HttpConnection]
      inSequence {
        (mockHandler.getRequest _) expects ("http://localhost:8080/rest/items?recursive=false") returns (Success(new HttpResponse[String]("[]", 200, responseMap)))
        (mockDB.query _) expects ("SELECT * FROM /^*/ WHERE time > now() - 7200s", *) returns (simulation(jsonResult))
        (mockHandler.postRequest _) expects (sendURL, dataMsg) returns (Success(new HttpResponse[String]("", 404, responseMap)))
        (mockDB.multiQuery _) expects (Seq[String](), *)
      }

      val dbactor = TestActorRef(new DBActor(mockDB))
      val actor = TestActorRef(new TransmissionActor(dbactor, mockHandler))
      actor ! "send"
    }

    "handle a send message and a make a transmission that succeeds with data in db" in {
      val sendURL = ConfigFactory.load("endpoints").getString("endpoints.send")
      val jsonResult = """{"results":[{"series":[{"name":"test","columns":["time", "value"],"values":[[1, 0], [2, 0], [3, 0]],"tags":{"tag": "value"}}]}]}"""
      val data = IndexedSeq(Data("test", "test", 1, 0),
        Data("test", "test", 2, 0),
        Data("test", "test", 3, 0))
      val dataMsg = JsonMapper.wrapForTransport(MACAddress.computeMAC, JsonMapper.toJson(data))
      val mockDB = mock[Database]
      val mockHandler = mock[HttpConnection]
      inSequence {
        (mockHandler.getRequest _) expects("http://localhost:8080/rest/items?recursive=false") returns (Success(new HttpResponse[String]("[{\"name\":\"test\", \"label\":\"test\"}]", 200, responseMap)))
        (mockDB.query _) expects ("SELECT * FROM /^*/ WHERE time > now() - 7200s", *) returns (simulation(jsonResult))
        (mockHandler.postRequest _) expects (sendURL, dataMsg) returns (Success(new HttpResponse[String]("", 200, responseMap)))
        (mockDB.multiQuery _) expects(Seq("DELETE FROM test WHERE time = 1", "DELETE FROM test WHERE time = 2", "DELETE FROM test WHERE time = 3"), *) 
      }

      val dbactor = TestActorRef(new DBActor(mockDB))
      val actor = TestActorRef(new TransmissionActor(dbactor, mockHandler))
      actor ! "send"
    }

    "handle a send message and a make a transmission that fails with data in db" in {
      val sendURL = ConfigFactory.load("endpoints").getString("endpoints.send")
      val jsonResult = """{"results":[{"series":[{"name":"test","columns":["time", "value"],"values":[[1, 0], [2, 0], [3, 0]],"tags":{"tag": "value"}}]}]}"""
      val data = IndexedSeq(Data("test", "test", 1, 0),
        Data("test", "test", 2, 0),
        Data("test", "test", 3, 0))
      val dataMsg = JsonMapper.wrapForTransport(MACAddress.computeMAC, JsonMapper.toJson(data))
      val mockDB = mock[Database]
      val mockHandler = mock[HttpConnection]
      inSequence {
        (mockHandler.getRequest _) expects("http://localhost:8080/rest/items?recursive=false") returns (Success(new HttpResponse[String]("[{\"name\":\"test\", \"label\":\"test\"}]", 200, responseMap)))
        (mockDB.query _) expects ("SELECT * FROM /^*/ WHERE time > now() - 7200s", *) returns (simulation(jsonResult))
        (mockHandler.postRequest _) expects (sendURL, dataMsg) returns (Success(new HttpResponse[String]("", 404, responseMap)))
        (mockDB.multiQuery _) expects (Seq[String](), *)
      }

      val dbactor = TestActorRef(new DBActor(mockDB))
      val actor = TestActorRef(new TransmissionActor(dbactor, mockHandler))
      actor ! "send"
    }

    "handle a different message and do nothing" in {
      val mockDB = mock[Database]
      val mockHandler = mock[HttpConnection]
        (mockDB.query _).expects(*,*).never
        (mockDB.multiQuery _).expects(*,*).never
        (mockHandler.getRequest _).expects(*).never
        (mockHandler.postRequest _).expects(*,*).never
      val dbactor = TestActorRef(new DBActor(mockDB))
      val actor = TestActorRef(new TransmissionActor(dbactor, mockHandler))
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

    "handle a ViewInbox where OpenHAB calls does succeed" in {
      val responseMap = Map[String, IndexedSeq[String]]()
      val dataMsg = JsonMapper.wrapForTransport(MACAddress.computeMAC, "[]")
      val inboxURL = ConfigFactory.load("endpoints").getString("endpoints.inbox")
      val mockHandler = mock[HttpConnection]
      inSequence {
        (mockHandler.postRequest _) expects("http://localhost:8080/rest/discovery/bindings/zwave/scan", "") returns(Success(new HttpResponse[String]("", 200, responseMap)))
        (mockHandler.getRequest _) expects("http://localhost:8080/rest/inbox") returns(Success(new HttpResponse[String]("[]", 200, responseMap)))
        (mockHandler.postRequest _) expects(inboxURL, dataMsg) returns(Success(new HttpResponse[String]("", 200, responseMap)))
      }
      val actor = TestActorRef(new MessageActor(mockHandler))
      actor ! ViewInbox()
    }

    "handle a ViewInbox where OpenHAB calls fail" in {
      val responseMap = Map[String, IndexedSeq[String]]()
      val dataMsg = JsonMapper.wrapForTransport(MACAddress.computeMAC, "[]")
      val inboxURL = ConfigFactory.load("endpoints").getString("endpoints.inbox")
      val mockHandler = mock[HttpConnection]
      inSequence {
        (mockHandler.postRequest _) expects("http://localhost:8080/rest/discovery/bindings/zwave/scan", "") returns(Success(new HttpResponse[String]("", 200, responseMap)))
        (mockHandler.getRequest _) expects("http://localhost:8080/rest/inbox") returns(Failure(new RuntimeException("Exception was thrown")))
        (mockHandler.postRequest _) expects(inboxURL, dataMsg) returns(Success(new HttpResponse[String]("", 200, responseMap)))
      }
      val actor = TestActorRef(new MessageActor(mockHandler))
      actor ! ViewInbox()
    }

    "log the content of a Log message" in {
      val mockHandler = mock[HttpConnection]
        (mockHandler.postRequest _).expects(*,*).never
        (mockHandler.getRequest _).expects(*).never
      val actor = TestActorRef(new MessageActor(mockHandler))
      actor ! Log("message")
    }

    "do nothing if a different message was received" in {
      val mockHandler = mock[HttpConnection]
        (mockHandler.postRequest _).expects(*,*).never
        (mockHandler.getRequest _).expects(*).never
      val actor = TestActorRef(new MessageActor(mockHandler))
      actor ! "different"
    }
  }

  "DBActor" must {
    "return an empty sequence when the database is empty when a readDB msg is received" in {
      val jsonResult = """{"results":[{"series":[]}]}"""
      val mockDB = mock[Database]
      (mockDB.query _) expects("SELECT * FROM /^*/ WHERE time > now() - 7200s", *) returns(simulation(jsonResult))
      val actor = TestActorRef(new DBActor(mockDB))
      implicit val timeout = Timeout(5 seconds)
      val callDB = actor ? readDB(Map[String, String]())
      val result = Await.result(callDB, Duration.Inf).asInstanceOf[Seq[Data]]
      result.size should be (0)
    }

    "return an sequence with one series when the database only contains one series when a readDB msg is received" in {
      val types = Map("Test1" -> "test")
      val jsonResult = """{"results":[{"series":[{"name":"Test1","columns":["time", "value"],"values":[["0", "0"], ["1", "0"], ["2", "0"]],"tags":{"tag": "value"}}]}]}"""
      val mockDB = mock[Database]
      (mockDB.query _) expects("SELECT * FROM /^*/ WHERE time > now() - 7200s", *) returns(simulation(jsonResult))

      val actor = TestActorRef(new DBActor(mockDB))
      implicit val timeout = Timeout(5 seconds)
      val callDB = actor ? readDB(types)
      val result = Await.result(callDB, Duration.Inf).asInstanceOf[Seq[Data]]
      result.size should be (3)
      result contains Data("Test1", "test", "0", "0") should be (true)
      result contains Data("Test1", "test", "1", "0") should be (true)
      result contains Data("Test1", "test", "2", "0") should be (true)
    }

    "return an sequence with two series when the database contains two series when a readDB msg is received" in {
      val types = Map("Test1" -> "test", "Test2" -> "test")
      val jsonResult = """{"results":[{"series":[{"name":"Test1","columns":["time", "value"],"values":[["0", "0"], ["1", "0"], ["2", "0"]],"tags":{"tag": "value"}}, {"name":"Test2","columns":["time", "value"],"values":[["0", "0"], ["1", "0"], ["2", "0"]],"tags":{"tag": "value"}}]}]}"""
      val mockDB = mock[Database]
      (mockDB.query _) expects("SELECT * FROM /^*/ WHERE time > now() - 7200s", *) returns(simulation(jsonResult))

      val actor = TestActorRef(new DBActor(mockDB))
      implicit val timeout = Timeout(5 seconds)
      val callDB = actor ? readDB(types)
      val result = Await.result(callDB, Duration.Inf).asInstanceOf[Seq[Data]]
      result.size should be (6)
      result contains Data("Test1", "test", "0", "0") should be (true)
      result contains Data("Test1", "test", "1", "0") should be (true)
      result contains Data("Test1", "test", "2", "0") should be (true)
      result contains Data("Test2", "test", "0", "0") should be (true)
      result contains Data("Test2", "test", "1", "0") should be (true)
      result contains Data("Test2", "test", "2", "0") should be (true)
    }

    "give a serie a \"Unknown type\" when the serie is not present in OpenHAB when a readDB msg is received" in {
      val types = Map[String, String]()
      val jsonResult = """{"results":[{"series":[{"name":"Test1","columns":["time", "value"],"values":[["0", "0"], ["1", "0"], ["2", "0"]],"tags":{"tag": "value"}}]}]}"""
      val mockDB = mock[Database]
      (mockDB.query _) expects("SELECT * FROM /^*/ WHERE time > now() - 7200s", *) returns(simulation(jsonResult))

      val actor = TestActorRef(new DBActor(mockDB))
      implicit val timeout = Timeout(5 seconds)
      val callDB = actor ? readDB(types)
      val result = Await.result(callDB, Duration.Inf).asInstanceOf[Seq[Data]]
      result.size should be (3)
      result contains Data("Test1", "Unknown type", "0", "0") should be (true)
      result contains Data("Test1", "Unknown type", "1", "0") should be (true)
      result contains Data("Test1", "Unknown type", "2", "0") should be (true)
    }

    "only give \"Unknown type\" to series that are not present in OpenHAB and actual types to those that do when a readDB msg is received" in {
      val types = Map("Test1" -> "test")
      val jsonResult = """{"results":[{"series":[{"name":"Test1","columns":["time", "value"],"values":[["0", "0"], ["1", "0"], ["2", "0"]],"tags":{"tag": "value"}}, {"name":"Test2","columns":["time", "value"],"values":[["0", "0"], ["1", "0"], ["2", "0"]],"tags":{"tag": "value"}}]}]}"""
      val mockDB = mock[Database]
      (mockDB.query _) expects("SELECT * FROM /^*/ WHERE time > now() - 7200s", *) returns(simulation(jsonResult))

      val actor = TestActorRef(new DBActor(mockDB))
      implicit val timeout = Timeout(5 seconds)
      val callDB = actor ? readDB(types)
      val result = Await.result(callDB, Duration.Inf).asInstanceOf[Seq[Data]]

      result.size should be (6)
      result contains Data("Test1", "test", "0", "0") should be (true)
      result contains Data("Test1", "test", "1", "0") should be (true)
      result contains Data("Test1", "test", "2", "0") should be (true)
      result contains Data("Test2", "Unknown type", "0", "0") should be (true)
      result contains Data("Test2", "Unknown type", "1", "0") should be (true)
      result contains Data("Test2", "Unknown type", "2", "0") should be (true)
    }

    "accept an empty sequence, which will not change the database when a clearDB msg is received" in {
      val mockDB = mock[Database]
      (mockDB.multiQuery _) expects(Seq[String](), *)
      val actor = TestActorRef(new DBActor(mockDB))
      actor ! clearDB(Seq[Data]())
    }

    "accept an sequence consisting of a single series, where the content will be cleared from the database when a clearDB msg is received" in {
      val data = IndexedSeq(Data("Test1", "test", 0, 0),
        Data("Test1", "test", 1, 0),
        Data("Test1", "test", 2, 0))
      val mockDB = mock[Database]
      (mockDB.multiQuery _) expects (Seq("DELETE FROM Test1 WHERE time = 0", "DELETE FROM Test1 WHERE time = 1", "DELETE FROM Test1 WHERE time = 2"), *)

      val actor = TestActorRef(new DBActor(mockDB))
      actor ! clearDB(data)
    }

    "accept an sequence consisting of two series, where the content will be cleared from the database when a clearDB msg is received" in {
      val data = IndexedSeq(Data("Test1", "test", 0, 0),
        Data("Test1", "test", 1, 0),
        Data("Test1", "test", 2, 0),
        Data("Test2", "test", 0, 0),
        Data("Test2", "test", 1, 0),
        Data("Test2", "test", 2, 0))
      val mockDB = mock[Database]

      (mockDB.multiQuery _) expects (Seq("DELETE FROM Test1 WHERE time = 0", "DELETE FROM Test1 WHERE time = 1", "DELETE FROM Test1 WHERE time = 2", "DELETE FROM Test2 WHERE time = 0", "DELETE FROM Test2 WHERE time = 1", "DELETE FROM Test2 WHERE time = 2"), *)

      val actor = TestActorRef(new DBActor(mockDB))
      actor ! clearDB(data)
    }

    "do nothing when receiving a different message" in {
      val mockDB = mock[Database]
        (mockDB.query _).expects(*,*).never
        (mockDB.multiQuery _).expects(*,*).never
      val actor = TestActorRef(new DBActor(mockDB))
      actor ! "different"
    }
  }
}
