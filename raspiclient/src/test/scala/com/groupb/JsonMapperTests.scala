package com.groupb

import org.scalatest.{FlatSpec, Matchers}
import org.scalatest.prop.Checkers
import org.scalacheck.Arbitrary

class JsonMapperTests extends FlatSpec with Checkers with Matchers {
  "A JsonMapper" should "be able to convert strings to and from JSON" in {
    check((obj : String) => JsonMapper.convert[String](JsonMapper.toJson(obj)) == Some(obj))
  }

  it should "be able to convert integers to and from JSON" in {
    check((obj : Int) => JsonMapper.convert[Int](JsonMapper.toJson(obj)) == Some(obj))
  }

  it should "return None when receiving invalid JSON" in {
    val result = JsonMapper.convert[Message]("...")
    result should be (None)
  }

  it should "return None when the Mapper is unable to serialize the JSON to the given type" in {
    val result = JsonMapper.convert[Message]("{ \"test\" : \"data\"}")
    result should be (None)
  }
}
