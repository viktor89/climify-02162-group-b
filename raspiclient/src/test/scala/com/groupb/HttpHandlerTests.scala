package com.groupb

import scalaj.http._
import org.scalatest.{FlatSpec, Matchers}

/**
  * URLs in test originate from scalaj-http's tests
  */
class HttpHandlerTests extends FlatSpec with Matchers {
  "A HttpHandler" should "be able to make a get request to any site" in {
    val resp = HttpHandler.getRequest("https://httpbin.org/get")
    resp.isEmpty should be (false)
    resp.get.code should be (200)
  }

  it should "be able to make a post request to any site" in {
    val resp = HttpHandler.postRequest("http://httpbin.org/post", "foo")
    resp.isEmpty should be (false)
    resp.get.code should be (200)
  }

  it should "return None if the get request fails due to an non-existent url" in {
    val resp = HttpHandler.getRequest("invalid")
    resp.isEmpty should be (true)
  }

  it should "return None if the post request fails due to an non-existent url" in {
    val resp = HttpHandler.postRequest("invalid", "foo")
    resp.isEmpty should be (true)
  }
}
