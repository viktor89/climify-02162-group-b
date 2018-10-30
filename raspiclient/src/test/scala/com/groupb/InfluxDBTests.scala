package com.groupb

import com.paulgoldbaum.influxdbclient._
import com.paulgoldbaum.influxdbclient.Parameter.Precision.Precision
import org.scalatest.{FlatSpec, Matchers}
import org.scalamock.scalatest.MockFactory
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class InfluxDBTests extends DBFramework {
  "InfluxDBHandler" should "return an empty sequence when the database is empty" in {
    val jsonResult = """{"results":[{"series":[]}]}"""
    val mockDB = mock[Database]
    (mockDB.query _) expects("SELECT * FROM /^*/ LIMIT 1000", *) returns(simulation(jsonResult))

    val result = InfluxDBHandler.readData(mockDB)
    result.size should be (0)
  }

  it should "return an sequence with one series when the database contains one series" in {
    val jsonResult = """{"results":[{"series":[{"name":"Test1","columns":["time", "value"],"values":[["0", "0"], ["1", "0"], ["2", "0"]],"tags":{"tag": "value"}}]}]}""" 
    val mockDB = mock[Database]
    (mockDB.query _) expects("SELECT * FROM /^*/ LIMIT 1000", *) returns(simulation(jsonResult))

    val result = InfluxDBHandler.readData(mockDB)
    result.size should be (3)
    result contains Data("Test1", "0", "0") should be (true)
    result contains Data("Test1", "1", "0") should be (true)
    result contains Data("Test1", "2", "0") should be (true)
  }

  it should "return an sequence with two series when the database contains two series" in {
    val jsonResult = """{"results":[{"series":[{"name":"Test1","columns":["time", "value"],"values":[["0", "0"], ["1", "0"], ["2", "0"]],"tags":{"tag": "value"}}, {"name":"Test2","columns":["time", "value"],"values":[["0", "0"], ["1", "0"], ["2", "0"]],"tags":{"tag": "value"}}]}]}"""
    val mockDB = mock[Database]
    (mockDB.query _) expects("SELECT * FROM /^*/ LIMIT 1000", *) returns(simulation(jsonResult))

    val result = InfluxDBHandler.readData(mockDB)
    result.size should be (6)
    result contains Data("Test1", "0", "0") should be (true)
    result contains Data("Test1", "1", "0") should be (true)
    result contains Data("Test1", "2", "0") should be (true)
    result contains Data("Test2", "0", "0") should be (true)
    result contains Data("Test2", "1", "0") should be (true)
    result contains Data("Test2", "2", "0") should be (true)
  }

  it should "accept an empty sequence, which will not change the database" in {
    val mockDB = mock[Database]
    InfluxDBHandler.clearDB(mockDB)(IndexedSeq[Data]())
  }

  it should "accept an sequence consisting of a single series, where the content will be cleared from the database" in {
    val data = IndexedSeq(Data("Test1", 0, 0), Data("Test1", 1, 0), Data("Test1", 2, 0))
    val mockDB = mock[Database]

    inSequence {
      (mockDB.exec _) expects("DELETE FROM Test1 WHERE time = 0") returns (simulation("""{"results":[{"series":[]}]}"""))
      (mockDB.exec _) expects("DELETE FROM Test1 WHERE time = 1") returns (simulation("""{"results":[{"series":[]}]}"""))
      (mockDB.exec _) expects("DELETE FROM Test1 WHERE time = 2") returns (simulation("""{"results":[{"series":[]}]}"""))
    }
    InfluxDBHandler.clearDB(mockDB)(data)
  }


  it should "accept an sequence consisting of two series, where the content will be cleared from the database" in {
    val data = IndexedSeq(Data("Test1", 0, 0), Data("Test1", 1, 0), Data("Test1", 2, 0),
      Data("Test2", 0, 0), Data("Test2", 1, 0), Data("Test2", 2, 0))
    val mockDB = mock[Database]

    inSequence {
      (mockDB.exec _) expects("DELETE FROM Test1 WHERE time = 0") returns (simulation("""{"results":[{"series":[]}]}"""))
      (mockDB.exec _) expects("DELETE FROM Test1 WHERE time = 1") returns (simulation("""{"results":[{"series":[]}]}"""))
      (mockDB.exec _) expects("DELETE FROM Test1 WHERE time = 2") returns (simulation("""{"results":[{"series":[]}]}"""))
      (mockDB.exec _) expects("DELETE FROM Test2 WHERE time = 0") returns (simulation("""{"results":[{"series":[]}]}"""))
      (mockDB.exec _) expects("DELETE FROM Test2 WHERE time = 1") returns (simulation("""{"results":[{"series":[]}]}"""))
      (mockDB.exec _) expects("DELETE FROM Test2 WHERE time = 2") returns (simulation("""{"results":[{"series":[]}]}"""))
    }
    InfluxDBHandler.clearDB(mockDB)(data)
  }
}
