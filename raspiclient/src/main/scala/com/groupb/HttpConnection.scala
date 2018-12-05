package com.groupb

import scala.util.Try
import scalaj.http.{ Http, HttpResponse }


trait HttpConnection {
  def getRequest(url : String) : Try[HttpResponse[String]]
  def postRequest(url : String, data : String) : Try[HttpResponse[String]]
  def deleteRequest(url : String, data : String) : Try[HttpResponse[String]]
}

object HttpHandler extends HttpConnection {
  private def createPost(url : String, data : String) = {
    Http(url)
      .postData(data)
      .header("Content-Type", "text/plain")
      .header("Accept", "application/json")
  }

  def getRequest(url : String) = {
    Try{
      Http(url)
        .header("Accept", "application/json")
        .asString
    }
  }

  def postRequest(url : String, data : String) = {
    Try {
      createPost(url, data).asString
    }
  }

  def deleteRequest(url : String, data : String) = {
    Try {
      createPost(url, data).method("DELETE").asString
    }
  }
}

