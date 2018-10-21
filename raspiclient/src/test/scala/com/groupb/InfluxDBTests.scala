package com.groupb

import com.paulgoldbaum.influxdbclient._
import org.scalatest.{FlatSpec, Matchers}
import org.scalamock.scalatest.MockFactory
import ExecutionContext.Implicits.global

class InfluxDBTests extends FlatSpec with Matchers with MockFactory {
  val record1 = new Record(Map("time" -> 0, "value" -> 1), List(0, 0))
  val record2 = new Record(Map("time" -> 0, "value" -> 1), List(1, 0))
  val record3 = new Record(Map("time" -> 0, "value" -> 1), List(2, 0))
  val tagSet = new TagSet(Map[String, Int](), List())
  val series1 = new Series("Test1", List("time", "value"), List(record1, record2, record3), tagSet)
  val series2 = new Series("Test2", List("time", "value"), List(record1, record2, record3), tagSet)

  "InfluxDBHandler" should "return an empty sequence when the database is empty" in {
    val simulatedFuture = Future {
      new QueryResult(List[Series]())
    }
    val mockDB = mock[Database]
    (mockDB.query _)
      .expects("SELECT * FROM /^*/")
      .returns(simulatedFuture)

    val result = InfluxDBHandler.readData(mockDB)
    result.size should be (0)
  }

  it should "return an sequence with one series when the database contains one series" in {
    val simulatedFuture = Future {
      new QueryResult(List[Series](series1))
    }
    val mockDB = mock[Database]
    (mockDB.query _)
      .expects("SELECT * FROM /^*/")
      .returns(simulatedFuture)

    val result = InfluxDBHandler.readData(mockDB)
    result.size should be (3)
    result.contains(Data("Test1", 0, 0)) should be (true)
    result.contains(Data("Test1", 1, 0)) should be (true)
    result.contains(Data("Test1", 2, 0)) should be (true)
  }

  it should "return an sequence with two series when the database contains two series" in {
    val simulatedFuture = Future {
      new QueryResult(List[Series](series1, series2))
    }
    val mockDB = mock[Database]
    (mockDB.query _)
      .expects("SELECT * FROM /^*/")
      .returns(simulatedFuture)

    val result = InfluxDBHandler.readData(mockDB)
    result.size should be (6)
    result.contains(Data("Test1", 0, 0)) should be (true)
    result.contains(Data("Test1", 1, 0)) should be (true)
    result.contains(Data("Test1", 2, 0)) should be (true)
    result.contains(Data("Test2", 0, 0)) should be (true)
    result.contains(Data("Test2", 1, 0)) should be (true)
    result.contains(Data("Test2", 2, 0)) should be (true)
  }

  it should "accept an empty sequence, which will not change the database" in {
    val mockDB = mock[Database]
    InfluxDBHandler.clearDB(mockDB)(IndexedSeq[Data]())
  }

  it should "accept an sequence consisting of a single series, where the content will be cleared from the database" in {
    val data = IndexedSeq(Data("Test1", 0, 0), Data("Test1", 1, 0), Data("Test1", 2, 0))
    val mockDB = mock[Database]

    inSequence {
      (mockDB.query _)
        .expects("DELETE WHERE time=0 AND measurement =Test1")
      (mockDB.query _)
        .expects("DELETE WHERE time=1 AND measurement =Test1")
      (mockDB.query _)
        .expects("DELETE WHERE time=2 AND measurement =Test1")
    }
    InfluxDBHandler.clearDB(data)
  }


  it should "accept an sequence consisting of two series, where the content will be cleared from the database" in {
    val data = IndexedSeq(Data("Test1", 0, 0), Data("Test1", 1, 0), Data("Test1", 2, 0),
      Data("Test2", 0, 0), Data("Test2", 0, 0), Data("Test2", 0, 0))
    val mockDB = mock[Database]

    inSequence {
      (mockDB.query _)
        .expects("DELETE WHERE time=0 AND measurement =Test1")
      (mockDB.query _)
        .expects("DELETE WHERE time=1 AND measurement =Test1")
      (mockDB.query _)
        .expects("DELETE WHERE time=2 AND measurement =Test1")
      (mockDB.query _)
        .expects("DELETE WHERE time=0 AND measurement =Test2")
      (mockDB.query _)
        .expects("DELETE WHERE time=1 AND measurement =Test2")
      (mockDB.query _)
        .expects("DELETE WHERE time=2 AND measurement =Test2")
    }
    InfluxDBHandler.clearDB(data)
  }
}
