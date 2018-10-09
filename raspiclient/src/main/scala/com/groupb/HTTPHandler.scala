package com.groupb

import scalaj.http._

object HTTPHandler {
  def getRequest(url : String) : String = {
    val request = Http(url).asString
    request.body
  }

  def postRequest(url : String, data : String) : String = {
    val request = Http(url).postData(data).asString
    request.body
  }
}
