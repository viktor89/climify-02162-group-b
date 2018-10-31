package com.groupb

import com.paulgoldbaum.influxdbclient.Database

case class Transmission(val db : Database, val http : HttpConnection) {
  def transmit() = {
    val types = ItemFetcher.getOpenHABItems(http)
    val storedData = InfluxDBHandler.readData(db)(types)
    val deletionList = Sequencer.transmitData(http)(storedData)
    InfluxDBHandler.clearDB(db)(deletionList)
  }
}
