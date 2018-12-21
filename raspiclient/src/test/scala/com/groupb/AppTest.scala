package com.groupb

import org.scalatest.FlatSpec

/**
  * @author s144456
  */
class AppTest extends FlatSpec {
  "The main method" should "execute without any errors" in {
    val args = new Array[String](0)
    App.main(args)
  }
}

