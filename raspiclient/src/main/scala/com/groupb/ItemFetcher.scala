package com.groupb

import scala.language.postfixOps
import scala.util.{Success, Failure}

object ItemFetcher {
  private def convertToMap(body : String) = {
    JsonMapper.convert[Seq[OpenHABItems]](body) match {
      case Some(items) => {
        items.foldLeft(Map[String, String]()) {
          (acc, item) => acc + (item.name -> item.label)
        }
      }
      case None => {
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
