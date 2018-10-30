package com.groupb

object ItemFetcher {
  def getOpenHABItems(http : HttpConnection) = {
    val response = http.getRequest("http://localhost:8080/rest/items?recursive=false")
    val items = JsonMapper.convert[Seq[OpenHABItems]](response.body)
    items.foldLeft(Map[String, String]()) {
      (acc, item) => acc + (item.name -> item.label)
    }
  }
}
