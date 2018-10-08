package com.groupb

import java.util.ArrayList
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.Duration
import scala.concurrent.{ Await, Future }
import scala.util._
import scala.collection.JavaConversions._
import com.paulgoldbaum.influxdbclient._

class Data(_sensor : String, _time : Any, _value : Any) {
  val sensorName: String = _sensor
  val time: Any = _time
  val value: Any = _value
}

object InfluxDBHandler {
  val influxdb = InfluxDB.connect("localhost", 8086, "openhab", "AnotherSuperbPassword456-")
  val database = influxdb.selectDatabase("openhab_db")

  def readData(): String = {
    val list = new ArrayList[Data]
    val seriesQuery = database.query("SELECT * FROM /^*/")
    val result = Await.result(seriesQuery, Duration.Inf)
    result.series.foreach(serie =>
      serie.records.foreach(record =>
        list.add(new Data(serie.name,
          record("time"),record("value")))))
    JsonMapper.toJson(list)
  }

  def clearDB(): Unit = {
    val clearQuery = database.query("DELETE WHERE time > 2018-06-19") // Can clear more than needed
    Await.result(clearQuery, Duration.Inf)
  }
}
