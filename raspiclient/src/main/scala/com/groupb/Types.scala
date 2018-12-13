package com.groupb

import com.fasterxml.jackson.annotation.JsonSubTypes.Type
import com.fasterxml.jackson.annotation.{JsonSubTypes, JsonTypeInfo}

@JsonTypeInfo(
  use = JsonTypeInfo.Id.NAME,
  include = JsonTypeInfo.As.PROPERTY,
  property = "type"
)
@JsonSubTypes(Array(
  new Type(value = classOf[ApproveThing], name="ApproveThing"),
  new Type(value = classOf[TState], name="TState"),
  new Type(value = classOf[ViewInbox], name="ViewInbox"),
  new Type(value = classOf[DeleteItem], name="DeleteItem")
))
sealed trait Message
case class ApproveThing(val name : String) extends Message
case class TState(val uuid: String, val temp : String) extends Message
case class ViewInbox() extends Message
case class DeleteItem(val uuid : String) extends Message

case class Data(val sensorName : String, val sensorType : String, val time : Any, val value : Any)
case class Log(val msg : String)
case class ReadDB(val types : Map[String, String])
case class DataPoints(val data : Seq[Data])
case class DropMsg(val serie : String)

case class OpenHABItems(val name : String, val label : String)
case class Sensor(val sensorName : String, val sensorType : String)
