package com.groupb

import java.net.{InetAddress, NetworkInterface}
import scala.collection.JavaConverters._

object MACAddress {
  private def scanNetworkInterfaces() = {
    NetworkInterface.getNetworkInterfaces.asScala collect {
      case inet if inet.getHardwareAddress != null => inet.getHardwareAddress
    }
  }

  def computeMAC() = {
    val addresses = scanNetworkInterfaces.toList
    val sb = new StringBuilder
    for(i <- 0 to addresses(0).length-1) {
      sb.append("%02X%s".format(addresses(0)(i), if (i < addresses(0).length-1) "-" else ""))
    }
    sb.toString
  }
}
