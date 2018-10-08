package com.groupb

import java.util.ArrayList
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.Duration
import scala.concurrent.{ Await, Future }
import scala.util._
import scala.collection.JavaConversions._
import com.paulgoldbaum.influxdbclient._

class Data(_sensor : String, _time : Int, _value : Int) {
  val sensorName: String = _sensor
  val time: Int = _time
  val value: Int = _value
}

object InfluxDBHandler {
  val influxdb = InfluxDB.connect("localhost", 8086, "openhab", "AnotherSuperbPassword456-")
  val database = influxdb.selectDatabase("openhab_db")

  var latest = 0

  def readData(): String = {
    val list = new ArrayList[Data]
    val measurementQuery = database.query("SELECT * FROM /^*/")
    val result = Await.result(measurementQuery, Duration.Inf)
    result.series.foreach(serie =>
      serie.records.foreach(record =>
        list.add(new Data(serie.name,
          record("time").asInstanceOf[Int],
          record("value").asInstanceOf[Int]))))

    latest = 0
    for(point <- list) {
      if (point.time > latest) {
        latest = point.time
      }
    }

    JsonMapper.toJson(list)
  }

  def clearDB(): Unit = {
    val timestamp = Integer.toString(latest)
    val clearQuery : Future[QueryResult] = database.query("DELETE WHERE time <= " + timestamp)
    Await.result(clearQuery, Duration.Inf)
  }
}
