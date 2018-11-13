package com.groupb

import com.paulgoldbaum.influxdbclient.Database
import com.paulgoldbaum.influxdbclient.Parameter.Precision.Precision
import org.scalatest.{FlatSpec, Matchers}
import org.scalamock.scalatest.MockFactory
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class InfluxDBTests extends DBFramework {
  "InfluxDBHandler" should "return an empty sequence when the database is empty when calling readData" in {
    val jsonResult = """{"results":[{"series":[]}]}"""
    val mockDB = mock[Database]
    (mockDB.query _) expects("SELECT * FROM /^*/", *) returns(simulation(jsonResult))

    val result = InfluxDBHandler.readData(mockDB)(Map[String, String]())
    result.size should be (0)
  }

  it should "return an sequence with one series when the database only contains one series when calling readData" in {
    val types = Map("Test1" -> "test")
    val jsonResult = """{"results":[{"series":[{"name":"Test1","columns":["time", "value"],"values":[["0", "0"], ["1", "0"], ["2", "0"]],"tags":{"tag": "value"}}]}]}""" 
    val mockDB = mock[Database]
    (mockDB.query _) expects("SELECT * FROM /^*/", *) returns(simulation(jsonResult))

    val result = InfluxDBHandler.readData(mockDB)(types)
    result.size should be (3)
    result contains Data("Test1", "test", "0", "0") should be (true)
    result contains Data("Test1", "test", "1", "0") should be (true)
    result contains Data("Test1", "test", "2", "0") should be (true)
  }

  it should "return an sequence with two series when the database contains two series when calling readData" in {
    val types = Map("Test1" -> "test", "Test2" -> "test")
    val jsonResult = """{"results":[{"series":[{"name":"Test1","columns":["time", "value"],"values":[["0", "0"], ["1", "0"], ["2", "0"]],"tags":{"tag": "value"}}, {"name":"Test2","columns":["time", "value"],"values":[["0", "0"], ["1", "0"], ["2", "0"]],"tags":{"tag": "value"}}]}]}"""
    val mockDB = mock[Database]
    (mockDB.query _) expects("SELECT * FROM /^*/", *) returns(simulation(jsonResult))

    val result = InfluxDBHandler.readData(mockDB)(types)
    result.size should be (6)
    result contains Data("Test1", "test", "0", "0") should be (true)
    result contains Data("Test1", "test", "1", "0") should be (true)
    result contains Data("Test1", "test", "2", "0") should be (true)
    result contains Data("Test2", "test", "0", "0") should be (true)
    result contains Data("Test2", "test", "1", "0") should be (true)
    result contains Data("Test2", "test", "2", "0") should be (true)
  }

  it should "give a serie a \"Unknown type\" when the serie is not present in OpenHAB when calling readData" in {
    val types = Map[String, String]()
    val jsonResult = """{"results":[{"series":[{"name":"Test1","columns":["time", "value"],"values":[["0", "0"], ["1", "0"], ["2", "0"]],"tags":{"tag": "value"}}]}]}""" 
    val mockDB = mock[Database]
    (mockDB.query _) expects("SELECT * FROM /^*/", *) returns(simulation(jsonResult))

    val result = InfluxDBHandler.readData(mockDB)(types)
    result.size should be (3)
    result contains Data("Test1", "Unknown type", "0", "0") should be (true)
    result contains Data("Test1", "Unknown type", "1", "0") should be (true)
    result contains Data("Test1", "Unknown type", "2", "0") should be (true)
  }

  it should "only give \"Unknown type\" to series that are not present in OpenHAB and actual types to those that do when calling readData" in {
    val types = Map("Test1" -> "test")
    val jsonResult = """{"results":[{"series":[{"name":"Test1","columns":["time", "value"],"values":[["0", "0"], ["1", "0"], ["2", "0"]],"tags":{"tag": "value"}}, {"name":"Test2","columns":["time", "value"],"values":[["0", "0"], ["1", "0"], ["2", "0"]],"tags":{"tag": "value"}}]}]}"""
    val mockDB = mock[Database]
    (mockDB.query _) expects("SELECT * FROM /^*/", *) returns(simulation(jsonResult))

    val result = InfluxDBHandler.readData(mockDB)(types)
    result.size should be (6)
    result contains Data("Test1", "test", "0", "0") should be (true)
    result contains Data("Test1", "test", "1", "0") should be (true)
    result contains Data("Test1", "test", "2", "0") should be (true)
    result contains Data("Test2", "Unknown type", "0", "0") should be (true)
    result contains Data("Test2", "Unknown type", "1", "0") should be (true)
    result contains Data("Test2", "Unknown type", "2", "0") should be (true)
  }

  it should "accept an empty sequence, which will not change the database when calling clearDB" in {
    val mockDB = mock[Database]
    (mockDB.exec _).expects(*).never
    InfluxDBHandler.clearDB(mockDB)(IndexedSeq[Data]())
  }

  it should "accept an sequence consisting of a single series, where the content will be cleared from the database when calling clearDB" in {
    val data = IndexedSeq(Data("Test1", "test", 0, 0),
      Data("Test1", "test", 1, 0),
      Data("Test1", "test", 2, 0))
    val mockDB = mock[Database]

    inSequence {
      (mockDB.exec _) expects("DELETE FROM Test1 WHERE time = 0") returns (simulation("""{"results":[{"series":[]}]}"""))
      (mockDB.exec _) expects("DELETE FROM Test1 WHERE time = 1") returns (simulation("""{"results":[{"series":[]}]}"""))
      (mockDB.exec _) expects("DELETE FROM Test1 WHERE time = 2") returns (simulation("""{"results":[{"series":[]}]}"""))
    }
    InfluxDBHandler.clearDB(mockDB)(data)
  }


  it should "accept an sequence consisting of two series, where the content will be cleared from the database when calling clearDB" in {
    val data = IndexedSeq(Data("Test1", "test", 0, 0),
      Data("Test1", "test", 1, 0),
      Data("Test1", "test", 2, 0),
      Data("Test2", "test", 0, 0),
      Data("Test2", "test", 1, 0),
      Data("Test2", "test", 2, 0))
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
