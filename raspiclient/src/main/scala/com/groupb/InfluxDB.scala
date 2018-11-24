package com.groupb

import scala.concurrent.duration.Duration
import scala.concurrent.{ Await, Future }
import com.paulgoldbaum.influxdbclient._
import com.paulgoldbaum.influxdbclient.Parameter.Precision.Precision

object InfluxDBHandler {
  def readData(db : Database)(types : Map[String, String]) = {
    val seriesQuery = db.query("SELECT * FROM /^*/", Parameter.Precision.SECONDS)
    val result = Await.result(seriesQuery, Duration.Inf)
    result.series.flatMap(serie => {
      serie.records.map(record => {
        Data(serie.name, types.getOrElse(serie.name, "Unknown type"),
          record("time"), record("value"))
      })
    })
  }

  def clearDB(db : Database)(data : Seq[Data]) = {
    data.foreach(d => {
      val query = db.exec("DELETE FROM " + d.sensorName + " WHERE time = " + d.time)
      Await.result(query, Duration.Inf)
    })
  }
}
