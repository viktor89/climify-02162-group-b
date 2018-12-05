package com.groupb

import akka.actor.{Actor, ActorLogging, ActorRef, Props}
import akka.event.Logging
import scala.util.{ Success, Failure }
import scalaj.http.HttpResponse
import com.typesafe.config.ConfigFactory

class MessageActor(val http : HttpConnection, val dbActor : ActorRef) extends Actor with ActorLogging {
  def receive() = {
    case ApproveThing(name) => http.postRequest("http://localhost:8080/rest/inbox/" + name + "/approve", name)
    case TState(uuid, temp) => http.postRequest("http://localhost:8080/rest/items/" + uuid, temp)
    case ViewInbox() => {
      val inboxURL = ConfigFactory.load("endpoints").getString("endpoints.inbox")
      http.postRequest("http://localhost:8080/rest/discovery/bindings/zwave/scan", "")
      val response = http.getRequest("http://localhost:8080/rest/inbox")
      response match {
        case Success(resp) => http.postRequest(inboxURL, JsonMapper.wrapForTransport(MACAddress.computeMAC, resp.body))
        case _ => http.postRequest(inboxURL, JsonMapper.wrapForTransport(MACAddress.computeMAC, "[]"))
      }
    }
    case DeleteItem(uuid) => {
      val response = http.deleteRequest("http://localhost:8080/rest/items/" + uuid)
      response match {
        case Success(resp) => {
          log.info("DeleteItem successful")
          dbActor ! DropMsg(uuid)
        }
        case _ => {
          log.info("DeleteItem failed")
        }
      }
    }
    case Log(msg) => log.info(msg)
    case _ => log.info("Invalid message received")
  }
}
