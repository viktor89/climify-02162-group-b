package com.groupb

import org.scalatest.{FlatSpec, Matchers}

class MACAddressTests extends FlatSpec with Matchers {
  "A MACAddress" should "follow this pattern (([0-9A-F]{2}[:-]){5}([0-9A-F]{2}))" in {
    val regex = "(([0-9A-F]{2}[:-]){5}([0-9A-F]{2}))"
    MACAddress.computeMAC matches regex shouldBe true
  }
}
