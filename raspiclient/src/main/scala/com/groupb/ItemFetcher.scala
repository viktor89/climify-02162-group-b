package com.groupb

object ItemFetcher {
  def getOpenHABItems(http : HttpConnection) = {
    val response = http.getRequest("http://localhost:8080/rest/items?recursive=false")
    JsonMapper.convert[Seq[OpenHABItems]](response.body) match {
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
}
