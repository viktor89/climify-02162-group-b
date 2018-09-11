package com.db.influxdb.openhab;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class RaspberryPiDTO {
	
	private static RaspberryPiDTO instance;
	
	private RaspberryPiDTO() {}
	@JsonIgnore
	public static RaspberryPiDTO data(String name, String location, String address)
	{
		if(instance==null) {
			instance = new RaspberryPiDTO();
			instance.rosberryName = name;
			instance.location = location;
			instance.address = address;
		}
		return instance;
	}
	
	@JsonIgnore
	public static RaspberryPiDTO dataReterive() {
		return instance;
	}

	public static String rosberryName;
	public static String location;//i.e floor
	public static String address; //i.e actual address of the device. 
}
