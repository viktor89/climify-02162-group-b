package com.groupb

import com.fasterxml.jackson.annotation.JsonSubTypes.Type
import com.fasterxml.jackson.annotation.{JsonSubTypes, JsonTypeInfo, JsonIgnoreProperties}
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
  def act() : HttpResponse[String]
}

@JsonIgnoreProperties(Array("openHABRequest"))
class ApproveThing(val name : String) extends Message {
  var openHABRequest = Http("http://localhost:8080/rest/inbox/" + name + "/approve")

  override def act() = {
    openHABRequest.postData(name).asString
  }
}

@JsonIgnoreProperties(Array("openHABRequest"))
class TState(val uuid: String, val temp : Int) extends Message {
  var openHABRequest = Http("http://localhost:8080/rest/items/" + uuid)

  override def act() = {
    openHABRequest.postData(Integer.toString(temp)).asString
  }
}

@JsonIgnoreProperties(Array("openHABRequest", "climifyRequest", "openHABGetRequest"))
class ViewInbox extends Message {
  var openHABRequest = Http("http://localhost:8080/rest/discovery/bindings/zwave/scan")
  var climifyRequest = Http("http://http://se2-webapp02.compute.dtu.dk/api/v2/sensor/inbox/")
  var openHABGetRequest = Http("http://localhost:8080/rest/inbox")

  override def act() = {
    openHABRequest.postData("").asString
    val content = openHABGetRequest.asString
    climifyRequest.postData(JsonMapper.wrapForTransport(MACAddress.computeMAC, content.body)).asString
  }
}
