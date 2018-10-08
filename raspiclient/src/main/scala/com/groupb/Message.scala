package com.groupb

import com.fasterxml.jackson.annotation.JsonSubTypes.Type
import com.fasterxml.jackson.annotation.{JsonSubTypes, JsonTypeInfo}
import org.springframework.web.client.RestTemplate
import org.springframework.http.ResponseEntity

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
    val action = new RestTemplate
    val url = "http://localhost:8080/rest/inbox/" + name + "/approve"
    action.postForEntity(url, name, classOf[String])
  }
}

class TState(val _uuid: String, val _temp : Int) extends Message {
  var uuid: String = _uuid
  var temp: Int = _temp

  override def act(): Unit = {
    val action = new RestTemplate
    val url = "http://localhost:8080/rest/items" + uuid
    action.postForEntity(url, Integer.toString(temp), classOf[String])
  }
}

class ViewInbox extends Message {
  override def act(): Unit = {
    val discovery = new RestTemplate
    val discurl = "http://localhost:8080/rest/extensions"
    discovery.getForEntity(discurl, classOf[Object])

    val inbox = new RestTemplate
    val raspurl = "http://localhost:8080/rest/inbox"
    val response = inbox.getForEntity(raspurl, classOf[Object])
    val content = response.getBody().asInstanceOf[String]

    val action = new RestTemplate
    val serverurl = "http://http://se2-webapp02.compute.dtu.dk/send"
    val msg = new RootMessage(content)
    val jsoncontent = JsonMapper.toJson(msg)
    action.postForEntity(serverurl, jsoncontent, classOf[String])
  }
}
