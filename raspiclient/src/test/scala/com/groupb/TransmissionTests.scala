package com.groupb

import com.paulgoldbaum.influxdbclient.Database
import scala.util.Success
import scalaj.http.HttpResponse
import com.typesafe.config.ConfigFactory

class TransmissionTests extends DBFramework {
  val responseMap = Map[String, IndexedSeq[String]]()

  "Transmission" should "handle a transmission that succeeds with no data in db" in {
    val sendURL = ConfigFactory.load("endpoints").getString("endpoints.send")
    val jsonResult = """{"results":[{"series":[]}]}"""
    val data = IndexedSeq[Data]()
    val dataMsg = DataMessage(MACAddress.computeMAC, JsonMapper.toJson(data))
    val json = JsonMapper.toJson(dataMsg)
    val mockDB = mock[Database]
    val mockHandler = mock[HttpConnection]
    inSequence {
      (mockHandler.getRequest _) expects ("http://localhost:8080/rest/items?recursive=false") returns (Success(new HttpResponse[String]("[]", 200, responseMap)))
      (mockDB.query _) expects ("SELECT * FROM /^*/", *) returns (simulation(jsonResult))
      (mockHandler.postRequest _) expects (sendURL, json) returns (Success(new HttpResponse[String]("", 200, responseMap)))
    }
    val transmitter = Transmission(mockDB, mockHandler)
    transmitter.transmit
  }

  it should "handle a transmission that fails with no data in db" in {
    val sendURL = ConfigFactory.load("endpoints").getString("endpoints.send")
    val jsonResult = """{"results":[{"series":[]}]}"""
    val data = IndexedSeq[Data]()
    val dataMsg = DataMessage(MACAddress.computeMAC, JsonMapper.toJson(data))
    val json = JsonMapper.toJson(dataMsg)
    val mockDB = mock[Database]
    val mockHandler = mock[HttpConnection]
    inSequence {
      (mockHandler.getRequest _) expects ("http://localhost:8080/rest/items?recursive=false") returns (Success(new HttpResponse[String]("[]", 200, responseMap)))
      (mockDB.query _) expects ("SELECT * FROM /^*/", *) returns (simulation(jsonResult))
      (mockHandler.postRequest _) expects (sendURL, json) returns (Success(new HttpResponse[String]("", 404, responseMap)))
    }
    val transmitter = Transmission(mockDB, mockHandler)
    transmitter.transmit
  }

  it should "handle a transmission that succeeds with data in db" in {
    val sendURL = ConfigFactory.load("endpoints").getString("endpoints.send")
    val jsonResult = """{"results":[{"series":[{"name":"test","columns":["time", "value"],"values":[[1, 0], [2, 0], [3, 0]],"tags":{"tag": "value"}}]}]}"""
    val data = IndexedSeq(Data("test", "test", 1, 0),
      Data("test", "test", 2, 0),
      Data("test", "test", 3, 0))
    val dataMsg = DataMessage(MACAddress.computeMAC, JsonMapper.toJson(data))
    val json = JsonMapper.toJson(dataMsg)
    val mockDB = mock[Database]
    val mockHandler = mock[HttpConnection]
    inSequence {
      (mockHandler.getRequest _) expects("http://localhost:8080/rest/items?recursive=false") returns (Success(new HttpResponse[String]("[{\"name\":\"test\", \"label\":\"test\"}]", 200, responseMap)))
      (mockDB.query _) expects ("SELECT * FROM /^*/", *) returns (simulation(jsonResult))
      (mockHandler.postRequest _) expects (sendURL, json) returns (Success(new HttpResponse[String]("", 200, responseMap)))
      (mockDB.exec _) expects ("DELETE FROM test WHERE time = 1") returns (simulation("""{"results":[{"series":[]}]}"""))
      (mockDB.exec _) expects ("DELETE FROM test WHERE time = 2") returns (simulation("""{"results":[{"series":[]}]}"""))
      (mockDB.exec _) expects ("DELETE FROM test WHERE time = 3") returns (simulation("""{"results":[{"series":[]}]}"""))
    }
    val transmitter = Transmission(mockDB, mockHandler)
    transmitter.transmit
  }

  it should "handle a transmission that fails with data in db" in {
    val sendURL = ConfigFactory.load("endpoints").getString("endpoints.send")
    val jsonResult = """{"results":[{"series":[{"name":"test","columns":["time", "value"],"values":[[1, 0], [2, 0], [3, 0]],"tags":{"tag": "value"}}]}]}"""
    val data = IndexedSeq(Data("test", "test", 1, 0),
      Data("test", "test", 2, 0),
      Data("test", "test", 3, 0))
    val dataMsg = DataMessage(MACAddress.computeMAC, JsonMapper.toJson(data))
    val json = JsonMapper.toJson(dataMsg)
    val mockDB = mock[Database]
    val mockHandler = mock[HttpConnection]
    inSequence {
      (mockHandler.getRequest _) expects("http://localhost:8080/rest/items?recursive=false") returns (Success(new HttpResponse[String]("[{\"name\":\"test\", \"label\":\"test\"}]", 200, responseMap)))
      (mockDB.query _) expects ("SELECT * FROM /^*/", *) returns (simulation(jsonResult))
      (mockHandler.postRequest _) expects (sendURL, json) returns (Success(new HttpResponse[String]("", 404, responseMap)))
    }
    val transmitter = Transmission(mockDB, mockHandler)
    transmitter.transmit
  }
}
