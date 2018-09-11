package dk.skoleklima.util;

import java.util.List;


public class SensorDTO {

	public String thingTypeUID;
	public List<ChannelsDTO> channels;
	public String UID;
	
	
	@Override
	public String toString() {
		return thingTypeUID;
	}
}
