package com.groupb

import com.fasterxml.jackson.databind.{ObjectMapper, DeserializationFeature}
import com.fasterxml.jackson.module.scala.DefaultScalaModule
import com.fasterxml.jackson.module.scala.experimental.ScalaObjectMapper

object JsonMapper {
  private val mapper = new ObjectMapper() with ScalaObjectMapper
  mapper.registerModule(DefaultScalaModule)
  mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)

  def toJson(value : Any) : String = {
    mapper.writeValueAsString(value)
  }

  def convert[Type](jsonString : String)(implicit m : Manifest[Type]) : Type = {
    mapper.readValue[Type](jsonString)
  }
}
