package com.groupb

import java.util.ArrayList
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.Duration
import scala.concurrent.{ Await, Future }
import scala.util._
import com.paulgoldbaum.influxdbclient._

class Data(_sensor : String, _time : Int, _value : Int) {
  val sensorName: String = _sensor
  val time: Int = _time
  val value: Int = _value
}

object InfluxDB {
  val influxdb = InfluxDB.connect("localhost", 8086, "openhab", "AnotherSuperbPassword456-")
  val database = influxdb.selectDatabase("openhab_db")

  def readData(): String = {
    val list : ArrayList[Data]
    val measurementQuery : Future[QueryResult] = database.query("SELECT * FROM /^*/")
    val result = Await.result(measurementQuery, Duration.Inf)
    result.series.foreach(serie =>
      serie.foreach(records =>
        records.foreach(record =>
          list.add(new Data(serie.name, record("time"), record("value"))))))

    JsonMapper.toJson(list)
  }

  def clearDB(): Unit = {
    val clearQuery : Future[QueryResult] = database.query("DELETE WHERE time > 2018-06-09")
    Await.result(clearQuery, Duration.Inf)
  }
}

/*
class InfluxDB {
  val influxDB = InfluxDBFactory.connect("http://localhost:8086", "", "")

  def sendDataToClimify(): Unit = {
    val data = new ArrayList[Data]
    val measurements = new Query("SHOW MEASUREMENTS", "openhab_db")
    val resultMeasurements = influxDB.query(measurements)


    for(result <- resultMeasurements.getResults().toList) {
      for(series <- result.getSeries.toList) {
        for(listobjects <- series.getValues.toList) {
          for(objectVal <- listobjects.toList) {
            getSensorValues(data, objectVal.asInstanceOf[String])
          }
        }
      }
    }

    val action = new RestTemplate
    val serverUrl = "http://http://se2-webapp02.compute.dtu.dk/send"

    val ip = InetAddress.getLocalHost()
    val interface = NetworkInterface.getByInetAddress(ip)
    val mac = interface.getHardwareAddress()
    val sb = new StringBuilder
    for(i <- 0 to mac.length) {
      sb.append("%02X%s".format(mac(i), if (i < mac.length-1) "-" else ""))
    }

    val mapper = new ObjectMapper
    val jsoncontentlist =  mapper.writeValueAsString(data)
    val extension = new Extension(sb.toString, jsoncontentlist)
    val jsoncontent = mapper.writeValueAsString(extension)

    val confirmation = action.postForEntity(serverUrl, jsoncontent, classOf[String])
    if(confirmation.getBody == 200) {
      influxDB.query(new Query("DELETE WHERE time > 2018-06-19", "openhab_db"))
    }
  }

  private def getSensorValues(data : ArrayList[Data], objectVal : String): Unit = {
    val dataQuery = new Query("SELECT value FROM " + objectVal, "openhab_db")
    val dataResults = influxDB.query(dataQuery)
    for(result <- dataResults.getResults.toList) {
      for(series <- result.getSeries.toList) {
        for(listobjects <- series.getValues.toList) {
          for(objectValue <- listobjects.toList) {
            var dataObject = new Data(objectVal, objectValue(0), objectValue(1))
            data.add(dataObject)
          }
        }
      }
    }
  }
}
 */
