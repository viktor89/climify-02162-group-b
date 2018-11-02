package com.groupb

import com.fasterxml.jackson.databind.{ObjectMapper, DeserializationFeature}
import com.fasterxml.jackson.module.scala.DefaultScalaModule
import com.fasterxml.jackson.module.scala.experimental.ScalaObjectMapper
import java.io.IOException

object JsonMapper {
  private val mapper = new ObjectMapper() with ScalaObjectMapper
  mapper.registerModule(DefaultScalaModule)
  mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)

  def toJson(value : Any) = {
    mapper.writeValueAsString(value)
  }

  def convert[Type](jsonString : String)(implicit m : Manifest[Type]) = {
    try {
      Some(mapper.readValue[Type](jsonString))
    } catch {
      case e : IOException => None
    }
  }
}
