package com.groupb

import scalaj.http.HttpResponse
import org.scalatest.{FlatSpec, Matchers}
import org.scalamock.scalatest.MockFactory

class ItemFetcherTests extends FlatSpec with Matchers with MockFactory {
  val responseMap = Map[String, IndexedSeq[String]]()

  "A ItemFetcher" should "return an empty map if OpenHAB returns an empty list" in {
    val mockHandler = mock[HttpConnection]
    (mockHandler.getRequest _) expects("http://localhost:8080/rest/items?recursive=false") returns (new HttpResponse[String]("[]", 200, responseMap))

    val result = ItemFetcher.getOpenHABItems(mockHandler)
    result.size should be (0)
  }

  it should "create a map with the same contents as the returned list" in {
    val mockHandler = mock[HttpConnection]
    (mockHandler.getRequest _) expects("http://localhost:8080/rest/items?recursive=false") returns (new HttpResponse[String]("[{\"name\": \"device1\", \"label\": \"device1\"}, {\"name\": \"device2\", \"label\": \"device2\"}, {\"name\": \"device3\", \"label\": \"device3\"}]", 200, responseMap))

    val result = ItemFetcher.getOpenHABItems(mockHandler)
    result.size should be (3)
    result("device1") should be ("device1")
    result("device2") should be ("device2")
    result("device3") should be ("device3")
  }

  it should "handle unknown properties in the JSON without any errors" in {
    val mockHandler = mock[HttpConnection]
    (mockHandler.getRequest _) expects("http://localhost:8080/rest/items?recursive=false") returns (new HttpResponse[String]("[{\"name\": \"device1\", \"label\": \"device1\", \"category\": \"test\"}, {\"name\": \"device2\", \"label\": \"device2\", \"category\": \"test\"}, {\"name\": \"device3\", \"label\": \"device3\", \"category\": \"test\"}]", 200, responseMap))

    val result = ItemFetcher.getOpenHABItems(mockHandler)
    result.size should be (3)
    result("device1") should be ("device1")
    result("device2") should be ("device2")
    result("device3") should be ("device3")
  }
}