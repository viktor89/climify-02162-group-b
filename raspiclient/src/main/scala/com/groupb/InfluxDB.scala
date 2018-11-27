package com.groupb

import scala.concurrent.duration.Duration
import scala.concurrent.{ Await, Future }
import akka.actor.{Actor, ActorLogging, Props}
import akka.event.Logging
import com.paulgoldbaum.influxdbclient._
import com.paulgoldbaum.influxdbclient.Parameter.Precision.Precision

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
    data.foreach(d => {
      val query = db.exec("DELETE FROM " + d.sensorName + " WHERE time = " + d.time)
      Await.result(query, Duration.Inf)
    })
  }

  def receive = {
    case readDB(types) => sender ! readData(types)
    case clearDB(data) => clearDB(data)
    case _ => log.info("Invalid DB Message")
  }
}
