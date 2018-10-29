package com.groupb

import com.paulgoldbaum.influxdbclient.QueryResult
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import org.scalatest.{FlatSpec, Matchers}
import org.scalamock.scalatest.MockFactory

class DBFramework extends FlatSpec with Matchers with MockFactory {
  def simulation(json : String) = Future {
    QueryResult.fromJson(json)
  }
}
