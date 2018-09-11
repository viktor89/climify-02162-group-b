package dk.skoleklima.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=true)
public class Inbox {
	
	private String flag;
	private String label;
	private String thingUID;
	private String thingTypeUID;
	/**
	 * @return the flag
	 */
	public String getFlag() {
		return flag;
	}
	/**
	 * @param flag the flag to set
	 */
	public void setFlag(String flag) {
		this.flag = flag;
	}
	/**
	 * @return the label
	 */
	public String getLabel() {
		return label;
	}
	/**
	 * @param label the label to set
	 */
	public void setLabel(String label) {
		this.label = label;
	}
	/**
	 * @return the thingUID
	 */
	public String getThingUID() {
		return thingUID;
	}
	/**
	 * @param thingUID the thingUID to set
	 */
	public void setThingUID(String thingUID) {
		this.thingUID = thingUID;
	}
	/**
	 * @return the thingTypeUID
	 */
	public String getThingTypeUID() {
		return thingTypeUID;
	}
	/**
	 * @param thingTypeUID the thingTypeUID to set
	 */
	public void setThingTypeUID(String thingTypeUID) {
		this.thingTypeUID = thingTypeUID;
	}
	
	

}
