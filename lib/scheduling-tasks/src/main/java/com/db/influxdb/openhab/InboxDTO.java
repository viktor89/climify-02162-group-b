package com.db.influxdb.openhab;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=true)
public class InboxDTO {
//	public String bridgeUID;
	public String flag;
	public String label;
	public String thingUID;
	public String thingTypeUID;
	//public Object properties;

}
