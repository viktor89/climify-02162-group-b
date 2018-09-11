package com.db.influxdb.openhab;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=false)
public class ListItemsDTO {

	public String label;
	public String UID;
	public String thingTypeUID;
	public String bridgeUID;
    public List<ItemsDTO> channels;

}
