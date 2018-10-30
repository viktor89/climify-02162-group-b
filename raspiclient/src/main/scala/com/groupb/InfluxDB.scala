package com.groupb

import scala.concurrent.{ Await, Future }
import com.paulgoldbaum.influxdbclient._
import com.paulgoldbaum.influxdbclient.Parameter.Precision.Precision

object InfluxDBHandler {
  def readData(db : Database) = {
    val seriesQuery = db.query("SELECT * FROM /^*/ LIMIT 1000", Parameter.Precision.SECONDS)
    val result = Await.result(seriesQuery, Duration.Inf)
    result.series.flatMap(serie =>
      serie.records.map(record =>
        Data(serie.name, record("time"), record("value"))))
  }

  def clearDB(db : Database)(data : Seq[Data]) = {
    data.foreach(d => {
      db.exec("DELETE FROM " + d.sensorName + " WHERE time = " + d.time)
    })
  }
}
