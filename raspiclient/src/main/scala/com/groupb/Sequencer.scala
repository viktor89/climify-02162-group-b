package com.groupb

import scala.util.Success
import scalaj.http.HttpResponse
import com.typesafe.config.ConfigFactory
import java.io._

object Sequencer {
  def transmitData(handler : HttpConnection)(data : Seq[Data]) = {
    val sendURL = ConfigFactory.load("endpoints").getString("endpoints.send")
    val response = handler.postRequest(sendURL, JsonMapper.wrapForTransport(MACAddress.computeMAC, JsonMapper.toJson(data)))
    println(data.size)
    response  match {
      case Success(resp) if resp.code == 200 => data
      case _ => Seq[Data]()
    }
  }
}
