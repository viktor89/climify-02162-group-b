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
  def act(): Unit
}

class ApproveThing(val _name : String) extends Message {
  var name: String = _name

  override def act(): Unit = {
    val url = "http://localhost:8080/rest/inbox/" + name + "/approve"
    HTTPHandler.postRequest(url, name)
  }
}

class TState(val _uuid: String, val _temp : Int) extends Message {
  var uuid: String = _uuid
  var temp: Int = _temp

  override def act(): Unit = {
    val url = "http://localhost:8080/rest/items" + uuid
    HTTPHandler.postRequest(url, Integer.toString(temp))
  }
}

class ViewInbox extends Message {
  override def act(): Unit = {
    val discurl = "http://localhost:8080/rest/extensions"
    HTTPHandler.getRequest(discurl)
    val raspurl = "http://localhost:8080/rest/inbox"
    val content = HTTPHandler.getRequest(raspurl)
    val serverurl = "http://http://se2-webapp02.compute.dtu.dk/send"
    val msg = new RootMessage(content)
    val jsoncontent = JsonMapper.toJson(msg)
    HTTPHandler.postRequest(serverurl, jsoncontent)
  }
}
