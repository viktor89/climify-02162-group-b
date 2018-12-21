package com.groupb

import scala.language.postfixOps
import scala.util.{Success, Failure}

/**
  * @author s144456
  */
object ItemFetcher {
  private def convertToMap(body : String) = {
    JsonMapper.convert[Seq[OpenHABItems]](body) match {
      case Success(items) => {
        items.foldLeft(Map[String, String]()) {
          (acc, item) => acc + (item.name -> item.label)
        }
      }
      case Failure(_) => {
        Map[String, String]()
      }
    }
  }

  def getOpenHABItems(http : HttpConnection) = {
    val response = http.getRequest("http://localhost:8080/rest/items?recursive=false")
    response match {
      case Success(resp) => convertToMap(resp.body)
      case Failure(_) => Map[String, String]()
    }
  }

  def getOpenHABList(http : HttpConnection) = {
    val datamap = getOpenHABItems(http)
    datamap.map{
      case (key, value) => Sensor(key, value)
    } toList
  }
}
