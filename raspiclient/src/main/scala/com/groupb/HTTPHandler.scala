package com.groupb

import scalaj.http._

object HTTPHandler {
  def getRequest(url : String) = {
    Http(url).asString
  }

  def postRequest(url : String, data : String) = {
    Http(url).postData(data).asString
  }
}
