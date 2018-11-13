package com.groupb

import scalaj.http.HttpResponse
import org.scalatest.{FlatSpec, Matchers}
import org.scalamock.scalatest.MockFactory

class ItemFetcherTests extends FlatSpec with Matchers with MockFactory {
  val responseMap = Map[String, IndexedSeq[String]]()

  "A ItemFetcher" should "return an empty map if OpenHAB returns an empty list" in {
    val mockHandler = mock[HttpConnection]
    (mockHandler.getRequest _) expects("http://localhost:8080/rest/items?recursive=false") returns (Some(new HttpResponse[String]("[]", 200, responseMap)))

    val result = ItemFetcher.getOpenHABItems(mockHandler)
    result.size should be (0)
  }

  it should "create a map with the same contents as the returned list" in {
    val mockHandler = mock[HttpConnection]
    (mockHandler.getRequest _) expects("http://localhost:8080/rest/items?recursive=false") returns (Some(new HttpResponse[String]("[{\"name\": \"device1\", \"label\": \"device1\"}, {\"name\": \"device2\", \"label\": \"device2\"}, {\"name\": \"device3\", \"label\": \"device3\"}]", 200, responseMap)))

    val result = ItemFetcher.getOpenHABItems(mockHandler)
    result.size should be (3)
    result("device1") should be ("device1")
    result("device2") should be ("device2")
    result("device3") should be ("device3")
  }

  it should "handle unknown properties in the JSON without any errors" in {
    val mockHandler = mock[HttpConnection]
    (mockHandler.getRequest _) expects("http://localhost:8080/rest/items?recursive=false") returns (Some(new HttpResponse[String]("[{\"name\": \"device1\", \"label\": \"device1\", \"category\": \"test\"}, {\"name\": \"device2\", \"label\": \"device2\", \"category\": \"test\"}, {\"name\": \"device3\", \"label\": \"device3\", \"category\": \"test\"}]", 200, responseMap)))

    val result = ItemFetcher.getOpenHABItems(mockHandler)
    result.size should be (3)
    result("device1") should be ("device1")
    result("device2") should be ("device2")
    result("device3") should be ("device3")
  }

  it should "handle an non-JSON response from OpenHAB and return an empty map" in {
    val mockHandler = mock[HttpConnection]
    (mockHandler.getRequest _) expects("http://localhost:8080/rest/items?recursive=false") returns (Some(new HttpResponse[String]("...", 200, responseMap)))
    val result = ItemFetcher.getOpenHABItems(mockHandler)
    result.size should be (0)
  }

  it should "handle an incorrect JSON response from OpenHAB and return an empty map (not a list)" in {
    val mockHandler = mock[HttpConnection]
    (mockHandler.getRequest _) expects("http://localhost:8080/rest/items?recursive=false") returns (Some(new HttpResponse[String]("{ \"test\" : \"data\"}", 200, responseMap)))
    val result = ItemFetcher.getOpenHABItems(mockHandler)
    result.size should be (0)
  }

  it should "handle an incorrect JSON response from OpenHAB and return an empty map (invalid list)" in {
    val mockHandler = mock[HttpConnection]
    (mockHandler.getRequest _) expects("http://localhost:8080/rest/items?recursive=false") returns (Some(new HttpResponse[String]("[{ \"test\"}]", 200, responseMap)))
    val result = ItemFetcher.getOpenHABItems(mockHandler)
    result.size should be (0)
  }

  it should "return an empty map if the get request to OpenHAB fails" in {
    val mockHandler = mock[HttpConnection]
    (mockHandler.getRequest _) expects("http://localhost:8080/rest/items?recursive=false") returns (None)
    val result = ItemFetcher.getOpenHABItems(mockHandler)
    result.size should be (0)
  }

  it should "return an empty list when OpenHAB returns an empty list" in {
    val mockHandler = mock[HttpConnection]
    (mockHandler.getRequest _) expects("http://localhost:8080/rest/items?recursive=false") returns (Some(new HttpResponse[String]("[]", 200, responseMap)))
    val result = ItemFetcher.getOpenHABList(mockHandler)
    result.size should be (0)
  }

  it should "return a list representation when OpenHAB has items defined" in {
    val mockHandler = mock[HttpConnection]
    (mockHandler.getRequest _) expects("http://localhost:8080/rest/items?recursive=false") returns (Some(new HttpResponse[String]("[{\"name\": \"device1\", \"label\": \"device1\"}, {\"name\": \"device2\", \"label\": \"device2\"}, {\"name\": \"device3\", \"label\": \"device3\"}]", 200, responseMap)))

    val result = ItemFetcher.getOpenHABList(mockHandler)
    result.size should be (3)
    result(0).sensorName should be ("device1")
    result(0).sensorType should be ("device1")
    result(1).sensorName should be ("device2")
    result(1).sensorType should be ("device2")
    result(2).sensorName should be ("device3")
    result(2).sensorName should be ("device3")
  }
}
