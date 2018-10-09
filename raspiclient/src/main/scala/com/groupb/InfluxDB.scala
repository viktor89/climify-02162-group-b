package com.groupb

import java.util.ArrayList
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.Duration
import scala.concurrent.{ Await, Future }
import scala.util._
import scala.collection.JavaConversions._
import com.paulgoldbaum.influxdbclient._

class Data(val sensorName : String, val time : Any, val value : Any) { }

object InfluxDBHandler {
  val influxdb = InfluxDB.connect("localhost", 8086, "openhab", "AnotherSuperbPassword456-")
  val database = influxdb.selectDatabase("openhab_db")

  def readData() = {
    val list = new ArrayList[Data]
    val seriesQuery = database.query("SELECT * FROM /^*/")
    val result = Await.result(seriesQuery, Duration.Inf)
    result.series.foreach(serie =>
      serie.records.foreach(record =>
        list.add(new Data(serie.name,
          record("time"),record("value")))))
    JsonMapper.toJson(list)
  }

  def clearDB() = {
    val clearQuery = database.query("DELETE WHERE time > 2018-06-19") // Can clear more than needed
    Await.result(clearQuery, Duration.Inf)
  }
}
