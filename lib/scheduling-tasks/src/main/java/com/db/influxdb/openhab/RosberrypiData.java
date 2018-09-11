package com.db.influxdb.openhab;

public class RosberrypiData{
	
	public RosberrypiData(RaspberryPiDTO dto) {
		this.rosberryName = dto.rosberryName;
		this.location = dto.location;
		this.address = dto.address;
	}
	
	public String rosberryName;
	public String location;
	public String address;
		
}
