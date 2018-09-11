package com.db.influxdb.openhab;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=true)
public class ItemsDTO {
    public String id;
    public String kind;
    public String uid;
    public String channelTypeUID;
    public String itemType;
    public List<String> linkedItems;
}
