package com.groupb

import scalaj.http.HttpResponse
import com.typesafe.config.ConfigFactory

object Sequencer {
  def transmitData(handler : HttpConnection)(data : Seq[Data]) = {
    val sendURL = ConfigFactory.load("endpoints").getString("endpoints.send")
    val response = handler.postRequest(sendURL,
      JsonMapper.wrapForTransport(MACAddress.computeMAC, JsonMapper.toJson(data)))

    if (response.code == 200) {
      data
    } else {
      Seq[Data]()
    }
  }
}
