package com.groupb

class RootMessage(val _data : String) {
  var mac : String = MACAddress.computeMAC
  var data : String = _data
}
