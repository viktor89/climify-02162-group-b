package com.groupb

import java.net.{InetAddress, NetworkInterface}

object MACAddress {
  def computeMAC() : String = {
    val ip = InetAddress.getLocalHost()
    val interface = NetworkInterface.getByInetAddress(ip)
    val mac = interface.getHardwareAddress()
    val sb = new StringBuilder
    for(i <- 0 to mac.length) {
      sb.append("%02X%s".format(mac(i), if (i < mac.length-1) "-" else ""))
    }
    sb.toString
  }
}
