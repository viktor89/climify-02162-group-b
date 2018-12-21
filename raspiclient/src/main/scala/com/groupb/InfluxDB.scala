package com.groupb

import scala.concurrent.duration.Duration
import scala.concurrent.{ Await, Future }
import akka.actor.{Actor, ActorLogging, Props}
import akka.event.Logging
import com.paulgoldbaum.influxdbclient._
import com.paulgoldbaum.influxdbclient.Parameter.Precision.Precision

/**
  * @author s144456
  */
class DBActor(private val db : Database) extends Actor with ActorLogging {
  private def readData(types : Map[String, String]) = {
    val seriesQuery = db.query("SELECT * FROM /^*/ WHERE time > now() - 7200s", Parameter.Precision.NANOSECONDS)
    val result = Await.result(seriesQuery, Duration.Inf)
    result.series.flatMap(serie => {
      serie.records.map(record => {
        Data(serie.name, types.getOrElse(serie.name, "Unknown type"),
          record("time"), record("value"))
      })
    })
  }

  private def clearDB(data : Seq[Data]) = {
    val query = data.map(d => "DELETE FROM " + d.sensorName + " WHERE time = " + d.time)
    db.multiQuery(query, Parameter.Precision.NANOSECONDS)
  }

  private def dropMeasurement(serie : String) = {
    db.exec("DROP MEASUREMENT " + serie)
  }

  def receive = {
    case ReadDB(types) => sender ! DataPoints(readData(types))
    case DataPoints(data) => clearDB(data)
    case DropMsg(serie) => dropMeasurement(serie)
    case _ => log.info("Invalid DB Message")
  }
}
