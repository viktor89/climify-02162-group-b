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
  new Type(value = classOf[ViewInbox], name="ViewInbox")
))
trait Message {
  def act() : Unit
}

class ApproveThing(val name : String) extends Message {
  override def act() = {
    val url = "http://localhost:8080/rest/inbox/" + name + "/approve"
    HTTPHandler.postRequest(url, name)
  }
}

class TState(val uuid: String, val temp : Int) extends Message {
  override def act() = {
    val url = "http://localhost:8080/rest/items" + uuid
    HTTPHandler.postRequest(url, Integer.toString(temp))
  }
}

class ViewInbox extends Message {
  override def act() = {
    val discurl = "http://localhost:8080/rest/discovery/bindings/zwave/scan"
    HTTPHandler.postRequest(discurl, "")
    val raspurl = "http://localhost:8080/rest/inbox"
    val content = HTTPHandler.getRequest(raspurl)
    val serverurl = "http://http://se2-webapp02.compute.dtu.dk/api/v2/sensor/inbox/"
    val msg = new RootMessage(MACAddress.computeMAC, content.body)
    val jsoncontent = JsonMapper.toJson(msg)
    HTTPHandler.postRequest(serverurl, jsoncontent)
  }
}
