package com.groupb

import akka.actor.{Actor, Props}
import akka.event.Logging
import com.paulgoldbaum.influxdbclient._

class TransmissionActor(val transmitter : Transmission) extends Actor {
  private val log = Logging(context.system, this)

  def receive = {
    case "send" => {
      log.info("Data transmission started")
      transmitter.transmit
    }
    case _ => {
      log.info("Invalid message received")
    }
  }
}
