package com.groupb

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

case class TState(val uuid: String, val temp : Int) extends Message

case class ViewInbox() extends Message

case class Data(val sensorName : String, val time : Any, val value : Any)

trait HttpConnection {
  def getRequest(url : String) : HttpResponse[String]
  def postRequest(url : String, data : String) : HttpResponse[String]
}

object HttpHandler extends HttpConnection {
  def getRequest(url : String) = Http(url).asString
  def postRequest(url : String, data : String) = Http(url).postData(data).asString
}

object PipeHandler {
  implicit class Pipe[A](private val a : A ) extends AnyVal {
    def |>[B](f : A => B) = f(a)
  }
}
