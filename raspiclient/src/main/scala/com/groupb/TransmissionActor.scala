package com.groupb

import akka.actor.{Actor, ActorLogging, ActorRef, Props}
import akka.event.Logging
import akka.pattern.ask
import akka.util.Timeout
import scala.concurrent.duration._
import scala.concurrent.{Await, ExecutionContext, Future}
import scala.language.postfixOps
import scala.util.Success
import com.typesafe.config.ConfigFactory

class TransmissionActor(val dbActor : ActorRef, val http : HttpConnection) extends Actor with ActorLogging {
  private def transmitData(data : Seq[Data]) = {
    val sendURL = ConfigFactory.load("endpoints").getString("endpoints.send")
    val response = http.postRequest(sendURL, JsonMapper.wrapForTransport(MACAddress.computeMAC, JsonMapper.toJson(data)))

    response  match {
      case Success(resp) if resp.code == 200 => data
      case _ => Seq[Data]()
    }
  }

  def receive = {
    case "send" => {
      log.info("Data transmission started")
      val types = ItemFetcher.getOpenHABItems(http)
      implicit val timeout = Timeout(5 seconds)
      val callDB = dbActor ? readDB(types)
      val storedData = Await.result(callDB, Duration.Inf).asInstanceOf[Seq[Data]]
      val deletionList = transmitData(storedData)
      dbActor ! clearDB(deletionList)
    }
    case _ => {
      log.info("Invalid message received")
    }
  }
}
