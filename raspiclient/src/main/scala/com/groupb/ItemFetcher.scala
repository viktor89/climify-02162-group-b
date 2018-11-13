package com.groupb

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
      case Some(resp) => convertToMap(resp.body)
      case None => Map[String, String]()
    }
  }
}
