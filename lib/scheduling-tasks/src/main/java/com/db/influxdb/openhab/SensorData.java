package com.db.influxdb.openhab;

import java.util.List;
import java.util.ArrayList;

public class SensorData {

	public String thingTypeUID;
	public String uid;
	public String address;
	
	public RosberrypiData rasberyPi = new RosberrypiData(RaspberryPiDTO.dataReterive());
	
	public List<SensorLinkedItem> sensorItemData = new ArrayList<>();
	
}
