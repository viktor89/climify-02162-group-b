package com.db.influxdb.openhab;

import java.util.List;


public class SensorDTO {

	public String thingTypeUID;
	public List<ChannelsDTO> channels;
	public String UID;
	public RaspberryPiDTO raspberryPi;
	
	@Override
	public String toString() {
		return thingTypeUID;
	}
	

}
