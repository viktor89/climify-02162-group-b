package com.groupb

import scalaj.http._

object Sequencer {
  def transmitData(handler : HttpConnection)(data : Seq[Data]) = {
    val response = handler.postRequest("http://se2-webapp02.compute.dtu.dk/api/v2/sensor/send/",
      JsonMapper.wrapForTransport(MACAddress.computeMAC, JsonMapper.toJson(data)))

    if (response.code == 200) {
      data
    } else {
      Seq[Data]()
    }
  }
}
