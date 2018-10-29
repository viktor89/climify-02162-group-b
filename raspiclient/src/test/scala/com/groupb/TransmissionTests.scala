package com.groupb

import com.paulgoldbaum.influxdbclient.Database
import scalaj.http.HttpResponse
import com.typesafe.config.ConfigFactory

class TransmissionTests extends DBFramework {
  val responseMap = Map[String, IndexedSeq[String]]()

  "A Transmission object" should "handle a transmission that succeeds with no data in db" in {
    val sendURL = ConfigFactory.load("endpoints").getString("endpoints.send")
    val jsonResult = """{"results":[{"series":[]}]}"""
    val data = IndexedSeq[Data]()
    val json = JsonMapper.wrapForTransport(MACAddress.computeMAC, JsonMapper.toJson(data))
    val mockDB = mock[Database]
    val mockHandler = mock[HttpConnection]
    inSequence {
      (mockDB.query _) expects ("SELECT * FROM /^*/ LIMIT 1000", *) returns (simulation(jsonResult))
      (mockHandler.postRequest _) expects (sendURL, json) returns (new HttpResponse[String]("", 200, responseMap))
    }
    val transmitter = Transmission(mockDB, mockHandler)
    transmitter.transmit
  }

  it should "handle a transmission that fails with no data in db" in {
    val sendURL = ConfigFactory.load("endpoints").getString("endpoints.send")
    val jsonResult = """{"results":[{"series":[]}]}"""
    val data = IndexedSeq[Data]()
    val json = JsonMapper.wrapForTransport(MACAddress.computeMAC, JsonMapper.toJson(data))
    val mockDB = mock[Database]
    val mockHandler = mock[HttpConnection]
    inSequence {
      (mockDB.query _) expects ("SELECT * FROM /^*/ LIMIT 1000", *) returns (simulation(jsonResult))
      (mockHandler.postRequest _) expects (sendURL, json) returns (new HttpResponse[String]("", 404, responseMap))
    }
    val transmitter = Transmission(mockDB, mockHandler)
    transmitter.transmit
  }

  it should "handle a transmission that succeeds with data in db" in {
    val sendURL = ConfigFactory.load("endpoints").getString("endpoints.send")
    val jsonResult = """{"results":[{"series":[{"name":"test","columns":["time", "value"],"values":[[1, 0], [2, 0], [3, 0]],"tags":{"tag": "value"}}]}]}"""
    val data = IndexedSeq(Data("test", 1, 0), Data("test", 2, 0), Data("test", 3, 0))
    val json = JsonMapper.wrapForTransport(MACAddress.computeMAC, JsonMapper.toJson(data))
    val mockDB = mock[Database]
    val mockHandler = mock[HttpConnection]
    inSequence {
      (mockDB.query _) expects ("SELECT * FROM /^*/ LIMIT 1000", *) returns (simulation(jsonResult))
      (mockHandler.postRequest _) expects (sendURL, json) returns (new HttpResponse[String]("", 200, responseMap))
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
    val data = IndexedSeq(Data("test", 1, 0), Data("test", 2, 0), Data("test", 3, 0))
    val json = JsonMapper.wrapForTransport(MACAddress.computeMAC, JsonMapper.toJson(data))
    val mockDB = mock[Database]
    val mockHandler = mock[HttpConnection]
    inSequence {
      (mockDB.query _) expects ("SELECT * FROM /^*/ LIMIT 1000", *) returns (simulation(jsonResult))
      (mockHandler.postRequest _) expects (sendURL, json) returns (new HttpResponse[String]("", 404, responseMap))
    }
    val transmitter = Transmission(mockDB, mockHandler)
    transmitter.transmit
  }
}
