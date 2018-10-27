package com.groupb

import akka.actor.{Actor, Props}
import akka.event.Logging
import com.paulgoldbaum.influxdbclient._

class TransmissionActor(val db : Database, val handler : HttpConnection) extends Actor {
  private val log = Logging(context.system, this)

  def receive = {
    case "send" => {
      log.info("Data transmission started")
      InfluxDBHandler.clearDB(db)(Sequencer.transmitData(handler)(InfluxDBHandler.readData(db)))
      log.info("Data transmission completed")
    }
    case _ => {
      log.info("Invalid message received")
    }
  }
}
