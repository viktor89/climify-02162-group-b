package com.groupb

import scala.util.Try
import scalaj.http.{ Http, HttpResponse }


trait HttpConnection {
  def getRequest(url : String) : Try[HttpResponse[String]]
  def postRequest(url : String, data : String) : Try[HttpResponse[String]]
  def deleteRequest(url : String) : Try[HttpResponse[String]]
}

object HttpHandler extends HttpConnection {
  private def makeRequest(url : String) = {
    Http(url)
      .header("Content-Type", "text/plain")
      .header("Accept", "application/json")
  }

  def getRequest(url : String) = {
    Try{
      makeRequest(url).asString
    }
  }

  def postRequest(url : String, data : String) = {
    Try {
      makeRequest(url)
        .postData(data)
        .asString
    }
  }

  def deleteRequest(url : String) = {
    Try {
      makeRequest(url)
        .method("DELETE")
        .asString
    }
  }
}

