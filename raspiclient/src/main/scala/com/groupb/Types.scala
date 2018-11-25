package com.groupb

import scala.util.Try
import com.fasterxml.jackson.annotation.JsonSubTypes.Type
import com.fasterxml.jackson.annotation.{JsonSubTypes, JsonTypeInfo}
import scalaj.http._

@JsonTypeInfo(
  use = JsonTypeInfo.Id.NAME,
  include = JsonTypeInfo.As.PROPERTY,
  property = "type"
)
@JsonSubTypes(Array(
  new Type(value = classOf[ApproveThing], name="ApproveThing"),
  new Type(value = classOf[TState], name="TState"),
  new Type(value = classOf[ViewInbox], name="ViewInbox")
))
sealed trait Message
case class ApproveThing(val name : String) extends Message
case class TState(val uuid: String, val temp : String) extends Message
case class ViewInbox() extends Message

case class Data(val sensorName : String, val sensorType : String, val time : Any, val value : Any)
case class Log(val msg : String)

trait HttpConnection {
  def getRequest(url : String) : Try[HttpResponse[String]]
  def postRequest(url : String, data : String) : Try[HttpResponse[String]]
}

object HttpHandler extends HttpConnection {
  def getRequest(url : String) = {
    Try{
      Http(url)
        .header("Accept", "application/json")
        .asString
    }
  }

  def postRequest(url : String, data : String) = {
    Try {
      Http(url)
        .header("Content-Type", "text/plain")
        .header("Accept", "application/json")
        .postData(data).asString
    }
  }
}

case class OpenHABItems(val name : String, val label : String)
case class Sensor(val sensorName : String, val sensorType : String)
