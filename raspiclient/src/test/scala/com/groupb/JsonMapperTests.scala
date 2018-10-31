package com.groupb

import org.scalatest.FlatSpec
import org.scalatest.prop.Checkers
import org.scalacheck.Arbitrary

class JsonMapperTests extends FlatSpec with Checkers {
  "A JsonMapper" should "be able to convert strings to and from JSON" in {
    check((obj : String) => JsonMapper.convert[String](JsonMapper.toJson(obj)) == obj)
  }

  it should "be able to convert integers to and from JSON" in {
    check((obj : Int) => JsonMapper.convert[Int](JsonMapper.toJson(obj)) == obj)
  }
}
