package com.groupb

import scala.util.{Success, Failure}
import org.scalatest.{FlatSpec, Matchers}
import org.scalatest.prop.Checkers
import org.scalacheck.Arbitrary

class JsonMapperTests extends FlatSpec with Checkers with Matchers {
  "JsonMapper" should "be able to convert strings to and from JSON" in {
    check((obj : String) => JsonMapper.convert[String](JsonMapper.toJson(obj)) == Success(obj))
  }

  it should "be able to convert integers to and from JSON" in {
    check((obj : Int) => JsonMapper.convert[Int](JsonMapper.toJson(obj)) == Success(obj))
  }

  it should "return a failure instance when receiving invalid JSON" in {
    val result = JsonMapper.convert[Message]("...")
    result.isFailure should be (true)
  }

  it should "return a failure when the Mapper is unable to serialize the JSON to the given type" in {
    val result = JsonMapper.convert[Message]("{ \"test\" : \"data\"}")
    result.isFailure should be (true)
  }
}
