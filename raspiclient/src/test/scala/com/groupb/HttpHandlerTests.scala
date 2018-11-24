package com.groupb

import scalaj.http._
import org.scalatest.{FlatSpec, Matchers}

/**
  * URLs in test originate from scalaj-http's tests
  */
class HttpHandlerTests extends FlatSpec with Matchers {
  "HttpHandler" should "be able to make a get request to any site" in {
    val resp = HttpHandler.getRequest("https://httpbin.org/get")
    resp.isSuccess should be (true)
    resp.get.code should be (200)
  }

  it should "be able to make a post request to any site" in {
    val resp = HttpHandler.postRequest("http://httpbin.org/post", "foo")
    resp.isSuccess should be (true)
    resp.get.code should be (200)
  }

  it should "return a failure if the get request fails due to an non-existent url" in {
    val resp = HttpHandler.getRequest("invalid")
    resp.isFailure should be (true)
  }

  it should "return a failure if the post request fails due to an non-existent url" in {
    val resp = HttpHandler.postRequest("invalid", "foo")
    resp.isFailure should be (true)
  }
}
