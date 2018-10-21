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
trait Message {
  def act() : Unit
}

class ApproveThing(val name : String) extends Message {
  override def act() = {
    val url = "http://localhost:8080/rest/inbox/" + name + "/approve"
    Http(url).postData(name)
  }
}

class TState(val uuid: String, val temp : Int) extends Message {
  override def act() = {
    val url = "http://localhost:8080/rest/items" + uuid
    Http(url).postData(Integer.toString(temp)).asString
  }
}

class ViewInbox extends Message {
  override def act() = {
    Http("http://localhost:8080/rest/discovery/bindings/zwave/scan").postData("").asString
    val content = Http("http://localhost:8080/rest/inbox").asString
    Http("http://http://se2-webapp02.compute.dtu.dk/api/v2/sensor/inbox/")
      .postData(JsonMapper.wrapForTransport(MACAddress.computeMAC, content.body))
      .asString
  }
}
