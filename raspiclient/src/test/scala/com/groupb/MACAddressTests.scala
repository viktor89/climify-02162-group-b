package com.groupb

import org.scalatest.{FlatSpec, Matchers}

/**
  * @author s144456
  */
class MACAddressTests extends FlatSpec with Matchers {
  "MACAddress" should "follow this pattern (([0-9A-F]{2}[:-]){5}([0-9A-F]{2}))" in {
    val regex = "(([0-9A-F]{2}[:-]){5}([0-9A-F]{2}))"
    MACAddress.computeMAC matches regex shouldBe true
  }
}
