package dk.skoleklima.dto;

import java.util.List;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=true)
public class ListItemsDTO {
	public String label;
	public String UID;
	public String thingTypeUID;
	public String bridgeUID;
    public List<ItemsDTO> channels;
}
