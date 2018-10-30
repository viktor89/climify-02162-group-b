package com.groupb

import scalaj.http.HttpResponse
import com.typesafe.config.ConfigFactory
import org.scalatest.{FlatSpec, Matchers}
import org.scalamock.scalatest.MockFactory

class SequencerTests extends FlatSpec with Matchers with MockFactory {
  val responseMap = Map[String, IndexedSeq[String]]()

  "A Sequencer" should "transmit a non-empty sequence of Data as JSON successfully" in {
    val sendURL = ConfigFactory.load("endpoints").getString("endpoints.send")
    val data = IndexedSeq(Data("test", "test", 1, 0),
      Data("test", "test", 2, 0),
      Data("test","test", 3, 0))
    val dataMsg = DataMessage(MACAddress.computeMAC, JsonMapper.toJson(data))
    val json = JsonMapper.toJson(dataMsg)

    val mockHandler = mock[HttpConnection]
    (mockHandler.postRequest _) expects (sendURL, json) returns(new HttpResponse[String]("", 200, responseMap))

    val result = Sequencer.transmitData(mockHandler)(data)
    result should be (data)
  }

  it should "transmit a empty sequence of Data as JSON successfully" in {
    val sendURL = ConfigFactory.load("endpoints").getString("endpoints.send")
    val data = IndexedSeq[Data]()
    val dataMsg = DataMessage(MACAddress.computeMAC, JsonMapper.toJson(data))
    val json = JsonMapper.toJson(dataMsg)

    val mockHandler = mock[HttpConnection]
    (mockHandler.postRequest _) expects (sendURL, json) returns(new HttpResponse[String]("", 200, responseMap))

    val result = Sequencer.transmitData(mockHandler)(data)
    result should be (data)
  }

  it should "return a empty sequence when the response is different from 200" in {
    val sendURL = ConfigFactory.load("endpoints").getString("endpoints.send")
    val data = IndexedSeq(Data("test", "test", 1, 0),
      Data("test", "test", 2, 0),
      Data("test", "test", 3, 0))
    val dataMsg = DataMessage(MACAddress.computeMAC, JsonMapper.toJson(data))
    val json = JsonMapper.toJson(dataMsg)

    val mockHandler = mock[HttpConnection]
    (mockHandler.postRequest _) expects(sendURL, json) returns(new HttpResponse[String]("", 404, responseMap))

    val result = Sequencer.transmitData(mockHandler)(data)
    result.size should be (0)
    result.size should not be (data)
  }
}
