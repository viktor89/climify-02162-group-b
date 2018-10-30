package com.groupb

import com.paulgoldbaum.influxdbclient.Database

case class Transmission(val db : Database, val http : HttpConnection) {
  def transmit() = {
    InfluxDBHandler.clearDB(db)(Sequencer.transmitData(http)(InfluxDBHandler.readData(db)))
  }
}
