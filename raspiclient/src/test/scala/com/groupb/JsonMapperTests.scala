package com.groupb

import org.scalatest.FlatSpec
import org.scalatest.prop.Checkers
import org.scalacheck.Arbitrary

class JsonMapperTests extends FlatSpec with Checkers {
  "A JsonMapper" should "return a string in the form { \"mac\":*, \"data\":*}" in {
    check((mac : String, data : String) =>
      "{ \"mac\":" + mac + ",\"data\":" + data + " }" == JsonMapper.wrapForTransport(mac, data))
  }

  it should "be able to convert objects to and from JSON" in {
    check((obj : String) => JsonMapper.convert[String](JsonMapper.toJson(obj)) == obj)
  }
}
