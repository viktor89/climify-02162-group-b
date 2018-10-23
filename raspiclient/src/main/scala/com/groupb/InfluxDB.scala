package com.groupb

import java.util.ArrayList
import scala.concurrent.duration.Duration
import scala.concurrent.{ Await, Future }
import scala.util._
import scala.collection.JavaConverters
import com.paulgoldbaum.influxdbclient._
import com.paulgoldbaum.influxdbclient.Parameter.Precision.Precision

object InfluxDBHandler {
  def readData(db : Database) = {
    val list = new ArrayList[Data]
    val seriesQuery = db.query("SELECT * FROM /^*/", Parameter.Precision.SECONDS)
    val result = Await.result(seriesQuery, Duration.Inf)
    result.series.foreach(serie =>
      serie.records.foreach(record =>
        list.add(Data(serie.name, record("time"),record("value")))))
    JavaConverters.asScalaBuffer(list).toSeq
  }

  def clearDB(db : Database)(data : Seq[Data]) = {
    data.foreach(d => db.exec("DELETE FROM " + d.sensorName + " WHERE time = " + d.time))
  }
}
