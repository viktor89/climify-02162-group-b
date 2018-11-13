package com.groupb

import scala.util.Success
import scalaj.http.HttpResponse
import com.typesafe.config.ConfigFactory

object Sequencer {
  def transmitData(handler : HttpConnection)(data : Seq[Data]) = {
    val sendURL = ConfigFactory.load("endpoints").getString("endpoints.send")
    val response = handler.postRequest(sendURL,
      JsonMapper.toJson(DataMessage(MACAddress.computeMAC,
        JsonMapper.toJson(data))))

    response match {
      case Success(resp) if resp.code == 200 => data
      case _ => Seq[Data]()
    }
  }
}
